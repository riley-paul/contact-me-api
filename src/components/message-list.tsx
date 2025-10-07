import type { MessageSelect } from "@/lib/types";
import React from "react";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item";
import { Badge } from "./ui/badge";

type Props = { messages: MessageSelect[] };

const MessageItem: React.FC<{ message: MessageSelect }> = ({ message }) => {
  return (
    <Item>
      <ItemContent>
        <ItemTitle>
          {message.name} • {message.email}
        </ItemTitle>
        <ItemDescription>{message.content}</ItemDescription>
        <ItemFooter>
          <Badge>{new Date(message.createdAt).toLocaleString()}</Badge>
        </ItemFooter>
      </ItemContent>
      <ItemActions>
        {/* Add action buttons like reply, delete, etc. */}
      </ItemActions>
    </Item>
  );
};

const MessageList: React.FC<Props> = ({ messages }) => {
  return (
    <ItemGroup>
      {messages.map((message, idx) => (
        <React.Fragment key={message.id}>
          {idx > 0 && <ItemSeparator />}
          <MessageItem key={message.id} message={message} />
        </React.Fragment>
      ))}
    </ItemGroup>
  );
};

export default MessageList;
