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
  Button,
  ClipboardCopy,
  CardBody,
  Card,
  CardTitle,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  Form,
  FormGroup,
  FormSelect,
  FormSelectOption,
  Label,
  Split,
  SplitItem,
  TextInput,
  FlexItem,
  Flex,
  Text,
  TextContent,
  TextVariants,
  Tooltip,
  EmptyState,
  EmptyStateIcon,
  Title
} from "@patternfly/react-core";
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { HelpIcon, ServerIcon } from "@patternfly/react-icons";
import DecisionVersions from "../DecisionVersions/DecisionVersions";
import "./DeploymentConsole.scss";
import { GlobalContext } from "../../common/GlobalContext";
import useDecisionStatus, { Decision } from "./useDecisionStatus";
import DeploymentStatusIcon from "../DeploymentStatusIcon/DeploymentStatusIcon";
import { EmbeddedEditorRef } from "@kogito-tooling/editor/dist/embedded";
import { Environment } from "../TestAndDeploy/TestAndDeploy";
import { AxiosRequestConfig } from "axios";
import { axiosClient } from "../../common/axiosClient";

interface DeploymentConsoleProps {
  editor?: EmbeddedEditorRef;
}

const DeploymentConsole = ({ editor }: DeploymentConsoleProps) => {
  const context = useContext(GlobalContext);
  const modelName = context.file.fileName;
  const [description, setDescription] = useState("");
  const [kafkaSource, setKafkaSource] = useState<string>("");
  const [kafkaSink, setKafkaSink] = useState<string>("");
  const kafkaOptions = ["endpoint 1", "endpoint 2", "endpoint 3", "endpoint 4"];
  const { decisionStatus, loadDecisionStatus } = useDecisionStatus(modelName);
  const [decision, setDecision] = useState<Decision>();

  // console.log(decisionStatus);
  const onDescriptionChange = (value: string) => {
    setDescription(value);
  };

  const onKafkaSourceChange = (value: string) => {
    setKafkaSource(value);
  };

  const onKafkaSinkChange = (value: string) => {
    setKafkaSink(value);
  };

  const deploy = useCallback(async () => {
    try {
      const modelContent = await editor?.getContent();
      const requestConfig: AxiosRequestConfig = {
        url: "/decisions",
        method: "post",
        data: {
          kind: "Decision",
          name: modelName,
          description: description,
          model: {
            dmn: modelContent
          }
        }
      };
      if (kafkaSource && kafkaSink) {
        requestConfig.data.eventing = {
          kafka: {
            source: kafkaSource,
            sink: kafkaSink
          }
        };
      }
      axiosClient(requestConfig)
        .then(response => {
          console.log(response);
          loadDecisionStatus();
        })
        .catch(error => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  }, [editor, description, modelName, kafkaSource, kafkaSink]);

  useEffect(() => {
    if (decisionStatus.status === "SUCCESS") {
      setDecision(decisionStatus.data);
    }
  }, [decisionStatus]);

  const interval = useRef<number | undefined>();

  useEffect(() => {
    let isMounted = true;
    if (
      isMounted &&
      decisionStatus.status === "SUCCESS" &&
      decisionStatus.data.status === "BUILDING" &&
      !interval.current
    ) {
      console.log("starting interval");
      interval.current = window.setInterval(loadDecisionStatus, 5000);
    }
    if (isMounted && decisionStatus.status === "SUCCESS" && decisionStatus.data.status !== "BUILDING") {
      console.log("clearing interval");
      window.clearInterval(interval.current);
    }
    return () => {
      isMounted = false;
    };
  }, [interval.current, decisionStatus]);

  useEffect(() => {
    return () => {
      console.log("clearing interval because unmount");
      window.clearInterval(interval.current);
    };
  }, []);

  return (
    <section className="test-and-deploy__deployment">
      <Card isFlat={true}>
        <CardTitle>Deployment</CardTitle>
        <CardBody>
          <Form>
            <Split hasGutter={true}>
              <SplitItem isFilled={true}>
                <FormGroup label="Description" fieldId="description">
                  <TextInput id="description" type="text" value={description} onChange={onDescriptionChange} />
                </FormGroup>
              </SplitItem>
              <SplitItem style={{ minWidth: "15em" }}>
                <FormGroup
                  label="Kafka source"
                  fieldId="kafka-source"
                  labelIcon={
                    <Tooltip content="Kafka source is optional. If provided, a Kafka sink must be provided too.">
                      <button
                        aria-label="More information for Kafka source"
                        onClick={e => e.preventDefault()}
                        className="pf-c-form__group-label-help"
                      >
                        <HelpIcon
                          noVerticalAlign={true}
                          color={"var(--pf-global--info-color--100)"}
                          style={{ verticalAlign: "unset" }}
                        />
                      </button>
                    </Tooltip>
                  }
                >
                  <FormSelect
                    id="kafka-source"
                    value={kafkaSource}
                    onChange={onKafkaSourceChange}
                    aria-label="Kafka source"
                  >
                    <FormSelectOption key="none" value="" label="" />
                    {kafkaOptions.map((option, index) => (
                      <FormSelectOption key={index} value={option} label={option} />
                    ))}
                  </FormSelect>
                </FormGroup>
              </SplitItem>
              <SplitItem style={{ minWidth: "15em" }}>
                <FormGroup
                  label="Kafka sink"
                  fieldId="kafka-sink"
                  labelIcon={
                    <Tooltip content="Kafka sink is optional. If provided, a Kafka source must be provided too.">
                      <button
                        aria-label="More information for Kafka sink"
                        onClick={e => e.preventDefault()}
                        className="pf-c-form__group-label-help"
                      >
                        <HelpIcon
                          noVerticalAlign={true}
                          color={"var(--pf-global--info-color--100)"}
                          style={{ verticalAlign: "unset" }}
                        />
                      </button>
                    </Tooltip>
                  }
                >
                  <FormSelect id="kafka-sink" value={kafkaSink} onChange={onKafkaSinkChange} aria-label="Kafka sink">
                    <FormSelectOption key="none" value="" label="" />
                    {kafkaOptions.map((option, index) => (
                      <FormSelectOption key={index} value={option} label={option} />
                    ))}
                  </FormSelect>
                </FormGroup>
              </SplitItem>
              <SplitItem style={{ paddingTop: 32 }}>
                <Button variant="primary" onClick={deploy}>
                  Deploy
                </Button>
              </SplitItem>
            </Split>
          </Form>
        </CardBody>
      </Card>
      <br />
      <Card isFlat={true}>
        <CardTitle>Status</CardTitle>
        <CardBody>
          {decisionStatus.status === "FAILURE" && decisionStatus.error.response?.status === 404 && (
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
                <DescriptionListGroup>
                  <DescriptionListTerm>Url</DescriptionListTerm>
                  <DescriptionListDescription>
                    <ClipboardCopy isReadOnly={true}>{decision.url}</ClipboardCopy>
                  </DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Version</DescriptionListTerm>
                  <DescriptionListDescription>v{decision.version}</DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Deployed at</DescriptionListTerm>
                  <DescriptionListDescription>{decision.published_at}</DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Kafka source</DescriptionListTerm>
                  <DescriptionListDescription>
                    <span>{decision.eventing?.kafka?.source ?? <em>Not present</em>}</span>
                  </DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Kafka sink</DescriptionListTerm>
                  <DescriptionListDescription>
                    <span>{decision.eventing?.kafka?.sink ?? <em>Not present</em>}</span>
                  </DescriptionListDescription>
                </DescriptionListGroup>
              </DescriptionList>
            </section>
          )}
        </CardBody>
      </Card>
      <br />
      <Card isFlat={true}>
        <CardTitle>Deployment History</CardTitle>
        <CardBody>
          <DecisionVersions />
        </CardBody>
      </Card>
    </section>
  );
};

export default DeploymentConsole;
