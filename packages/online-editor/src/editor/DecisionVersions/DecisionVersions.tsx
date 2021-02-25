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
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  Label,
  Skeleton,
  Title,
  Tooltip
} from "@patternfly/react-core";
import { nowrap, cellWidth, IRow, truncate, Table, TableHeader, TableBody } from "@patternfly/react-table";
import { ExternalLinkAltIcon, HistoryIcon, WarningTriangleIcon } from "@patternfly/react-icons";
import { AxiosError } from "axios";
import { Decision } from "../DeploymentConsole/useDecisionStatus";
import { RemoteData } from "../ModelTester/ModelTester";
import DeploymentStatusLabel from "../DeploymentStatusLabel/DeploymentStatusLabel";
import DecisionStatusMessage from "../DecisionStatusMessage/DecisionStatusMessage";

interface DecisionVersionsProps {
  data: RemoteData<AxiosError, Decision[]>;
  onRollback: (versionNumber: number) => Promise<any>;
}

const DecisionVersions = (props: DecisionVersionsProps) => {
  const { data, onRollback } = props;
  const columns = [
    { title: "Version", transforms: [nowrap] },
    { title: "Status" },
    { title: "Created on" },
    { title: "Description", transforms: [cellWidth(30)], cellTransforms: [truncate] },
    { title: "Url" },
    { title: "Source" },
    { title: "Sink" },
    { title: "" }
  ];
  const [rows, setRows] = useState<IRow[]>(prepareRows(columns.length, data, onRollback));

  useEffect(() => {
    setRows(prepareRows(columns.length, data, onRollback));
  }, [data.status]);

  return (
    <Table aria-label="Versions List" variant="compact" cells={columns} rows={rows}>
      <TableHeader />
      <TableBody />
    </Table>
  );
};

export default DecisionVersions;

const prepareRows = (
  columnsNumber: number,
  data: RemoteData<AxiosError, Decision[]>,
  onRollback: DecisionVersionsProps["onRollback"]
) => {
  let rows;
  switch (data.status) {
    case "NOT_ASKED":
    case "LOADING":
      rows = skeletonRows(columnsNumber, 4);
      break;
    case "SUCCESS":
      if (data.data.length > 0) {
        rows = prepareVersionsRows(data.data, onRollback);
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

const prepareVersionsRows = (rowData: Decision[], onRollback: DecisionVersionsProps["onRollback"]) => {
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
      item.submitted_at,
      {
        title: (
          <Tooltip content={<div>{item.description}</div>}>
            <span>{item.description}</span>
          </Tooltip>
        )
      },
      {
        title:
          item.status === "CURRENT" ? (
            <Label color="blue" href={item.url} icon={<ExternalLinkAltIcon />} target="_blank">
              Link
            </Label>
          ) : (
            <span>-</span>
          )
      },
      item.eventing?.kafka?.source ?? "-",
      item.eventing?.kafka?.sink ?? "-",
      {
        title: item.status === "READY" ? <RollbackButton versionNumber={item.version} onRollback={onRollback} /> : <></>
        // title: <RollbackButton versionNumber={item.version} onRollback={onRollback} />
      }
    ]
  }));
};

interface RollbackButtonProps {
  versionNumber: number;
  onRollback: DecisionVersionsProps["onRollback"];
}

const RollbackButton = (props: RollbackButtonProps) => {
  const { versionNumber, onRollback } = props;
  const [loading, setLoading] = useState(false);

  const rollback = useCallback(() => {
    if (loading) {
      return;
    }
    setLoading(true);
    onRollback(versionNumber).finally(() => setLoading(false));
  }, [versionNumber, loading, onRollback]);

  return (
    <div className={"pf-u-text-align-right"}>
      <Button
        key={"rollback"}
        variant="secondary"
        isSmall={true}
        icon={<HistoryIcon />}
        iconPosition="left"
        onClick={rollback}
        isLoading={loading}
        spinnerAriaValueText={loading ? "loading" : ""}
      >
        Rollback
      </Button>
    </div>
  );
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
                  Developmennt History is empty
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
