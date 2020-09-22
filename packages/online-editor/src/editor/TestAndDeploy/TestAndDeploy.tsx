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
import { ServerIcon, SyncIcon, CheckCircleIcon, HourglassHalfIcon } from "@patternfly/react-icons";
import "bootstrap/dist/css/bootstrap.css";
import { config } from "../../config";
import ModelTester from "../ModelTester/ModelTester";
import EmptyModelMessage from "../EmptyModelMessage/EmptyModelMessage";
import "./TestAndDeploy.scss";
import { filterEndpoints } from "./filterEndpoints";

interface TestAndDeployProps {
  showPanel: boolean;
  lastSave: Date | null;
}

const TestAndDeploy = (props: TestAndDeployProps) => {
  const { showPanel, lastSave } = props;
  const [activeTab, setActiveTab] = useState<React.ReactText>(0);
  const [devSchemas, setDevSchemas] = useState<Schema[]>();
  const [prodSchemas, setProdSchemas] = useState<Schema[]>();
  const [modelDeploy, setModelDeploy] = useState<ModelDeploy>({ deployed: false, waiting: false });
  const [refreshCssClass, setRefreshCssClass] = useState("");

  const openApiDevUrl = config.development.openApi.url + config.development.openApi.specPath;
  const prodUrl = config.development.openApi.url.replace("daas-executor", "daas-executor-native");
  const openApiProdUrl = prodUrl + "/openapi";

  useEffect(() => {
    getOpenApiSpec("DEV");
  }, []);

  const getOpenApiSpec = (environment: Environment) => {
    const endpoint = environment === "DEV" ? openApiDevUrl : openApiProdUrl;
    new SwaggerClient(endpoint).then((client: { spec: { paths: any } }) => {
      const paths = client.spec.paths;
      const endpoints = filterEndpoints(paths);
      console.log(paths);
      switch (environment) {
        case "DEV":
          setDevSchemas(endpoints);
          break;
        case "PROD":
          setProdSchemas(endpoints);
      }
    });
  };

  useEffect(() => {
    if (lastSave) {
      getOpenApiSpec("DEV");
    }
  }, [lastSave]);

  const handleDeploy = () => {
    setModelDeploy({ deployed: false, waiting: true });
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
    fetch(openApiProdUrl, {
      headers: {
        Accept: "application/json, text/plain",
        "Content-Type": "application/json"
      },
      method: "GET",
      mode: "cors"
    })
      .then(() => {
        getOpenApiSpec("PROD");
        setModelDeploy({ deployed: true, waiting: false });
      })
      .finally(() => {
        setRefreshCssClass("");
      });
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
                <Tab eventKey={0} id="test-tab" title={<TabTitleText>Test Development Environment</TabTitleText>}>
                  <PageSection variant={"light"}>
                    {devSchemas && devSchemas.length > 0 && (
                      <ModelTester schemas={devSchemas} baseUrl={config.development.openApi.url} environment="DEV" />
                    )}
                    {devSchemas && devSchemas.length === 0 && <EmptyModelMessage />}
                  </PageSection>
                </Tab>
                <Tab eventKey={1} id="deploy-tab" title={<TabTitleText>Deploy to Production</TabTitleText>}>
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
                              <Label color="blue" icon={<HourglassHalfIcon />}>
                                Deployment in progress
                              </Label>
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
                          {modelDeploy.deployed && (
                            <Label color={"green"} icon={<CheckCircleIcon />}>
                              Deployed Successfully
                            </Label>
                          )}
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
                    {prodSchemas && prodSchemas.length > 0 && modelDeploy.deployed && (
                      <ModelTester schemas={prodSchemas} baseUrl={prodUrl} environment="PROD" />
                    )}
                    {prodSchemas && prodSchemas.length === 0 && modelDeploy.deployed && <EmptyModelMessage />}
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
