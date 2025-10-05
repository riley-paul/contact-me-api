import type { ProjectSelect } from "@/lib/types";
import { Card, Text } from "@radix-ui/themes";
import { KeyIcon } from "lucide-react";
import React from "react";

type Props = { project: ProjectSelect };

const ProjectCard: React.FC<Props> = ({ project }) => {
  return (
    <Card size="2" asChild>
      <a href={`/projects/${project.id}`}>
        <article className="flex items-center gap-3">
          <div className="bg-grayA-3 flex size-8 items-center justify-center rounded-full">
            <KeyIcon className="size-4" />
          </div>
          <section>
            <Text as="div" size="2" weight="bold">
              {project.name}
            </Text>
            {project.description && (
              <Text as="div" size="2" color="gray">
                {project.description}
              </Text>
            )}
          </section>
        </article>
      </a>
    </Card>
  );
};

export default ProjectCard;
