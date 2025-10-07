import { Trash2Icon } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";

const ProjectDelete: React.FC = () => {
  return (
    <Button variant="destructive">
      <Trash2Icon className="size-4" />
      Delete
    </Button>
  );
};

export default ProjectDelete;
