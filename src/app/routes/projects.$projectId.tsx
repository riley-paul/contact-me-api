import { linkOptions } from "@tanstack/react-router";
import {
  createFileRoute,
  Link,
  Outlet,
  type LinkOptions,
} from "@tanstack/react-router";
import { actions } from "astro:actions";
import React from "react";
import useIsLinkActive from "../hooks/use-is-link-active";
import { GlobeIcon, MailIcon, Settings, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/client/utils";

export const Route = createFileRoute("/projects/$projectId")({
  component: RouteComponent,
  loader: async ({ params: { projectId } }) => {
    const project = await actions.projects.getOne.orThrow({ projectId });
    return { project };
  },
});

type TabLinkProps = { label: string; link: LinkOptions; icon: LucideIcon };
const TabLink: React.FC<TabLinkProps> = ({ label, link, icon: Icon }) => {
  const isActive = useIsLinkActive(link);
  return (
    <Link
      {...link}
      className={cn(
        "text-muted-foreground flex items-center gap-2 border-b border-transparent px-3 py-2 text-sm",
        isActive && "text-primary-foreground border-primary",
      )}
    >
      <Icon className={cn("size-4 opacity-70")} />
      {label}
    </Link>
  );
};

function RouteComponent() {
  const { project } = Route.useLoaderData();

  const links: TabLinkProps[] = [
    {
      icon: MailIcon,
      label: "Messages",
      link: linkOptions({
        to: "/projects/$projectId/messages",
        params: { projectId: project.id },
      }),
    },
    {
      icon: GlobeIcon,
      label: "Setup",
      link: linkOptions({
        to: "/projects/$projectId/setup",
        params: { projectId: project.id },
      }),
    },
    {
      icon: Settings,
      label: "Settings",
      link: linkOptions({
        to: "/projects/$projectId/settings",
        params: { projectId: project.id },
      }),
    },
  ];

  return (
    <React.Fragment>
      <h2 className="text-2xl font-bold tracking-tight">{project.name}</h2>
      <div className="flex w-full border-b">
        {links.map((link) => (
          <TabLink key={link.label} {...link} />
        ))}
      </div>
      <Outlet />
    </React.Fragment>
  );
}
