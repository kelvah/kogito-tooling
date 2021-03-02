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

import { useCallback, useRef, useState } from "react";

const useLoading = () => {
  const [loadingStatus, setLoadingStatus] = useState(false);
  const minimumWait = 1000;

  const startTime = useRef(0);

  const updateLoading = useCallback(
    (status: boolean) => {
      if (status) {
        startTime.current = new Date().getTime();
      }
      if (!status && startTime.current) {
        const now = new Date().getTime();
        const diff = now - startTime.current;
        if (diff < minimumWait) {
          setTimeout(() => setLoadingStatus(status), minimumWait - diff);
        } else {
          setLoadingStatus(status);
        }
        startTime.current = 0;
      } else {
        setLoadingStatus(status);
      }
    },
    [startTime.current, minimumWait]
  );

  return [loadingStatus, updateLoading] as const;
};

export default useLoading;
