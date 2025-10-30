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

export const Route = createFileRoute("/projects/$projectId")({
  component: RouteComponent,
  loader: async ({ params: { projectId } }) => {
    const project = await actions.projects.getOne.orThrow({ projectId });
    return { project };
  },
});

type TabLinkProps = { label: string; link: LinkOptions };
const TabLink: React.FC<TabLinkProps> = ({ label, link }) => {
  const isActive = useIsLinkActive(link);
  return (
    <TabNav.Link asChild active={isActive}>
      <Link {...link}>{label}</Link>
    </TabNav.Link>
  );
};

function RouteComponent() {
  const { project } = Route.useLoaderData();

  const links: TabLinkProps[] = [
    {
      label: "Messages",
      link: linkOptions({
        to: "/projects/$projectId/messages",
        params: { projectId: project.id },
      }),
    },
    {
      label: "Setup",
      link: linkOptions({
        to: "/projects/$projectId/setup",
        params: { projectId: project.id },
      }),
    },
    {
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
          <TabLink key={link.label} label={link.label} link={link.link} />
        ))}
      </TabNav.Root>
      <Outlet />
    </React.Fragment>
  );
}
