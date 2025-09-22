import { Heading } from "@radix-ui/themes";
import { Link } from "@tanstack/react-router";
import { SendIcon } from "lucide-react";
import React from "react";

const Logo: React.FC = () => {
  return (
    <Link to="/">
      <span className="flex items-center gap-1.5">
        <SendIcon className="text-accent-10 size-5" />
        <Heading size="3" weight="bold">
          Contactulator
        </Heading>
      </span>
    </Link>
  );
};

export default Logo;
