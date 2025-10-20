import { Button } from "@radix-ui/themes";
import { PlusIcon } from "lucide-react";
import React from "react";

const ProjectAddLink: React.FC = () => {
  return (
    <Button variant="solid" asChild className="not-prose">
      <a href="/projects/new">
        <PlusIcon className="size-5" />
        New Project
      </a>
    </Button>
  );
};

export default ProjectAddLink;
