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
import {
  ClipboardCopy,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  EmptyState,
  EmptyStateIcon,
  Flex,
  FlexItem,
  Split,
  SplitItem,
  Text,
  TextContent,
  TextVariants,
  Title
} from "@patternfly/react-core";
import { ServerIcon } from "@patternfly/react-icons";
import DecisionStatusMessage from "../DecisionStatusMessage/DecisionStatusMessage";
import DeploymentStatusIcon from "../DeploymentStatusIcon/DeploymentStatusIcon";
import { Decision } from "../DeploymentConsole/useDecisionStatus";
import FormattedDate from "../FormattedDate/FormattedDate";

interface DecisionStatusProps {
  decision: Decision | undefined;
}

const DecisionStatus = (props: DecisionStatusProps) => {
  const { decision } = props;
  return (
    <>
      {!decision && (
        <EmptyState variant={"xs"}>
          <EmptyStateIcon icon={ServerIcon} />
          <Title headingLevel="h3" size="lg">
            Model not yet deployed
          </Title>
        </EmptyState>
      )}
      {decision && (
        <section>
          <Flex
            direction={{ default: "row" }}
            alignItems={{ default: "alignItemsStretch" }}
            justifyContent={{ default: "justifyContentFlexStart" }}
            className="test-and-deploy__deployment__status-bar"
          >
            <FlexItem grow={{ default: "grow" }}>
              <Split hasGutter={true}>
                <SplitItem>
                  <Flex
                    direction={{ default: "column" }}
                    alignSelf={{ default: "alignSelfCenter" }}
                    justifyContent={{ default: "justifyContentCenter" }}
                    style={{ height: "100%" }}
                  >
                    <FlexItem>
                      <DeploymentStatusIcon status={decision.status} />
                    </FlexItem>
                  </Flex>
                </SplitItem>
                <SplitItem>
                  <TextContent>
                    <strong>{decision.name}</strong> v{decision.version}
                    <Text component={TextVariants.small} style={{ textTransform: "capitalize" }}>
                      {decision.status.toLowerCase()}
                    </Text>
                  </TextContent>
                </SplitItem>
              </Split>
            </FlexItem>
            {/*<FlexItem grow={{ default: "grow" }}>*/}
            {/*  <TextContent>*/}
            {/*    <strong>5</strong>*/}
            {/*    <Text component={TextVariants.small}>Version</Text>*/}
            {/*  </TextContent>*/}
            {/*</FlexItem>*/}
            {/*<FlexItem grow={{ default: "grow" }}>*/}
            {/*  <TextContent>*/}
            {/*    <span>02/16/2021 10:11</span>*/}
            {/*    <Text component={TextVariants.small}>Deployed at</Text>*/}
            {/*  </TextContent>*/}
            {/*</FlexItem>*/}
          </Flex>
          <DescriptionList columnModifier={{ lg: "3Col" }}>
            <DescriptionListGroup>
              <DescriptionListTerm>Description</DescriptionListTerm>
              <DescriptionListDescription>{decision.description}</DescriptionListDescription>
            </DescriptionListGroup>
            {decision.status !== "FAILED" && (
              <DescriptionListGroup>
                <DescriptionListTerm>Url</DescriptionListTerm>
                <DescriptionListDescription>
                  {decision.current_endpoint ? (
                    <ClipboardCopy isReadOnly={true}>{`http://${decision.current_endpoint}`}</ClipboardCopy>
                  ) : (
                    <em>Not yet ready</em>
                  )}
                </DescriptionListDescription>
              </DescriptionListGroup>
            )}
            {decision.status === "FAILED" && (
              <DescriptionListGroup>
                <DescriptionListTerm>Status Message</DescriptionListTerm>
                <DescriptionListDescription>
                  {decision.status_message ? <DecisionStatusMessage message={decision.status_message} /> : "n.a."}
                </DescriptionListDescription>
              </DescriptionListGroup>
            )}
            <DescriptionListGroup>
              <DescriptionListTerm>Version</DescriptionListTerm>
              <DescriptionListDescription>v{decision.version}</DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm>{decision.published_at ? "Deployed at" : "Submitted at"}</DescriptionListTerm>
              <DescriptionListDescription>
                <FormattedDate date={decision.published_at ?? decision.submitted_at} />
              </DescriptionListDescription>
            </DescriptionListGroup>
            {decision.eventing?.kafka?.source && (
              <DescriptionListGroup>
                <DescriptionListTerm>Kafka source</DescriptionListTerm>
                <DescriptionListDescription>
                  <span>{decision.eventing?.kafka?.source ?? <em>n.a.</em>}</span>
                </DescriptionListDescription>
              </DescriptionListGroup>
            )}
            {decision.eventing?.kafka?.sink && (
              <DescriptionListGroup>
                <DescriptionListTerm>Kafka sink</DescriptionListTerm>
                <DescriptionListDescription>
                  <span>{decision.eventing?.kafka?.sink ?? <em>n.a.</em>}</span>
                </DescriptionListDescription>
              </DescriptionListGroup>
            )}
          </DescriptionList>
        </section>
      )}
    </>
  );
};

export default DecisionStatus;
