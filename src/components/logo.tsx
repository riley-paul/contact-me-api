import { Heading } from "@radix-ui/themes";
import { SendIcon } from "lucide-react";
import React from "react";

const Logo: React.FC = () => {
  return (
    <a href="/">
      <span className="flex items-center gap-2">
        <div className="bg-accent-3 flex size-9 items-center justify-center rounded-full">
          <SendIcon className="text-accent-10 mt-0.5 mr-0.5 size-5" />
        </div>
        <Heading size="4" weight="bold" trim="both" className="mt-1!">
          Contactulator
        </Heading>
      </span>
    </a>
  );
};

export default Logo;
