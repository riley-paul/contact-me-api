import { Button } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import {
  DraftingCompassIcon,
  SearchIcon,
  SearchXIcon,
} from "lucide-react";
import React from "react";
import { qProjects } from "@/app/queries";
import ProjectListItem from "./project-list-item";
import CenteredSpinner from "@/app/components/ui/centered-spinner";

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/app/components/ui/empty";

type Props = {
  search: string;
  clearSearch: () => void;
};

const ProjectList: React.FC<Props> = ({ search, clearSearch }) => {
  const { data: projects, status } = useQuery(qProjects(search));

  switch (status) {
    case "pending":
      return <CenteredSpinner />;
    case "error":
      return "error loading projects";
    case "success":
      if (projects?.length === 0) {
        if (search) {
          return (
            <Empty className="h-full">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <SearchIcon />
                </EmptyMedia>
                <EmptyTitle>No Search Results</EmptyTitle>
                <EmptyDescription>
                  We couldn&apos;t find any projects matching &quot;{search}
                  &quot;.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button
                  onClick={clearSearch}
                  variant="outline"
                  color="gray"
                  size="1"
                >
                  <SearchXIcon className="size-3" />
                  Clear search
                </Button>
              </EmptyContent>
            </Empty>
          );
        }

        return (
          <Empty className="h-full">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <DraftingCompassIcon />
              </EmptyMedia>
              <EmptyTitle>No Search Results</EmptyTitle>
              <EmptyDescription>
                You haven&apos;t created any projects yet.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        );
      }
      return (
        <ul className="flex flex-col gap-1 overflow-auto p-3">
          {projects.map((project) => (
            <ProjectListItem key={project.id} project={project} />
          ))}
        </ul>
      );
  }
};

export default ProjectList;
