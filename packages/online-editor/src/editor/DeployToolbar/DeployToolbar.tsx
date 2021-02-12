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
  Dropdown,
  DropdownGroup,
  DropdownItem,
  DropdownToggle,
  FormGroup,
  FormSelect,
  FormSelectOption,
  Label,
  Split,
  SplitItem
} from "@patternfly/react-core";
import { useState } from "react";
import { CheckCircleIcon, RedoAltIcon } from "@patternfly/react-icons";

const DeployToolbar = () => {
  const [kafkaSource, setKafkaSource] = useState<string>();
  const [kafkaSink, setKafkaSink] = useState<string>();

  const kafkaOptions = ["endpoint 1", "endpoint 2", "endpoint 3", "endpoint 4"];

  const onKafkaSourceChange = (value: string) => {
    setKafkaSource(value);
  };

  const onKafkaSinkChange = (value: string) => {
    setKafkaSink(value);
  };

  const [isOpen, setIsOpen] = useState(false);

  const onToggle = (status: boolean) => {
    setIsOpen(status);
  };
  const onSelect = () => {
    setIsOpen(!isOpen);
    onFocus();
  };
  const onFocus = () => {
    const element = document.getElementById("toggle-id-3");
    element?.focus();
  };

  const dropdownItems = [
    <DropdownItem key="v4" component="button">
      v4 ~ 14:11
    </DropdownItem>,
    <DropdownItem key="v3" component="button">
      v3 ~ 12:00
    </DropdownItem>,
    <DropdownItem key="v2" component="button">
      v2 ~ 02/10/2022
    </DropdownItem>,
    <DropdownItem key="v1" component="button">
      v1 ~ 02/08/2022
    </DropdownItem>
  ];
  return (
    <section>
      <Split hasGutter={true}>
        <SplitItem isFilled={true}>
          <FormGroup label="Status" fieldId="a">
            <section style={{ marginTop: 6 }}>
              <strong>Version 5</strong>&nbsp;
              <Label color={"green"} icon={<CheckCircleIcon />}>
                Current
              </Label>
            </section>
          </FormGroup>
        </SplitItem>
        <SplitItem style={{ minWidth: "15em" }}>
          <FormGroup label="Kafka source" fieldId="kafka-source">
            <FormSelect id="kafka-source" value={kafkaSource} onChange={onKafkaSourceChange} aria-label="Kafka source">
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
        {/*<SplitItem style={{ paddingTop: 24 }}>*/}
        {/*  <Dropdown*/}
        {/*    onSelect={onSelect}*/}
        {/*    toggle={*/}
        {/*      <DropdownToggle onToggle={onToggle} icon={<RedoAltIcon />} id="toggle-id-3">*/}
        {/*        Rollback*/}
        {/*      </DropdownToggle>*/}
        {/*    }*/}
        {/*    isOpen={isOpen}*/}
        {/*    dropdownItems={dropdownItems}*/}
        {/*  />*/}
        {/*</SplitItem>*/}
        <SplitItem style={{ paddingTop: 24 }}>
          <Button variant="primary">Deploy</Button>
        </SplitItem>
      </Split>
    </section>
  );
};

export default DeployToolbar;
