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
import { Button, Modal, ModalVariant } from "@patternfly/react-core";
import { useCallback, useEffect, useState } from "react";

interface DecisionDeleteConfirmationProps {
  decisionVersion: number;
  onDelete: (versionNumber: number) => Promise<any>;
  onClose: () => void;
}

const DecisionDeleteConfirmation = (props: DecisionDeleteConfirmationProps) => {
  const { decisionVersion, onDelete, onClose } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setIsModalOpen(decisionVersion > -1);
  }, [decisionVersion]);

  const deleteVersion = useCallback(() => {
    onDelete(decisionVersion);
    onClose();
  }, [onDelete, decisionVersion]);

  return (
    <div>
      <Modal
        variant={ModalVariant.small}
        title="Delete Confirmation"
        titleIconVariant="warning"
        isOpen={isModalOpen}
        onClose={onClose}
        actions={[
          <Button key="confirm" variant="danger" onClick={deleteVersion}>
            Delete
          </Button>,
          <Button key="cancel" variant="link" onClick={onClose}>
            Cancel
          </Button>
        ]}
        appendTo={() => document.querySelector("#deploy-tab-content") as HTMLElement}
      >
        Are you sure to delete the decision <strong>version {decisionVersion}</strong>?
        <br />
        This action cannot be undone.
      </Modal>
    </div>
  );
};

export default DecisionDeleteConfirmation;
