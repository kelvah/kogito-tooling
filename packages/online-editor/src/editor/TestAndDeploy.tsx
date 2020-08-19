import * as React from "react";
// @ts-ignore
import SwaggerClient from "swagger-client";
import { useEffect, useState } from "react";
import {
  FormGroup,
  Page,
  PageSection,
  Title,
  TitleSizes,
  Select,
  SelectOption,
  SelectVariant,
  SelectDirection
} from "@patternfly/react-core";
import Form from "@rjsf/bootstrap-4";
import "bootstrap/dist/css/bootstrap.css";

import "./TestAndDeploy.css";

interface TestAndDeployProps {
  showPanel: boolean;
}

const TestAndDeploy = (props: TestAndDeployProps) => {
  const { showPanel } = props;
  // const context = useContext(GlobalContext);
  const [schemas, setSchemas] = useState<Schema[]>();
  const [isEndpointSelectOpen, setIsEndpointSelectOpen] = useState(false);
  const [selectedEndpoint, setSelectedEndpoint] = useState<Schema>();
  const [requestPayload, setRequestPayload] = useState();
  const [responsePayload, setResponsePayload] = useState<string>();

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
      setResponsePayload("");
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
              <Title headingLevel="h3" size={TitleSizes["2xl"]} id="test-endpoints">
                Test Things
              </Title>
            </PageSection>
            <PageSection>
              <FormGroup label="Endpoint Selection" fieldId="endpoint-selection">
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
              </FormGroup>
            </PageSection>
            <PageSection>
              {selectedEndpoint && (
                <Form schema={selectedEndpoint.schema} onSubmit={handleForm} formData={requestPayload} />
              )}
            </PageSection>
            <PageSection>
              <div className="form-group">
                <label htmlFor="request-response">Response:</label>
                <textarea
                  className="form-control"
                  id="request-response"
                  rows={22}
                  value={JSON.stringify(responsePayload, null, 2)}
                  readOnly={true}
                />
              </div>
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
