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
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  Divider,
  Form,
  FormGroup,
  FormSelect,
  FormSelectOption,
  Label,
  Split,
  SplitItem,
  TextInput,
  Title,
  FlexItem,
  Flex,
  PageSection
} from "@patternfly/react-core";
import { useState } from "react";
import { CheckCircleIcon, ExternalLinkAltIcon, RedoAltIcon } from "@patternfly/react-icons";
import DecisionVersions from "../DecisionVersions/DecisionVersions";

const DeploymentConsole = () => {
  const [description, setDescription] = useState("");
  const [kafkaSource, setKafkaSource] = useState<string>("endpoint 1");
  const [kafkaSink, setKafkaSink] = useState<string>("endpoint 2");

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
      <Title headingLevel="h2" size="xl" className="test-and-deploy__title">
        Deployment
      </Title>
      <Form>
        <Split hasGutter={true}>
          <SplitItem isFilled={true}>
            <FormGroup label="Description" fieldId="description">
              <TextInput type="text" value={description} onChange={onDescriptionChange} />
            </FormGroup>
          </SplitItem>
          <SplitItem style={{ minWidth: "15em" }}>
            <FormGroup label="Kafka source" fieldId="kafka-source">
              <FormSelect
                id="kafka-source"
                value={kafkaSource}
                onChange={onKafkaSourceChange}
                aria-label="Kafka source"
              >
                {kafkaOptions.map((option, index) => (
                  <FormSelectOption key={index} value={option} label={option} />
                ))}
              </FormSelect>
            </FormGroup>
          </SplitItem>
          <SplitItem style={{ minWidth: "15em" }}>
            <FormGroup label="Kafka sink" fieldId="kafka-sink">
              <FormSelect id="kafka-sink" value={kafkaSink} onChange={onKafkaSinkChange} aria-label="Kafka sink">
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
      <Divider className="test-and-deploy__divider" />
      <Title headingLevel="h2" size="xl" className="test-and-deploy__title">
        Status
      </Title>
      <Form readOnly={true}>
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
      <Divider className="test-and-deploy__divider" />
      <Title headingLevel="h3" size="xl" className="test-and-deploy__title">
        Version History
      </Title>
      <DecisionVersions />
    </section>
  );
};

export default DeploymentConsole;
