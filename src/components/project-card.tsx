import type { ProjectSelect } from "@/lib/types";
import { Card, Text } from "@radix-ui/themes";
import React from "react";

type Props = { project: ProjectSelect };

const ProjectCard: React.FC<Props> = ({ project }) => {
  return (
    <a href={`/projects/${project.id}`}>
      <Card size="2">
        <Text as="div" size="2" weight="bold">
          {project.name}
        </Text>
        <Text as="div" size="2" color="gray">
          {project.description}
        </Text>
      </Card>
    </a>
  );
};

export default ProjectCard;
