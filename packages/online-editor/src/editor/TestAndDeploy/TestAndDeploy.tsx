import * as React from "react";
// @ts-ignore
import SwaggerClient from "swagger-client";
import { useEffect, useState, useRef, useCallback } from "react";
import {
  Alert,
  Button,
  Divider,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  Flex,
  FlexItem,
  Label,
  Page,
  PageSection,
  Title,
  Tooltip,
  Tab,
  TabContent,
  Tabs,
  TabTitleText
} from "@patternfly/react-core";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  HourglassHalfIcon,
  ServerIcon,
  SyncIcon
} from "@patternfly/react-icons";
import "bootstrap/dist/css/bootstrap.css";
import { config } from "../../config";
import ModelTester from "../ModelTester/ModelTester";
import EmptyModelMessage from "../EmptyModelMessage/EmptyModelMessage";
import "./TestAndDeploy.scss";
import { filterEndpoints } from "./filterEndpoints";
import { EmbeddedEditorRef } from "@kogito-tooling/editor/dist/embedded";
import DeploymentConsole from "../DeploymentConsole/DeploymentConsole";

interface TestAndDeployProps {
  editor?: EmbeddedEditorRef;
  isEditorReady: boolean;
  showPanel: boolean;
  lastSave: Date | null;
  isModelDirty: boolean;
}

