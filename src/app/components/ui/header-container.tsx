import { Separator } from "@radix-ui/themes";
import React from "react";

type Props = React.PropsWithChildren;

const HeaderContainer: React.FC<Props> = ({ children }) => {
  return (
    <>
      <header className="flex h-14 shrink-0 items-center justify-between gap-4 px-6">
        {children}
      </header>
      <Separator size="4" />
    </>
  );
};

export default HeaderContainer;
