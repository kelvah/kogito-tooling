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
import { Table, TableHeader, TableBody } from "@patternfly/react-table";
import { Button } from "@patternfly/react-core";
import { RedoAltIcon } from "@patternfly/react-icons";

const DecisionVersions = () => {
  const columns = ["Version", "Deployed", "Status", ""];
  const rows = [
    {
      cells: [
        "4",
        "02/10/2021",
        "Ready",
        <>
          <RollbackButton />
        </>
      ]
    },
    {
      cells: [
        "3",
        "02/09/2021",
        "Ready",
        <>
          <RollbackButton />
        </>
      ]
    },
    {
      cells: [
        "2",
        "02/08/2021",
        "Ready",
        <>
          <RollbackButton />
        </>
      ]
    },
    {
      cells: [
        "1",
        "02/07/2021",
        "Ready",
        <>
          <RollbackButton />
        </>
      ]
    }
  ];

  return (
    <div>
      <Table aria-label="Versions List" variant="compact" cells={columns} rows={rows}>
        <TableHeader />
        <TableBody />
      </Table>
    </div>
  );
};

export default DecisionVersions;

const RollbackButton = () => {
  return (
    <div className={"pf-u-text-align-right"}>
      <Button key={"rollback"} variant="secondary" isSmall={true} icon={<RedoAltIcon />} iconPosition="left">
        Rollback
      </Button>
    </div>
  );
};
