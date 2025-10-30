import type { ProjectSelect } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Badge } from "@radix-ui/themes";
import type { ClassValue } from "clsx";
import React from "react";

type Props = { project: ProjectSelect; className?: ClassValue };

const ProjectTags: React.FC<Props> = ({ project, className }) => {
  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      <Badge>{project.messageCount} messages</Badge>
      <Badge color="gray" className="font-mono">
        {project.identifier}
      </Badge>
    </div>
  );
};

export default ProjectTags;
