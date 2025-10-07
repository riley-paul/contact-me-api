import { IconButton, Separator, Tooltip } from "@radix-ui/themes";
import { Link, type LinkOptions } from "@tanstack/react-router";
import {
  DraftingCompassIcon,
  HomeIcon,
  MailIcon,
  MessageCircleIcon,
} from "lucide-react";
import React from "react";
import { ACCENT_COLOR } from "../lib/constants";
import UserMenu from "./user-menu";

const NavLink: React.FC<
  React.PropsWithChildren<{
    linkOptions: LinkOptions;
    title: string;
  }>
> = ({ linkOptions, title, children }) => {
  return (
    <Tooltip side="right" content={title}>
      <Link {...linkOptions}>
        {({ isActive }) => (
          <IconButton
            size="3"
            variant={isActive ? "solid" : "soft"}
            color={isActive ? ACCENT_COLOR : "gray"}
          >
            {children}
          </IconButton>
        )}
      </Link>
    </Tooltip>
  );
};

const NavBar: React.FC = () => {
  return (
    <aside className="bg-panel flex h-screen w-14 shrink-0 flex-col items-center">
      <header className="flex h-14 items-center justify-center">
        <Link to="/">
          <div className="bg-accent-3 flex size-10 items-center justify-center rounded-full">
            <MailIcon className="text-accent-10 size-5" />
          </div>
        </Link>
      </header>
      <Separator orientation="horizontal" size="4" />
      <section className="flex flex-1 flex-col items-center gap-2 py-3">
        <NavLink title="Dashboard" linkOptions={{ to: "/" }}>
          <HomeIcon className="size-4" />
        </NavLink>
        <NavLink title="Projects" linkOptions={{ to: "/projects" }}>
          <DraftingCompassIcon className="size-4" />
        </NavLink>
        <NavLink title="Messages" linkOptions={{ to: "/messages" }}>
          <MessageCircleIcon className="size-4" />
        </NavLink>
      </section>
      <footer className="flex h-14 items-center justify-center">
        <UserMenu />
      </footer>
    </aside>
  );
};

export default NavBar;
