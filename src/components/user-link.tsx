import type { UserSelect } from "@/lib/types";
import { Avatar, Button, Text } from "@radix-ui/themes";
import { ChevronsUpDownIcon } from "lucide-react";

type Props = { user: UserSelect };

export const UserMenu: React.FC<Props> = ({ user }) => {
  const fallback = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Button
      variant="ghost"
      radius="none"
      color="gray"
      className="m-0! box-border! w-full! gap-2! px-3! py-2!"
      asChild
    >
      <a href="/settings/profile">
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
      </a>
    </Button>
  );
};

export default UserMenu;
