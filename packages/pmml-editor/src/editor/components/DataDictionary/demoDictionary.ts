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

import { DDDataField } from "./DataDictionaryContainer/DataDictionaryContainer";

export const demoDictionary: DDDataField[] = [
  {
    name: "Requested_Product",
    type: "structure",
    optype: "categorical",
    children: [
      {
        name: "Type",
        type: "custom",
        customType: "Product_Type",
        optype: "categorical",
      },
      {
        name: "Rate",
        type: "float",
        optype: "categorical",
      },
      {
        name: "Term",
        type: "integer",
        optype: "categorical",
      },
      {
        name: "Amount",
        type: "integer",
        optype: "categorical",
      },
    ],
  },
  {
    name: "Post-Bureau_Risk_Category",
    type: "structure",
    optype: "categorical",
    children: [
      {
        name: "Risk Category",
        type: "string",
        optype: "categorical",
      },
      {
        name: "Credit Contingency Factor",
        type: "integer",
        optype: "categorical",
      },
    ],
  },
  {
    name: "Applicant_Data",
    type: "structure",
    optype: "categorical",
    children: [
      {
        name: "Age",
        type: "integer",
        optype: "categorical",
      },
      {
        name: "Marital Status",
        type: "string",
        optype: "categorical",
      },
      {
        name: "Employment Status",
        type: "string",
        optype: "categorical",
      },
      {
        name: "Existing Customer",
        type: "boolean",
        optype: "categorical",
      },
      {
        name: "Monthly",
        type: "structure",
        optype: "categorical",
        children: [
          {
            name: "Income",
            type: "integer",
            optype: "categorical",
          },
          {
            name: "Repayments",
            type: "integer",
            optype: "categorical",
          },
          {
            name: "Expenses",
            type: "integer",
            optype: "categorical",
          },
          {
            name: "Tax",
            type: "integer",
            optype: "categorical",
          },
          {
            name: "Insurance",
            type: "integer",
            optype: "categorical",
          },
        ],
      },
    ],
  },
  {
    name: "Pre-Bureau_Risk_Category",
    type: "structure",
    optype: "categorical",
    children: [
      {
        name: "Risk Category",
        type: "string",
        optype: "categorical",
      },
      {
        name: "Credit Contingency Factor",
        type: "integer",
        optype: "categorical",
      },
    ],
  },
  {
    name: "Strategy",
    type: "string",
    optype: "categorical",
  },
  {
    name: "Bureau_Call_Type",
    type: "string",
    optype: "categorical",
  },
  {
    name: "Eligibility",
    type: "string",
    optype: "categorical",
  },
  {
    name: "Product_Type",
    type: "structure",
    optype: "categorical",
    children: [
      {
        name: "Description",
        type: "string",
        optype: "categorical",
      },
      {
        name: "Code",
        type: "string",
        optype: "categorical",
      },
    ],
  },
  {
    name: "Credit_Score_Rating",
    type: "string",
    optype: "categorical",
  },
  {
    name: "Back_End_Ratio",
    type: "string",
    optype: "categorical",
  },
  {
    name: "Front_End_Ratio",
    type: "string",
    optype: "categorical",
  },
  {
    name: "Qualification",
    type: "string",
    optype: "categorical",
  },
  {
    name: "Credit_Score",
    type: "structure",
    optype: "categorical",
    children: [
      {
        name: "FICO",
        type: "integer",
        optype: "categorical",
      },
    ],
  },
  {
    name: "Loan_Qualification",
    type: "structure",
    optype: "categorical",
    children: [
      {
        name: "Qualification",
        type: "string",
        optype: "categorical",
      },
      {
        name: "Reason",
        type: "string",
        optype: "categorical",
      },
    ],
  },
];
