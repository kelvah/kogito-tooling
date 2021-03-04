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

import { useCallback, useEffect, useState } from "react";
import { RemoteData } from "../ModelTester/ModelTester";
import { AxiosError, AxiosRequestConfig } from "axios";
import { axiosClient } from "../../common/axiosClient";
import { Decision } from "./useDecisionStatus";

const useBuildingDecision = (modelName: string) => {
  const [buildingDecision, setBuildingDecision] = useState<RemoteData<AxiosError, Decision>>({
    status: "NOT_ASKED"
  });

  const loadBuildingDecision = useCallback(() => {
    let isMounted = true;
    setBuildingDecision({ status: "LOADING" });

    const config: AxiosRequestConfig = {
      url: `/decisions/${modelName}/building`,
      method: "get"
    };

    axiosClient(config)
      .then(response => {
        if (isMounted) {
          setBuildingDecision({ status: "SUCCESS", data: response.data });
        }
      })
      .catch(error => {
        setBuildingDecision({ status: "FAILURE", error });
      });
    return () => {
      isMounted = false;
    };
  }, [modelName]);

  useEffect(() => {
    loadBuildingDecision();
  }, [modelName]);

  return { loadBuildingDecision, buildingDecision };
};

export default useBuildingDecision;
