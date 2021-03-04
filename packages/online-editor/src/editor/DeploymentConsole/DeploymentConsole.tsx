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
  CardBody,
  Card,
  CardTitle,
  Form,
  FormGroup,
  FormSelect,
  FormSelectOption,
  Popover,
  Split,
  SplitItem,
  TextInput,
  Tooltip
} from "@patternfly/react-core";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { HelpIcon } from "@patternfly/react-icons";
import { AxiosRequestConfig } from "axios";
import { EmbeddedEditorRef } from "@kogito-tooling/editor/dist/embedded";
import { isEqual } from "lodash";
import { GlobalContext } from "../../common/GlobalContext";
import { axiosClient } from "../../common/axiosClient";
import DecisionVersions from "../DecisionVersions/DecisionVersions";
import useDecisionStatus, { Decision } from "./useDecisionStatus";
import useBuildingDecision from "./useBuildingDecision";
import useDecisionVersions from "./useDecisionVersions";
import DecisionStatus from "../DecisionStatus/DecisionStatus";
import "./DeploymentConsole.scss";
import { config } from "../../config";
import useLoading from "./useLoading";

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
  const [decision, setDecision] = useState<Decision | undefined>();
  const [deployFormValidation, setDeployFormValidation] = useState<DeployFormValidation>({
    isValid: true,
    messages: {}
  });
  const [deployLoading, setDeployLoading] = useLoading();
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
    if (deployLoading) {
      return;
    }
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
            setDescription("");
            setKafkaSource("");
            setKafkaSink("");
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
  }, [editor, description, modelName, kafkaSource, kafkaSink, deployLoading]);

  const rollback = useCallback(
    (versionNumber: number) => {
      const requestConfig: AxiosRequestConfig = {
        url: `/decisions/${modelName}/versions/${versionNumber}`,
        method: "put"
      };
      return axiosClient(requestConfig)
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
    if (buildingDecision.status === "FAILURE" && buildingDecision.error?.response?.status === 404) {
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
    if (decisionStatus.status === "FAILURE") {
      setDecision(undefined);
      loadDecisionVersions();
    }
  }, [decisionStatus]);

  const interval = useRef<number | null | undefined>();

  useEffect(() => {
    let isMounted = true;
    if (isMounted && decision?.status === "BUILDING" && !interval.current) {
      console.log("starting interval");
      interval.current = window.setInterval(loadBuildingDecision, 10000);
    }
    if (isMounted && decision?.status !== "BUILDING" && interval.current) {
      console.log("clearing interval");
      window.clearInterval(interval.current);
      interval.current = null;
    }
    return () => {
      isMounted = false;
    };
  }, [interval.current, decision]);

  useEffect(() => {
    return () => {
      console.log("clearing interval because unmount");
      if (interval.current) {
        window.clearInterval(interval.current);
      }
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
          <DecisionStatus decision={decision} />
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
