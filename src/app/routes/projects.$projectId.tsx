import { Heading, TabNav } from "@radix-ui/themes";
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
    <TabNav.Link asChild active={isActive}>
      <Link {...link}>
        <div className="flex items-center gap-2">
          <Icon className={cn("size-4", isActive && "text-accent-11")} />
          {label}
        </div>
      </Link>
    </TabNav.Link>
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
      <Heading size="6">{project.name}</Heading>
      <TabNav.Root>
        {links.map((link) => (
          <TabLink key={link.label} {...link} />
        ))}
      </TabNav.Root>
      <Outlet />
    </React.Fragment>
  );
}
