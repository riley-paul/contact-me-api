import { Button, Separator } from "@radix-ui/themes";
import React from "react";
import Logo from "../logo";
import UserMenu from "./user-menu";
import { useSuspenseQuery } from "@tanstack/react-query";
import { qCurrentUser } from "@/lib/client/queries";

const AppSidebar: React.FC = () => {
  const { data: user } = useSuspenseQuery(qCurrentUser);
  if (!user) return null;

  return (
    <aside className="bg-panel border-accent-7 flex h-screen w-[250px] flex-col border-r">
      <header className="flex h-14 items-center px-3">
        <Logo />
      </header>
      <Separator size="4" />
      <article className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
        <Button variant="ghost" className="m-0! justify-start! text-left!">
          Messages
        </Button>
        <Button variant="ghost" className="m-0! justify-start! text-left!">
          Projects
        </Button>
      </article>
      <Separator size="4" />
      <footer>
        <UserMenu user={user} />
      </footer>
    </aside>
  );
};

export default AppSidebar;
