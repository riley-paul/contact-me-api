import { qProjects } from "@/lib/client/queries";
import { useSuspenseQuery } from "@tanstack/react-query";
import React from "react";

const ProjectList: React.FC = () => {
  const { data: projects } = useSuspenseQuery(qProjects);

  return (
    <section>
      {projects.map((project) => (
        <div>{project.name}</div>
      ))}
    </section>
  );
};

export default ProjectList;
