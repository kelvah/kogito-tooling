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
  Popover,
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
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { HelpIcon, ServerIcon } from "@patternfly/react-icons";
import { AxiosRequestConfig } from "axios";
import { EmbeddedEditorRef } from "@kogito-tooling/editor/dist/embedded";
import { isEqual } from "lodash";
import { GlobalContext } from "../../common/GlobalContext";
import { axiosClient } from "../../common/axiosClient";
import DecisionVersions from "../DecisionVersions/DecisionVersions";
import DeploymentStatusIcon from "../DeploymentStatusIcon/DeploymentStatusIcon";
import useDecisionStatus, { Decision } from "./useDecisionStatus";
import useBuildingDecision from "./useBuildingDecision";
import useDecisionVersions from "./useDecisionVersions";
import "./DeploymentConsole.scss";
import { config } from "../../config";
import DecisionStatusMessage from "../DecisionStatusMessage/DecisionStatusMessage";

interface DeploymentConsoleProps {
  editor?: EmbeddedEditorRef;
}

const DeploymentConsole = ({ editor }: DeploymentConsoleProps) => {
  const context = useContext(GlobalContext);
  const modelName = context.file.fileName;
  const [description, setDescription] = useState("");
  const [kafkaSource, setKafkaSource] = useState<string>("");
  const [kafkaSink, setKafkaSink] = useState<string>("");
  const kafkaOptions = config.kafkaOptions || [];
  const { decisionStatus, loadDecisionStatus } = useDecisionStatus(modelName);
  const { buildingDecision, loadBuildingDecision } = useBuildingDecision(modelName);
  const [decision, setDecision] = useState<Decision>();
  const [deployFormValidation, setDeployFormValidation] = useState<DeployFormValidation>({
    isValid: true,
    messages: {}
  });
  const [deployLoading, setDeployLoading] = useState(false);
  const [deployWarningVisible, setDeployWarningVisible] = useState(false);
  const { decisionVersions, loadDecisionVersions } = useDecisionVersions(modelName);

  const onDescriptionChange = (value: string) => {
    setDescription(value);
    validateDeployForm(value, kafkaSource, kafkaSink);
  };

  const onKafkaSourceChange = (value: string) => {
    setKafkaSource(value);
    validateDeployForm(description, value, kafkaSink);
  };

  const onKafkaSinkChange = (value: string) => {
    setKafkaSink(value);
    validateDeployForm(description, kafkaSource, value);
  };

  const validateDeployForm = useCallback((descriptionValue: string, sourceValue: string, sinkValue: string) => {
    const validation: DeployFormValidation = {
      isValid: true,
      messages: {}
    };
    if (descriptionValue.trim() === "") {
      validation.isValid = false;
      validation.messages.description = "Please provide a description";
    } else {
      delete validation.messages.description;
    }
    if (sourceValue !== "" && sinkValue === "") {
      validation.isValid = false;
      validation.messages.kafkaSink = "Please select a Kafka sink Endpoint";
    } else {
      delete validation.messages.kafkaSink;
    }
    if (sinkValue !== "" && sourceValue === "") {
      validation.isValid = false;
      validation.messages.kafkaSource = "Please select a Kafka source Endpoint";
    } else {
      delete validation.messages.kafkaSource;
    }
    setDeployFormValidation(validation);
    return validation;
  }, []);

  const deploy = useCallback(async () => {
    const validation = validateDeployForm(description, kafkaSource, kafkaSink);
    if (validation.isValid) {
      setDeployLoading(true);
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
          .then(() => {
            loadBuildingDecision();
          })
          .catch(error => {
            console.log(error);
            showDeployWarning();
          })
          .finally(() => {
            setDeployLoading(false);
          });
      } catch (error) {
        console.log(error);
        if (deployLoading) {
          setDeployLoading(false);
        }
      }
    }
  }, [editor, description, modelName, kafkaSource, kafkaSink]);

  const rollback = useCallback(
    (versionNumber: number) => {
      console.log("rollback to version " + versionNumber);
      const requestConfig: AxiosRequestConfig = {
        url: `/decisions${modelName}/versions/${versionNumber}`,
        method: "put"
      };
      axiosClient(requestConfig)
        .then(response => {
          console.log(response);
          loadBuildingDecision();
        })
        .catch(error => {
          console.log(error);
        });
    },
    [modelName]
  );

  useEffect(() => {
    if (buildingDecision.status === "FAILURE") {
      loadDecisionStatus();
    } else if (buildingDecision.status === "SUCCESS" && !isEqual(buildingDecision.data, decision)) {
      setDecision(buildingDecision.data);
      loadDecisionVersions();
    }
  }, [buildingDecision]);

  useEffect(() => {
    if (decisionStatus.status === "SUCCESS") {
      setDecision(decisionStatus.data);
      loadDecisionVersions();
    }
  }, [decisionStatus]);

  const interval = useRef<number | undefined>();

  useEffect(() => {
    let isMounted = true;
    if (isMounted && decision?.status === "BUILDING" && !interval.current) {
      console.log("starting interval");
      interval.current = window.setInterval(loadBuildingDecision, 5000);
    }
    if (isMounted && decision?.status !== "BUILDING" && interval.current) {
      console.log("clearing interval");
      window.clearInterval(interval.current);
    }
    return () => {
      isMounted = false;
    };
  }, [interval.current, decision]);

  useEffect(() => {
    return () => {
      console.log("clearing interval because unmount");
      window.clearInterval(interval.current);
    };
  }, []);

  const showDeployWarning = () => {
    setDeployWarningVisible(true);
    setTimeout(() => {
      setDeployWarningVisible(false);
    }, 4000);
  };

  return (
    <section className="test-and-deploy__deployment">
      <Card isFlat={true}>
        <CardTitle>Deployment</CardTitle>
        <CardBody>
          <Form>
            <Split hasGutter={true}>
              <SplitItem isFilled={true}>
                <FormGroup
                  label="Description"
                  fieldId="description"
                  isRequired={true}
                  validated={deployFormValidation.messages.description ? "error" : "default"}
                  helperTextInvalid={deployFormValidation.messages.description}
                >
                  <TextInput
                    id="description"
                    type="text"
                    value={description}
                    onChange={onDescriptionChange}
                    onBlur={() => {
                      validateDeployForm(description, kafkaSource, kafkaSink);
                    }}
                    validated={deployFormValidation.messages.description ? "error" : "default"}
                  />
                </FormGroup>
              </SplitItem>
              <SplitItem style={{ minWidth: "15em" }}>
                <FormGroup
                  label="Kafka source"
                  fieldId="kafka-source"
                  validated={deployFormValidation.messages.kafkaSource ? "error" : "default"}
                  helperTextInvalid={deployFormValidation.messages.kafkaSource}
                  labelIcon={
                    <Tooltip content="Kafka source is mandatory if a Kafka sink endpoint has been provided.">
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
                    validated={deployFormValidation.messages.kafkaSource ? "error" : "default"}
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
                  validated={deployFormValidation.messages.kafkaSink ? "error" : "default"}
                  helperTextInvalid={deployFormValidation.messages.kafkaSink}
                  labelIcon={
                    <Tooltip content="Kafka sink is mandatory if a Kafka source endpoint has been provided.">
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
                  <FormSelect
                    id="kafka-sink"
                    value={kafkaSink}
                    onChange={onKafkaSinkChange}
                    aria-label="Kafka sink"
                    validated={deployFormValidation.messages.kafkaSink ? "error" : "default"}
                  >
                    <FormSelectOption key="none" value="" label="" />
                    {kafkaOptions.map((option, index) => (
                      <FormSelectOption key={index} value={option} label={option} />
                    ))}
                  </FormSelect>
                </FormGroup>
              </SplitItem>
              <SplitItem style={{ paddingTop: 32 }}>
                <Button
                  variant="primary"
                  onClick={deploy}
                  type={"button"}
                  isLoading={deployLoading}
                  spinnerAriaValueText={deployLoading ? "loading" : ""}
                  id="test-and-deploy__deployment__deploy"
                >
                  Deploy
                </Button>
                <Popover
                  aria-label="Deploy information"
                  headerContent={<div>The system is busy</div>}
                  bodyContent={<div>A deploy is already in progress</div>}
                  reference={() => document.getElementById("test-and-deploy__deployment__deploy") as HTMLElement}
                  isVisible={deployWarningVisible}
                  shouldClose={() => setDeployWarningVisible(false)}
                  position={"bottom"}
                />
              </SplitItem>
            </Split>
          </Form>
        </CardBody>
      </Card>
      <br />
      <Card isFlat={true}>
        <CardTitle>Status</CardTitle>
        <CardBody>
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
                      {decision.url ? <ClipboardCopy isReadOnly={true}>{decision.url}</ClipboardCopy> : <em>n.a.</em>}
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
                    {decision.published_at ?? decision.submitted_at}
                  </DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Kafka source</DescriptionListTerm>
                  <DescriptionListDescription>
                    <span>{decision.eventing?.kafka?.source ?? <em>n.a.</em>}</span>
                  </DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Kafka sink</DescriptionListTerm>
                  <DescriptionListDescription>
                    <span>{decision.eventing?.kafka?.sink ?? <em>n.a.</em>}</span>
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
          <DecisionVersions data={decisionVersions} onRollback={rollback} />
        </CardBody>
      </Card>
    </section>
  );
};

export default DeploymentConsole;

interface DeployFormValidation {
  isValid: boolean;
  messages: {
    description?: string;
    kafkaSource?: string;
    kafkaSink?: string;
  };
}
