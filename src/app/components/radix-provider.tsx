import { ACCENT_COLOR } from "@/lib/client/constants";
import { Theme, type ThemeProps } from "@radix-ui/themes";
import { useMediaQuery } from "usehooks-ts";
import React from "react";

const RadixProvider: React.FC<ThemeProps> = (props) => {
  const deviceDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  return (
    <Theme
      appearance={deviceDarkMode ? "dark" : "light"}
      accentColor={ACCENT_COLOR}
      grayColor="gray"
      radius="large"
      {...props}
    />
  );
};

export default RadixProvider;
