import React from "react";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import { PhoneIcon } from "lucide-react";
import { Link } from "@tanstack/react-router";

const NavLogo: React.FC = () => {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Link to="/" className="flex items-center gap-2 p-2">
          <div className="text-sidebar-primary flex aspect-square items-center justify-center rounded-lg">
            <PhoneIcon className="size-5" />
          </div>
          <span className="text-base font-bold">Contactulator</span>
        </Link>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default NavLogo;
