import useIsLinkActive from "@/app/hooks/use-is-link-active";
import { Button } from "@radix-ui/themes";
import { Link, type LinkOptions } from "@tanstack/react-router";
import React from "react";

type Props = React.PropsWithChildren<{ linkOptions: LinkOptions }>;

const SidebarItem: React.FC<Props> = ({ children, linkOptions }) => {
  return (
    <Link
      {...linkOptions}
      className="px-3 py-2 text-sm"
      activeProps={{ className: "bg-accent-3" }}
    >
      {children}
    </Link>
  );
};

export default SidebarItem;
