import type { ProjectSelect } from '@/lib/types';
import { Card } from '@radix-ui/themes';
import React from 'react';

type Props = { project: ProjectSelect }

const ProjectCard: React.FC<Props> = ({ project }) => {
  return <a>
    <Card>
      {project.name}
    </Card>
  </a>
  ;
};

export default ProjectCard;