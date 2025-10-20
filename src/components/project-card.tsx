import type { ProjectSelect } from "@/lib/types";
import { Card, Heading, Text } from "@radix-ui/themes";
import React from "react";

type Props = { project: ProjectSelect };

const ProjectCard: React.FC<Props> = ({ project }) => {
  return (
    <Card asChild>
      <a href={`/projects/${project.id}`}>
        <Heading as="h2" size="3">
          {project.name}
        </Heading>
        <Text size="2" color="gray" className="line-clamp-2">
          {project.description}
        </Text>
      </a>
    </Card>
  );
};

export default ProjectCard;
