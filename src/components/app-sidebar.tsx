import type { ProjectSelect, UserSelect } from "@/lib/types";
import React, { useEffect, useRef } from "react";
import Logo from "./logo";
import UserAvatar from "./user-avatar";
import { Button, ScrollArea, Separator, Text } from "@radix-ui/themes";
import { PlusIcon } from "lucide-react";
import { ACCENT_COLOR } from "@/lib/client/constants";
import { cn } from "@/lib/client/utils";

type Props = { user: UserSelect; projects: ProjectSelect[]; pathname: string };

const ProjectLink: React.FC<{ project: ProjectSelect; pathname: string }> = ({
  project,
  pathname,
}) => {
  const ref = useRef<HTMLAnchorElement>(null);
  const href = `/projects/${project.id}`;
  const isActive = pathname === href;

  useEffect(() => {
    if (isActive) {
      ref.current?.scrollIntoView({ block: "nearest" });
    }
  }, [isActive]);

  return (
    <a
      ref={ref}
      href={href}
      className={cn(
        "hover:bg-gray-3 flex h-9 items-center border-l-4 border-l-transparent px-3",
        isActive && "border-l-accent-7 bg-accent-1 hover:bg-accent-2",
      )}
    >
      <Text
        color={isActive ? ACCENT_COLOR : "gray"}
        weight={isActive ? "medium" : "regular"}
        size="2"
      >
        {project.name}
      </Text>
    </a>
  );
};

const AppSidebar: React.FC<Props> = ({ user, projects, pathname }) => {
  return (
    <aside className="bg-panel flex h-full w-[250px] flex-col overflow-hidden">
      <header className="flex h-14 shrink-0 items-center justify-between px-3">
        <Logo />
        <a href="/settings">
          <UserAvatar user={user} />
        </a>
      </header>
      <Separator size="4" />
      <section className="flex-1 overflow-auto">
        <ScrollArea>
          <ul className="grid py-2">
            {projects.map((project) => (
              <ProjectLink
                key={project.id}
                project={project}
                pathname={pathname}
              />
            ))}
          </ul>
        </ScrollArea>
      </section>
      <Separator size="4" />
      <footer className="flex h-14 w-full shrink-0 items-center px-3">
        <a href="/projects/new" className="w-full">
          <Button className="w-full!" variant="surface">
            <PlusIcon className="size-4" />
            New Project
          </Button>
        </a>
      </footer>
    </aside>
  );
};

export default AppSidebar;
