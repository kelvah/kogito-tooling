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
import { Button, Popover } from "@patternfly/react-core";

interface DecisionStatusMessageProps {
  children?: React.ReactNode;
  message: string;
}

const DecisionStatusMessage = ({ children, message }: DecisionStatusMessageProps) => {
  const trimmedMessage = message.length > 40 ? message.substring(0, 40) : "";

  return (
    <>
      {children && (
        <Popover
          aria-label="Status Message details"
          headerContent={<div>Status Message</div>}
          bodyContent={<div>{message}</div>}
          position="top"
          maxWidth={"25rem"}
        >
          <span style={{ cursor: "pointer" }} title="Read status message">
            {children}
          </span>
        </Popover>
      )}
      {!children && (
        <>
          {trimmedMessage && (
            <>
              {trimmedMessage}
              <span>...</span>
              <Popover
                aria-label="Status Message details"
                headerContent={<div>Status Message</div>}
                bodyContent={<div>{message}</div>}
                maxWidth={"25rem"}
              >
                <span>
                  <Button variant={"link"} isInline={true}>
                    read more
                  </Button>
                </span>
              </Popover>
            </>
          )}
          {!trimmedMessage && <span>{message}</span>}
        </>
      )}
    </>
  );
};

export default DecisionStatusMessage;
