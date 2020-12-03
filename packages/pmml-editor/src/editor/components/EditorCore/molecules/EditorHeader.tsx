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
import { ModelTitle } from "../atoms";
import * as React from "react";
import { Split, SplitItem } from "@patternfly/react-core";
import DataDictionaryHandler from "../../DataDictionary/DataDictionaryHandler/DataDictionaryHandler";
import { OutputsHandler } from "../../Outputs/organisms";
import { Operation } from "../../EditorScorecard";
import { MiningSchema, Output, OutputField } from "@kogito-tooling/pmml-editor-marshaller";
import MiningSchemaHandler from "../../MiningSchema/MiningSchemaHandler/MiningSchemaHandler";

interface EditorHeaderProps {
  modelName: string;
  activeOperation: Operation;
  setActiveOperation: (operation: Operation) => void;
  modelIndex: number;
  output?: Output;
  miningSchema?: MiningSchema;
  validateOutputFieldName: (index: number | undefined, name: string | undefined) => boolean;
  deleteOutputField: (index: number) => void;
  commitOutputField: (index: number | undefined, outputField: OutputField) => void;
  commitModelName: (modelName: string) => void;
}

export const EditorHeader = (props: EditorHeaderProps) => {
  const {
    modelName,
    activeOperation,
    setActiveOperation,
    miningSchema,
    modelIndex,
    output,
    validateOutputFieldName,
    deleteOutputField,
    commitOutputField,
    commitModelName
  } = props;

  return (
    <Split hasGutter={true}>
      <SplitItem>
        <ModelTitle
          modelName={modelName}
          activeOperation={activeOperation}
          setActiveOperation={setActiveOperation}
          commitModelName={commitModelName}
        />
      </SplitItem>
      <SplitItem isFilled={true}>
        <div>&nbsp;</div>
      </SplitItem>
      <SplitItem>
        <DataDictionaryHandler activeOperation={activeOperation} />
      </SplitItem>
      <SplitItem>
        <MiningSchemaHandler activeOperation={activeOperation} miningSchema={miningSchema} modelIndex={modelIndex} />
      </SplitItem>
      <SplitItem>
        <OutputsHandler
          activeOperation={activeOperation}
          setActiveOperation={setActiveOperation}
          modelIndex={modelIndex}
          output={output}
          validateOutputFieldName={validateOutputFieldName}
          deleteOutputField={deleteOutputField}
          commitOutputField={commitOutputField}
        />
      </SplitItem>
    </Split>
  );
};
