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
import { RemoteData } from "../editor/ModelTester/ModelTester";
import { AxiosError, AxiosRequestConfig } from "axios";
import { axiosClient } from "./axiosClient";

const useAxiosRequest = <T>(requestConfig: AxiosRequestConfig): [() => void, RemoteData<AxiosError, T>] => {
  const [data, setData] = useState<RemoteData<AxiosError, T>>({
    status: "NOT_ASKED",
  });

  const loadData = useCallback(() => {
    let isMounted = true;
    setData({ status: "LOADING" });

    axiosClient(requestConfig)
      .then((response) => {
        if (isMounted) {
          setData({ status: "SUCCESS", data: response.data });
        }
      })
      .catch((error) => {
        setData({ status: "FAILURE", error });
      });
    return () => {
      isMounted = false;
    };
  }, [requestConfig]);

  return [loadData, data];
};

export default useAxiosRequest;