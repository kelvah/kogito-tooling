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
import { Breadcrumb, BreadcrumbItem } from "@patternfly/react-core";
import { Button } from "@patternfly/react-core/dist/js/components/Button";
import { DDDataField } from "../DataDictionaryContainer/DataDictionaryContainer";
import { getParentPathString } from "../dataDictionaryUtils";
import { get } from "lodash";

interface DataDictionaryBreadcrumbProps {
  dataDictionary: DDDataField[];
  paths: Array<number>;
  onNavigate: (path: Array<number>) => void;
}

const DataDictionaryBreadcrumb = (props: DataDictionaryBreadcrumbProps) => {
  const { paths, onNavigate, dataDictionary } = props;
  return (
    <Breadcrumb className="data-dictionary__types-list__breadcrumb">
      <BreadcrumbItem component={"span"} key="data-types-root">
        <Button
          variant="link"
          isInline={true}
          onClick={() => {
            onNavigate([]);
          }}
        >
          Data Types List
        </Button>
      </BreadcrumbItem>
      {paths.map((item, index) => {
        const currentPath = [...paths].splice(0, index + 1);
        const pathString = getParentPathString(currentPath);
        const dataType = get(dataDictionary, pathString);
        return (
          <BreadcrumbItem isActive={index === paths.length - 1} key={pathString}>
            {index !== paths.length - 1 ? (
              <Button
                variant="link"
                isInline={true}
                onClick={() => {
                  onNavigate(currentPath);
                }}
              >
                {dataType?.name}
              </Button>
            ) : (
              <strong>{dataType?.name}</strong>
            )}
          </BreadcrumbItem>
        );
      })}
    </Breadcrumb>
  );
};

export default DataDictionaryBreadcrumb;
