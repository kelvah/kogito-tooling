import * as React from "react";
import { useContext } from "react";
import { Button, Split, SplitItem } from "@patternfly/react-core";
import { TrashIcon } from "@patternfly/react-icons";
import { MiningField } from "@kogito-tooling/pmml-editor-marshaller";
import { MiningSchemaContext } from "../MiningSchemaContainer/MiningSchemaContainer";
import MiningSchemaFieldLabels from "../MiningSchemaFieldLabels/MiningSchemaFieldLabels";
import "./MiningSchemaFields.scss";

interface MiningSchemaFieldsProps {
  fields: MiningField[] | undefined;
  onAddProperties: (index: number) => void;
  onDelete: (index: number) => void;
  onPropertyDelete: (index: number, updatedField: MiningField) => void;
  onEdit: (index: number) => void;
}

const MiningSchemaFields = (props: MiningSchemaFieldsProps) => {
  const { fields, onAddProperties, onDelete, onPropertyDelete, onEdit } = props;
  return (
    <ul className="mining-schema-list">
      {fields?.map((field, index) => {
        return (
          <MiningSchemaItem
            key={field.name as string}
            field={field}
            index={index}
            onAddProperties={onAddProperties}
            onDelete={onDelete}
            onPropertyDelete={onPropertyDelete}
            onEdit={onEdit}
          />
        );
      })}
    </ul>
  );
};

export default MiningSchemaFields;

interface MiningSchemaFieldProps {
  field: MiningField;
  index: number;
  onAddProperties: (index: number) => void;
  onDelete: (index: number) => void;
  onPropertyDelete: (index: number, field: MiningField) => void;
  onEdit: (index: number) => void;
}

const MiningSchemaItem = (props: MiningSchemaFieldProps) => {
  const { field, index, onAddProperties, onDelete, onPropertyDelete, onEdit } = props;
  const editing = useContext(MiningSchemaContext);

  const addProperties = () => {
    onAddProperties(index);
  };
  const deleteField = () => {
    onDelete(index);
  };
  const deleteProperty = (updatedField: MiningField) => {
    onPropertyDelete(index, updatedField);
  };
  const handleEdit = () => {
    onEdit(index);
  };
  return (
    <li
      className={`mining-schema-list__item ${editing === index ? "editing" : ""}`}
      key={field.name.value}
      onClick={handleEdit}
    >
      <Split hasGutter={true}>
        <SplitItem>
          <span className="mining-schema-list__item__name">{field.name}</span>
        </SplitItem>
        <SplitItem isFilled={true}>
          <MiningSchemaFieldLabels
            field={field}
            onEdit={addProperties}
            onDelete={deleteProperty}
            editing={index === editing}
          />
        </SplitItem>
        <SplitItem>
          <Button variant="plain" onClick={deleteField}>
            <TrashIcon />
          </Button>
        </SplitItem>
      </Split>
    </li>
  );
};
