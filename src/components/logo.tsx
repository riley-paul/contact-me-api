import { SendIcon } from "lucide-react";
import React from "react";

const Logo: React.FC = () => {
  return (
    <a href="/">
      <span className="flex items-center gap-2">
        <div className="bg-primary-foreground flex size-9 items-center justify-center rounded-full">
          <SendIcon className="text-primary mt-0.5 mr-0.5 size-5" />
        </div>
        <h1 className="font-serif text-xl leading-none font-bold">
          Contactulator
        </h1>
      </span>
    </a>
  );
};

export default Logo;
