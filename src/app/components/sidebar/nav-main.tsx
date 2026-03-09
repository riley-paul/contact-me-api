import React from "react";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import { MailIcon, PlusIcon } from "lucide-react";
import { Link } from "@tanstack/react-router";
import useIsLinkActive from "@/app/hooks/use-is-link-active";
import { useAtom } from "jotai";
import { projectAdderOpenAtom } from "../project-adder";

const NavMain: React.FC = () => {
  const isAllMessages = useIsLinkActive({ to: "/messages" });

  const [, setOpen] = useAtom(projectAdderOpenAtom);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton variant="outline" onClick={() => setOpen(true)}>
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
