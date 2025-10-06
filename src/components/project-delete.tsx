import { Button } from "@radix-ui/themes";
import { Trash2Icon } from "lucide-react";
import React from "react";

const ProjectDelete: React.FC = () => {
  return (
    <Button color="red" variant="surface">
      <Trash2Icon className="size-4" />
      Delete
    </Button>
  );
};

export default ProjectDelete;
