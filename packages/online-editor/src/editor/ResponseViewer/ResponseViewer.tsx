import * as React from "react";
import { v4 as uuid } from "uuid";
import { Split, SplitItem } from "@patternfly/react-core";
import "./ResponseViewer.scss";

interface ResponseViewerProps {
  source: object;
}

const ResponseViewer = (props: ResponseViewerProps) => {
  const { source } = props;
  return <div className="response-viewer">{renderData(source)}</div>;
};

function renderData(object: { [index: string]: any }): JSX.Element {
  const renderItems: JSX.Element[] = [];
  for (const property in object) {
    if (object.hasOwnProperty(property)) {
      if (isObjectOrArrayOfObjects(object[property])) {
        renderItems.push(<Structure data={object[property]} name={property} key={uuid()} />);
      } else {
        renderItems.push(
          <div className="response-viewer__item" key={uuid()}>
            <ObjectProperty property={property} value={object[property]} />
          </div>
        );
      }
    }
  }
  return <React.Fragment key={uuid()}>{renderItems}</React.Fragment>;
}

export const isObjectOrArrayOfObjects = (item: unknown): boolean => {
  return (
    (item !== null && typeof item === "object" && !Array.isArray(item)) ||
    (item !== null && Array.isArray(item) && item.length > 0 && typeof item[0] === "object")
  );
};

interface StructureProps {
  data: { [index: string]: any };
  name: string;
  isArray?: boolean;
}

const Structure = (props: StructureProps) => {
  const { data, name, isArray = false } = props;
  const renderItems: JSX.Element[] = [];

  for (const subItem in data) {
    if (data.hasOwnProperty(subItem)) {
      if (isObjectOrArrayOfObjects(data[subItem])) {
        renderItems.push(<Structure data={data[subItem]} name={subItem} isArray={Array.isArray(data)} key={uuid()} />);
      } else {
        renderItems.push(<ObjectProperty property={subItem} value={data[subItem]} key={uuid()} />);
      }
    }
  }

  return (
    <div className="response-viewer__item" key={uuid()}>
      {!isArray && (
        <div className="response-viewer__title response-viewer__title--struct" key={uuid()}>
          <span className="response-viewer__property__name">{name}</span>
        </div>
      )}
      <div className={isArray ? "response-viewer__item--array" : "response-viewer__item--struct"} key={name}>
        {renderItems.map(item => item)}
        {isArray && renderItems.length === 0 && <span>No entries</span>}
      </div>
    </div>
  );
};

interface ObjectPropertyProps {
  property: string;
  value: unknown;
}

export const ObjectProperty = (props: ObjectPropertyProps) => {
  const { property, value } = props;

  return (
    <Split key={uuid()} className="response-viewer__property">
      {property.length > 0 && (
        <SplitItem className="response-viewer__property__name" key="property-name">
          {property}:
        </SplitItem>
      )}
      <SplitItem className="response-viewer__property__value" key="property-value">
        <FormattedValue value={value} />
      </SplitItem>
    </Split>
  );
};

interface FormattedValueProps {
  value: unknown;
}

const FormattedValue = (props: FormattedValueProps) => {
  const { value } = props;
  let formattedValue;

  switch (typeof value) {
    case "number":
    case "bigint":
    case "string":
      formattedValue = value;
      break;
    case "boolean":
      formattedValue = value.toString();
      break;
    case "object":
      if (Array.isArray(value)) {
        formattedValue = <FormattedList valueList={value} />;
      }
      break;
    default:
      formattedValue = "";
      break;
  }

  return (
    <>
      {value === null && <span className="response-viewer__no-value">&ndash;</span>}
      {value && <span>{formattedValue}</span>}
    </>
  );
};

interface FormattedListProps {
  valueList: Array<unknown>;
}
const FormattedList = (props: FormattedListProps) => {
  const { valueList } = props;

  if (valueList.length === 0) {
    return <span className="response-viewer__no-value">&ndash;</span>;
  }
  return (
    <span className="formatted-list">
      {valueList.map((item, index) => (
        <React.Fragment key={uuid()}>
          <FormattedValue value={item} key={uuid()} />
          {index < valueList.length - 1 && (
            <span key={uuid()}>
              ,<br />
            </span>
          )}
        </React.Fragment>
      ))}
    </span>
  );
};

export default ResponseViewer;
