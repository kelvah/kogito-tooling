import * as React from "react";
import { Schema } from "../TestAndDeploy/TestAndDeploy";
import { useEffect, useState } from "react";
import Form from "@rjsf/bootstrap-4";
import ReactJson from "react-json-view";

import {
  Grid,
  GridItem,
  Title,
  Select,
  SelectOption,
  SelectVariant,
  SelectDirection,
  Switch
} from "@patternfly/react-core";

type ModelTesterProps = {
  schemas: Schema[];
  environment: "PROD" | "DEV";
};

const ModelTester = (props: ModelTesterProps) => {
  const { schemas } = props;
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>();
  const [isEndpointSelectOpen, setIsEndpointSelectOpen] = useState(false);
  const [selectedSchema, setSelectedSchema] = useState<{}>();
  const [processedResponse, setProcessedResponse] = useState<{}>({});
  const [requestPayload, setRequestPayload] = useState();
  const [requestBody, setRequestBody] = useState<{}>();
  const [responsePayload, setResponsePayload] = useState<{} | null>(null);
  const [hideInputsFromEndpointResponse, setHideInputsFromEndpointResponse] = useState(true);

  const onEndpointSelectToggle = (openStatus: boolean) => {
    setIsEndpointSelectOpen(openStatus);
  };

  const onEndpointSelect = (event: React.MouseEvent | React.ChangeEvent, selection: string) => {
    setSelectedEndpoint(selection);
    setIsEndpointSelectOpen(false);
    setResponsePayload(null);
    setProcessedResponse({});
  };

  useEffect(() => {
    setSelectedEndpoint(schemas[0].url);
  }, []);

  useEffect(() => {
    if (selectedEndpoint) {
      const schema = schemas?.filter(item => item.url === selectedEndpoint)[0];
      setSelectedSchema(schema?.schema);
    }
  }, [selectedEndpoint]);

  const handleForm = (form: { formData: any }) => {
    const formData = form.formData;
    setRequestPayload(formData);

    if (selectedEndpoint) {
      setRequestBody(formData);
      setResponsePayload(null);
      setProcessedResponse({});
      fetch("http://localhost:8080" + selectedEndpoint, {
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

  useEffect(() => {
    if (responsePayload && requestBody) {
      const keys = Object.keys(requestBody);
      const withoutInputs: { [key: string]: any } = Object.assign({}, responsePayload);
      for (const key in withoutInputs) {
        if (keys.includes(key)) {
          delete withoutInputs[key];
        }
      }
      setProcessedResponse(withoutInputs);
    }
  }, [responsePayload]);
  return (
    <div>
      <div className="test-and-deploy__endpoint-selection">
        <Title headingLevel="h3" className="test-and-deploy__title">
          Endpoint Selection
        </Title>
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
              <SelectOption key={index} value={schema.url}>
                {schema.url.replace(/%20/g, " ")}
              </SelectOption>
            ))}
        </Select>
      </div>
      <Grid hasGutter={false}>
        <GridItem span={6}>
          {selectedSchema && (
            <div className="test-and-deploy__request">
              <Title headingLevel="h3" className="test-and-deploy__title">
                Request
              </Title>
              <Form schema={selectedSchema} onSubmit={handleForm} formData={requestPayload} className="dynamic-form" />
            </div>
          )}
        </GridItem>
        <GridItem span={6}>
          <div className="test-and-deploy__endpoint-response">
            <Title headingLevel="h3" className="test-and-deploy__title">
              Response
            </Title>
            <div className="response-viewer">
              {responsePayload && (
                <ReactJson
                  src={
                    Object.keys(processedResponse).length > 0 && hideInputsFromEndpointResponse
                      ? processedResponse
                      : responsePayload
                  }
                  displayDataTypes={false}
                  displayObjectSize={false}
                  enableClipboard={false}
                  shouldCollapse={false}
                  name={false}
                  theme="shapeshifter:inverted"
                />
              )}
            </div>
            {responsePayload && Object.keys(processedResponse).length !== Object.keys(responsePayload).length && (
              <div className="response-input-filter">
                <Switch
                  id="no-label-switch-on"
                  aria-label="Message when on"
                  isChecked={hideInputsFromEndpointResponse}
                  label="Hide input parameters from response"
                  onChange={() => setHideInputsFromEndpointResponse(!hideInputsFromEndpointResponse)}
                />
              </div>
            )}
          </div>
        </GridItem>
      </Grid>
    </div>
  );
};

export default ModelTester;
