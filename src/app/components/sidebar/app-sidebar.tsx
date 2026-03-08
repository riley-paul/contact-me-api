import type { ProjectSelect, UserSelect } from "@/lib/types";
import React from "react";
import { atomWithStorage } from "jotai/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/app/components/ui/sidebar";
import NavUser from "./nav-user";
import NavProjects from "./nav-projects";
import NavLogo from "./nav-logo";
import NavMain from "./nav-main";

export const sidebarOpenAtom = atomWithStorage(
  "sidebar-open",
  true,
  undefined,
  { getOnInit: true },
);

type Props = {
  projects: ProjectSelect[];
  user: UserSelect;
};

const AppSidebar: React.FC<Props> = ({ projects, user }) => {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <NavLogo />
        <NavMain />
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

export default AppSidebar;
