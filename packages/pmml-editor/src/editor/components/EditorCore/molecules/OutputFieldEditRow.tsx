/*
 * Copyright 2020 Red Hat, Inc. and/or its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import * as React from "react";
import { useState } from "react";
import {
  FormGroup,
  Select,
  SelectOption,
  SelectVariant,
  Split,
  SplitItem,
  Stack,
  StackItem,
  TextInput
} from "@patternfly/react-core";
import "../organisms/OutputFieldsTable.scss";
import { FieldName, OutputField } from "@kogito-tooling/pmml-editor-marshaller";
import { OutputFieldRowEditModeAction, OutputLabelsEditMode } from "../atoms";
import { ExclamationCircleIcon } from "@patternfly/react-icons";
import { ValidatedType } from "../../../types";

interface OutputFieldEditRowProps {
  activeOutputFieldIndex: number | undefined;
  activeOutputField: ValidatedType<OutputField>;
  setActiveOutputField: (_output: ValidatedType<OutputField>) => void;
  validateOutputName: (name: string | undefined) => boolean;
  viewExtendedProperties: () => void;
  onCommit: () => void;
  onCancel: () => void;
}

const dataTypes = [
  "string",
  "integer",
  "float",
  "double",
  "boolean",
  "date",
  "time",
  "dateTime",
  "dateDaysSince[0]",
  "dateDaysSince[1960]",
  "dateDaysSince[1970]",
  "dateDaysSince[1980]",
  "timeSeconds",
  "dateTimeSecondsSince[0]",
  "dateTimeSecondsSince[1960]",
  "dateTimeSecondsSince[1970]",
  "dateTimeSecondsSince[1980]"
];

export const OutputFieldEditRow = (props: OutputFieldEditRowProps) => {
  const {
    activeOutputFieldIndex,
    activeOutputField,
    setActiveOutputField,
    validateOutputName,
    viewExtendedProperties,
    onCommit,
    onCancel
  } = props;

  const [isTypeSelectOpen, setIsTypeSelectOpen] = useState(false);
  const typeToggle = (isOpen: boolean) => {
    setIsTypeSelectOpen(isOpen);
  };

  const onSelectType = (event: any, selection: any, isPlaceholder: boolean) => {
    setActiveOutputField({
      ...activeOutputField,
      value: { ...activeOutputField.value, dataType: isPlaceholder ? undefined : selection }
    });
    setIsTypeSelectOpen(false);
  };

  return (
    <article className={`output-item output-item-n${activeOutputFieldIndex}`}>
      <Stack hasGutter={true}>
        <StackItem>
          <Split hasGutter={true}>
            <SplitItem>
              <FormGroup
                label="Name"
                fieldId="output-name-helper"
                isRequired={true}
                helperTextInvalid="Name must be unique and present."
                helperTextInvalidIcon={<ExclamationCircleIcon />}
                validated={activeOutputField.valid ? "default" : "error"}
              >
                <TextInput
                  type="text"
                  id="output-name"
                  name="output-name"
                  aria-describedby="output-name-helper"
                  value={activeOutputField.value.name.toString()}
                  validated={activeOutputField.valid ? "default" : "error"}
                  autoFocus={true}
                  onChange={e => {
                    setActiveOutputField({
                      value: { ...activeOutputField.value, name: e as FieldName },
                      valid: validateOutputName(e)
                    });
                  }}
                />
              </FormGroup>
            </SplitItem>
            <SplitItem isFilled={true}>
              <FormGroup label="Data type" fieldId="output-dataType-helper" style={{ width: "12em" }} isRequired={true}>
                <Select
                  id="output-dataType"
                  name="output-dataType"
                  aria-label="Select Input"
                  aria-describedby="output-dataType-helper"
                  variant={SelectVariant.single}
                  onToggle={typeToggle}
                  onSelect={onSelectType}
                  selections={activeOutputField.value.dataType}
                  isOpen={isTypeSelectOpen}
                  placeholder="Type"
                  menuAppendTo={"parent"}
                >
                  {dataTypes.map((dt, _index) => (
                    <SelectOption key={_index} value={dt} />
                  ))}
                </Select>
              </FormGroup>
            </SplitItem>
            <SplitItem>
              <OutputFieldRowEditModeAction
                onCommit={onCommit}
                onCancel={onCancel}
                disableCommit={!validateOutputName(activeOutputField.value.name.toString())}
              />
            </SplitItem>
          </Split>
        </StackItem>
        <StackItem>
          <Split>
            <SplitItem>
              <FormGroup label="Properties" fieldId="output-labels-helper">
                <OutputLabelsEditMode
                  activeOutputField={activeOutputField}
                  setActiveOutputField={setActiveOutputField}
                  viewExtendedProperties={viewExtendedProperties}
                />
              </FormGroup>
            </SplitItem>
          </Split>
        </StackItem>
      </Stack>
    </article>
  );
};
