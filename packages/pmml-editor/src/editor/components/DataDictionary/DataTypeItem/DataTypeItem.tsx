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
import { BaseSyntheticEvent, useEffect, useMemo, useRef, useState } from "react";
import useOnclickOutside from "react-cool-onclickoutside";
import { Button } from "@patternfly/react-core/dist/js/components/Button";
import { Flex, FlexItem } from "@patternfly/react-core/dist/js/layouts/Flex";
import { Split, SplitItem } from "@patternfly/react-core/dist/js/layouts/Split";
import { Label } from "@patternfly/react-core/dist/js/components/Label";
import { TrashIcon } from "@patternfly/react-icons/dist/js/icons/trash-icon";
import { DDDataField } from "../DataDictionaryContainer/DataDictionaryContainer";
import ConstraintsLabel from "../ConstraintsLabel/ConstraintsLabel";
import { Interaction, Validated } from "../../../types";
import PropertiesLabels from "../PropertiesLabels/PropertiesLabels";
import { useValidationRegistry } from "../../../validation";
import { Builder } from "../../../paths";
import { ValidationIndicator } from "../../EditorCore/atoms";
import "./DataTypeItem.scss";
import TypeLabel from "../TypeLabel/TypeLabel";
import { isStructureOrCustomType } from "../dataDictionaryUtils";
import { Text, TextContent, TextVariants } from "@patternfly/react-core/dist/js/components/Text";

interface DataTypeItemProps {
  dataType: DDDataField;
  index: number;
  editingIndex: number | undefined;
  onSave: (dataType: DDDataField, index: number | null) => void;
  onEdit?: (index: number, path?: number, searchPath?: number[]) => void;
  onDelete?: (index: number, interaction: Interaction) => void;
  onConstraintsSave: (dataType: DDDataField) => void;
  onValidate: (dataTypeName: string) => boolean;
  onOutsideClick: () => void;
  getCustomTypeDefinition: (name: string) => DDDataField | undefined;
  isReadonly?: boolean;
  searchPath?: number[];
  searchPathStrings?: string[];
  searchOriginalIndex?: number;
}

