import * as React from "react";
// @ts-ignore
import SwaggerClient from "swagger-client";
import { useEffect, useState } from "react";
import {
  Button,
  Flex,
  FlexItem,
  Grid,
  GridItem,
  Page,
  PageSection,
  Title,
  TitleSizes,
  Select,
  SelectOption,
  SelectVariant,
  SelectDirection,
  Spinner
} from "@patternfly/react-core";
import ReactJson from "react-json-view";
import Form from "@rjsf/bootstrap-4";
import "bootstrap/dist/css/bootstrap.css";

import "./TestAndDeploy.css";

interface TestAndDeployProps {
  showPanel: boolean;
}
interface ModelDeploy {
  deployed: boolean;
  waiting: boolean;
  time?: string;
}

const TestAndDeploy = (props: TestAndDeployProps) => {
  const { showPanel } = props;
  // const context = useContext(GlobalContext);
  const [schemas, setSchemas] = useState<Schema[]>();
  const [isEndpointSelectOpen, setIsEndpointSelectOpen] = useState(false);
  const [selectedEndpoint, setSelectedEndpoint] = useState<Schema>();
  const [requestPayload, setRequestPayload] = useState();
  const [responsePayload, setResponsePayload] = useState<{}>();
  const [testEnvironment, setTestEnvironment] = useState(1);
  const [modelDeploy, setModelDeploy] = useState<ModelDeploy>({ deployed: false, waiting: false });

  useEffect(() => {
    new SwaggerClient("http://localhost:8080/openapi").then((client: { spec: { paths: any } }) => {
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
      setSelectedEndpoint(endpoints[0]);
    });
  }, []);

  const handleDeploy = () => {
    setTestEnvironment(1);
    setModelDeploy({ deployed: false, waiting: true });
    setTimeout(() => {
      const now = new Date().toLocaleTimeString();
      setModelDeploy({ deployed: true, waiting: false, time: now });
    }, 2500);
  };

  const onEndpointSelectToggle = (openStatus: boolean) => {
    setIsEndpointSelectOpen(openStatus);
  };
  const onEndpointSelect = (event: React.MouseEvent | React.ChangeEvent, selection: Schema) => {
    setSelectedEndpoint(selection);
    setIsEndpointSelectOpen(false);
  };
  const handleForm = (form: { formData: any }) => {
    const formData = form.formData;
    setRequestPayload(formData);

    if (selectedEndpoint) {
      setResponsePayload({});
      fetch("http://localhost:8080" + selectedEndpoint.url, {
        headers: {
          Accept: "application/json, text/plain",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData),
        method: "POST",
        mode: "cors"
      })
        .then(response => {
          return response.json();
        })
        .then(data => {
          console.log(data);
          setResponsePayload(data);
        });
    }
  };

  return (
    <div className={`cd-panel cd-panel--from-right js-cd-panel-main ${showPanel ? "cd-panel--is-visible" : ""}`}>
      <div className="cd-panel__container">
        <div className="cd-panel__content">
          <Page>
            <PageSection>
              <Title headingLevel="h4" size={TitleSizes.xl} style={{ marginBottom: "var(--pf-global--spacer--sm)" }}>
                Deploy
              </Title>
              <div>
                <Flex>
                  <FlexItem>
                    <Button type="button" variant="primary" onClick={handleDeploy} isDisabled={modelDeploy.waiting}>
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
            </PageSection>
            <PageSection>
              <Title headingLevel="h4" size={TitleSizes.xl} style={{ marginBottom: "var(--pf-global--spacer--sm)" }}>
                Test
              </Title>
              <Grid hasGutter={true}>
                <GridItem span={6}>
                  <div className="endpoint-selection">
                    <label htmlFor="endpoint-selection">Endpoint Selection</label>
                    <Select
                      id="endpoint-selection"
                      variant={SelectVariant.single}
                      aria-label="Select Input"
                      onToggle={onEndpointSelectToggle}
                      onSelect={onEndpointSelect}
                      selections={selectedEndpoint}
                      isOpen={isEndpointSelectOpen}
                      aria-labelledby={"test-endpoints"}
                      direction={SelectDirection.down}
                    >
                      {schemas &&
                        schemas.map((schema, index) => (
                          <SelectOption key={index} value={schema}>
                            {schema.url.replace(/%20/g, " ")}
                          </SelectOption>
                        ))}
                    </Select>
                  </div>
                </GridItem>
                <GridItem span={6}>
                  <label>Select environment</label>
                  <Flex>
                    <FlexItem>
                      <Button
                        variant={testEnvironment === 1 ? "primary" : "control"}
                        isActive={testEnvironment === 1}
                        onClick={() => setTestEnvironment(1)}
                      >
                        Development
                      </Button>
                    </FlexItem>
                    <FlexItem>
                      <Button
                        variant={
                          testEnvironment === 2
                            ? "primary"
                            : !modelDeploy.deployed || modelDeploy.waiting
                            ? "secondary"
                            : "control"
                        }
                        isActive={testEnvironment === 2}
                        onClick={() => setTestEnvironment(2)}
                        isDisabled={!modelDeploy.deployed || modelDeploy.waiting}
                        title={"Only available after successful deploy"}
                      >
                        Production
                      </Button>
                    </FlexItem>
                  </Flex>
                </GridItem>
              </Grid>
            </PageSection>
            <PageSection>
              <Grid hasGutter={true}>
                <GridItem span={6}>
                  {selectedEndpoint && (
                    <Form
                      schema={selectedEndpoint.schema}
                      onSubmit={handleForm}
                      formData={requestPayload}
                      className="dynamic-form"
                    />
                  )}
                </GridItem>
                <GridItem span={6}>
                  <div className="endpoint-response">
                    <label>Response</label>
                    <div className="response-viewer">
                      {responsePayload && (
                        <ReactJson
                          src={responsePayload}
                          displayDataTypes={false}
                          displayObjectSize={false}
                          enableClipboard={false}
                          name={false}
                          theme="shapeshifter:inverted"
                        />
                      )}
                    </div>
                  </div>
                </GridItem>
              </Grid>
            </PageSection>
          </Page>
        </div>
      </div>
    </div>
  );
};

export default TestAndDeploy;

interface Schema {
  url: string;
  schema: any;
}
