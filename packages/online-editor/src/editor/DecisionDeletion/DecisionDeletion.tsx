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
import { useEffect, useState } from "react";
import { AxiosRequestConfig } from "axios";
import useAxiosRequest from "../../common/useAxiosRequest";
import DeleteConfirmationDialog from "../DeleteConfirmationDialog/DeleteConfirmationDialog";
import { Text, TextContent, TextVariants } from "@patternfly/react-core";

interface DecisionDeletionProps {
  decisionName: string | undefined;
  onConfirm?: () => void;
  onDelete: () => void;
  onCancel: () => void;
}

const DecisionDeletion = (props: DecisionDeletionProps) => {
  const { decisionName, onConfirm, onDelete, onCancel } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteDecisionRequestConfig, setDecisionRequestConfig] = useState<AxiosRequestConfig>({
    url: ``,
    method: "delete",
  });
  const [deleteDecision, deletedDecision] = useAxiosRequest<{}>(deleteDecisionRequestConfig);

  useEffect(() => {
    if (decisionName) {
      setIsModalOpen(true);
      setDecisionRequestConfig((prevState) => ({
        ...prevState,
        url: `/decisions/${decisionName}`,
      }));
    } else {
      setIsModalOpen(false);
    }
  }, [decisionName]);

  useEffect(() => {
    if (deletedDecision.status === "SUCCESS" || deletedDecision.status === "FAILURE") {
      onDelete();
    }
  }, [deletedDecision]);

  const handleDelete = () => {
    setIsModalOpen(false);
    onConfirm?.();
    deleteDecision();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    onCancel();
  };

  return (
    <DeleteConfirmationDialog
      onConfirm={handleDelete}
      onClose={handleCancel}
      showModal={isModalOpen}
      title="Permanently delete decision?"
    >
      <TextContent>
        <Text component={TextVariants.p}>
          The <strong>{decisionName}</strong> decision will be lost forever and it will not be possible to recover it.
        </Text>
      </TextContent>
    </DeleteConfirmationDialog>
  );
};

export default DecisionDeletion;
