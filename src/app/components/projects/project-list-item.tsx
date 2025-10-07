import useIsLinkActive from "@/app/hooks/use-is-link-active";
import { ACCENT_COLOR } from "@/app/lib/constants";
import type { ProjectSelect } from "@/lib/types";
import { Button, Heading, Text } from "@radix-ui/themes";
import { Link, linkOptions } from "@tanstack/react-router";
import React from "react";

type Props = { project: ProjectSelect };

const ProjectListItem: React.FC<Props> = ({ project }) => {
  const link = linkOptions({
    to: "/projects/$projectId",
    params: { projectId: project.id },
  });

  const isActive = useIsLinkActive(link);

  return (
    <Button
      asChild
      className="m-0 grid justify-start px-3 py-2 text-left h-auto gap-0 font-normal text-gray-12"
      variant={isActive ? "solid" : "ghost"}
      color={isActive ? ACCENT_COLOR : "gray"}
    >
      <Link {...link}>
        <Heading size="3" weight="medium">
          {project.name}
        </Heading>
        <Text size="1" color="gray" truncate>
          {project.description}
        </Text>
      </Link>
    </Button>
  );
};

export default ProjectListItem;
