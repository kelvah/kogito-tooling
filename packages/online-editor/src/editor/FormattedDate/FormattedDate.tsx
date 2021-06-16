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

import * as React from "react";
import { useMemo } from "react";

interface FormattedDateProps {
  date: string;
  short?: boolean;
}

const FormattedDate = (props: FormattedDateProps) => {
  const { date, short = false } = props;
  const shortOptions = { dateStyle: "short" } as Intl.DateTimeFormatOptions;

  const formattedDate = useMemo(() => {
    return short ? new Date(date).toLocaleString(undefined, shortOptions) : new Date(date).toLocaleString();
  }, [date]);
  return <span>{formattedDate}</span>;
};

export default FormattedDate;
