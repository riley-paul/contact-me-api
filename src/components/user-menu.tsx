import type { UserSelect } from "@/lib/types";
import { DropdownMenu, Text } from "@radix-ui/themes";
import { LogOutIcon } from "lucide-react";
import RadixProvider from "./radix-provider";
import UserAvatar from "./user-avatar";

type Props = { user: UserSelect };

export const UserMenu: React.FC<Props> = ({ user }) => {
  return (
    <RadixProvider asChild>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <button>
            <UserAvatar user={user} avatarProps={{ size: "3" }} />
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Content
          side="bottom"
          align="end"
          className="grid gap-3"
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <header className="flex items-center gap-2 p-2">
            <UserAvatar user={user} avatarProps={{ size: "5" }} />
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
