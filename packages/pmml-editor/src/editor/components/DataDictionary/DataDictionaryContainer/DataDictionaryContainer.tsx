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
import { useEffect, useMemo, useRef, useState } from "react";
import { Button, ButtonVariant } from "@patternfly/react-core/dist/js/components/Button";
import { Flex, FlexItem } from "@patternfly/react-core/dist/js/layouts/Flex";
import { Bullseye } from "@patternfly/react-core/dist/js/layouts/Bullseye";
import { Alert } from "@patternfly/react-core/dist/js/components/Alert";
import { SortIcon } from "@patternfly/react-icons/dist/js/icons/sort-icon";
import { PlusIcon } from "@patternfly/react-icons/dist/js/icons/plus-icon";
import { BoltIcon } from "@patternfly/react-icons/dist/js/icons/bolt-icon";
import { Drawer, DrawerContent, DrawerContentBody, DrawerPanelBody, DrawerPanelContent } from "@patternfly/react-core";
import { OutlinedHandPointLeftIcon } from "@patternfly/react-icons";
import MultipleDataTypeAdd from "../MultipleDataTypeAdd/MultipleDataTypeAdd";
import DataTypesSort from "../DataTypesSort/DataTypesSort";
import EmptyDataDictionary from "../EmptyDataDictionary/EmptyDataDictionary";
import { findIncrementalName } from "../../../PMMLModelHelper";
import DataDictionaryPropertiesEdit from "../DataDictionaryPropertiesEdit/DataDictionaryPropertiesEdit";
import { get, isEqual } from "lodash";
import { useValidationRegistry } from "../../../validation";
import { Builder } from "../../../paths";
import "./DataDictionaryContainer.scss";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import { getChildPathString, getParentPathString, getPathsString, searchDataFields } from "../dataDictionaryUtils";
import DataDictionaryBreadcrumb from "../DataDictionaryBreadcrumb/DataDictionaryBreadcrumb";
import { Interaction } from "../../../types";
import DataTypeItem from "../DataTypeItem/DataTypeItem";
import { InputGroup } from "@patternfly/react-core/dist/js/components/InputGroup";
import { TextInput } from "@patternfly/react-core/dist/js/components/TextInput";
import { SearchIcon } from "@patternfly/react-icons/dist/js/icons/search-icon";

interface DataDictionaryContainerProps {
  dataDictionary: DDDataField[];
  onAdd: (name: string, type: DDDataField["type"], optype: DDDataField["optype"], pathString?: string) => void;
  onEdit: (pathString: string, field: DDDataField) => void;
  onDelete: (index: number, pathString?: string) => void;
  onReorder: (oldIndex: number, newIndex: number, pathString?: string) => void;
  onBatchAdd: (fields: string[], pathString?: string) => void;
  onEditingPhaseChange: (status: boolean) => void;
}

