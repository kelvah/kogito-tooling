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

interface DeleteConfirmationDialogProps {
  title?: string;
  onConfirm: () => void;
  onClose: () => void;
  appendToSelector?: string;
  showModal: boolean;
  children: React.ReactNode;
}

const DeleteConfirmationDialog = (props: DeleteConfirmationDialogProps) => {
  const { title = "Delete Confirmation", onConfirm, onClose, appendToSelector, showModal, children } = props;
  const appendToProp = {
    appendTo: appendToSelector ? () => document.querySelector(appendToSelector) as HTMLElement : () => document.body,
  };
  return (
    <Modal
      variant={ModalVariant.small}
      title={title}
      titleIconVariant="warning"
      isOpen={showModal}
      onClose={onClose}
      actions={[
        <Button key="confirm" variant="danger" onClick={onConfirm}>
          Delete
        </Button>,
        <Button key="cancel" variant="link" onClick={onClose}>
          Cancel
        </Button>,
      ]}
      {...appendToProp}
    >
      {children}
    </Modal>
  );
};

export default DeleteConfirmationDialog;
