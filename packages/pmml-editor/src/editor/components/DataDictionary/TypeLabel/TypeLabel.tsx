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
import { useRef } from "react";
import { DDDataField } from "../DataDictionaryContainer/DataDictionaryContainer";
import { Label } from "@patternfly/react-core/dist/js/components/Label";
import { OutlinedListAltIcon } from "@patternfly/react-icons";
import { Tooltip } from "@patternfly/react-core/dist/js/components/Tooltip";

interface TypeLabelProps {
  // the data type to display
  dataType: DDDataField;
  // if a label with a list of children types should be added
  showStructureDetail?: boolean;
  // if the dataType is of custom type, the referenced custom type
  customType?: DDDataField;
}

const TypeLabel = (props: TypeLabelProps) => {
  const { dataType, showStructureDetail = false, customType } = props;
  const color = dataType.type === "structure" || dataType.type === "custom" ? "purple" : "blue";
  const iconProp = dataType.type === "structure" ? { icon: <OutlinedListAltIcon /> } : {};
  const tooltipRef = useRef<HTMLSpanElement>(null);
  const typesListString = dataType.children?.map((child) => child.name).join(", ");
  const typesListTruncated =
    typesListString && typesListString.length > 30 ? typesListString.substring(0, 30) + "…" : typesListString;

  return (
    <>
      {dataType.type !== "custom" && (
        <>
          <Label color={color} {...iconProp} className="data-type-item__type-label" key="type">
            {dataType.type}
          </Label>
          {showStructureDetail && dataType.children && dataType.children.length >= 0 && (
            <>
              <span ref={tooltipRef} key="types list">
                <Label
                  color="purple"
                  className="data-type-item__type-label"
                  style={{ marginLeft: 3 }}
                  isTruncated={false}
                >
                  {typesListTruncated}
                </Label>
              </span>
              <Tooltip
                isContentLeftAligned={true}
                content={
                  <div>
                    <span>{dataType.name} Structure</span>
                    {getStructureContent(dataType)}
                  </div>
                }
                reference={tooltipRef}
              />
            </>
          )}
        </>
      )}

      {dataType.type === "custom" && customType && (
        <>
          <span ref={tooltipRef} key="types list">
            <Label color="purple" className="data-type-item__type-label">
              {customType.name}
            </Label>
          </span>
          <Tooltip
            isContentLeftAligned={true}
            content={
              <div>
                <span>{customType.name} Structure</span>
                {getStructureContent(customType)}
              </div>
            }
            reference={tooltipRef}
          />
        </>
      )}
    </>
  );
};

export default TypeLabel;

const getStructureContent = (dataType: DDDataField, parentIndex?: number) => {
  return (
    <ul key={parentIndex ? (parentIndex + 1) * 10 : "root"} style={{ margin: "5px 15px" }}>
      {dataType.children?.map((child, index) => (
        <li key={index} style={{ margin: "5px 0" }}>
          <span style={{ display: "block" }}>
            {child.name} - <em>{child.type === "custom" ? child.customType : child.type}</em>
          </span>
          {child.children && child.children.length > 0 && getStructureContent(child, index)}
        </li>
      ))}
    </ul>
  );
};
