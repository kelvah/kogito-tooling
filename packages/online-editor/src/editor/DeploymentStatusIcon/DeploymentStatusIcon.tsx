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
import { decisionDeployStatusStrings } from "../DeploymentConsole/useDecisionStatus";
import {
  CheckCircleIcon,
  ErrorCircleOIcon,
  HourglassHalfIcon,
  StopCircleIcon,
  TrashAltIcon
} from "@patternfly/react-icons";

interface DeploymentStatusIconProps {
  status: decisionDeployStatusStrings;
}

const DeploymentStatusIcon = ({ status }: DeploymentStatusIconProps) => {
  const fontSize = "var(--pf-global--icon--FontSize--lg)";

  switch (status) {
    case "CURRENT":
      return (
        <CheckCircleIcon
          style={{
            fontSize,
            color: "var(--pf-global--success-color--100)"
          }}
        />
      );
    case "BUILDING":
      return (
        <HourglassHalfIcon
          style={{
            fontSize,
            color: "var(--pf-global--primary-color--100)"
          }}
        />
      );
    case "FAILED":
      return (
        <ErrorCircleOIcon
          style={{
            fontSize,
            color: "var(--pf-global--palette--red-100)"
          }}
        />
      );
    case "READY":
      return (
        <StopCircleIcon
          style={{
            fontSize,
            color: "var(--pf-global--palette--black-400)"
          }}
        />
      );
    case "DELETED":
      return (
        <TrashAltIcon
          style={{
            fontSize,
            color: "var(--pf-global--palette--black-400)"
          }}
        />
      );
  }
};

export default DeploymentStatusIcon;
