import { LogOutIcon, MoreVerticalIcon } from "lucide-react";
import type { UserSelect } from "@/lib/types";

import { Button } from "@/app/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/ui/avatar";

export const UserMenu: React.FC<{ user: UserSelect }> = ({ user }) => {
  const fallback = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button
          variant="ghost"
          className="h-auto justify-start gap-2.5 px-3 py-2 text-left"
        >
          <Avatar>
            <AvatarFallback>{fallback}</AvatarFallback>
            <AvatarImage src={user.avatarUrl ?? ""} alt={user.name} />
          </Avatar>

          <div className="grid flex-1">
            <span className="text-sm font-medium">{user.name}</span>
            <span className="text-muted-foreground text-xs">{user.email}</span>
          </div>
          <MoreVerticalIcon className="size-4 opacity-70" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side="right"
        align="end"
        sideOffset={8}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <header className="flex items-center gap-2 p-2">
          <Avatar size="lg">
            <AvatarFallback>{fallback}</AvatarFallback>
            <AvatarImage src={user.avatarUrl ?? ""} alt={user.name} />
          </Avatar>

          <div className="grid">
            <span className="font-medium">{user.name}</span>
            <span className="text-muted-foreground text-sm">{user.email}</span>
          </div>
        </header>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <a href="/logout">
            <LogOutIcon className="size-4 opacity-70" />
            <span>Log out</span>
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
