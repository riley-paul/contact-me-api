import React from "react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/app/components/ui/sidebar";
import type { ProjectSelect } from "@/lib/types";
import { Link, linkOptions } from "@tanstack/react-router";
import useIsLinkActive from "@/app/hooks/use-is-link-active";

type Props = { projects: ProjectSelect[] };

const ProjectMenuItem: React.FC<{ project: ProjectSelect }> = ({ project }) => {
  const link = linkOptions({
    to: "/projects/$projectId",
    params: { projectId: project.id },
  });

  const isActive = useIsLinkActive(link);

  return (
    <SidebarMenuItem key={project.name}>
      <SidebarMenuButton asChild isActive={isActive}>
        <Link {...link} title={project.name}>
          <span>{project.name}</span>
        </Link>
      </SidebarMenuButton>
      {/*<DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuAction showOnHover>
            <MoreHorizontal />
            <span className="sr-only">More</span>
          </SidebarMenuAction>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56 rounded-lg"
          side={isMobile ? "bottom" : "right"}
          align={isMobile ? "end" : "start"}
        >
          <DropdownMenuItem>
            <StarOff className="text-muted-foreground" />
            <span>Remove from Favorites</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link className="text-muted-foreground" />
            <span>Copy Link</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <ArrowUpRight className="text-muted-foreground" />
            <span>Open in New Tab</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Trash2 className="text-muted-foreground" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>*/}
    </SidebarMenuItem>
  );
};

const NavProjects: React.FC<Props> = ({ projects }) => {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((project) => (
          <ProjectMenuItem key={project.id} project={project} />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
};

export default NavProjects;
