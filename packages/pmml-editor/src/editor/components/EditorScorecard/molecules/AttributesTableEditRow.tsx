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
import { useEffect, useRef, useState } from "react";
import {
  DataListAction,
  DataListCell,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
  FormGroup,
  TextInput
} from "@patternfly/react-core";
import "../organisms/CharacteristicsTable.scss";
import { Attribute } from "@kogito-tooling/pmml-editor-marshaller";
import { AttributesTableEditModeAction } from "../atoms";
import { ValidatedType } from "../../../types";
import { ExclamationCircleIcon } from "@patternfly/react-icons";
import { toText } from "../../../reducers";
import MonacoEditor, { EditorWillMount } from "react-monaco-editor";
import { CancellationToken, editor, languages, Position } from "monaco-editor/esm/vs/editor/editor.api";
import CompletionItemKind = languages.CompletionItemKind;
import CompletionItemInsertTextRule = languages.CompletionItemInsertTextRule;

interface AttributesTableEditRowProps {
  index: number | undefined;
  attribute: Attribute;
  validateText: (text: string | undefined) => boolean;
  onCommit: (text: string | undefined, partialScore: number | undefined, reasonCode: string | undefined) => void;
  onCancel: () => void;
}

export const AttributesTableEditRow = (props: AttributesTableEditRowProps) => {
  const { index, attribute, validateText, onCommit, onCancel } = props;

  const [text, setText] = useState<ValidatedType<string | undefined>>({
    value: undefined,
    valid: true
  });
  const [partialScore, setPartialScore] = useState<number | undefined>();
  const [reasonCode, setReasonCode] = useState<string | undefined>();

  const monaco = useRef<MonacoEditor>(null);

  useEffect(() => {
    const _text = toText(attribute.predicate);
    setText({
      value: _text,
      valid: true
    });
    setPartialScore(attribute.partialScore);
    setReasonCode(attribute.reasonCode);

    monaco.current?.editor?.focus();
  }, [props]);

  const toNumber = (value: string): number | undefined => {
    if (value === "") {
      return undefined;
    }
    const n = Number(value);
    if (isNaN(n)) {
      return undefined;
    }
    return n;
  };

  const editorWillMount: EditorWillMount = monaco => {
    const theme: editor.IStandaloneThemeData = {
      base: "vs",
      inherit: false,
      rules: [
        { token: "sc-numeric", foreground: "3232E7" },
        {
          token: "sc-boolean",
          foreground: "26268D",
          fontStyle: "bold"
        },
        {
          token: "sc-string",
          foreground: "2A9343",
          fontStyle: "bold"
        },
        {
          token: "sc-operator",
          foreground: "3232E8"
        },
        {
          token: "sc-keyword",
          foreground: "0000ff",
          fontStyle: "bold"
        }
      ],
      colors: { "editorLineNumber.foreground": "00ff00" }
    };
    const tokens: languages.IMonarchLanguage = {
      tokenizer: {
        root: [
          {
            regex: "[0-9]+",
            action: "sc-numeric"
          },
          {
            regex: "(?:(\\btrue\\b)|(\\bfalse\\b))",
            action: "sc-boolean"
          },
          {
            regex: "True|False",
            action: "sc-keyword"
          },
          {
            regex: '(?:\\"(?:.*?)\\")',
            action: "sc-string"
          },
          {
            regex: "==|!=|<|<=|>|>=|isMissing|isNotMissing",
            action: "sc-operator"
          }
        ]
      }
    };
    const provider: languages.CompletionItemProvider = {
      provideCompletionItems(
        model: editor.ITextModel,
        position: Position,
        context: languages.CompletionContext,
        token: CancellationToken
      ): languages.ProviderResult<languages.CompletionList> {
        return {
          suggestions: [
            {
              label: "True",
              insertText: "True",
              kind: CompletionItemKind.Keyword,
              insertTextRules: CompletionItemInsertTextRule.InsertAsSnippet,
              range: { startLineNumber: 1, endLineNumber: 1, startColumn: 1, endColumn: 1 }
            },
            {
              label: "False",
              insertText: "False",
              kind: CompletionItemKind.Keyword,
              insertTextRules: CompletionItemInsertTextRule.InsertAsSnippet,
              range: { startLineNumber: 1, endLineNumber: 1, startColumn: 1, endColumn: 1 }
            }
          ]
        };
      }
    };
    monaco.editor.defineTheme("scorecards", theme);
    monaco.languages.register({ id: "scorecards" });
    monaco.languages.setMonarchTokensProvider("scorecards", tokens);
    monaco.languages.registerCompletionItemProvider("scorecards", provider);
  };

  return (
    <DataListItem id={index?.toString()} className="attributes__list-item" aria-labelledby={"attribute-" + index}>
      <DataListItemRow>
        <DataListItemCells
          dataListCells={[
            <DataListCell key="0" width={5}>
              <FormGroup
                fieldId="attribute-text-helper"
                helperTextInvalid="Text must be present"
                helperTextInvalidIcon={<ExclamationCircleIcon />}
                validated={text.valid ? "default" : "error"}
              >
                <MonacoEditor
                  ref={monaco}
                  height="150px"
                  language="scorecards"
                  theme="scorecards"
                  options={{
                    glyphMargin: false,
                    scrollBeyondLastLine: false
                  }}
                  value={text.value ?? ""}
                  onChange={e =>
                    setText({
                      value: e,
                      valid: validateText(e)
                    })
                  }
                  editorWillMount={editorWillMount}
                />
              </FormGroup>
            </DataListCell>,
            <DataListCell key="1" width={2}>
              <FormGroup
                fieldId="attribute-partial-score-helper"
                helperText="Defines the score points awarded to the Attribute."
              >
                <TextInput
                  type="number"
                  id="attribute-partial-score"
                  name="attribute-partial-score"
                  aria-describedby="attribute-partial-score-helper"
                  value={partialScore ?? ""}
                  onChange={e => setPartialScore(toNumber(e))}
                />
              </FormGroup>
            </DataListCell>,
            <DataListCell key="2" width={2}>
              <FormGroup
                fieldId="attribute-reason-code-helper"
                helperText="A Reason Code is mapped to a Business reason."
              >
                <TextInput
                  type="text"
                  id="attribute-reason-code"
                  name="attribute-reason-code"
                  aria-describedby="attribute-reason-code-helper"
                  value={reasonCode ?? ""}
                  onChange={e => setReasonCode(e)}
                />
              </FormGroup>
            </DataListCell>,
            <DataListAction
              id="delete-attribute"
              aria-label="delete"
              aria-labelledby="delete-attribute"
              key="4"
              width={1}
            >
              <AttributesTableEditModeAction
                onCommit={() => onCommit(text.value, partialScore, reasonCode)}
                onCancel={() => onCancel()}
                disableCommit={!validateText(text.value)}
              />
            </DataListAction>
          ]}
        />
      </DataListItemRow>
    </DataListItem>
  );
};
