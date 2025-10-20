import type { ProjectSelect } from "@/lib/types";
import { Card, Heading, Text } from "@radix-ui/themes";
import React from "react";
import ProjectTags from "./project-tags";
import { Link } from "@tanstack/react-router";

type Props = { project: ProjectSelect };

const ProjectCard: React.FC<Props> = ({ project }) => {
  return (
    <Card asChild size="2">
      <Link to="/projects/$projectId" params={{ projectId: project.id }}>
        <Heading as="h2" size="4">
          {project.name}
        </Heading>
        <Text size="2" color="gray" className="line-clamp-2">
          {project.description}
        </Text>
        <ProjectTags className="pt-4" project={project} />
      </Link>
    </Card>
  );
};

export default ProjectCard;
