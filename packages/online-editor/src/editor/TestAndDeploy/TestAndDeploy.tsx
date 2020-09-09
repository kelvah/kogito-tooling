import * as React from "react";
// @ts-ignore
import SwaggerClient from "swagger-client";
import { useEffect, useState } from "react";
import {
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
  Tab,
  Tabs,
  TabTitleText
} from "@patternfly/react-core";
import { ProjectDiagramIcon, ServerIcon, SyncIcon } from "@patternfly/react-icons";
import "bootstrap/dist/css/bootstrap.css";
import "./TestAndDeploy.scss";
import ModelTester from "../ModelTester/ModelTester";
import { config } from "../../config";

interface TestAndDeployProps {
  showPanel: boolean;
  lastSave: Date | null;
}

const TestAndDeploy = (props: TestAndDeployProps) => {
  const { showPanel, lastSave } = props;
  const [activeTab, setActiveTab] = useState<React.ReactText>(0);
  const [schemas, setSchemas] = useState<Schema[]>();
  const [modelDeploy, setModelDeploy] = useState<ModelDeploy>({ deployed: false, waiting: false });
  const [refreshCssClass, setRefreshCssClass] = useState("");

  useEffect(() => {
    getOpenApiSpec();
  }, []);

  const getOpenApiSpec = () => {
    new SwaggerClient(config.development.openApi.url + config.development.openApi.specPath).then(
      (client: { spec: { paths: any } }) => {
        const endpoints = [];
        const paths = client.spec.paths;
        console.log(paths);
        for (const url in paths) {
          if (paths.hasOwnProperty(url)) {
            const schema = paths[url].post?.requestBody?.content["application/json"]?.schema;
            if (schema) {
              endpoints.push({ url: url, schema: schema });
            }
          }
        }
        setSchemas(endpoints);
      }
    );
  };

  useEffect(() => {
    if (lastSave) {
      getOpenApiSpec();
    }
  }, [lastSave]);

  const handleDeploy = () => {
    setModelDeploy({ deployed: false, waiting: true });
    // setTimeout(() => {
    //   const now = new Date().toLocaleTimeString();
    //   setModelDeploy({ deployed: true, waiting: false, time: now });
    // }, 2500);
    fetch(config.development.publish.url, {
      headers: {
        Accept: "application/json, text/plain",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        appname: config.development.publish.appName,
        envname: config.development.publish.envName
      }),
      method: "POST",
      mode: "cors"
    }).then(() => {
      setModelDeploy({ deployed: false, waiting: true });
    });
  };

  const refreshDeployStatus = () => {
    setRefreshCssClass("rotating");
    setTimeout(() => {
      setRefreshCssClass("");
    }, 1500);
  };

  const handleTabClick = (event: React.MouseEvent<HTMLElement, MouseEvent>, tabIndex: React.ReactText) => {
    setActiveTab(tabIndex);
  };
  return (
    <div className={`cd-panel cd-panel--from-right js-cd-panel-main ${showPanel ? "cd-panel--is-visible" : ""}`}>
      <div className="cd-panel__container">
        <div className="cd-panel__content test-and-deploy">
          <Page>
            <PageSection>
              <Tabs isFilled={true} activeKey={activeTab} onSelect={handleTabClick} isBox={true}>
                <Tab eventKey={0} title={<TabTitleText>Test Development Environment</TabTitleText>}>
                  <PageSection variant={"light"}>
                    {schemas && schemas.length > 0 && <ModelTester schemas={schemas} environment={"DEV"} />}
                    {schemas && schemas.length === 0 && (
                      <EmptyState variant={"small"} style={{ minHeight: "380px" }}>
                        <EmptyStateIcon icon={ProjectDiagramIcon} />
                        <Title headingLevel="h3" size="lg">
                          Empty Model
                        </Title>
                        <EmptyStateBody>
                          It seems there are no endpoints to test right now.
                          <br />
                          Go back editing the model.
                        </EmptyStateBody>
                      </EmptyState>
                    )}
                  </PageSection>
                </Tab>
                <Tab eventKey={1} title={<TabTitleText>Deploy to Production</TabTitleText>}>
                  <PageSection variant={"light"}>
                    <div className="test-and-deploy__deploy">
                      <Title headingLevel="h3" size="lg" className="test-and-deploy__title">
                        Deployment
                      </Title>
                      <Flex>
                        <FlexItem>
                          <span style={{ fontWeight: 700 }}>Status</span>
                        </FlexItem>
                        <FlexItem>
                          {!modelDeploy.deployed && !modelDeploy.waiting && <Label>Not deployed</Label>}
                          {modelDeploy.waiting && (
                            <span>
                              <Label color="blue">Deployment in progress</Label>
                              <Button
                                className="test-and-deploy__update-deploy-status"
                                variant="plain"
                                title="Refresh status"
                                aria-label="Refresh"
                                onClick={refreshDeployStatus}
                              >
                                <SyncIcon className={refreshCssClass} />
                              </Button>
                            </span>
                          )}
                          {modelDeploy.deployed && <em>Last published today at {modelDeploy.time}</em>}
                        </FlexItem>
                        <FlexItem align={{ default: "alignRight" }}>
                          <Button
                            type="button"
                            variant="primary"
                            onClick={handleDeploy}
                            isDisabled={modelDeploy.waiting}
                          >
                            Publish Model
                          </Button>
                        </FlexItem>
                      </Flex>
                    </div>
                    <Divider />
                    {schemas && modelDeploy.deployed && <ModelTester schemas={schemas} environment={"PROD"} />}
                    {!modelDeploy.deployed && (
                      <EmptyState variant={"small"}>
                        <EmptyStateIcon icon={ServerIcon} />
                        <Title headingLevel="h3" size="lg">
                          Model not deployed
                        </Title>
                        <EmptyStateBody>
                          You need to deploy the model to production to be able to execute it
                        </EmptyStateBody>
                      </EmptyState>
                    )}
                  </PageSection>
                </Tab>
              </Tabs>
            </PageSection>
          </Page>
        </div>
      </div>
    </div>
  );
};

export default TestAndDeploy;

export interface Schema {
  url: string;
  schema: any;
}

export interface ModelDeploy {
  deployed: boolean;
  waiting: boolean;
  time?: string;
}
