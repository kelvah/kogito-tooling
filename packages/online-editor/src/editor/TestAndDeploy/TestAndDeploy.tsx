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
  Page,
  PageSection,
  Title,
  Spinner,
  Tab,
  Tabs,
  TabTitleText
} from "@patternfly/react-core";
import { ServerIcon } from "@patternfly/react-icons";
import "bootstrap/dist/css/bootstrap.css";
import "./TestAndDeploy.scss";
import ModelTester from "../ModelTester/ModelTester";
import { config } from "../../config";

interface TestAndDeployProps {
  showPanel: boolean;
}

const TestAndDeploy = (props: TestAndDeployProps) => {
  const { showPanel } = props;
  // const context = useContext(GlobalContext);
  const [activeTab, setActiveTab] = useState<React.ReactText>(0);
  const [schemas, setSchemas] = useState<Schema[]>();
  const [modelDeploy, setModelDeploy] = useState<ModelDeploy>({ deployed: false, waiting: false });

  useEffect(() => {
    new SwaggerClient(config.development.openApiUrl + "/openapi").then((client: { spec: { paths: any } }) => {
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
    });
  }, []);

  const handleDeploy = () => {
    setModelDeploy({ deployed: false, waiting: true });
    setTimeout(() => {
      const now = new Date().toLocaleTimeString();
      setModelDeploy({ deployed: true, waiting: false, time: now });
    }, 2500);
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
                    {schemas && <ModelTester schemas={schemas} environment={"DEV"} />}
                  </PageSection>
                </Tab>
                <Tab eventKey={1} title={<TabTitleText>Deploy to Production</TabTitleText>}>
                  <PageSection variant={"light"}>
                    <div className="test-and-deploy__deploy">
                      <Title headingLevel="h3" className="test-and-deploy__title">
                        Deployment
                      </Title>
                      <Flex>
                        <FlexItem>
                          <Button
                            type="button"
                            variant="primary"
                            onClick={handleDeploy}
                            isDisabled={modelDeploy.waiting}
                          >
                            Publish Model
                          </Button>
                        </FlexItem>
                        <FlexItem>
                          {modelDeploy.waiting && (
                            <span>
                              <Spinner size="md" style={{ marginRight: ".5em" }} /> <em>Deploying</em>
                            </span>
                          )}
                          {modelDeploy.deployed && <em>Last published today at {modelDeploy.time}</em>}
                        </FlexItem>
                      </Flex>
                    </div>
                    <Divider />
                    {schemas && modelDeploy.deployed && <ModelTester schemas={schemas} environment={"PROD"} />}
                    {!modelDeploy.deployed && (
                      <EmptyState variant={"small"}>
                        <EmptyStateIcon icon={ServerIcon} />
                        <Title headingLevel="h3" size="md">
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
