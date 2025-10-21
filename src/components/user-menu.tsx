import { LogOutIcon, MoreVerticalIcon } from "lucide-react";
import { Avatar, Button, DropdownMenu, Text } from "@radix-ui/themes";
import type { UserSelect } from "@/lib/types";
import RadixProvider from "./radix-provider";

export const UserMenu: React.FC<{ user: UserSelect }> = ({ user }) => {
  const fallback = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button
          variant="ghost"
          color="gray"
          className="m-0 h-auto justify-start gap-2.5 px-3 py-2 text-left"
        >
          <Avatar
            src={user.avatarUrl ?? ""}
            radius="full"
            size="2"
            fallback={fallback}
          />
          <div className="grid flex-1">
            <Text size="2" weight="bold">
              {user.name}
            </Text>
            <Text size="1" color="gray">
              {user.email}
            </Text>
          </div>
          <MoreVerticalIcon className="size-4 opacity-70" />
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content
        side="right"
        align="end"
        sideOffset={8}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <header className="flex items-center gap-2 p-2">
          <Avatar
            src={user.avatarUrl ?? ""}
            radius="full"
            size="4"
            fallback={fallback}
          />
          <div className="grid">
            <Text weight="bold">{user.name}</Text>
            <Text size="2" color="gray">
              {user.email}
            </Text>
          </div>
        </header>
        <DropdownMenu.Separator />
        <DropdownMenu.Item asChild color="amber">
          <a href="/logout">
            <LogOutIcon className="size-4" />
            <span>Log out</span>
          </a>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default UserMenu;
