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
import { PageSection, PageSectionVariants } from "@patternfly/react-core";
import { Header } from "../../Header/molecules";

interface EditorPageProps {
  path: string;
}

export const ScorecardEditorPage = (props: EditorPageProps) => {
  return (
    <>
      <div data-testid="editor-page">
        <PageSection variant={PageSectionVariants.light}>
          <Header title={props.path} />
        </PageSection>

        <PageSection isFilled={true}>
          <section>Hello</section>
        </PageSection>
      </div>
    </>
  );
};
