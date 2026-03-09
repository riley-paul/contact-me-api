import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";
import { MailIcon, Trash2Icon } from "lucide-react";
import { useSetAtom } from "jotai";
import { actions } from "astro:actions";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  CardAction,
} from "@/app/components/ui/card";
import { Separator } from "@/app/components/ui/separator";
import { deleteConfirmAtom } from "@/app/components/delete-confirm";
import { Badge } from "@/app/components/ui/badge";

export const Route = createFileRoute("/messages/$messageId")({
  component: RouteComponent,
  loader: async ({ params: { messageId } }) => {
    const message = await actions.messages.getOne.orThrow({ messageId });
    return { message, crumb: message.name };
  },
});

function RouteComponent() {
  const { message } = Route.useLoaderData();
  const navigate = useNavigate();
  const setDeleteConfirm = useSetAtom(deleteConfirmAtom);

  const handleDelete = () => {
    setDeleteConfirm({
      open: true,
      onConfirm: async () => {
        await actions.messages.remove({ messageId: message.id });
        navigate({ to: "/messages" });
      },
    });
  };

  const mailtoLink = `mailto:${message.email}?subject=${encodeURIComponent(
    `Re: ${message.name}'s message [${message.project.name}]`,
  )}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">{message.name}</CardTitle>
        <CardDescription>
          <a href={mailtoLink} className="hover:underline">
            {message.email}
          </a>
        </CardDescription>
        <CardAction className="flex items-center gap-2">
          <Button variant="destructive" size="default" onClick={handleDelete}>
            <Trash2Icon className="size-4" />
            Delete
          </Button>
          <Button variant="default" size="default" asChild>
            <a href={mailtoLink}>
              <MailIcon className="size-4" />
              Reply
            </a>
          </Button>
        </CardAction>
      </CardHeader>

      <Separator />

      <CardContent>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {message.content}
        </p>
      </CardContent>

      <CardFooter className="justify-between">
        <section>
          <span className="text-muted-foreground text-xs">
            {format(message.createdAt, "EEEE, MMMM d, yyyy 'at' h:mm a")}
          </span>
        </section>
        <section className="flex items-center gap-2">
          <Badge variant="invert" asChild>
            <a href={`/projects/${message.projectId}`}>
              {message.project.name}
            </a>
          </Badge>
        </section>
      </CardFooter>
    </Card>
  );
}
