import * as React from "react";
import { EvaluationStatus, ResponseMessage, ResponsePayload } from "../ModelTester/ModelTester";
import { v4 as uuid } from "uuid";
import {
  Alert,
  AlertProps,
  Card,
  CardTitle,
  CardBody,
  CardFooter,
  Flex,
  FlexItem,
  Label,
  LabelProps,
  Stack,
  StackItem,
  Title
} from "@patternfly/react-core";
import { CheckCircleIcon, WarningTriangleIcon, InfoCircleIcon } from "@patternfly/react-icons";
import ResponseViewer, { isObjectOrArrayOfObjects, ObjectProperty } from "../ResponseViewer/ResponseViewer";
import "./OutputViewer.scss";

interface OutputViewerProps {
  responsePayload: ResponsePayload;
}

const OutputViewer = ({ responsePayload }: OutputViewerProps) => {
  return (
    <section className="output-viewer">
      <div className="output-viewer__section">
        <Title headingLevel="h4" className="output-viewer__section__title">
          Decision Results
        </Title>
        <Stack hasGutter={true}>
          {responsePayload.decisionResults &&
            responsePayload.decisionResults.map(decision => {
              return (
                <StackItem key={decision.decisionId}>
                  <Card isCompact={true} isHoverable={true}>
                    <CardTitle>{decision.decisionName}</CardTitle>
                    <CardBody>
                      {isObjectOrArrayOfObjects(decision.result) && (
                        <ResponseViewer source={decision.result as object} />
                      )}
                      {!isObjectOrArrayOfObjects(decision.result) && (
                        <ObjectProperty property="" value={decision.result} />
                      )}
                    </CardBody>
                    <CardFooter>
                      <Flex>
                        <FlexItem align={{ default: "alignRight" }}>
                          <EvaluationStatusLabel status={decision.evaluationStatus} />
                        </FlexItem>
                      </Flex>
                    </CardFooter>
                  </Card>
                </StackItem>
              );
            })}
        </Stack>
      </div>
      <div className="output-viewer__section">
        <Title headingLevel="h4" className="output-viewer__section__title">
          Messages
        </Title>
        <Stack hasGutter={true}>
          {responsePayload.messages &&
            responsePayload.messages.map(message => {
              return (
                <StackItem key={uuid()}>
                  <MessageAlert message={message} />
                </StackItem>
              );
            })}
        </Stack>
      </div>
    </section>
  );
};

export default OutputViewer;

interface EvaluationStatusProps {
  status: EvaluationStatus;
}

const EvaluationStatusLabel = ({ status }: EvaluationStatusProps) => {
  let color;
  let icon;
  switch (status) {
    case "SUCCEEDED":
      color = "green";
      icon = <CheckCircleIcon />;
      break;
    case "FAILED":
      color = "orange";
      icon = <WarningTriangleIcon />;
      break;
    default:
      color = "blue";
      icon = <InfoCircleIcon />;
  }
  return (
    <Label color={color as LabelProps["color"]} icon={icon} style={{ textTransform: "capitalize" }} variant={"outline"}>
      {status.toLocaleLowerCase()}
    </Label>
  );
};

interface MessageAlertProps {
  message: ResponseMessage;
}

const MessageAlert = ({ message }: MessageAlertProps) => {
  let type;
  const title = message.messageType.toLocaleLowerCase().replace(/_/g, " ");
  switch (message.level) {
    case "WARNING":
      type = "warning";
      break;
    case "ERROR":
      type = "danger";
      break;
    default:
      type = "info";
      break;
  }
  return (
    <Alert isInline={true} variant={type as AlertProps["variant"]} title={title}>
      {message.message}
    </Alert>
  );
};
