import type { UserSelect } from "@/lib/types";
import { Avatar } from "@radix-ui/themes";

type Props = { user: UserSelect };

export const UserAvatar: React.FC<Props> = ({ user }) => {
  const fallback = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Avatar
      src={user.avatarUrl ?? ""}
      alt={user.name}
      fallback={fallback}
      size="2"
      radius="full"
    />
  );
};

export default UserAvatar;
