import { Button } from "@radix-ui/themes";
import React from "react";
import Logo from "../logo";
import UserMenu from "./user-menu";
import { useSuspenseQuery } from "@tanstack/react-query";
import { qCurrentUser } from "@/lib/client/queries";

const AppSidebar: React.FC = () => {
  const { data: user } = useSuspenseQuery(qCurrentUser);
  if (!user) return null;

  return (
    <aside className="flex h-screen w-[250px] flex-col px-3">
      <header className="flex h-12 items-center">
        <Logo />
      </header>
      <article className="flex flex-1 flex-col gap-1">
        <Button variant="ghost" className="justify-start! text-left! m-0!">
          Messages
        </Button>
        <Button variant="ghost" className="justify-start! text-left! m-0!">
          Projects
        </Button>
      </article>
      <footer>
        <UserMenu user={user} />
      </footer>
    </aside>
  );
};

export default AppSidebar;
