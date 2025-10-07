import { Spinner } from "@radix-ui/themes";
import React from "react";

const CenteredSpinner: React.FC = () => {
  return (
    <section className="flex h-full w-full items-center justify-center gap-2 py-32">
      <Spinner size="3" />
    </section>
  );
};

export default CenteredSpinner;
