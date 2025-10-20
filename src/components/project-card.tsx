import type { ProjectSelect } from "@/lib/types";
import { Badge, Card, Heading, Text } from "@radix-ui/themes";
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
        <footer className="mt-4 flex flex-wrap gap-3">
          <Badge>{project.messageCount} messages</Badge>
          <Badge color="gray" className="font-mono">
            {project.identifier}
          </Badge>
        </footer>
      </a>
    </Card>
  );
};

export default ProjectCard;
