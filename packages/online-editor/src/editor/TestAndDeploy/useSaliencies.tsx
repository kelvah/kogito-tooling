import { useCallback, useEffect, useState } from "react";
import { omit, pick } from "lodash";
import { config } from "../../config";
import { ResponsePayload } from "../ModelTester/ModelTester";

const useSaliencies = (modelTestResponse: RemoteData<Error, ResponsePayload>, baseUrl: string) => {
  const [saliencies, setSaliencies] = useState<RemoteData<Error, Saliencies>>({
    status: "NOT_ASKED"
  });

  const contextFilter = useCallback((responsePayload: ResponsePayload, contextType: "inputs" | "outputs") => {
    let result;
    const outputKeys = responsePayload.decisionResults.map(decision => decision.decisionName);
    switch (contextType) {
      case "inputs":
        result = omit(responsePayload.dmnContext, outputKeys);
        break;
      case "outputs":
        result = pick(responsePayload.dmnContext, outputKeys);
        break;
      default:
        break;
    }
    return result;
  }, []);

  useEffect(() => {
    let isMounted = true;
    if (modelTestResponse.status === "SUCCESS") {
      setSaliencies({ status: "LOADING" });
      fetch(config.development.explainability.serviceUrl, {
        headers: {
          Accept: "application/json, text/plain",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          serviceUrl: baseUrl,
          modelIdentifier: {
            resourceType: "dmn",
            resourceId: `${modelTestResponse.data.namespace}:${modelTestResponse.data.modelName}`
          },
          inputs: contextFilter(modelTestResponse.data, "inputs"),
          outputs: contextFilter(modelTestResponse.data, "outputs")
        }),
        method: "POST",
        mode: "cors"
      })
        .then(response => {
          return response.json();
        })
        .then(data => {
          if (isMounted) {
            setSaliencies({ status: "SUCCESS", data: data });
          }
        })
        .catch(error => {
          setSaliencies({ status: "FAILURE", error });
        });
    }

    return () => {
      isMounted = false;
    };
  }, [modelTestResponse]);

  return saliencies;
};

export default useSaliencies;

export type RemoteData<E, D> =
  | { status: "NOT_ASKED" }
  | { status: "LOADING" }
  | { status: "FAILURE"; error: E }
  | { status: "SUCCESS"; data: D };

export interface FeatureScores {
  featureName: string;
  featureId: string;
  featureScore: number;
}

export interface Saliency {
  outcomeName: string;
  featureImportance: FeatureScores[];
}
export interface Saliencies {
  status: "SUCCEEDED" | "FAILED";
  statusDetails: string;
  saliencies: Saliency[];
}
