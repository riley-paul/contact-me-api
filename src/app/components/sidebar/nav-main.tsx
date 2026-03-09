import React from "react";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import { MailIcon, PlusIcon } from "lucide-react";
import { Link } from "@tanstack/react-router";
import useIsLinkActive from "@/app/hooks/use-is-link-active";

const NavMain: React.FC = () => {
  const isAllMessages = useIsLinkActive({ to: "/messages" });

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton variant="outline">
          <PlusIcon />
          New Project
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={isAllMessages}>
          <Link to="/messages">
            <MailIcon />
            Messages
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default NavMain;
