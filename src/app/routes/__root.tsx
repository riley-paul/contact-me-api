import {
  Outlet,
  createRootRouteWithContext,
  linkOptions,
  type LinkOptions,
} from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import { qUser } from "../queries";
import { Heading, Link as UiLink, Separator } from "@radix-ui/themes";
import { PhoneIcon } from "lucide-react";
import UserMenu from "@/components/user-menu";
import DeleteConfirm from "@/components/delete-confirm";
import { ACCENT_COLOR } from "@/lib/constants";
import { Link } from "@tanstack/react-router";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    component: RootComponent,
    loader: async ({ context }) => {
      const user = await context.queryClient.ensureQueryData(qUser);
      return { user };
    },
  },
);

const links: { label: string; options: LinkOptions }[] = [
  { label: "Messages", options: linkOptions({ to: "/messages" }) },
  { label: "Projects", options: linkOptions({ to: "/projects" }) },
];

function RootComponent() {
  const { user } = Route.useLoaderData();
  return (
    <main className="container2">
      <header className="flex h-16 items-center justify-between gap-4">
        <a href="/" className="flex items-center gap-3">
          <PhoneIcon className="text-accent-10 size-6" />
          <Heading size="4" className="leading-tight">
            Contactulator
          </Heading>
        </a>
        <section className="flex items-center gap-6">
          {links.map(({ label, options }) => (
            <Link {...options} key={label}>
              {({ isActive }) => (
                <UiLink size="2" color={isActive ? ACCENT_COLOR : "gray"}>
                  {label}
                </UiLink>
              )}
            </Link>
          ))}
          <UserMenu user={user} />
        </section>
      </header>
      <Separator size="4" color={ACCENT_COLOR} />
      <article className="grid gap-8 py-6">
        <Outlet />
      </article>
      <DeleteConfirm />
    </main>
  );
}
