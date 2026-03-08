import useIsLinkActive from "@/app/hooks/use-is-link-active";
import { ACCENT_COLOR } from "@/lib/constants";
import type { ProjectSelect, UserSelect } from "@/lib/types";
import { Button, Heading, IconButton, Text } from "@radix-ui/themes";
import { Link, type LinkOptions } from "@tanstack/react-router";
import { useAtom } from "jotai";
import {
  HomeIcon,
  MailIcon,
  PhoneIcon,
  SidebarCloseIcon,
  SidebarOpenIcon,
} from "lucide-react";
import React from "react";
import UserMenu from "../user-menu";
import { cn } from "@/lib/utils";
import { atomWithStorage } from "jotai/utils";
import ProjectAdder from "../project-adder";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/app/components/ui/sidebar";
import NavUser from "./nav-user";

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
      <SidebarHeader>{/*<TeamSwitcher teams={data.teams} />*/}</SidebarHeader>
      <SidebarContent>
        {/*<NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />*/}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

export default AppSidebar;