const TestAndDeploy = (props: TestAndDeployProps) => {
  const { editor, isEditorReady, showPanel, lastSave, isModelDirty } = props;
  const [activeTab, setActiveTab] = useState<React.ReactText>(0);
  const [devSchemas, setDevSchemas] = useState<Schema[] | null>(null);
  const [prodSchemas, setProdSchemas] = useState<Schema[] | null>(null);
  const [schema, setSchema] = useState<{}>();
  const [modelDeploy, setModelDeploy] = useState<ModelDeploy>({ deployed: false, waiting: false });
  const [refreshCssClass, setRefreshCssClass] = useState("");

  const openApiDevUrl = config.openApi.url + config.openApi.specPath;
  const prodUrl = config.openApi.url.replace("daas-executor", "daas-executor-native");
  const openApiProdUrl = prodUrl + "/openapi";

  useEffect(() => {
    if (isEditorReady) {
      getSchema("DEV");
      // getSchema("PROD");
    }
  }, [isEditorReady]);

  const getModel = useCallback(async () => {
    return editor?.getContent();
  }, [editor]);

  const getSchema = useCallback(
    async (environment: Environment) => {
      const modelContent = await getModel();
      // console.log("model content");
      // console.log(modelContent);
      const endpoint = environment === "DEV" ? openApiDevUrl : openApiProdUrl;
      const requestParams = {
        headers: {
          "Content-Type": "application/xml",
          Accept: "application/json"
        },
        body: modelContent,
        method: "POST",
        mode: "cors" as RequestMode
      };
      try {
        const modelSchema = await fetch(endpoint, requestParams).then(response => {
          return response.json();
        });
        // console.log("model schema");
        // console.log(modelSchema);
        setSchema(modelSchema);
      } catch (err) {
        console.error(err);
        return;
      }
      // SwaggerClient(endpoint).then((client: { spec: { paths: any } }) => {
      //   const paths = client.spec.paths;
      //   const endpoints = filterEndpoints(paths);
      //   switch (environment) {
      //     case "DEV":
      //       setDevSchemas(endpoints);
      //       break;
      //     case "PROD":
      //       setProdSchemas(endpoints);
      //       setModelDeploy({ deployed: true, waiting: false });
      //   }
      // });
    },
    [editor]
  );

  useEffect(() => {
    if (lastSave) {
      getSchema("DEV");
    }
  }, [lastSave]);

  const handleDeploy = () => {
    fetch(config.publish.url, {
      headers: {
        Accept: "application/json, text/plain",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        appname: config.publish.appName,
        envname: config.publish.envName
      }),
      method: "POST",
      mode: "cors"
    }).then(response => {
      if (response.ok) {
        setProdSchemas(null);
        setModelDeploy({ deployed: false, waiting: true });
      }
    });
  };

  const refreshDeployStatus = () => {
    setRefreshCssClass("rotating");
    fetch(openApiProdUrl, {
      headers: {
        Accept: "application/json, text/plain",
        "Content-Type": "application/json"
      },
      method: "GET",
      mode: "cors"
    })
      .then(response => {
        if (response.ok) {
          getSchema("PROD");
        }
      })
      .finally(() => {
        setRefreshCssClass("");
      });
  };

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
          <Page>
            <PageSection>
              <Tabs isFilled={true} activeKey={activeTab} onSelect={handleTabClick} isBox={true}>
                <Tab
                  eventKey={0}
                  id="test-tab"
                  title={
                    <TabTitleText>
                      {isModelDirty && (
                        <Tooltip
                          position="bottom"
                          content={
                            <div>
                              The model has unsaved changes.
                              <br />
                              Save it to test the latest version.
                            </div>
                          }
                        >
                          <>
                            <ExclamationTriangleIcon className="test-and-deploy__warn-icon" />
                            &nbsp;
                            <span>Test Development Environment</span>
                          </>
                        </Tooltip>
                      )}
                      {!isModelDirty && <span>Test Development Environment</span>}
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
                      {isModelDirty && (
                        <Alert variant="warning" title="The model has unsaved changes" isInline={true}>
                          <span>Save the model to test the latest version.</span>
                        </Alert>
                      )}
                      {schema && (
                        <ModelTester
                          schema={schema}
                          getModel={getModel}
                          baseUrl={config.openApi.url}
                          environment="DEV"
                        />
                      )}
                      {devSchemas !== null && devSchemas.length === 0 && <EmptyModelMessage />}
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
                      {/*<Flex>*/}
                      {/*  <FlexItem>*/}
                      {/*    <span style={{ fontWeight: 700 }}>Status</span>*/}
                      {/*  </FlexItem>*/}
                      {/*  <FlexItem>*/}
                      {/*    {!modelDeploy.deployed && !modelDeploy.waiting && <Label>Not deployed</Label>}*/}
                      {/*    {modelDeploy.waiting && (*/}
                      {/*      <span>*/}
                      {/*        <Label color="blue" icon={<HourglassHalfIcon />}>*/}
                      {/*          Deployment in progress*/}
                      {/*        </Label>*/}
                      {/*        <Button*/}
                      {/*          className="test-and-deploy__update-deploy-status"*/}
                      {/*          variant="plain"*/}
                      {/*          title="Refresh status"*/}
                      {/*          aria-label="Refresh"*/}
                      {/*          onClick={refreshDeployStatus}*/}
                      {/*        >*/}
                      {/*          <SyncIcon className={refreshCssClass} />*/}
                      {/*        </Button>*/}
                      {/*      </span>*/}
                      {/*    )}*/}
                      {/*    {modelDeploy.deployed && (*/}
                      {/*      <Label color={"green"} icon={<CheckCircleIcon />}>*/}
                      {/*        Deployed Successfully*/}
                      {/*      </Label>*/}
                      {/*    )}*/}
                      {/*  </FlexItem>*/}
                      {/*  <FlexItem align={{ default: "alignRight" }}>*/}
                      {/*    <Button*/}
                      {/*      type="button"*/}
                      {/*      variant="primary"*/}
                      {/*      onClick={handleDeploy}*/}
                      {/*      isDisabled={modelDeploy.waiting}*/}
                      {/*    >*/}
                      {/*      Deploy*/}
                      {/*    </Button>*/}
                      {/*  </FlexItem>*/}
                      {/*</Flex>*/}
                      {prodSchemas !== null && prodSchemas.length === 0 && modelDeploy.deployed && (
                        <EmptyModelMessage />
                      )}
                    </PageSection>
                  </TabContent>
                </div>
              </div>
            </PageSection>
          </Page>
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

export type Environment = "PROD" | "DEV";
