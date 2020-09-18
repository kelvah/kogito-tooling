import * as React from "react";
import { useEffect, useState } from "react";
import { DecisionResult, evaluationStatusStrings, ResponseMessage, ResponsePayload } from "../ModelTester/ModelTester";
import { v4 as uuid } from "uuid";
import {
  Alert,
  AlertProps,
  Badge,
  Button,
  Card,
  CardTitle,
  CardBody,
  CardFooter,
  Flex,
  FlexItem,
  Label,
  LabelProps,
  Grid,
  GridItem,
  Stack,
  StackItem,
  Title,
  Tooltip
} from "@patternfly/react-core";
import {
  ArrowRightIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  EnvelopeIcon,
  ErrorCircleOIcon,
  FastForwardIcon,
  HourglassHalfIcon,
  MinusCircleIcon,
  OutlinedQuestionCircleIcon
} from "@patternfly/react-icons";
import ResponseViewer, { isObjectOrArrayOfObjects, ObjectProperty } from "../ResponseViewer/ResponseViewer";
import "./OutputViewer.scss";
import FeaturesScoreChart, { FeatureScores } from "../../FeaturesScoreChart/FeaturesScoreChart";
import FeaturesScoreTable from "../../FeaturesScoreTable/FeaturesScoreTable";

interface OutputViewerProps {
  responsePayload: ResponsePayload;
}

