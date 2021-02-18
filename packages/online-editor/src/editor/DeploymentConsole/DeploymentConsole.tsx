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
  Tooltip
} from "@patternfly/react-core";
import { useState } from "react";
import { CheckCircleIcon, ExternalLinkAltIcon, HelpIcon } from "@patternfly/react-icons";
import DecisionVersions from "../DecisionVersions/DecisionVersions";
import "./DeploymentConsole.scss";

const DeploymentConsole = () => {
  const [description, setDescription] = useState("");
  const [kafkaSource, setKafkaSource] = useState<string>("");
  const [kafkaSink, setKafkaSink] = useState<string>("");

  const kafkaOptions = ["endpoint 1", "endpoint 2", "endpoint 3", "endpoint 4"];

  const onDescriptionChange = (value: string) => {
    setDescription(value);
  };

  const onKafkaSourceChange = (value: string) => {
    setKafkaSource(value);
  };

  const onKafkaSinkChange = (value: string) => {
    setKafkaSink(value);
  };

  return (
    <section className="test-and-deploy__deployment">
      <Card isFlat={true}>
        <CardTitle>Deployment</CardTitle>
        <CardBody>
          <Form>
            <Split hasGutter={true}>
              <SplitItem isFilled={true}>
                <FormGroup label="Description" fieldId="description">
                  <TextInput type="text" value={description} onChange={onDescriptionChange} />
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
                <Button variant="primary">Deploy</Button>
              </SplitItem>
            </Split>
          </Form>
        </CardBody>
      </Card>
      <br />
      <Card isFlat={true}>
        <CardTitle>Status</CardTitle>
        <CardBody>
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
                        <CheckCircleIcon
                          style={{
                            fontSize: "var(--pf-global--icon--FontSize--lg)",
                            color: "var(--pf-global--success-color--100)"
                          }}
                        />
                      </FlexItem>
                    </Flex>
                  </SplitItem>
                  <SplitItem>
                    <TextContent>
                      <strong>Traffic Violation</strong> v5
                      <Text component={TextVariants.small}>Deployed</Text>
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
            {/*<Title headingLevel="h3" size="lg" className="test-and-deploy__title">*/}
            {/*  Details*/}
            {/*</Title>*/}
            <DescriptionList columnModifier={{ lg: "3Col" }}>
              <DescriptionListGroup>
                <DescriptionListTerm>Description</DescriptionListTerm>
                <DescriptionListDescription>Added some new rules and fixed others</DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Url</DescriptionListTerm>
                <DescriptionListDescription>
                  <ClipboardCopy isReadOnly={true}>https://example.com/e8d6d5f5d83u8d8d83</ClipboardCopy>
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Version</DescriptionListTerm>
                <DescriptionListDescription>v5</DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Deployed at</DescriptionListTerm>
                <DescriptionListDescription>02/16/2021 10:11</DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Kafka source</DescriptionListTerm>
                <DescriptionListDescription>
                  <span>endpoint 1</span>
                </DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Kafka sink</DescriptionListTerm>
                <DescriptionListDescription>
                  <span>endpoint 2</span>
                </DescriptionListDescription>
              </DescriptionListGroup>
            </DescriptionList>
          </section>
        </CardBody>
      </Card>

      <Form readOnly={true} style={{ display: "none" }}>
        <Flex spaceItems={{ default: "spaceItemsXl" }}>
          <FlexItem>
            <FormGroup label="Version" fieldId="a">
              <section style={{ marginTop: 6 }}>
                <strong>v5</strong>
                &nbsp;
                <Label color={"green"} icon={<CheckCircleIcon />}>
                  Current
                </Label>
              </section>
            </FormGroup>
          </FlexItem>
          <FlexItem style={{ maxWidth: "25em" }}>
            <FormGroup label="Description" fieldId="d">
              <section style={{ marginTop: 6 }}>Added some new rules and fixed others</section>
            </FormGroup>
          </FlexItem>
          <FlexItem>
            <FormGroup label="Url" fieldId="b">
              <section style={{ marginTop: 6 }}>
                <Label color="blue" href="https://www.redhat.com" icon={<ExternalLinkAltIcon />} target="_blank">
                  Link
                </Label>
              </section>
            </FormGroup>
          </FlexItem>
          <FlexItem>
            <FormGroup label="Created on" fieldId="c">
              <section style={{ marginTop: 6 }}>02/25/2021</section>
            </FormGroup>
          </FlexItem>
        </Flex>
      </Form>
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
