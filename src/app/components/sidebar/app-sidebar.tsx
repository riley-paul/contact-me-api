import type { ProjectSelect, UserSelect } from "@/lib/types";
import React from "react";
import { atomWithStorage } from "jotai/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/app/components/ui/sidebar";
import NavUser from "./nav-user";
import { PhoneIcon } from "lucide-react";
import { Link } from "@tanstack/react-router";
import NavProjects from "./nav-projects";

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
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <PhoneIcon className="size-4" />
                </div>
                <span className="text-lg font-bold">Contactulator</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
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
