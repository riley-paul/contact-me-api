import { Button, ScrollArea, Separator } from "@radix-ui/themes";
import React from "react";
import Logo from "../logo";
import UserMenu from "./user-menu";
import { useSuspenseQuery } from "@tanstack/react-query";
import { qCurrentUser, qProjects } from "@/lib/client/queries";
import { Link } from "@tanstack/react-router";
import SidebarItem from "./sidebar-item";
import SidebarHeader from "./sidebar-header";

const AppSidebar: React.FC = () => {
  const { data: user } = useSuspenseQuery(qCurrentUser);
  const { data: projects } = useSuspenseQuery(qProjects());
  if (!user) return null;

  return (
    <aside className="bg-panel border-accent-7 flex h-screen w-[250px] shrink-0 flex-col border-r">
      <header className="flex h-14 items-center px-3">
        <Logo />
      </header>
      <Separator size="4" />
      <ScrollArea>
        <article className="flex flex-1 flex-col gap-6 overflow-y-auto py-3">
          <SidebarItem linkOptions={{ to: "/messages" }}>Messages</SidebarItem>
          <section className="grid gap-2">
            <SidebarHeader>Projects</SidebarHeader>
            {projects.map((projects) => (
              <SidebarItem
                key={projects.id}
                linkOptions={{
                  to: "/projects/$projectId",
                  params: { projectId: projects.id },
                }}
              >
                {projects.name}
              </SidebarItem>
            ))}
          </section>
        </article>
      </ScrollArea>
      <Separator size="4" />
      <footer>
        <UserMenu user={user} />
      </footer>
    </aside>
  );
};

export default AppSidebar;
