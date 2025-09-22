import type { UserSelect } from "@/lib/types";
import { Avatar, Button, DropdownMenu, Text } from "@radix-ui/themes";
import { ChevronsUpDownIcon, LogOutIcon } from "lucide-react";
import RadixProvider from "./radix-provider";

type Props = { user: UserSelect };

export const UserMenu: React.FC<Props> = ({ user }) => {
  const fallback = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <RadixProvider hasBackground={false}>
      <DropdownMenu.Root modal={false}>
        <DropdownMenu.Trigger>
          <Button
            variant="ghost"
            radius="none"
            color="gray"
            className="m-0! box-border! w-full! gap-2! px-3! py-2!"
          >
            <Avatar
              src={user.avatarUrl ?? ""}
              alt={user.name}
              fallback={fallback}
              size="2"
              radius="full"
            />
            <div className="grid flex-1 text-left">
              <Text size="2" weight="medium" className="text-gray-12" truncate>
                {user.name}
              </Text>
              <Text size="1" color="gray" truncate>
                {user.email}
              </Text>
            </div>
            <ChevronsUpDownIcon className="size-4 opacity-70" />
          </Button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Content side="right" className="grid gap-3">
          <header className="flex items-center gap-2 p-2">
            <Avatar
              src={user.avatarUrl ?? ""}
              alt={user.name}
              fallback={fallback}
              radius="full"
              size="4"
            />
            <div className="grid flex-1 leading-0.5">
              <Text weight="medium" truncate>
                {user.name}
              </Text>
              <Text color="gray" size="2">
                {user.email}
              </Text>
            </div>
          </header>
          <DropdownMenu.Separator />
          <a href="/logout">
            <DropdownMenu.Item color="amber">
              <LogOutIcon className="size-4 opacity-70" />
              <span>Log out</span>
            </DropdownMenu.Item>
          </a>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </RadixProvider>
  );
};

export default UserMenu;
