import * as React from "react";
import { useEffect, useState, useRef, useCallback } from "react";
import { Page, PageSection, Tab, TabContent, Tabs, TabTitleText } from "@patternfly/react-core";
import "bootstrap/dist/css/bootstrap.css";
import { AxiosRequestConfig } from "axios";
import { EmbeddedEditorRef } from "@kogito-tooling/editor/dist/embedded";
import ModelTester from "../ModelTester/ModelTester";
import DeploymentConsole from "../DeploymentConsole/DeploymentConsole";
import { axiosClient } from "../../common/axiosClient";
import "./TestAndDeploy.scss";
import { config } from "../../config";

interface TestAndDeployProps {
  editor?: EmbeddedEditorRef;
  isEditorReady: boolean;
  showPanel: boolean;
}

const TestAndDeploy = (props: TestAndDeployProps) => {
  const { editor, isEditorReady, showPanel } = props;
  const [activeTab, setActiveTab] = useState<React.ReactText>(0);
  const [schema, setSchema] = useState<{}>();
  const [jitdmnPath, setJitdmnPath] = useState();

  useEffect(() => {
    if (config.testFeatureOnly) {
      setJitdmnPath(config.jitDmnUrl);
    } else {
      const requestConfig: AxiosRequestConfig = {
        url: "/decisions/jit",
        method: "get"
      };
      axiosClient(requestConfig)
        .then(response => {
          if ((response.data as DecisionJitResponse).kind === "DMNJITList") {
            const dmnjit = response.data.items.find((item: DmnJitItem) => item.kind === "DMNJIT");
            if (dmnjit) {
              setJitdmnPath(dmnjit.url);
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  }, []);

  useEffect(() => {
    if (isEditorReady && jitdmnPath) {
      getSchema();
    }
  }, [isEditorReady, jitdmnPath]);

  const getModel = useCallback(async () => {
    return editor?.getContent();
  }, [editor]);

  const getSchema = useCallback(async () => {
    try {
      const modelContent = await getModel();
      const requestConfig: AxiosRequestConfig = {
        baseURL: jitdmnPath,
        url: "/schema/form",
        method: "post",
        headers: { "Content-Type": "application/xml" },
        responseType: "json",
        data: modelContent
      };
      axiosClient(requestConfig)
        .then(response => {
          const versionedSchema = {
            $schema: "http://json-schema.org/draft-04/schema#",
            type: "object"
          };
          setSchema({ ...response.data, ...versionedSchema });
        })
        .catch(error => {
          console.log(error);
        });
    } catch (err) {
      console.error(err);
      return;
    }
  }, [editor, jitdmnPath]);

  useEffect(() => {
    if (showPanel) {
      getSchema();
    }
  }, [showPanel]);

  const handleTabClick = (event: React.MouseEvent<HTMLElement, MouseEvent>, tabIndex: React.ReactText) => {
    setActiveTab(tabIndex);
  };

  const testTab = useRef(null);
  const deployTab = useRef(null);

  return (
    <div
      className={`side-panel side-panel--from-right js-side-panel-main ${showPanel ? "side-panel--is-visible" : ""}`}
    >
      <div className="side-panel__container">
        <div className="side-panel__content test-and-deploy">
          {!config.testFeatureOnly && (
            <Page>
              <PageSection>
                <Tabs isFilled={true} activeKey={activeTab} onSelect={handleTabClick} isBox={true}>
                  <Tab
                    eventKey={0}
                    id="test-tab"
                    title={
                      <TabTitleText>
                        <span>Test Development Environment</span>
                      </TabTitleText>
                    }
                    tabContentRef={testTab}
                    tabContentId="test-tab-content"
                  />
                  <Tab
                    eventKey={1}
                    id="deploy-tab"
                    title={<TabTitleText>Deployment Console</TabTitleText>}
                    tabContentRef={deployTab}
                    tabContentId="deploy-tab-content"
                  />
                </Tabs>
                <div className="test-and-deploy__tabs-content">
                  <div className="test-and-deploy__tabs-scroll">
                    <TabContent eventKey={0} id="test-tab-content" ref={testTab} aria-label="Test Tab Content">
                      <PageSection variant={"light"} isFilled={true}>
                        {schema && jitdmnPath && (
                          <ModelTester schema={schema} getModel={getModel} baseUrl={jitdmnPath} />
                        )}
                      </PageSection>
                    </TabContent>
                    <TabContent
                      eventKey={1}
                      id="deploy-tab-content"
                      ref={deployTab}
                      aria-label="Deploy Tab Content"
                      hidden={true}
                    >
                      <PageSection variant={"light"} isFilled={true}>
                        <DeploymentConsole editor={editor} />
                      </PageSection>
                    </TabContent>
                  </div>
                </div>
              </PageSection>
            </Page>
          )}
          {config.testFeatureOnly && (
            <PageSection variant={"light"} isFilled={true}>
              {schema && jitdmnPath && <ModelTester schema={schema} getModel={getModel} baseUrl={jitdmnPath} />}
            </PageSection>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestAndDeploy;

export interface Schema {
  label: string;
  url: string;
  schema: any;
}

export interface ModelDeploy {
  deployed: boolean;
  waiting: boolean;
  time?: string;
}
interface DecisionJitResponse {
  kind: string;
  items: DmnJitItem[];
}

interface DmnJitItem {
  kind: string;
  url: string;
}
