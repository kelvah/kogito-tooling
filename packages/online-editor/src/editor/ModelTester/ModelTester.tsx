import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import Form from "@rjsf/bootstrap-4";
import { Alert, Grid, GridItem, EmptyState, EmptyStateIcon, Title } from "@patternfly/react-core";
import { EnvelopeIcon } from "@patternfly/react-icons";
import { JSONSchemaBridge } from "uniforms-bridge-json-schema";
import Ajv from "ajv";
import { AutoForm } from "uniforms-patternfly";
import OutputViewer from "../OutputViewer/OutputViewer";
import SkeletonCard from "../Skeletons/SkeletonCard/SkeletonCard";
import SkeletonStripe from "../Skeletons/SkeletonStripe/SkeletonStripe";
import { AxiosRequestConfig } from "axios";
import { axiosClient } from "../../common/axiosClient";

interface ModelTesterProps {
  schema: {};
  getModel: () => Promise<string | undefined>;
  baseUrl: string | undefined;
}

const ModelTester = (props: ModelTesterProps) => {
  const { schema, getModel, baseUrl } = props;
  const [requestPayload, setRequestPayload] = useState({});
  const [responsePayload, setResponsePayload] = useState<RemoteData<Error, EvaluateAndExplainResponse>>({
    status: "NOT_ASKED"
  });

  const ajv = new Ajv({ allErrors: true, useDefaults: true });

  const createValidator = (jsonSchema: object) => {
    const validator = ajv.compile(jsonSchema);

    return (model: object) => {
      validator(model);
      return validator.errors?.length ? { details: validator.errors } : null;
    };
  };

  useEffect(() => {
    setResponsePayload({ status: "NOT_ASKED" });
  }, []);

  const formSchema = useMemo(() => {
    if (schema) {
      const schemaValidator = createValidator(schema as object);
      return new JSONSchemaBridge(schema, schemaValidator);
    }
  }, [schema]);

  const handleForm = async (form: any) => {
    try {
      setRequestPayload(form);
      setResponsePayload({ status: "LOADING" });
      const model = await getModel();
      const requestConfig: AxiosRequestConfig = {
        baseURL: baseUrl,
        url: "/evaluateAndExplain",
        method: "post",
        headers: { "Content-Type": "application/json" },
        responseType: "json",
        data: JSON.stringify({ model, context: form })
      };
      axiosClient(requestConfig)
        .then(response => {
          setResponsePayload({ status: "SUCCESS", data: response.data });
        })
        .catch(error => {
          setResponsePayload({ status: "FAILURE", error: error.response.data.details });
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section>
      <Grid hasGutter={false}>
        <GridItem span={6}>
          {schema && (
            <div className="test-and-deploy__request">
              <Title headingLevel="h3" className="test-and-deploy__title">
                Request
              </Title>
              {/*<Form schema={schema} onSubmit={handleForm} formData={requestPayload} className="dynamic-form" />*/}
              <AutoForm schema={formSchema} onSubmit={handleForm} />
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
