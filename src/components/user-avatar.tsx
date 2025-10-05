import type { UserSelect } from "@/lib/types";
import { Avatar, type AvatarProps } from "@radix-ui/themes";

type Props = { user: UserSelect; avatarProps?: AvatarProps };

export const UserAvatar: React.FC<Props> = ({ user, avatarProps }) => {
  const fallback = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Avatar
      src={user.avatarUrl ?? ""}
      alt={user.name}
      size="3"
      radius="full"
      {...avatarProps}
      fallback={fallback}
    />
  );
};

export default UserAvatar;
