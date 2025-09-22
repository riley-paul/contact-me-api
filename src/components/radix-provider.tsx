import { ACCENT_COLOR } from "@/lib/client/constants";
import { Theme, type ThemeProps } from "@radix-ui/themes";
import React from "react";

const RadixProvider: React.FC<ThemeProps> = (props) => {
  return (
    <Theme
      appearance="dark"
      accentColor={ACCENT_COLOR}
      grayColor="gray"
      radius="large"
      {...props}
    />
  );
};

export default RadixProvider;
