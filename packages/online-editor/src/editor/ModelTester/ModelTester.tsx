import * as React from "react";
import { Environment, Schema } from "../TestAndDeploy/TestAndDeploy";
import { useEffect, useState } from "react";
import {
  Alert,
  Grid,
  GridItem,
  EmptyState,
  EmptyStateIcon,
  Title,
  Select,
  SelectOption,
  SelectVariant,
  SelectDirection
} from "@patternfly/react-core";
import { EnvelopeIcon } from "@patternfly/react-icons";
import { JSONSchemaBridge } from "uniforms-bridge-json-schema";
import * as Ajv from "ajv";
import { AutoForm } from "uniforms-patternfly";

import OutputViewer from "../OutputViewer/OutputViewer";
import useSaliencies, { RemoteData } from "../TestAndDeploy/useSaliencies";
import SkeletonCard from "../Skeletons/SkeletonCard/SkeletonCard";
import SkeletonStripe from "../Skeletons/SkeletonStripe/SkeletonStripe";

interface ModelTesterProps {
  schemas: Schema[];
  baseUrl: string;
  environment: Environment;
}

const ModelTester = (props: ModelTesterProps) => {
  const { schemas, baseUrl, environment } = props;
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>();
  const [isEndpointSelectOpen, setIsEndpointSelectOpen] = useState(false);
  const [selectedSchema, setSelectedSchema] = useState<{}>();
  const [responsePayload, setResponsePayload] = useState<RemoteData<Error, ResponsePayload>>({ status: "NOT_ASKED" });
  const saliencies = useSaliencies(responsePayload, baseUrl);

  const autoForm = React.createRef<HTMLFormElement>();
  const ajv = new Ajv({ allErrors: true, useDefaults: true });

  const onEndpointSelectToggle = (openStatus: boolean) => {
    setIsEndpointSelectOpen(openStatus);
  };

  const onEndpointSelect = (event: React.MouseEvent | React.ChangeEvent, selection: string) => {
    setIsEndpointSelectOpen(false);
    if (selection !== selectedEndpoint) {
      setSelectedEndpoint(selection);
      setResponsePayload({ status: "NOT_ASKED" });
    }
  };

  useEffect(() => {
    if (schemas.length > 0) {
      setSelectedEndpoint(schemas[0].url);
    }
    autoForm.current?.reset();
    setResponsePayload({ status: "NOT_ASKED" });
  }, [schemas]);

  const createValidator = (schema: object) => {
    const validator = ajv.compile(schema);

    return (model: object) => {
      validator(model);
      return validator.errors?.length ? { details: validator.errors } : null;
    };
  };

  useEffect(() => {
    if (selectedEndpoint) {
      const schema = schemas?.filter(item => item.url === selectedEndpoint)[0];
      console.log("SCHEMA");
      console.log(schema.schema);

      const schemaValidator = createValidator(schema.schema as object);
      const bridgedSchema = new JSONSchemaBridge(schema.schema, schemaValidator);
      setSelectedSchema(bridgedSchema);
    }
  }, [schemas, selectedEndpoint]);

  const handleForm = (form: any) => {
    if (selectedEndpoint) {
      setResponsePayload({ status: "LOADING" });
      fetch(baseUrl + selectedEndpoint, {
        headers: {
          Accept: "application/json, text/plain",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form),
        method: "POST",
        mode: "cors"
      })
        .then(response => {
          return response.json().then(text => ({
            json: text,
            meta: response
          }));
        })
        .then(data => {
          if (data.meta.ok) {
            setResponsePayload({ status: "SUCCESS", data: data.json });
          } else {
            setResponsePayload({ status: "FAILURE", error: data.json?.details });
          }
        });
    }
  };

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
          isDisabled={schemas.length === 0}
          aria-labelledby={"test-endpoints"}
          direction={SelectDirection.down}
        >
          {schemas &&
            schemas.map((schema, index) => (
              <SelectOption key={index} value={schema.url}>
                {schema.label}
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
              <AutoForm schema={selectedSchema} onSubmit={handleForm} ref={autoForm} />
            </div>
          )}
        </GridItem>
        <GridItem span={6}>
          <div className="test-and-deploy__endpoint-response">
            <Title headingLevel="h3" className="test-and-deploy__title">
              Response
            </Title>
            {responsePayload.status === "NOT_ASKED" && (
              <EmptyState variant={"small"}>
                <EmptyStateIcon icon={EnvelopeIcon} />
                <Title headingLevel="h3" size="lg">
                  Waiting for a new request
                </Title>
              </EmptyState>
            )}
            {responsePayload.status === "LOADING" && (
              <>
                <SkeletonStripe size="md" customStyle={{ width: 120, height: 20, marginBottom: 20 }} />
                <SkeletonCard />
              </>
            )}
            {responsePayload.status === "SUCCESS" && (
              <OutputViewer responsePayload={responsePayload.data} saliencies={saliencies} environment={environment} />
            )}
            {responsePayload.status === "FAILURE" && (
              <Alert isInline={true} variant="warning" title="The request produced an error">
                {responsePayload.error && (
                  <p>
                    Message:
                    <br /> {responsePayload.error}
                  </p>
                )}
              </Alert>
            )}
          </div>
        </GridItem>
      </Grid>
    </div>
  );
};

export default ModelTester;

export interface ResponsePayload {
  namespace: string;
  modelName: string;
  dmnContext: object;
  messages: ResponseMessage[];
  decisionResults: DecisionResult[];
}

export interface DecisionResult {
  decisionId: string;
  decisionName: string;
  result: unknown;
  messages: ResponseMessage[];
  evaluationStatus: evaluationStatusStrings;
}

export interface ResponseMessage {
  severity: "WARN" | "ERROR" | "INFO";
  message: string;
  messageType: string;
  sourceId: string;
  level: "WARNING" | "ERROR" | "INFO";
}

export enum evaluationStatus {
  EVALUATING = "EVALUATING",
  FAILED = "FAILED",
  NOT_EVALUATED = "NOT EVALUATED",
  SKIPPED = "SKIPPED",
  SUCCEEDED = "SUCCEEDED"
}

export type evaluationStatusStrings = keyof typeof evaluationStatus;