const DataDictionaryContainer = (props: DataDictionaryContainerProps) => {
  const { dataDictionary, onAdd, onEdit, onDelete, onReorder, onBatchAdd, onEditingPhaseChange } = props;
  const [dataTypes, setDataTypes] = useState<DDDataField[]>(dataDictionary);
  const [dataTypesView, setDataTypesView] = useState(dataDictionary);
  const [editingIndex, setEditingIndex] = useState<number | undefined>();
  const [editingPath, setEditingPath] = useState<number[]>([]);
  const [viewSection, setViewSection] = useState<dataDictionarySection>("main");
  const [editingDataType, setEditingDataType] = useState<DDDataField>();
  const [sorting, setSorting] = useState(false);
  const [deleteStructure, setDeleteStructure] = useState<{ index: number; path: string | undefined } | undefined>();
  const [dataTypeFocusIndex, setDataTypeFocusIndex] = useState<number | undefined>(undefined);
  const [searchString, setSearchString] = useState<string>("");
  const [searchResults, setSearchResults] = useState<DDDataFieldSearchResult[]>([]);
  const [searchBasePath, setSearchBasePath] = useState<number[]>([]);

  useEffect(() => {
    // undoing a recently created data field force to exit the editing mode for that field
    // if (editingIndex === dataTypesView.length) {
    //   setEditingIndex(undefined);
    //   if (viewSection !== "main") {
    //     setViewSection("main");
    //   }
    //   onEditingPhaseChange(false);
    // }

    setDataTypes(dataDictionary);
  }, [dataDictionary]);

  const combinedEditingPath = useMemo(
    () => (searchBasePath.length > 0 ? [...searchBasePath, ...editingPath] : editingPath),
    [searchBasePath, editingPath]
  );

  useEffect(() => {
    // updating editing data type
    if (editingIndex !== undefined) {
      if (editingIndex === -1) {
        setEditingDataType(get(dataDictionary, getParentPathString(combinedEditingPath)));
      } else {
        setEditingDataType(get(dataDictionary, getChildPathString(combinedEditingPath, editingIndex)));
      }
    }
  }, [dataDictionary, editingIndex, combinedEditingPath]);

  const structureTypes = useMemo(
    () => dataTypes.filter((item) => item.type === "structure").map((item) => item.name),
    [dataTypes]
  );

  useEffect(() => {
    const pathString = getPathsString(combinedEditingPath);
    setDataTypesView(pathString.length ? get(dataTypes, pathString, []) : dataTypes);
  }, [combinedEditingPath, dataTypes]);

  useEffect(() => {
    if (deleteStructure) {
      onDelete(deleteStructure.index, deleteStructure.path);
      setDeleteStructure(undefined);
    }
  }, [deleteStructure]);

  const handleOutsideClick = () => {
    setEditingIndex(undefined);
    setEditingDataType(undefined);
    onEditingPhaseChange(false);
  };

  const addDataType = () => {
    onAdd(
      findIncrementalName(
        "New Data Type",
        dataTypesView.map((dt) => dt.name),
        1
      ),
      "string",
      "categorical",
      editingPath.length ? getParentPathString(editingPath) : undefined
    );
    setEditingIndex(dataTypesView.length);
    onEditingPhaseChange(true);
  };

  const addMultipleDataTypes = (fields: string) => {
    const fieldsNames = fields.split("\n").filter((item) => item.trim().length > 0);
    onBatchAdd(fieldsNames, editingPath.length ? getParentPathString(editingPath) : undefined);
    setViewSection("main");
  };

  const saveDataType = (dataType: DDDataField, index: number) => {
    // onEdit(index, dataTypes[index].name, dataType);
  };

  const handleSave = (dataType: DDDataField, index: number) => {
    //saveDataType(dataType, index);
  };

  const handleDelete = (index: number, interaction: Interaction) => {
    // deleting an element while editing it, so cleaning up editing states
    if (editingIndex === index) {
      setEditingIndex(undefined);
      setEditingDataType(undefined);
    }
    // deleting a structure while inside it, so moving back a level
    if (index === -1) {
      setEditingPath((prevState) => {
        const updatedPath = [...prevState];
        updatedPath.splice(updatedPath.length - 1);
        return updatedPath;
      });
    }

    if (index === -1) {
      // relying to a state variable to defer deletion until moving back to the parent navigation level
      const deleteIndex = editingPath[editingPath.length - 1];
      const updatedPath = [...editingPath];
      updatedPath.splice(updatedPath.length - 1);
      const deletePathString = updatedPath.length ? getParentPathString(updatedPath) : undefined;
      if (deleteIndex) {
        setDeleteStructure({ index: deleteIndex, path: deletePathString });
      }
    } else {
      onDelete(index, editingPath.length ? getParentPathString(editingPath) : undefined);
      if (interaction === "mouse") {
        //If the DataTypeItem was deleted by clicking on the delete icon we need to blur
        //the element otherwise the CSS :focus-within persists on the deleted element.
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement?.blur();
        }
      } else if (interaction === "keyboard") {
        //If the DataTypeItem was deleted by pressing enter on the delete icon when focused
        //we need to set the focus to the next DataTypeItem. The index of the _next_ item
        //is identical to the index of the deleted item.
        setDataTypeFocusIndex(index);
      }
      setEditingIndex(undefined);
      onEditingPhaseChange(false);
    }
  };

  const handleEdit = (index: number, path?: number, searchPath?: number[]) => {
    if (path !== undefined && index !== -1) {
      const updatedPath = [...editingPath];
      updatedPath.push(path);
      setEditingPath(updatedPath);
      setEditingIndex(-1);
    } else {
      setEditingIndex(index);
    }
    if (searchPath) {
      setSearchBasePath(searchPath);
    }

    onEditingPhaseChange(true);
  };

  // const handleConstraintsEdit = (dataType: DDDataField) => {
  //   if (editing !== undefined) {
  //     setEditingDataType(dataType);
  //     setViewSection("properties");
  //     onEditingPhaseChange(true);
  //   }
  // };

  const handleConstraintsSave = (payload: DDDataField) => {
    if (editingIndex !== undefined) {
      // onEdit(editingIndex, dataTypes[editingIndex].name, payload);
      console.log("constraints save not implemented");
    }
  };

  const handlePropertiesSave = (payload: Partial<DDDataField>) => {
    if (editingIndex !== undefined && editingDataType) {
      const dataType = editingDataType;
      const existingPartial = {};
      Object.keys(payload).forEach((key) => Reflect.set(existingPartial, key, Reflect.get(dataType, key)));
      if (payload?.type && payload.type === "structure" && payload.type !== editingDataType.type) {
        // when changing type to structure, navigate inside of it
        setEditingPath((prev) => [...prev, editingIndex]);
        setEditingIndex(-1);
      }
      if (!isEqual(payload, existingPartial)) {
        onEdit(
          editingIndex === -1
            ? getParentPathString(combinedEditingPath)
            : getChildPathString(combinedEditingPath, editingIndex),
          Object.assign(dataType, payload)
        );
      }
    }
  };

  const exitFromPropertiesEdit = () => {
    setViewSection("main");
  };

  const toggleSorting = () => {
    setEditingIndex(undefined);
    setEditingDataType(undefined);
    setSorting(!sorting);
  };

  const handleReorder = (oldIndex: number, newIndex: number) => {
    onReorder(oldIndex, newIndex, editingPath.length ? getParentPathString(editingPath) : undefined);
  };

  const dataTypeNameValidation = (dataTypeName: string) => {
    let isValid = true;
    if (dataTypeName.trim().length === 0) {
      return false;
    }
    const match = dataTypes.find((item, index) => item.name === dataTypeName.trim() && index !== editingIndex);
    if (match !== undefined) {
      isValid = false;
    }
    return isValid;
  };

  const getTransition = (editingIndex: number | undefined) => {
    if (editingIndex !== -1) {
      return "data-dictionary__overview";
    } else {
      return "enter-from-right";
    }
  };

  const { validationRegistry } = useValidationRegistry();
  const validations = useRef(validationRegistry.get(Builder().forDataDictionary().build()));
  useEffect(() => {
    if (editingIndex === undefined) {
      validations.current = validationRegistry.get(Builder().forDataDictionary().build());
    }
  }, [dataDictionary, editingIndex]);

  //Set the focus on a DataTypeItem as required
  useEffect(() => {
    if (dataTypeFocusIndex !== undefined) {
      document.querySelector<HTMLElement>(`#data-type-item-n${dataTypeFocusIndex}`)?.focus();
    }
    return () => {
      setDataTypeFocusIndex(undefined);
    };
  }, [dataDictionary, dataTypeFocusIndex]);

  const getCustomTypeDefinition = (name: string) => {
    return dataDictionary.find((item) => item.name === name);
  };

  const goToCustomType = (name: string) => {
    const index = dataTypes.findIndex((item) => item.name === name);
    if (index > -1) {
      setEditingPath([index]);
      setEditingIndex(-1);
    }
  };

  const searchFieldRef = useRef<HTMLInputElement>(null);
  const onSearchSubmit = (): void => {
    if (searchFieldRef && searchFieldRef.current) {
      setSearchString(searchFieldRef.current.value);
    }
  };
  const onSearchEnter = (event: React.KeyboardEvent): void => {
    if (searchFieldRef && searchFieldRef.current && event.key === "Enter") {
      setSearchString(searchFieldRef.current.value);
    }
  };

  useEffect(() => {
    if (searchString.length > 0) {
      setSearchResults(searchDataFields(dataDictionary, searchString));
    } else {
      setSearchResults([]);
      setSearchBasePath([]);
      setEditingPath([]);
      setEditingDataType(undefined);
    }
  }, [searchString]);

  return (
    <div className="data-dictionary">
      <>
        <section className="data-dictionary__overview">
          <Flex className="data-dictionary__toolbar">
            <FlexItem>
              <Button
                variant="primary"
                onClick={addDataType}
                icon={<PlusIcon />}
                iconPosition="left"
                isDisabled={sorting}
                className="ignore-onclickoutside"
              >
                Add Data Type
              </Button>
            </FlexItem>
            <FlexItem>
              <Button
                variant="secondary"
                onClick={() => setViewSection("batch-add")}
                icon={<BoltIcon />}
                iconPosition="left"
                isDisabled={sorting}
              >
                Add Multiple Data Types
              </Button>
            </FlexItem>
            <FlexItem>
              <Button
                variant={sorting ? "primary" : "secondary"}
                onClick={toggleSorting}
                icon={<SortIcon />}
                iconPosition="left"
                isDisabled={searchString.length > 0}
              >
                {sorting ? "End Ordering" : "Order"}
              </Button>
            </FlexItem>
            <FlexItem>
              <InputGroup>
                <TextInput
                  name="data-types-search-input"
                  id="data-types-search-input"
                  ref={searchFieldRef}
                  type="search"
                  aria-label="search data types"
                  onKeyDown={onSearchEnter}
                  placeholder="Search Data Types"
                  data-ouia-component-id="data-types-search-input"
                />
                <Button
                  id="audit-search"
                  variant={ButtonVariant.control}
                  aria-label="search button for search input"
                  onClick={onSearchSubmit}
                  ouiaId="search-button"
                >
                  <SearchIcon />
                </Button>
              </InputGroup>
            </FlexItem>
          </Flex>
          {dataTypes.length === 0 && (
            <Bullseye style={{ height: "40vh" }}>
              <EmptyDataDictionary />
            </Bullseye>
          )}
          {dataTypes.length > 0 && (
            <Drawer isStatic isExpanded={true}>
              <DrawerContent
                panelContent={
                  <DrawerPanelContent widths={{ default: "width_50" }}>
                    <DrawerPanelBody
                      hasNoPadding={true}
                      style={{ backgroundColor: "var(--pf-global--BackgroundColor--200)" }}
                    >
                      {editingDataType ? (
                        <DataDictionaryPropertiesEdit
                          dataType={editingDataType}
                          dataFieldIndex={editingIndex}
                          onClose={exitFromPropertiesEdit}
                          onSave={handlePropertiesSave}
                          structureTypes={structureTypes}
                          goToCustomType={goToCustomType}
                        />
                      ) : (
                        <section
                          style={{
                            margin: "5em 0",
                            textAlign: "center",
                            color: "var(--pf-global--Color--200)",
                          }}
                        >
                          Click on a data type from the list to edit its properties
                          <br />
                          <OutlinedHandPointLeftIcon style={{ fontSize: "var(--pf-global--icon--FontSize--md)" }} />
                        </section>
                      )}
                    </DrawerPanelBody>
                  </DrawerPanelContent>
                }
              >
                <DrawerContentBody
                  style={{
                    overflowX: "hidden",
                    backgroundColor: "var(--pf-global--BackgroundColor--200)",
                  }}
                >
                  <SwitchTransition mode={"out-in"}>
                    <CSSTransition
                      timeout={{
                        enter: 230,
                        exit: 100,
                      }}
                      classNames={getTransition(editingIndex)}
                      key={editingPath.length}
                    >
                      <>
                        {/*    {validations.current && validations.current.length > 0 && (*/}
                        {/*      <section className="data-dictionary__validation-alert">*/}
                        {/*        <Alert*/}
                        {/*          variant="warning"*/}
                        {/*          isInline={true}*/}
                        {/*          title="Some items are invalid and need attention."*/}
                        {/*        />*/}
                        {/*      </section>*/}
                        {/*    )}*/}
                        <section className="data-dictionary__types-list-wrapper">
                          <section
                            className={`data-dictionary__types-list ${
                              editingPath.length > 0 || searchString.length > 0
                                ? "data-dictionary__types-list--with-breadcrumb"
                                : ""
                            }`}
                          >
                            {(editingPath.length > 0 || searchString.length > 0) && (
                              <DataDictionaryBreadcrumb
                                dataDictionary={dataTypes}
                                paths={editingPath}
                                onNavigate={(path) => {
                                  setSorting(false);
                                  setEditingIndex(undefined);
                                  setEditingDataType(undefined);
                                  setEditingPath(path);
                                }}
                                searchString={searchString}
                                searchBasePath={searchBasePath}
                              />
                            )}
                            {editingPath.length > 0 && (
                              <DataTypeItem
                                dataType={get(dataTypes, getParentPathString(combinedEditingPath))}
                                editingIndex={editingIndex}
                                index={-1}
                                key={-1}
                                onSave={handleSave}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                onConstraintsSave={handleConstraintsSave}
                                onValidate={dataTypeNameValidation}
                                onOutsideClick={handleOutsideClick}
                                getCustomTypeDefinition={getCustomTypeDefinition}
                                isReadonly={true}
                              />
                            )}
                            <section
                              className={`${editingPath.length > 0 ? "data-dictionary__types-list__children" : ""}`}
                            >
                              {sorting && <DataTypesSort dataTypes={dataTypesView} onReorder={handleReorder} />}
                              {!sorting && (
                                <>
                                  {searchString.length > 0 && editingPath.length === 0 && (
                                    <>
                                      {searchResults.map((item, index) => (
                                        <DataTypeItem
                                          dataType={item}
                                          editingIndex={editingIndex}
                                          index={index}
                                          key={index}
                                          onSave={handleSave}
                                          onEdit={handleEdit}
                                          onDelete={handleDelete}
                                          onConstraintsSave={handleConstraintsSave}
                                          onValidate={dataTypeNameValidation}
                                          onOutsideClick={handleOutsideClick}
                                          getCustomTypeDefinition={getCustomTypeDefinition}
                                          searchPath={item.searchPath}
                                          searchPathStrings={item.searchPathStrings}
                                          searchOriginalIndex={item.searchOriginalIndex}
                                        />
                                      ))}
                                    </>
                                  )}
                                  {!(searchString.length > 0 && editingPath.length === 0) &&
                                    dataTypesView.map((item, index) => (
                                      <DataTypeItem
                                        dataType={item}
                                        editingIndex={editingIndex}
                                        index={index}
                                        key={index}
                                        onSave={handleSave}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                        onConstraintsSave={handleConstraintsSave}
                                        onValidate={dataTypeNameValidation}
                                        onOutsideClick={handleOutsideClick}
                                        getCustomTypeDefinition={getCustomTypeDefinition}
                                      />
                                    ))}
                                </>
                              )}
                            </section>
                          </section>
                        </section>
                      </>
                    </CSSTransition>
                  </SwitchTransition>
                </DrawerContentBody>
              </DrawerContent>
            </Drawer>
          )}
        </section>
        {viewSection === "batch-add" && (
          <MultipleDataTypeAdd onAdd={addMultipleDataTypes} onCancel={() => setViewSection("main")} />
        )}
      </>
    </div>
  );
};

export default DataDictionaryContainer;

export interface DDDataField {
  name: string;
  type: "string" | "integer" | "float" | "double" | "boolean" | "structure" | "custom";
  customType?: string;
  optype: "categorical" | "ordinal" | "continuous";
  constraints?: Constraints;
  displayName?: string;
  isCyclic?: boolean;
  missingValue?: string;
  invalidValue?: string;
  children?: DDDataField[];
}

type dataDictionarySection = "main" | "batch-add" | "properties";

export type Constraints =
  | {
      type: ConstraintType.RANGE;
      value: RangeConstraint[];
    }
  | { type: ConstraintType.ENUMERATION; value: string[] };

export interface RangeConstraint {
  start: {
    value: string;
    included: boolean;
  };
  end: {
    value: string;
    included: boolean;
  };
}

export enum ConstraintType {
  RANGE = "Range",
  ENUMERATION = "Enumeration",
  NONE = "",
}

export interface DDDataFieldSearchResult extends DDDataField {
  searchPath: number[];
  searchPathStrings?: string[];
  searchOriginalIndex: number;
}
