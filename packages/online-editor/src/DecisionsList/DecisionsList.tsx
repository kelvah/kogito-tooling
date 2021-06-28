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
import { Table, TableHeader, TableBody, IRow } from "@patternfly/react-table";
import { useEffect, useState } from "react";
import { Decision } from "../editor/DeploymentConsole/useDecisionStatus";
import FormattedDate from "../editor/FormattedDate/FormattedDate";
import {
  Bullseye,
  Button,
  ClipboardCopy,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  Skeleton,
  Title,
} from "@patternfly/react-core";
import DeploymentStatusLabel from "../editor/DeploymentStatusLabel/DeploymentStatusLabel";
import useAxiosRequest from "../common/useAxiosRequest";
import { HistoryIcon, WarningTriangleIcon } from "@patternfly/react-icons";

interface DecisionsListProps {
  onOpenDecision: (fileName: string, fileExtension: string, fileUrl: string) => void;
}

const DecisionsList = ({ onOpenDecision }: DecisionsListProps) => {
  const columns = ["Name", "Version", "Description", "Status", "Published at", "Endpoint"];
  const [rows, setRows] = useState<IRow[]>(skeletonRows(8));

  const [loadDecisions, decisions] = useAxiosRequest<DecisionsResponse>({
    url: `/decisions`,
    method: "get",
  });

  useEffect(() => {
    loadDecisions();
  }, []);

  useEffect(() => {
    switch (decisions.status) {
      case "SUCCESS":
        if (decisions.data.items.length) {
          setRows(prepareRows(decisions.data.items));
        } else {
          setRows(noDecisions(columns.length));
        }
        break;
      case "LOADING":
        setRows(skeletonRows(8));
        break;
      case "FAILURE":
        setRows(loadingError(columns.length));
        break;
    }
  }, [decisions]);

  const openDecision = (decision: Decision) => {
    onOpenDecision(decision.name, "dmn", decision.model.href);
  };

  const prepareRows = (rowsData: Decision[]) => {
    return rowsData.map((decision) => ({
      cells: [
        {
          title: (
            <>
              <Button
                variant="link"
                isInline={true}
                onClick={() => openDecision(decision)}
                isDisabled={decision.status === "DELETED"}
              >
                {decision.name}
              </Button>
            </>
          ),
        },
        decision.version,
        decision.description,
        {
          title: (
            <>
              <DeploymentStatusLabel status={decision.status} />
            </>
          ),
        },
        {
          title: <>{decision.published_at ? <FormattedDate date={decision.published_at} /> : <span>-</span>}</>,
        },
        {
          title: (
            <>
              {decision.current_endpoint ?? decision.version_endpoint ? (
                <ClipboardCopy isReadOnly={true} style={{ maxWidth: 400 }} exitDelay={100}>
                  {decision.current_endpoint ?? decision.version_endpoint}
                </ClipboardCopy>
              ) : (
                <span>{decision.status === "DELETED" ? "-" : "Not yet available"}</span>
              )}
            </>
          ),
        },
      ],
    }));
  };

  return (
    <section>
      <Table aria-label="Simple Table" cells={columns} rows={rows} variant={"compact"}>
        <TableHeader />
        <TableBody />
      </Table>
    </section>
  );
};

export default DecisionsList;

const skeletonRows = (rowsCount: number) => {
  const skeletons = [];
  for (let j = 0; j < rowsCount; j++) {
    const cells = [];
    // name
    cells.push({
      title: <Skeleton width={j % 2 ? "300px" : "200px"} />,
    });
    //version
    cells.push({
      title: <Skeleton width={"40px"} />,
    });
    //description
    cells.push({
      title: <Skeleton width={"100px"} />,
    });
    //status
    cells.push({
      title: <Skeleton width={"60px"} />,
    });
    //creation date time
    cells.push({
      title: <Skeleton width={"400px"} />,
    });
    //endpoint
    cells.push({
      title: <Skeleton width={"200px"} />,
    });
    const skeletonRow: IRow = {
      cells,
    };
    skeletons.push(skeletonRow);
  }
  return skeletons;
};

const noDecisions = (colSpan: number) => {
  return [
    {
      heightAuto: true,
      cells: [
        {
          props: { colSpan },
          title: (
            <Bullseye>
              <EmptyState>
                <EmptyStateIcon icon={HistoryIcon} />
                <Title headingLevel="h5" size="lg">
                  No decisions found
                </Title>
                <EmptyStateBody>It looks like there are no decisions. Go create a new one!</EmptyStateBody>
              </EmptyState>
            </Bullseye>
          ),
        },
      ],
    },
  ];
};

const loadingError = (colSpan: number) => {
  return [
    {
      heightAuto: true,
      cells: [
        {
          props: { colSpan },
          title: (
            <Bullseye>
              <EmptyState>
                <EmptyStateIcon icon={WarningTriangleIcon} />
                <Title headingLevel="h5" size="lg">
                  Loading Error
                </Title>
                <EmptyStateBody>
                  We are unable to retrieve the decisions list right now. Try again later.
                </EmptyStateBody>
              </EmptyState>
            </Bullseye>
          ),
        },
      ],
    },
  ];
};

interface DecisionsResponse {
  items: Decision[];
  kind: "DecisionList";
  page: number;
  size: number;
  total: number;
}