const DataTypeItem = (props: DataTypeItemProps) => {
  const {
    dataType,
    index,
    editingIndex,
    onSave,
    onEdit,
    onDelete,
    onConstraintsSave,
    onValidate,
    onOutsideClick,
    getCustomTypeDefinition,
    isReadonly = false,
    searchPath,
    searchPathStrings,
    searchOriginalIndex,
  } = props;
  const [name, setName] = useState(dataType.name);
  const [typeSelection, setTypeSelection] = useState<DDDataField["type"]>(dataType.type);
  const [optypeSelection, setOptypeSelection] = useState(dataType.optype);
  const [validation, setValidation] = useState<Validated>("default");

  const dataTypeIndex = searchOriginalIndex !== undefined ? searchOriginalIndex : index;

  const ref = useOnclickOutside(
    () => {
      onOutsideClick();
    },
    { eventTypes: ["click"], disabled: editingIndex !== dataTypeIndex }
  );

  const articleRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (editingIndex === dataTypeIndex) {
      articleRef.current?.focus();
    }
  }, [editingIndex]);

  const handleEditStatus = (event: BaseSyntheticEvent) => {
    if (isReadonly) return;
    event.preventDefault();
    event.stopPropagation();
    if (searchOriginalIndex !== undefined) {
      onEdit?.(searchOriginalIndex, dataType.type === "structure" ? searchOriginalIndex : undefined, searchPath);
    } else {
      onEdit?.(index, dataType.type === "structure" ? index : undefined);
    }
  };

  const handleSave = (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    onSave({ name: name.trim(), type: typeSelection, optype: optypeSelection }, index);
  };

  const handleNameSave = () => {
    if (validation === "error") {
      setName(dataType.name);
      setValidation("default");
    } else if (name !== dataType.name) {
      handleSave();
    }
  };

  const handleDelete = (event: React.MouseEvent | React.KeyboardEvent, interaction: Interaction) => {
    event.stopPropagation();
    event.preventDefault();
    onDelete?.(index, interaction);
  };

  const handleConstraintsDelete = () => {
    const updatedDataType = { ...dataType };
    delete updatedDataType.constraints;
    onConstraintsSave(updatedDataType);
  };

  const handlePropertiesDelete = (updatedDataType: DDDataField, updateIndex: number) => {
    onSave(updatedDataType, updateIndex);
  };

  useEffect(() => {
    if (editingIndex === index) {
      const input = document.querySelector<HTMLInputElement>(`.data-dictionary__properties-edit__form #name`);
      input?.focus();
      if (name.startsWith("New Data Type")) {
        input?.select();
      }
    } else {
      if (validation !== "success") {
        setName(dataType.name);
        setValidation("default");
      }
    }
  }, [editingIndex]);

  useEffect(() => {
    setName(dataType.name);
    setTypeSelection(dataType.type);
    setOptypeSelection(dataType.optype);
  }, [dataType.name, dataType.type, dataType.optype]);

  const { validationRegistry } = useValidationRegistry();
  const validations = useMemo(
    () => validationRegistry.get(Builder().forDataDictionary().forDataField(index).build()),
    [index, dataType]
  );

  const customTypeDefinition = useMemo(() => {
    if (dataType.type === "custom" && dataType.customType !== undefined) {
      return getCustomTypeDefinition(dataType.customType);
    }
  }, [dataType, getCustomTypeDefinition]);

  const searchPathString = useMemo(
    () => (searchPathStrings?.length ? searchPathStrings.join(" > ") + " " : undefined),
    [searchPathStrings]
  );

  return (
    <article
      id={`data-type-item-n${index}`}
      className={`editable-item ${
        editingIndex === dataTypeIndex ? "editable-item--editing" : ""
      } data-type-item-n${index} ${isReadonly ? "is-readonly" : ""}`}
      tabIndex={0}
      ref={articleRef}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          handleEditStatus(event);
        }
      }}
    >
      {editingIndex === dataTypeIndex && (
        <section
          className={"editable-item__inner"}
          ref={ref}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              onOutsideClick();
            }
          }}
        >
          <Split hasGutter={true}>
            <SplitItem>
              <span className="data-type-item__name">
                {searchPathString && <span style={{ color: "gray" }}>{searchPathString + "> "}</span>}
                {name}
              </span>
            </SplitItem>
            <SplitItem isFilled={true}>
              <TypeLabel dataType={dataType} customType={customTypeDefinition} />{" "}
              {!isStructureOrCustomType(dataType.type) && (
                <>
                  <Label color="blue" className="data-type-item__type-label">
                    {optypeSelection}
                  </Label>{" "}
                  <PropertiesLabels
                    dataType={dataType}
                    editingIndex={editingIndex}
                    onPropertyDelete={handlePropertiesDelete}
                  />
                  <ConstraintsLabel
                    dataType={dataType}
                    dataTypeIndex={index}
                    editMode={true}
                    onConstraintsDelete={handleConstraintsDelete}
                  />
                </>
              )}
            </SplitItem>
            {!isReadonly && (
              <SplitItem>
                <Button
                  variant="plain"
                  className="editable-item__delete"
                  onClick={(event) => handleDelete(event, "mouse")}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      handleDelete(event, "keyboard");
                    }
                  }}
                >
                  <TrashIcon />
                </Button>
              </SplitItem>
            )}
          </Split>
          {/*{searchPathString && (*/}
          {/*  <TextContent className="data-type-item__path">*/}
          {/*    <Text component={TextVariants.small}>Path: {searchPathString}</Text>*/}
          {/*  </TextContent>*/}
          {/*)}*/}
        </section>
      )}
      {editingIndex !== dataTypeIndex && (
        <section
          className={"editable-item__inner"}
          onClick={(event) => handleEditStatus(event)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleEditStatus(event);
            }
          }}
        >
          <Split hasGutter={true}>
            {validations.length > 0 && (
              <SplitItem>
                <Flex
                  alignItems={{ default: "alignItemsCenter" }}
                  justifyContent={{ default: "justifyContentCenter" }}
                  style={{ height: "100%" }}
                >
                  <FlexItem>
                    <ValidationIndicator validations={validations} />
                  </FlexItem>
                </Flex>
              </SplitItem>
            )}
            <SplitItem>
              <span className="data-type-item__name">
                {searchPathString && <span style={{ color: "gray" }}>{searchPathString + "> "}</span>}
                {name}
              </span>
            </SplitItem>

            <SplitItem isFilled={true}>
              <TypeLabel dataType={dataType} showStructureDetail={index !== -1} customType={customTypeDefinition} />{" "}
              {!isStructureOrCustomType(dataType.type) && (
                <>
                  <Label color="blue" className="data-type-item__type-label">
                    {optypeSelection}
                  </Label>{" "}
                  <PropertiesLabels dataType={dataType} />
                  <ConstraintsLabel dataType={dataType} dataTypeIndex={index} />
                </>
              )}
            </SplitItem>
            {!isReadonly && (
              <SplitItem>
                <Button
                  variant="plain"
                  className="editable-item__delete"
                  onClick={(event) => {
                    handleDelete(event, "mouse");
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      handleDelete(event, "keyboard");
                    }
                  }}
                >
                  <TrashIcon />
                </Button>
              </SplitItem>
            )}
          </Split>
          {/*{searchPathString && (*/}
          {/*  <TextContent className="data-type-item__path">*/}
          {/*    <Text component={TextVariants.small}>*/}
          {/*      <strong>Path:</strong> {searchPathString}*/}
          {/*    </Text>*/}
          {/*  </TextContent>*/}
          {/*)}*/}
        </section>
      )}
    </article>
  );
};

export default DataTypeItem;
