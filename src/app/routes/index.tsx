import { createFileRoute, Link } from "@tanstack/react-router";
import { actions } from "astro:actions";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
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
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
      <div className="grid gap-4 md:grid-cols-2">
        {/* Top Projects by Messages */}
        <Card>
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
              <div className="space-y-4">
                {stats.projectStats.map((project, index) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <div className="bg-primary/10 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold">
                        {index + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <Link
                          to="/projects/$projectId"
                          params={{ projectId: project.id }}
                          className="block truncate font-medium hover:underline"
                        >
                          {project.name}
                        </Link>
                      </div>
                    </div>
                    <Badge variant="secondary" className="ml-2 shrink-0">
                      {project.messageCount}{" "}
                      {project.messageCount === 1 ? "message" : "messages"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Messages */}
        <Card>
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
              <div className="space-y-4">
                {stats.recentMessages.map((message) => (
                  <div
                    key={message.id}
                    className="group hover:bg-muted/50 rounded-lg border p-3 transition-colors"
                  >
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <p className="truncate text-sm font-medium">
                            {message.name}
                          </p>
                          <Badge variant="invert" className="shrink-0">
                            <Link
                              to="/projects/$projectId"
                              params={{ projectId: message.project.id }}
                            >
                              {message.project.name}
                            </Link>
                          </Badge>
                        </div>
                        <p className="text-muted-foreground truncate text-xs">
                          {message.email}
                        </p>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                        asChild
                      >
                        <Link
                          to="/messages/$messageId"
                          params={{ messageId: message.id }}
                        >
                          <ArrowRightIcon className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </div>
                    <p className="mb-2 line-clamp-2 text-sm">
                      {message.content}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {isAfter(message.createdAt, subDays(new Date(), 7))
                        ? formatDistanceToNow(message.createdAt, {
                            addSuffix: true,
                          })
                        : format(message.createdAt, "MMM d, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <Card className="shrink-0">
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

      {/* Quick Actions */}
      <div className="flex justify-center">
        <Button asChild>
          <Link to="/messages">View All Messages</Link>
        </Button>
      </div>
    </div>
  );
}
