import { Text } from "@radix-ui/themes";
import React from "react";

type Props = React.PropsWithChildren<{}>;

const SidebarHeader: React.FC<Props> = ({ children }) => {
  return (
    <div className="mb-2">
      <Text color="gray" weight="bold" size="1" className="px-3 uppercase">
        {children}
      </Text>
    </div>
  );
};

export default SidebarHeader;
