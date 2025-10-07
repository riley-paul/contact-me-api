import type { ProjectSelect } from "@/lib/types";
import { KeyIcon } from "lucide-react";
import React from "react";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";

type Props = { project: ProjectSelect };

const ProjectCard: React.FC<Props> = ({ project }) => {
  return (
    <Item asChild variant="outline">
      <a href={`/projects/${project.id}`}>
        <ItemMedia variant="icon">
          <KeyIcon className="size-4" />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{project.name}</ItemTitle>
          <ItemDescription>{project.description}</ItemDescription>
        </ItemContent>
      </a>
    </Item>
  );
};

export default ProjectCard;
