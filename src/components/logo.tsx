import { Heading } from "@radix-ui/themes";
import { SendIcon } from "lucide-react";
import React from "react";

const Logo: React.FC = () => {
  return (
    <a href="/">
      <span className="flex items-center gap-1.5">
        <SendIcon className="text-accent-10 size-5" />
        <Heading size="3" weight="bold">
          Contactulator
        </Heading>
      </span>
    </a>
  );
};

export default Logo;
