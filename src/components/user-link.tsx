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
    <a href="/settings">
      <Avatar
        src={user.avatarUrl ?? ""}
        alt={user.name}
        fallback={fallback}
        size="2"
        radius="full"
      />
    </a>
  );
};

export default UserMenu;
