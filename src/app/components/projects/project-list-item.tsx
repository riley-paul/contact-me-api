import useIsLinkActive from "@/app/hooks/use-is-link-active";
import { ACCENT_COLOR } from "@/app/lib/constants";
import { cn } from "@/lib/client/utils";
import type { ProjectSelect } from "@/lib/types";
import { Badge, Button, Heading, Text } from "@radix-ui/themes";
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
    <Link
      {...link}
      className={cn(
        "hover:bg-gray-2 rounded-3 flex items-center gap-1 px-3 py-2",
        "transition-colors ease-in",
        isActive && "bg-accent-9 hover:bg-accent-10",
      )}
    >
      <section className="grid">
        <Heading size="3" weight="medium">
          {project.name}
        </Heading>
        <Text size="1" color="gray" truncate>
          {project.description}
        </Text>
      </section>
      <Badge
        variant={isActive ? "solid" : "soft"}
        color={isActive ? ACCENT_COLOR : "gray"}
      >
        {project.messageCount}
      </Badge>
    </Link>
  );
};

export default ProjectListItem;
