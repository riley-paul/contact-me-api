import { createFileRoute, Link } from "@tanstack/react-router";
import { actions } from "astro:actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@/app/components/ui/item";

import {
  BarChart3Icon,
  InboxIcon,
  MailIcon,
  FolderIcon,
  TrendingUpIcon,
  ClockIcon,
  ArrowRightIcon,
  type LucideIcon,
} from "lucide-react";
import { formatDistanceToNow, format, isAfter, subDays } from "date-fns";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { formatMessageDate } from "@/lib/utils";
import React from "react";

export const Route = createFileRoute("/")({
  component: RouteComponent,
  loader: async () => {
    const stats = await actions.dashboard.getStats.orThrow();
    return { stats, crumb: "Dashboard" };
  },
});

const StatCard: React.FC<{
  title: string;
  description: string;
  icon: LucideIcon;
  value: React.ReactNode;
}> = ({ title, description, icon: Icon, value }) => (
  <Card className="shrink-0 gap-2 rounded-3xl p-5">
    <header className="flex items-center justify-between">
      <span className="text-muted-foreground text-sm font-normal">{title}</span>
      <Icon className="text-muted-foreground h-4 w-4" />
    </header>
    <div className="text-3xl font-bold">{value}</div>
    <p className="text-muted-foreground mt-2 text-xs">{description}</p>
  </Card>
);

function RouteComponent() {
  const { stats } = Route.useLoaderData();

  return (
    <div className="flex flex-1 flex-col gap-6 overflow-auto p-6">
      {/* Stats Grid */}
      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Messages */}
        <StatCard
          title="Total Messages"
          description="All messages received across your projects"
          icon={InboxIcon}
          value={stats.totalMessages}
        />

        {/* Total Projects */}
        <StatCard
          title="Total Projects"
          description="Active contact forms"
          icon={FolderIcon}
          value={stats.totalProjects}
        />

        {/* Last 24 Hours */}
        <StatCard
          title="Last 24 Hours"
          description="Messages in the last day"
          icon={ClockIcon}
          value={stats.messagesLast24h}
        />

        {/* Last 7 Days */}
        <StatCard
          title="Last 7 Days"
          description="Messages this week"
          icon={TrendingUpIcon}
          value={stats.messagesLast7d}
        />
      </section>

      {/* Two Column Layout */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Top Projects by Messages */}
        <Card className="rounded-3xl px-2 py-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3Icon className="text-primary h-5 w-5" />
              Top Projects
            </CardTitle>
            <CardDescription>Projects with the most messages</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.projectStats.length === 0 ? (
              <div className="text-muted-foreground py-8 text-center text-sm">
                No projects yet. Create your first project to get started!
              </div>
            ) : (
              <ItemGroup className="gap-1">
                {stats.projectStats.map((project, index) => (
                  <Item key={project.id} asChild className="group">
                    <Link
                      to="/projects/$projectId"
                      params={{ projectId: project.id }}
                    >
                      <ItemMedia variant="icon">
                        <Badge className="size-6">{index + 1}</Badge>
                      </ItemMedia>
                      <ItemContent>
                        <ItemTitle>{project.name}</ItemTitle>
                      </ItemContent>
                      <Badge variant="secondary">
                        {project.messageCount}{" "}
                        {project.messageCount === 1 ? "message" : "messages"}
                      </Badge>
                    </Link>
                  </Item>
                ))}
              </ItemGroup>
            )}
          </CardContent>
        </Card>

        {/* Recent Messages */}
        <Card className="rounded-3xl px-2 py-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MailIcon className="text-primary h-5 w-5" />
              Recent Messages
            </CardTitle>
            <CardDescription>
              Latest messages from your contacts
            </CardDescription>
          </CardHeader>
          <CardContent className="overflow-auto">
            {stats.recentMessages.length === 0 ? (
              <div className="text-muted-foreground py-8 text-center text-sm">
                No messages yet. Share your contact form to start receiving
                messages!
              </div>
            ) : (
              <ItemGroup className="gap-1">
                {stats.recentMessages.map((message, idx) => (
                  <React.Fragment>
                    {idx > 0 && <ItemSeparator />}
                    <Item key={message.id} asChild>
                      <Link
                        to="/messages/$messageId"
                        params={{ messageId: message.id }}
                      >
                        <ItemContent>
                          <ItemTitle>{message.name}</ItemTitle>
                          <ItemDescription>{message.content}</ItemDescription>
                        </ItemContent>

                        <ItemFooter>
                          <Badge variant="invert">{message.project.name}</Badge>
                          <span className="text-muted-foreground text-xs">
                            {formatMessageDate(message.createdAt)}
                          </span>
                        </ItemFooter>
                      </Link>
                    </Item>
                  </React.Fragment>
                ))}
              </ItemGroup>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <Card className="shrink-0 rounded-3xl px-2 py-6">
        <CardHeader>
          <CardTitle>Message Activity</CardTitle>
          <CardDescription>
            Overview of message volume over different time periods
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <p className="text-muted-foreground text-sm font-medium">
                Last 24 Hours
              </p>
              <p className="text-3xl font-bold">{stats.messagesLast24h}</p>
            </div>
            <div className="space-y-2">
              <p className="text-muted-foreground text-sm font-medium">
                Last 7 Days
              </p>
              <p className="text-3xl font-bold">{stats.messagesLast7d}</p>
            </div>
            <div className="space-y-2">
              <p className="text-muted-foreground text-sm font-medium">
                Last 30 Days
              </p>
              <p className="text-3xl font-bold">{stats.messagesLast30d}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
