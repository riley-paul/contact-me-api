import type { UserSelect } from "@/lib/types";
import { LogOutIcon } from "lucide-react";
import UserAvatar from "./user-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Props = { user: UserSelect };

export const UserMenu: React.FC<Props> = ({ user }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar user={user} />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side="bottom"
        align="end"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <header className="flex items-center gap-2 p-2">
          <UserAvatar user={user} className="size-12" />
          <div>
            <div className="font-bold">{user.name}</div>
            <div className="text-muted-foreground text-sm">{user.email}</div>
          </div>
        </header>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" asChild>
          <a href="/logout">
            <LogOutIcon />
            <span>Log out</span>
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
