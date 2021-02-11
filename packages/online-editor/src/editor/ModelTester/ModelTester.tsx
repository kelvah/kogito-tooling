import * as React from "react";
import { Environment, Schema } from "../TestAndDeploy/TestAndDeploy";
import { useEffect, useState } from "react";
import Form from "@rjsf/bootstrap-4";
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
import OutputViewer from "../OutputViewer/OutputViewer";
// import useSaliencies from "../TestAndDeploy/useSaliencies";
import SkeletonCard from "../Skeletons/SkeletonCard/SkeletonCard";
import SkeletonStripe from "../Skeletons/SkeletonStripe/SkeletonStripe";
import { config } from "../../config";

interface ModelTesterProps {
  schema: {};
  getModel: () => Promise<string | undefined>;
  baseUrl: string;
  environment: Environment;
}

const ModelTester = (props: ModelTesterProps) => {
  const { schema, getModel, baseUrl, environment } = props;
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>();
  const [isEndpointSelectOpen, setIsEndpointSelectOpen] = useState(false);
  const [selectedSchema, setSelectedSchema] = useState<{}>();
  const [requestPayload, setRequestPayload] = useState({});
  const [responsePayload, setResponsePayload] = useState<RemoteData<Error, EvaluateAndExplainResponse>>({
    status: "NOT_ASKED"
  });
  // const saliencies = useSaliencies(responsePayload, baseUrl);

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
    // if (schemas.length > 0) {
    //   setSelectedEndpoint(schemas[0].url);
    // }
    setResponsePayload({ status: "NOT_ASKED" });
  }, []);

  // useEffect(() => {
  //   if (selectedEndpoint) {
  //     const schema = schemas?.filter(item => item.url === selectedEndpoint)[0];
  //     setSelectedSchema(schema?.schema);
  //   }
  // }, [schemas, selectedEndpoint]);

  const handleForm = async (form: { formData: any }) => {
    const formData = form.formData;
    setRequestPayload(formData);

    setResponsePayload({ status: "LOADING" });
    const model = await getModel();
    const requestParams = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/plain"
      },
      body: JSON.stringify({ model, context: formData }),
      method: "POST",
      mode: "cors" as RequestMode
    };
    fetch(config.openApi.url + config.openApi.runModel, requestParams)
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
    // if (selectedEndpoint) {
    //   setResponsePayload({ status: "LOADING" });
    //   fetch(baseUrl + selectedEndpoint, {
    //     headers: {
    //       Accept: "application/json, text/plain",
    //       "Content-Type": "application/json"
    //     },
    //     body: JSON.stringify(formData),
    //     method: "POST",
    //     mode: "cors"
    //   })
    //     .then(response => {
    //       return response.json().then(text => ({
    //         json: text,
    //         meta: response
    //       }));
    //     })
    //     .then(data => {
    //       if (data.meta.ok) {
    //         setResponsePayload({ status: "SUCCESS", data: data.json });
    //       } else {
    //         setResponsePayload({ status: "FAILURE", error: data.json?.details });
    //       }
    //     });
    // }
  };

  return (
    <section>
      {/*<div className="test-and-deploy__endpoint-selection">*/}
      {/*  <Title headingLevel="h3" className="test-and-deploy__title">*/}
      {/*    Endpoint Selection*/}
      {/*  </Title>*/}
      {/*  <Select*/}
      {/*    id="endpoint-selection"*/}
      {/*    variant={SelectVariant.single}*/}
      {/*    aria-label="Select Input"*/}
      {/*    onToggle={onEndpointSelectToggle}*/}
      {/*    onSelect={onEndpointSelect}*/}
      {/*    selections={selectedEndpoint}*/}
      {/*    isOpen={isEndpointSelectOpen}*/}
      {/*    isDisabled={schemas.length === 0}*/}
      {/*    aria-labelledby={"test-endpoints"}*/}
      {/*    direction={SelectDirection.down}*/}
      {/*  >*/}
      {/*    {schemas &&*/}
      {/*      schemas.map((schema, index) => (*/}
      {/*        <SelectOption key={index} value={schema.url}>*/}
      {/*          {schema.label}*/}
      {/*        </SelectOption>*/}
      {/*      ))}*/}
      {/*  </Select>*/}
      {/*</div>*/}
      <Grid hasGutter={false}>
        <GridItem span={6}>
          {schema && (
            <div className="test-and-deploy__request">
              <Title headingLevel="h3" className="test-and-deploy__title">
                Request
              </Title>
              <Form schema={schema} onSubmit={handleForm} formData={requestPayload} className="dynamic-form" />
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
              <OutputViewer
                responsePayload={responsePayload.data.dmnResult}
                saliencies={responsePayload.data.saliencies}
                environment={environment}
              />
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
    </section>
  );
};

export default ModelTester;

export interface EvaluateAndExplainResponse {
  dmnResult: DmnResult;
  saliencies: Saliencies;
}

export interface DmnResult {
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

export interface Saliency {
  outcomeName: string;
  featureImportance: FeatureScores[];
}

export interface Saliencies {
  status: "SUCCEEDED" | "FAILED";
  statusDetails: string;
  saliencies: Saliency[];
}

export interface FeatureScores {
  featureName: string;
  featureId: string;
  featureScore: number;
}

export type RemoteData<E, D> =
  | { status: "NOT_ASKED" }
  | { status: "LOADING" }
  | { status: "FAILURE"; error: E }
  | { status: "SUCCESS"; data: D };
