import { useEffect, useState } from "react";
import { config } from "../../config";
import { ResponsePayload } from "../ModelTester/ModelTester";

const useSaliencies = (modelTestResponse: ResponsePayload | null) => {
  const [saliencies, setSaliencies] = useState<RemoteData<Error, Saliencies>>({
    status: "NOT_ASKED"
  });

  useEffect(() => {
    let isMounted = true;
    if (modelTestResponse) {
      setSaliencies({ status: "LOADING" });
      fetch(config.development.explainability.url, {
        headers: {
          Accept: "application/json, text/plain",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          serviceUrl: "",
          modelName: modelTestResponse.modelName,
          namespace: modelTestResponse.namespace,
          inputs: {},
          outputs: {}
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
  outcomeId: string;
  featureImportance: FeatureScores[];
}
export interface Saliencies {
  status: "SUCCEEDED" | "FAILED";
  statusDetail: string;
  saliencies: Saliency[];
}