const OutputViewer = ({ responsePayload }: OutputViewerProps) => {
  const [viewSection, setViewSection] = useState(1);
  const [decisionDetail, setDecisionDetail] = useState<DecisionResult | null>(null);

  const viewDecision = (decisionId: string) => {
    const decision = responsePayload.decisionResults.find(item => item.decisionId === decisionId);
    if (decision) {
      setDecisionDetail(decision);
      setViewSection(2);
    }
  };
  const backToResults = () => {
    setViewSection(1);
    setTimeout(() => {
      setDecisionDetail(null);
    }, 300);
  };
  useEffect(() => {
    setViewSection(1);
    setDecisionDetail(null);
  }, [responsePayload]);

  const featureScores = [
    {
      featureName: "Age",
      featureScore: -0.08937896629080377
    },
    {
      featureName: "State",
      featureScore: 0.21272743757961554
    },
    {
      featureName: "Points",
      featureScore: 0.23272743757961554
    },
    {
      featureName: "City",
      featureScore: 0.6780527129423648
    },
    {
      featureName: "Code",
      featureScore: 0.7033802543201365
    },
    {
      featureName: "Speed Limit",
      featureScore: 0.7693802543201365
    },
    {
      featureName: "Actual Speed",
      featureScore: -0.9240811677386516
    }
  ] as FeatureScores[];

  return (
    <section className="output-viewer">
      <div className={`output-viewer__content ${viewSection === 2 ? "output-viewer__content--second-panel" : ""}`}>
        <Grid>
          <GridItem span={6}>
            <div className="output-viewer__content__panel">
              <div className="output-viewer__section">
                <Title headingLevel="h4" className="output-viewer__section__title">
                  Decision Results
                </Title>
                <Stack hasGutter={true}>
                  {responsePayload.decisionResults &&
                    responsePayload.decisionResults.map(decision => {
                      return (
                        <StackItem key={decision.decisionId}>
                          <Card isCompact={true}>
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
                                <FlexItem align={{ default: "alignLeft" }}>
                                  <EvaluationStatusLabel status={decision.evaluationStatus} />
                                </FlexItem>
                                <FlexItem align={{ default: "alignLeft" }}>
                                  <Label
                                    color={decision.messages.length === 0 ? "grey" : "blue"}
                                    icon={<EnvelopeIcon />}
                                    title="Messages"
                                  >
                                    {decision.messages.length}
                                  </Label>
                                </FlexItem>
                                <FlexItem align={{ default: "alignRight" }}>
                                  <Button
                                    variant="link"
                                    icon={<ArrowRightIcon />}
                                    iconPosition="right"
                                    onClick={() => viewDecision(decision.decisionId)}
                                  >
                                    View More Info
                                  </Button>
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
                <MessagesSection messages={responsePayload.messages} />
              </div>
            </div>
          </GridItem>
          <GridItem span={6}>
            <div className="output-viewer__content__panel">
              {decisionDetail && (
                <>
                  <div className="output-viewer__section">
                    <Button
                      variant="link"
                      isInline={true}
                      icon={<ArrowLeftIcon />}
                      iconPosition="left"
                      onClick={backToResults}
                    >
                      Back to Results
                    </Button>
                  </div>
                  <div className="output-viewer__section">
                    <Title headingLevel="h4" className="output-viewer__section__title">
                      Decision Outcome
                    </Title>
                    <Stack hasGutter={true}>
                      <StackItem>
                        <Card isCompact={true} isFlat={true}>
                          <CardTitle>{decisionDetail.decisionName}</CardTitle>
                          <CardBody>
                            {isObjectOrArrayOfObjects(decisionDetail.result) && (
                              <ResponseViewer source={decisionDetail.result as object} />
                            )}
                            {!isObjectOrArrayOfObjects(decisionDetail.result) && (
                              <ObjectProperty property="" value={decisionDetail.result} />
                            )}
                          </CardBody>
                        </Card>
                      </StackItem>
                    </Stack>
                  </div>
                  <div className="output-viewer__section">
                    <MessagesSection messages={decisionDetail.messages} />
                  </div>
                  <div className="output-viewer__section">
                    <Title headingLevel="h4" className="output-viewer__section__title">
                      Explanation
                    </Title>
                    <Stack hasGutter={true}>
                      <StackItem>
                        <Card isCompact={true} isFlat={true}>
                          <CardTitle>
                            Explanation Chart{" "}
                            <Tooltip
                              position="top"
                              content={
                                <div>
                                  The explanation chart displays each input influencing the decision result, with a
                                  positive or negative score.
                                </div>
                              }
                            >
                              <OutlinedQuestionCircleIcon style={{ color: "var(--pf-global--primary-color--100)" }} />
                            </Tooltip>
                          </CardTitle>
                          <FeaturesScoreChart featuresScore={featureScores} />
                        </Card>
                      </StackItem>
                      <StackItem>
                        <Card isCompact={true} isFlat={true}>
                          <CardTitle>Explanation Scores</CardTitle>
                          <CardBody>
                            <FeaturesScoreTable featuresScore={featureScores} />
                          </CardBody>
                        </Card>
                      </StackItem>
                    </Stack>
                  </div>
                </>
              )}
            </div>
          </GridItem>
        </Grid>
      </div>
    </section>
  );
};

export default OutputViewer;

interface EvaluationStatusProps {
  status: evaluationStatusStrings;
}

const EvaluationStatusLabel = ({ status }: EvaluationStatusProps) => {
  let color;
  let icon;
  switch (status) {
    case "EVALUATING":
      icon = <HourglassHalfIcon />;
      color = "orange";
      break;
    case "FAILED":
      icon = <ErrorCircleOIcon />;
      color = "red";
      break;
    case "SKIPPED":
      icon = <FastForwardIcon />;
      color = "red";
      break;
    case "NOT_EVALUATED":
      icon = <MinusCircleIcon />;
      color = "red";
      break;
    case "SUCCEEDED":
      icon = <CheckCircleIcon />;
      color = "green";
      break;
  }
  return (
    <Label
      color={color as LabelProps["color"]}
      icon={icon}
      style={{ textTransform: "capitalize" }}
      variant={"outline"}
      title="Evaluation Status"
    >
      {status.toLocaleLowerCase()}
    </Label>
  );
};

interface MessagesSectionProps {
  messages: ResponseMessage[];
}

const MessagesSection = ({ messages }: MessagesSectionProps) => {
  return (
    <>
      <Title headingLevel="h4" className="output-viewer__section__title">
        <span style={{ marginRight: 3 }}>Messages</span> <Badge isRead={true}>{messages.length}</Badge>
      </Title>
      {messages.length > 0 && (
        <Stack hasGutter={true}>
          {messages &&
            messages.map(message => {
              return (
                <StackItem key={uuid()}>
                  <MessageAlert message={message} />
                </StackItem>
              );
            })}
        </Stack>
      )}
    </>
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
    case "INFO":
      type = "info";
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