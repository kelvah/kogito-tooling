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
import { HeaderTitle } from "../../Header/atoms";
import * as React from "react";
import { Split, SplitItem } from "@patternfly/react-core";
import DataDictionaryHandler from "../../DataDictionary/DataDictionaryHandler/DataDictionaryHandler";
import { OutputsHandler } from "../organisms";
import { Operation } from "../../EditorScorecard";
import { Output } from "@kogito-tooling/pmml-editor-marshaller";

interface EditorHeaderProps {
  title: string;
  activeOperation: Operation;
  setActiveOperation: (operation: Operation) => void;
  modelIndex: number;
  output?: Output;
  validateOutputName: (index: number | undefined, name: string | undefined) => boolean;
}

export const EditorHeader = (props: EditorHeaderProps) => {
  const { activeOperation, setActiveOperation, modelIndex, output, validateOutputName } = props;

  return (
    <Split hasGutter={true}>
      <SplitItem isFilled={true}>
        <HeaderTitle title={props.title} />
      </SplitItem>
      <SplitItem>
        <DataDictionaryHandler activeOperation={activeOperation} />
      </SplitItem>
      <SplitItem>
        <OutputsHandler
          activeOperation={activeOperation}
          setActiveOperation={setActiveOperation}
          modelIndex={modelIndex}
          output={output}
          validateOutputName={validateOutputName}
        />
      </SplitItem>
    </Split>
  );
};