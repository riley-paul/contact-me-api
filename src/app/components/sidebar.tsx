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
  PlusIcon,
  SidebarCloseIcon,
  SidebarOpenIcon,
} from "lucide-react";
import React from "react";
import UserMenu from "./user-menu";
import { cn } from "@/lib/utils";
import { atomWithStorage } from "jotai/utils";

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

const SidebarLink: React.FC<React.PropsWithChildren<LinkOptions>> = ({
  children,
  ...rest
}) => {
  const isActive = useIsLinkActive(rest);
  return (
    <Button
      asChild
      variant={isActive ? "solid" : "ghost"}
      color={isActive ? ACCENT_COLOR : "gray"}
      className="m-0 flex h-auto justify-start gap-2.5 px-3 py-1.5 text-left transition-colors ease-in"
    >
      <Link {...rest}>{children}</Link>
    </Button>
  );
};

const SidebarSection: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <section className="grid gap-2 py-3">{children}</section>;
};

const SidebarItems: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <div className="grid gap-1">{children}</div>;
};

const Sidebar: React.FC<Props> = ({ projects, user }) => {
  const [open, setOpen] = useAtom(sidebarOpenAtom);
  return (
    <React.Fragment>
      <div
        className="shrink-0 transition-all"
        style={{ width: open ? 280 : 0 }}
      />
      <aside
        className={cn(
          "bg-panel rounded-3 shadow-2 fixed inset-2 right-auto flex flex-col p-3 transition-all",
          !open && "translate-x-[-280px]",
        )}
        style={{ width: open ? 280 : 0 }}
      >
        <header className="flex h-8 items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 px-2">
            <PhoneIcon className="text-accent-10 size-5" />
            <Heading size="4" className="leading-tight">
              Contactulator
            </Heading>
          </Link>
          <IconButton variant="soft" onClick={() => setOpen(false)}>
            <SidebarCloseIcon className="size-4" />
          </IconButton>
        </header>

        <div className="flex-1">
          <SidebarSection>
            <SidebarItems>
              <SidebarLink to="/">
                <HomeIcon className="size-4 opacity-70" />
                Dashboard
              </SidebarLink>
              <SidebarLink to="/messages">
                <MailIcon className="size-4 opacity-70" />
                Messages
              </SidebarLink>
            </SidebarItems>
          </SidebarSection>

          <SidebarSection>
            <header className="flex items-center justify-between px-3">
              <Text size="1" className="uppercase" color="gray" weight="bold">
                Projects
              </Text>
              <IconButton size="2" variant="ghost" radius="full">
                <PlusIcon className="size-4" />
              </IconButton>
            </header>
            <SidebarItems>
              {projects.map((project) => (
                <SidebarLink
                  to="/projects/$projectId"
                  params={{ projectId: project.id }}
                  key={project.id}
                >
                  {project.name}
                </SidebarLink>
              ))}
            </SidebarItems>
          </SidebarSection>
        </div>

        <footer className="grid">
          <UserMenu user={user} />
        </footer>
      </aside>
      <div className={cn("fixed inset-0 right-auto flex items-center")}>
        <IconButton
          variant="soft"
          className={cn(
            "w-6 transition-transform ease-in",
            open && "-translate-x-6",
          )}
          style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
          onClick={() => setOpen(true)}
        >
          <SidebarOpenIcon className="size-4" />
        </IconButton>
      </div>
    </React.Fragment>
  );
};

export default Sidebar;
