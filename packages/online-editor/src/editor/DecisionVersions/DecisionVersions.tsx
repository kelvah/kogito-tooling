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
import { nowrap, cellWidth, truncate, Table, TableHeader, TableBody } from "@patternfly/react-table";
import { Button, Label } from "@patternfly/react-core";
import {
  CheckCircleIcon,
  ErrorCircleOIcon,
  ExternalLinkAltIcon,
  RedoAltIcon,
  StopCircleIcon
} from "@patternfly/react-icons";

const DecisionVersions = () => {
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
  const rows = [
    {
      cells: [
        "v5",
        {
          title: (
            <Label color={"green"} icon={<CheckCircleIcon />}>
              Deployed
            </Label>
          )
        },
        "02/25/2021",
        { title: <span>Added some new rules and fixed others</span> },
        {
          title: (
            <Label color="blue" href="https://www.redhat.com" icon={<ExternalLinkAltIcon />} target="_blank">
              Link
            </Label>
          )
        },
        "source endpoint",
        "sink endpoint",
        { title: "" }
      ]
    },
    {
      cells: [
        "v4",
        {
          title: (
            <Label color="red" icon={<ErrorCircleOIcon />}>
              Failed
            </Label>
          )
        },
        "02/10/2021",
        { title: "Updated some rule" },
        "url",
        "source endpoint",
        "sink endpoint",
        {
          title: <RollbackButton />
        }
      ]
    },
    {
      cells: [
        "v3",
        {
          title: (
            <Label color="grey" icon={<StopCircleIcon />}>
              Ready
            </Label>
          )
        },
        "02/09/2021",
        { title: "Fixed some issue" },
        "url",
        "source endpoint",
        "sink endpoint",
        {
          title: <RollbackButton />
        }
      ]
    },
    {
      cells: [
        "v2",
        {
          title: (
            <Label color="grey" icon={<StopCircleIcon />}>
              Ready
            </Label>
          )
        },
        "02/09/2021",
        { title: "Fixed some issue" },
        "url",
        "source endpoint",
        "sink endpoint",
        {
          title: <RollbackButton />
        }
      ]
    },
    {
      cells: [
        "v1",
        {
          title: (
            <Label color="grey" icon={<StopCircleIcon />}>
              Ready
            </Label>
          )
        },
        "02/09/2021",
        { title: "Fixed some issue" },
        "url",
        "source endpoint",
        "sink endpoint",
        {
          title: <RollbackButton />
        }
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
      <Button key={"rollback"} variant="control" isSmall={true} icon={<RedoAltIcon />} iconPosition="left">
        Rollback
      </Button>
    </div>
  );
};
