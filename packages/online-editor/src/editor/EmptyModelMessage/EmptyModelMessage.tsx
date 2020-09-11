import * as React from "react";
import { EmptyState, EmptyStateBody, EmptyStateIcon, Title } from "@patternfly/react-core";
import { ProjectDiagramIcon } from "@patternfly/react-icons";

const EmptyModelMessage = () => {
  return (
    <EmptyState variant={"small"} style={{ minHeight: "380px" }}>
      <EmptyStateIcon icon={ProjectDiagramIcon} />
      <Title headingLevel="h3" size="lg">
        Empty Model
      </Title>
      <EmptyStateBody>
        It seems there are no endpoints to test right now.
        <br />
        Go back editing the model.
      </EmptyStateBody>
    </EmptyState>
  );
};

export default EmptyModelMessage;
