import { DataList, Heading, Text } from "@radix-ui/themes";
import { createFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";
import React from "react";
import { qMessage } from "../queries";

export const Route = createFileRoute("/messages/$messageId")({
  component: RouteComponent,
  loader: async ({ params, context }) => {
    const message = await context.queryClient.ensureQueryData(
      qMessage(params.messageId),
    );
    return { message };
  },
});

function RouteComponent() {
  const { message } = Route.useLoaderData();
  return (
    <React.Fragment>
      <Heading size="8">Message</Heading>
      <DataList.Root>
        <DataList.Item>
          <DataList.Label> Name </DataList.Label>
          <DataList.Value> {message.name} </DataList.Value>
        </DataList.Item>
        <DataList.Item>
          <DataList.Label> Email </DataList.Label>
          <DataList.Value> {message.email} </DataList.Value>
        </DataList.Item>
        <DataList.Item>
          <DataList.Label> Date </DataList.Label>
          <DataList.Value>
            {format(message.createdAt, "cccc MMM d, u @ h:mm a")}
          </DataList.Value>
        </DataList.Item>
      </DataList.Root>
      <Text size="2" color="gray">
        {message.content}
      </Text>
    </React.Fragment>
  );
}
