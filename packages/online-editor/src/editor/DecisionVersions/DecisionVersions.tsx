/*
 * Copyright 2021 Red Hat, Inc. and/or its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import * as React from "react";
import { useCallback, useEffect, useState } from "react";
import {
  Bullseye,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  Label,
  Skeleton,
  Text,
  TextContent,
  TextVariants,
  Title,
  Tooltip
} from "@patternfly/react-core";
import {
  nowrap,
  cellWidth,
  IRow,
  truncate,
  Table,
  TableHeader,
  TableBody,
  IActions,
  IRowData,
  IExtraData
} from "@patternfly/react-table";
import { ExternalLinkAltIcon, HistoryIcon, WarningTriangleIcon } from "@patternfly/react-icons";
import { AxiosError } from "axios";
import { Decision } from "../DeploymentConsole/useDecisionStatus";
import { RemoteData } from "../ModelTester/ModelTester";
import DeploymentStatusLabel from "../DeploymentStatusLabel/DeploymentStatusLabel";
import DecisionStatusMessage from "../DecisionStatusMessage/DecisionStatusMessage";
import FormattedDate from "../FormattedDate/FormattedDate";
import DeleteConfirmationDialog from "../DeleteConfirmationDialog/DeleteConfirmationDialog";

interface DecisionVersionsProps {
  data: RemoteData<AxiosError, Decision[]>;
  onDelete: (versionNumber: number) => void;
}

const DecisionVersions = (props: DecisionVersionsProps) => {
  const { data, onDelete } = props;
  const columns = [
    { title: "Version", transforms: [nowrap] },
    { title: "Status" },
    { title: "Created on", transforms: [nowrap] },
    { title: "Description", transforms: [cellWidth(30)], cellTransforms: [truncate] },
    { title: "Url" },
    { title: "Source" },
    { title: "Sink" },
    { title: "" }
  ];
  const [rows, setRows] = useState<IRow[]>(prepareRows(columns.length, data));
  const [deleteVersionConfirmation, setDeleteVersionConfirmation] = useState(-1);

  const handleDelete = useCallback(
    (event, rowId) => {
      setDeleteVersionConfirmation(data.status === "SUCCESS" ? data.data[rowId].version : -1);
    },
    [data.status]
  );

  const handleDeleteConfirmation = () => {
    onDelete(deleteVersionConfirmation);
    setDeleteVersionConfirmation(-1);
  };

  const handleDeleteCancel = () => {
    setDeleteVersionConfirmation(-1);
  };

  const actions: IActions = [
    {
      title: "Delete",
      onClick: handleDelete
    }
  ];

  const actionResolver = () => {
    return data.status !== "SUCCESS" ? [] : actions;
  };

  const areActionsDisabled = useCallback(
    (rowData: IRowData, { rowIndex }: IExtraData) => {
      if (data && data.status === "SUCCESS" && typeof rowIndex === "number" && rowIndex < data.data.length) {
        return data.data[rowIndex].status !== "READY";
      }
      return true;
    },
    [data.status]
  );

  useEffect(() => {
    setRows(prepareRows(columns.length, data));
  }, [data.status]);

  return (
    <>
      <Table
        aria-label="Versions List"
        variant="compact"
        cells={columns}
        rows={rows}
        actionResolver={actionResolver}
        areActionsDisabled={areActionsDisabled}
      >
        <TableHeader />
        <TableBody />
      </Table>
      <DeleteConfirmationDialog
        onConfirm={handleDeleteConfirmation}
        onClose={handleDeleteCancel}
        showModal={deleteVersionConfirmation > -1}
        title="Permanently delete version?"
        appendToSelector={"#deploy-tab-content"}
      >
        <TextContent>
          <Text component={TextVariants.p}>
            The decision version <strong>{deleteVersionConfirmation}</strong> will be lost forever and it will not be
            possible to recover it.
          </Text>
        </TextContent>
      </DeleteConfirmationDialog>
    </>
  );
};

export default DecisionVersions;

const prepareRows = (columnsNumber: number, data: RemoteData<AxiosError, Decision[]>) => {
  let rows;
  switch (data.status) {
    case "NOT_ASKED":
    case "LOADING":
      rows = skeletonRows(columnsNumber, 4);
      break;
    case "SUCCESS":
      if (data.data.length > 0) {
        rows = prepareVersionsRows(data.data);
      } else {
        rows = noVersions(columnsNumber);
      }
      break;
    case "FAILURE":
      if (data.error.response?.status === 404) {
        rows = noVersions(columnsNumber);
      } else {
        rows = loadingError(columnsNumber);
      }
      break;
  }
  return rows;
};

const prepareVersionsRows = (rowData: Decision[]) => {
  return rowData.map(item => ({
    cells: [
      `v${item.version}`,
      {
        title: (
          <>
            {item.status === "FAILED" && item.status_message ? (
              <DecisionStatusMessage message={item.status_message}>
                <DeploymentStatusLabel status={item.status} />
              </DecisionStatusMessage>
            ) : (
              <DeploymentStatusLabel status={item.status} />
            )}
          </>
        )
      },
      {
        title: (
          <Tooltip
            content={
              <div>
                <span>
                  Submitted at: <FormattedDate date={item.submitted_at} />
                </span>
                {item.published_at && (
                  <>
                    <br />
                    <span>
                      Deployed at: <FormattedDate date={item.published_at} />
                    </span>
                  </>
                )}
              </div>
            }
          >
            <FormattedDate date={item.published_at ?? item.submitted_at} short={true} />
          </Tooltip>
        )
      },
      {
        title: (
          <Tooltip content={<div>{item.description}</div>}>
            <span>{item.description}</span>
          </Tooltip>
        )
      },
      {
        title: (
          <Label
            color="blue"
            href={item.current_endpoint ?? item.version_endpoint}
            icon={<ExternalLinkAltIcon />}
            target="_blank"
          >
            Link
          </Label>
        )
      },
      item.eventing?.kafka?.source ?? "-",
      item.eventing?.kafka?.sink ?? "-"
    ]
  }));
};

const skeletonRows = (colsCount: number, rowsCount: number) => {
  const skeletons = [];
  for (let j = 0; j < rowsCount; j++) {
    const cells = [];
    for (let i = 0; i < colsCount - 1; i++) {
      const size = (i + j) % 2 ? "100%" : "60%";
      cells.push({
        title: <Skeleton width={size} />
      });
    }
    cells.push({
      title: <span style={{ width: 20 }}>&nbsp;</span>
    });
    const skeletonRow: IRow = {
      cells
    };
    skeletons.push(skeletonRow);
  }
  return skeletons;
};

const noVersions = (colSpan: number) => {
  return [
    {
      heightAuto: true,
      cells: [
        {
          props: { colSpan },
          title: (
            <Bullseye>
              <EmptyState>
                <EmptyStateIcon icon={HistoryIcon} />
                <Title headingLevel="h5" size="lg">
                  Deployment History is empty
                </Title>
                <EmptyStateBody>It looks like this model was never deployed in the past.</EmptyStateBody>
              </EmptyState>
            </Bullseye>
          )
        }
      ]
    }
  ];
};

const loadingError = (colSpan: number) => {
  return [
    {
      heightAuto: true,
      cells: [
        {
          props: { colSpan },
          title: (
            <Bullseye>
              <EmptyState>
                <EmptyStateIcon icon={WarningTriangleIcon} />
                <Title headingLevel="h5" size="lg">
                  Loading Error
                </Title>
                <EmptyStateBody>We are unable to retrieve the deployment history right now.</EmptyStateBody>
              </EmptyState>
            </Bullseye>
          )
        }
      ]
    }
  ];
};
