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
import { useEffect, useState } from "react";
import {
  Bullseye,
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  Label,
  Skeleton,
  Title
} from "@patternfly/react-core";
import { nowrap, cellWidth, IRow, truncate, Table, TableHeader, TableBody } from "@patternfly/react-table";
import { ExclamationCircleIcon, ExternalLinkAltIcon, HistoryIcon, ServerIcon } from "@patternfly/react-icons";
import { AxiosError } from "axios";
import { Decision } from "../DeploymentConsole/useDecisionStatus";
import { RemoteData } from "../ModelTester/ModelTester";
import DeploymentStatusLabel from "../DeploymentStatusLabel/DeploymentStatusLabel";

interface DecisionVersionsProps {
  data: RemoteData<AxiosError, Decision[]>;
  onRollback: (versionNumber: number) => void;
}

const DecisionVersions = (props: DecisionVersionsProps) => {
  const { data, onRollback } = props;
  const columns = [
    { title: "Version", transforms: [nowrap] },
    { title: "Status" },
    { title: "Created on" },
    { title: "Description", transforms: [cellWidth(20)], cellTransforms: [truncate] },
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
      rows = skeletonRows(columnsNumber, 5);
      break;
    case "SUCCESS":
      if (data.data.length > 0) {
        rows = prepareVersionsRows(data.data, onRollback);
      } else {
        rows = noVersions(columnsNumber);
      }
      break;
    case "FAILURE":
      rows = loadingError(columnsNumber);
      break;
  }
  return rows;
};

const prepareVersionsRows = (rowData: Decision[], onRollback: DecisionVersionsProps["onRollback"]) => {
  return rowData.map(item => ({
    cells: [
      `v${item.version}`,
      {
        title: <DeploymentStatusLabel status={item.status} />
      },
      item.submitted_at,
      { title: <span>{item.description}</span> },
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
  return (
    <div className={"pf-u-text-align-right"}>
      <Button
        key={"rollback"}
        variant="secondary"
        isSmall={true}
        icon={<HistoryIcon />}
        iconPosition="left"
        onClick={() => onRollback(versionNumber)}
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
    for (let i = 0; i < colsCount; i++) {
      const size = (i + j) % 2 ? "100%" : "60%";
      cells.push({
        title: <Skeleton width={size} />
      });
    }
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
                <EmptyStateIcon icon={ServerIcon} />
                <Title headingLevel="h5" size="lg">
                  The history is empty
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
                <EmptyStateIcon icon={ExclamationCircleIcon} color="#C9190B" />
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
