import type { MessageSelect } from "@/lib/types";
import { DropdownMenu, IconButton } from "@radix-ui/themes";
import { Link } from "@tanstack/react-router";
import { AtSignIcon, MoreHorizontal, SearchIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { useCopyToClipboard } from "usehooks-ts";

type Props = { message: MessageSelect };

const MessageActions: React.FC<Props> = ({ message }) => {
  const [, copy] = useCopyToClipboard();
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <IconButton variant="ghost">
          <MoreHorizontal className="size-4" />
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
        side="bottom"
        align="end"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <DropdownMenu.Item asChild>
          <Link to="/messages/$messageId" params={{ messageId: message.id }}>
            <SearchIcon className="size-4 opacity-70" />
            View Details
          </Link>
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item
          onSelect={() => {
            copy(message.email);
            toast.success(`Copied "${message.email}" to clipboard`);
          }}
        >
          <AtSignIcon className="size-4 opacity-70" />
          Copy sender email
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default MessageActions;
