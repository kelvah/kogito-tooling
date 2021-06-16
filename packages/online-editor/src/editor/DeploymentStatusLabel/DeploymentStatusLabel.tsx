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
import { Label } from "@patternfly/react-core";
import {
  BanIcon,
  CheckCircleIcon,
  ErrorCircleOIcon,
  OutlinedDotCircleIcon,
  SyncAltIcon
} from "@patternfly/react-icons";
import { decisionDeployStatusStrings } from "../DeploymentConsole/useDecisionStatus";

interface DeploymentStatusLabelProps {
  status: decisionDeployStatusStrings;
}

const DeploymentStatusLabel = ({ status }: DeploymentStatusLabelProps) => {
  switch (status) {
    case "CURRENT":
      return (
        <Label color={"green"} icon={<CheckCircleIcon />}>
          Current{" "}
        </Label>
      );
    case "BUILDING":
      return (
        <Label color="blue" icon={<SyncAltIcon />}>
          Building
        </Label>
      );
    case "FAILED":
      return (
        <Label color="red" icon={<ErrorCircleOIcon />}>
          Failed
        </Label>
      );
    case "READY":
      return (
        <Label color="cyan" icon={<OutlinedDotCircleIcon />}>
          Ready
        </Label>
      );
    case "DELETED":
      return (
        <Label color="grey" icon={<BanIcon />}>
          Deleted
        </Label>
      );
  }
};

export default DeploymentStatusLabel;
