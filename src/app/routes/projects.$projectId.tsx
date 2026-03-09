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

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";

export const Route = createFileRoute("/projects/$projectId")({
  component: RouteComponent,
  loader: async ({ params: { projectId } }) => {
    const project = await actions.projects.getOne.orThrow({ projectId });
    return { project, crumb: project.name };
  },
});

type TabLinkProps = { label: string; link: LinkOptions; icon: LucideIcon };
const TabLink: React.FC<TabLinkProps> = ({ label, link, icon: Icon }) => {
  const isActive = useIsLinkActive(link);
  return (
    <Tooltip delayDuration={1000}>
      <TooltipTrigger>
        <Link
          {...link}
          className={cn(
            "text-muted-foreground flex h-9 items-center justify-center border-r-2 border-transparent",
            isActive && "text-primary-foreground border-primary",
          )}
        >
          <Icon className={cn("size-4")} />
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
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
    <div className="flex flex-1 overflow-hidden">
      <aside className="flex w-12 flex-col gap-2 border-r py-2">
        {links.map((link) => (
          <TabLink key={link.label} {...link} />
        ))}
      </aside>
      <article className="flex flex-1 flex-col gap-6 overflow-auto px-6 py-4">
        <Outlet />
      </article>
    </div>
  );
}
