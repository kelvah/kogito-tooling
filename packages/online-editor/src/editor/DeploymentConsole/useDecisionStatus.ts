/*
 * Copyright 2021 Red Hat, Inc. and/or its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import { useCallback, useState } from "react";
import { RemoteData } from "../ModelTester/ModelTester";
import { AxiosError, AxiosRequestConfig } from "axios";
import { axiosClient } from "../../common/axiosClient";

const useDecisionStatus = (modelName: string) => {
  const [decisionStatus, setDecisionStatus] = useState<RemoteData<AxiosError, Decision>>({
    status: "NOT_ASKED"
  });

  const loadDecisionStatus = useCallback(() => {
    let isMounted = true;
    setDecisionStatus({ status: "LOADING" });

    const config: AxiosRequestConfig = {
      url: `/decisions/${modelName}`,
      method: "get"
    };

    axiosClient(config)
      .then(response => {
        if (isMounted) {
          setDecisionStatus({ status: "SUCCESS", data: response.data });
        }
      })
      .catch(error => {
        setDecisionStatus({ status: "FAILURE", error });
      });
    return () => {
      isMounted = false;
    };
  }, [modelName]);

  return { loadDecisionStatus, decisionStatus };
};

export default useDecisionStatus;

export interface Decision {
  kind: string;
  id: string;
  version: number;
  href: string;
  name: string;
  description: string;
  model: {
    md5: string;
    href: string;
  };
  eventing?: {
    kafka?: {
      source?: string;
      sink?: string;
    };
  };
  configuration: {};
  tags: {};
  current_endpoint: string;
  version_endpoint: string;
  status: decisionDeployStatusStrings;
  status_message: string;
  submitted_at: string;
  published_at: string;
}

export enum decisionDeployStatus {
  BUILDING = "BUILDING",
  CURRENT = "CURRENT",
  FAILED = "FAILED",
  READY = "READY",
  DELETED = "DELETED"
}

export type decisionDeployStatusStrings = keyof typeof decisionDeployStatus;
