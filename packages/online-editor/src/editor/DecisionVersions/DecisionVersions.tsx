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
import { Button, Label } from "@patternfly/react-core";
import { nowrap, cellWidth, IRow, truncate, Table, TableHeader, TableBody } from "@patternfly/react-table";
import { ExternalLinkAltIcon, HistoryIcon } from "@patternfly/react-icons";
import { AxiosError } from "axios";
import { Decision } from "../DeploymentConsole/useDecisionStatus";
import { RemoteData } from "../ModelTester/ModelTester";
import DeploymentStatusLabel from "../DeploymentStatusLabel/DeploymentStatusLabel";

interface DecisionVersionsProps {
  data: RemoteData<AxiosError, Decision[]>;
}

const DecisionVersions = ({ data }: DecisionVersionsProps) => {
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
  const [rows, setRows] = useState<IRow[]>(prepareRows(columns.length, data));

  useEffect(() => {
    setRows(prepareRows(columns.length, data));
  }, [data.status]);

  return (
    <Table aria-label="Versions List" variant="compact" cells={columns} rows={rows}>
      <TableHeader />
      <TableBody />
    </Table>
  );
};

export default DecisionVersions;

const prepareRows = (columnsNumber: number, data: RemoteData<AxiosError, Decision[]>) => {
  let rows;
  switch (data.status) {
    case "NOT_ASKED":
    case "LOADING":
      // rows = skeletonRows(columnsNumber, 10, "executionKey");
      rows = [{ cells: ["", "", "", "", "", "", "", ""] }];
      break;
    case "SUCCESS":
      if (data.data.length > 0) {
        rows = prepareVersionsRows(data.data);
      } else {
        // rows = noVersions(columnsNumber);
        rows = [{ cells: ["", "", "", "", "", "", "", ""] }];
      }
      break;
    case "FAILURE":
      // rows = loadingError(columnsNumber);
      rows = [{ cells: ["", "", "", "", "", "", "", ""] }];
      break;
  }
  return rows;
};

const prepareVersionsRows = (rowData: Decision[]) => {
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
        title: item.status === "READY" ? <RollbackButton /> : <></>
      }
    ]
  }));
};

const RollbackButton = () => {
  return (
    <div className={"pf-u-text-align-right"}>
      <Button key={"rollback"} variant="secondary" isSmall={true} icon={<HistoryIcon />} iconPosition="left">
        Rollback
      </Button>
    </div>
  );
};
