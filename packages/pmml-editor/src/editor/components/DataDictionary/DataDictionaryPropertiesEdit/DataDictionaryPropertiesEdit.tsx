/*
 * Copyright 2020 Red Hat, Inc. and/or its affiliates.
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
import { useEffect, useMemo, useState } from "react";
import { TextInput } from "@patternfly/react-core/dist/js/components/TextInput";
import { Form, FormGroup } from "@patternfly/react-core/dist/js/components/Form";
import { Alert } from "@patternfly/react-core/dist/js/components/Alert";
import { Tooltip } from "@patternfly/react-core/dist/js/components/Tooltip";
import { Radio } from "@patternfly/react-core/dist/js/components/Radio";
import { HelpIcon } from "@patternfly/react-icons/dist/js/icons/help-icon";
import { ConstraintType, DDDataField } from "../DataDictionaryContainer/DataDictionaryContainer";
import ConstraintsEdit from "../ConstraintsEdit/ConstraintsEdit";
import "./DataDictionaryPropertiesEdit.scss";
import {
  Select,
  SelectGroup,
  SelectOption,
  SelectOptionObject,
  SelectVariant,
} from "@patternfly/react-core/dist/js/components/Select";
import { Flex, FlexItem } from "@patternfly/react-core/dist/js/layouts/Flex";
import { Divider } from "@patternfly/react-core/dist/js/components/Divider";
import { isStructureOrCustomType } from "../dataDictionaryUtils";

interface DataDictionaryPropertiesEditProps {
  dataType: DDDataField;
  dataFieldIndex: number | undefined;
  onClose: () => void;
  onSave: (payload: Partial<DDDataField>) => void;
  structureTypes: string[];
}

const DataDictionaryPropertiesEdit = (props: DataDictionaryPropertiesEditProps) => {
  const { dataType, dataFieldIndex, onClose, onSave, structureTypes } = props;
  const [name, setName] = useState(dataType.name ?? "");
  const [typeSelection, setTypeSelection] = useState<DDDataField["type"]>(dataType.type);
  const [isTypeSelectOpen, setIsTypeSelectOpen] = useState(false);
  const [displayName, setDisplayName] = useState(dataType.displayName ?? "");
  const [isCyclic, setIsCyclic] = useState(dataType.isCyclic);
  const [missingValue, setMissingValue] = useState(dataType.missingValue ?? "");
  const [invalidValue, setInvalidValue] = useState(dataType.invalidValue ?? "");
  const typeOptions = [
    { value: "string" },
    { value: "integer" },
    { value: "float" },
    { value: "double" },
    { value: "boolean" },
    { value: "structure" },
  ];
  const [optypeSelection, setOptypeSelection] = useState(dataType.optype);
  const [isOptypeSelectOpen, setIsOptypeSelectOpen] = useState(false);
  const optypeOptions = [{ value: "categorical" }, { value: "ordinal" }, { value: "continuous" }];

  useEffect(() => {
    setName(dataType.name);
    setTypeSelection(dataType.type);
    setOptypeSelection(dataType.optype);
    setDisplayName(dataType.displayName ?? "");
    setIsCyclic(dataType.isCyclic);
    setMissingValue(dataType.missingValue ?? "");
    setInvalidValue(dataType.invalidValue ?? "");
  }, [dataType]);

  const saveCyclicProperty = (value: DDDataField["isCyclic"]) => {
    setIsCyclic(value);
    onSave({
      isCyclic: value,
    });
  };

  const isOptypeDisabled = useMemo(() => dataType.optype === "categorical", [dataType.optype]);

  const constraintAlert = useMemo(() => {
    if (dataType.optype === "continuous" && dataType.isCyclic && dataType.constraints === undefined) {
      return "Interval or Value constraints are required for cyclic continuous data types";
    }
    if (
      dataType.isCyclic &&
      dataType.optype === "continuous" &&
      dataType.constraints?.type === ConstraintType.RANGE &&
      dataType.constraints.value?.length > 1
    ) {
      return "Cyclic continuous data types can only have a single interval constraint";
    }
  }, [dataType]);

  const handleNameChange = (value: string) => {
    setName(value);
    // setValidation(onValidate(value) ? "default" : "error");
  };

  const handleNameSave = () => {
    // if (validation === "error") {
    //   setName(dataType.name);
    //   setValidation("default");
    // } else if (name !== dataType.name) {
    //   handleSave();
    // }
    onSave({
      name,
    });
  };

  const typeToggle = (isOpen: boolean) => {
    setIsTypeSelectOpen(isOpen);
  };

  const typeSelect = (event: React.MouseEvent | React.ChangeEvent, value: string) => {
    if (value !== typeSelection) {
      setTypeSelection(value as DDDataField["type"]);
      setIsTypeSelectOpen(false);
      const payload = structureTypes.includes(value)
        ? { type: "custom" as DDDataField["type"], customType: value }
        : { type: value as DDDataField["type"] };
      onSave(payload);
    }
  };

  const defaultTypeOptions = useMemo(() => {
    return typeOptions.map((item, index) => (
      <SelectOption
        key={index + typeOptions.length}
        value={item.value}
        className="ignore-onclickoutside data-type-item__type-select__option"
      />
    ));
  }, [typeOptions]);

  const customTypeOptions = useMemo(() => {
    return structureTypes.map((item, index) => (
      <SelectOption
        key={index + typeOptions.length}
        value={item}
        className="ignore-onclickoutside data-type-item__type-select__option"
      />
    ));
  }, [structureTypes, typeOptions]);

  const typeSelectOptions = useMemo(() => {
    const optionList = [
      <SelectGroup key="group1" label="Regular Types" className="ignore-onclickoutside">
        {defaultTypeOptions}
      </SelectGroup>,
    ];
    if (structureTypes.length > 0) {
      optionList.push(<Divider className="ignore-onclickoutside" key="divider" />);
      optionList.push(
        <SelectGroup key="group2" label="Custom types" className="ignore-onclickoutside">
          {customTypeOptions}
        </SelectGroup>
      );
    }
    return optionList;
  }, [customTypeOptions, defaultTypeOptions]);

  const optypeToggle = (isOpen: boolean) => {
    setIsOptypeSelectOpen(isOpen);
  };

  const optypeSelect = (event: React.MouseEvent | React.ChangeEvent, value: string | SelectOptionObject) => {
    if (value !== optypeSelection) {
      setOptypeSelection(value as DDDataField["optype"]);
      setIsOptypeSelectOpen(false);
      onSave({ optype: value as DDDataField["optype"] });
    }
  };

  useEffect(() => {
    // on first render focus on name field
    const input = document.querySelector<HTMLInputElement>(`.data-dictionary__properties-edit__form #name`);
    input?.focus();
    // if it's a new field, select also the name content to quickly overwrite it
    if (name.startsWith("New Data Type")) {
      input?.select();
    }
  }, [dataType]);

  const isStructure = useMemo(() => typeSelection === "structure", [typeSelection]);

  return (
    <section className="data-dictionary__properties-edit ignore-onclickoutside">
      <Form className="data-dictionary__properties-edit__form">
        <div className="data-dictionary__properties-edit__form-container">
          <Flex className="data-dictionary__properties-edit__field-group">
            <FlexItem>
              <FormGroup
                className="data-dictionary__properties-edit__field"
                fieldId="name"
                label="Name"
                helperTextInvalid="Name is mandatory and must be unique"
                // helperTextInvalidIcon={<ExclamationCircleIcon />}
                // validated={validation}
                isRequired={true}
              >
                <TextInput
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={handleNameChange}
                  placeholder="Name"
                  // validated={validation}
                  onBlur={handleNameSave}
                  autoComplete="off"
                />
              </FormGroup>
            </FlexItem>
            <FlexItem>
              <FormGroup fieldId="type" label="Type" isRequired={true}>
                <Select
                  id="type"
                  variant={SelectVariant.single}
                  aria-label="Select Input Type"
                  onToggle={typeToggle}
                  onSelect={typeSelect}
                  selections={typeSelection}
                  isOpen={isTypeSelectOpen}
                  placeholder="Type"
                  className="data-type-item__type-select ignore-onclickoutside"
                  menuAppendTo={() => document.body}
                  isGrouped={true}
                  width={200}
                >
                  {typeSelectOptions}
                </Select>
              </FormGroup>
            </FlexItem>
            {!isStructureOrCustomType(dataType.type) && (
              <FlexItem>
                <FormGroup fieldId="optype" label="Op Type" isRequired={true}>
                  <Select
                    id="optype"
                    variant={SelectVariant.single}
                    aria-label="Select Op Type"
                    onToggle={optypeToggle}
                    onSelect={optypeSelect}
                    selections={optypeSelection}
                    isOpen={isOptypeSelectOpen}
                    placeholder="Op Type"
                    className="data-type-item__type-select"
                    menuAppendTo={"parent"}
                  >
                    {typeSelectOptions}
                  </Select>
                </FormGroup>
              </FlexItem>
            )}
          </Flex>
          {!isStructureOrCustomType(dataType.type) && (
            <>
              <Flex className="data-dictionary__properties-edit__field-group">
                <FlexItem>
                  <FormGroup
                    className="data-dictionary__properties-edit__field"
                    label="Display Name"
                    fieldId="display-name"
                  >
                    <TextInput
                      type="text"
                      id="display-name"
                      name="display-name"
                      aria-describedby="Display Name"
                      value={displayName}
                      onChange={(value) => setDisplayName(value)}
                      autoComplete="off"
                      onBlur={() =>
                        onSave({
                          displayName: displayName === "" ? undefined : displayName,
                        })
                      }
                    />
                  </FormGroup>
                </FlexItem>
                <FlexItem>
                  <FormGroup
                    className="data-dictionary__properties-edit__field"
                    label="Cyclic Type"
                    fieldId="is-cyclic"
                    isInline={true}
                    labelIcon={
                      dataType.optype === "categorical" ? (
                        <Tooltip content={"Categorical fields cannot be cyclic"}>
                          <button
                            aria-label="More info for Cyclic Type"
                            onClick={(e) => e.preventDefault()}
                            className="pf-c-form__group-label-help"
                          >
                            <HelpIcon style={{ color: "var(--pf-global--info-color--100)" }} />
                          </button>
                        </Tooltip>
                      ) : (
                        <></>
                      )
                    }
                  >
                    <Radio
                      isChecked={isCyclic === true}
                      name="isCyclic"
                      onChange={() => {
                        saveCyclicProperty(true);
                      }}
                      label="Yes"
                      id="isCyclic"
                      value="isCyclic"
                      isDisabled={isOptypeDisabled}
                    />
                    <Radio
                      isChecked={isCyclic === false}
                      name="isNotCyclic"
                      onChange={() => {
                        saveCyclicProperty(false);
                      }}
                      label="No"
                      id="isNotCyclic"
                      value="isNotCyclic"
                      isDisabled={isOptypeDisabled}
                    />
                    <Radio
                      isChecked={isCyclic === undefined}
                      name="cyclicNotSet"
                      onChange={() => {
                        saveCyclicProperty(undefined);
                      }}
                      label="Not Set"
                      id="cyclicNotSet"
                      value="cyclicNotSet"
                      isDisabled={isOptypeDisabled}
                    />
                  </FormGroup>
                </FlexItem>
              </Flex>
              <Flex className="data-dictionary__properties-edit__field-group">
                <FlexItem>
                  <FormGroup
                    className="data-dictionary__properties-edit__field"
                    label="Missing Value"
                    fieldId="missing-value"
                  >
                    <TextInput
                      type="text"
                      id="missing-value"
                      name="missing-value"
                      aria-describedby="Missing Value"
                      value={missingValue}
                      onChange={(value) => setMissingValue(value)}
                      autoComplete="off"
                      onBlur={() =>
                        onSave({
                          missingValue: missingValue === "" ? undefined : missingValue,
                        })
                      }
                    />
                  </FormGroup>
                </FlexItem>
                <FlexItem>
                  <FormGroup
                    className="data-dictionary__properties-edit__field"
                    label="Invalid Value"
                    fieldId="missing-value"
                  >
                    <TextInput
                      type="text"
                      id="invalid-value"
                      name="invalid-value"
                      aria-describedby="Invalid Value"
                      value={invalidValue}
                      onChange={(value) => setInvalidValue(value)}
                      autoComplete="off"
                      onBlur={() =>
                        onSave({
                          invalidValue: invalidValue === "" ? undefined : invalidValue,
                        })
                      }
                    />
                  </FormGroup>
                </FlexItem>
              </Flex>
              <section className="data-dictionary__constraints-section">
                {constraintAlert && (
                  <Alert
                    variant="warning"
                    isInline={true}
                    className="data-dictionary__validation-alert"
                    title={constraintAlert}
                  />
                )}
                <ConstraintsEdit dataType={dataType} dataFieldIndex={dataFieldIndex} onSave={onSave} />
              </section>
            </>
          )}
        </div>
      </Form>
    </section>
  );
};

export default DataDictionaryPropertiesEdit;
