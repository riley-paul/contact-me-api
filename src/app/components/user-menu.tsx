import { LogOutIcon } from "lucide-react";
import { Avatar, DropdownMenu, Text } from "@radix-ui/themes";
import { useSuspenseQuery } from "@tanstack/react-query";
import { qUser } from "@/app/queries";

export const UserMenu: React.FC = () => {
  const { data: user } = useSuspenseQuery(qUser);

  const fallback = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Avatar
          src={user.avatarUrl ?? ""}
          radius="full"
          size="2"
          fallback={fallback}
        />
      </DropdownMenu.Trigger>

      <DropdownMenu.Content
        side="right"
        align="end"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <header className="flex items-center gap-2 p-2">
          <Avatar
            src={user.avatarUrl ?? ""}
            radius="full"
            size="5"
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
