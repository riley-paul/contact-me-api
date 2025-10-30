import { Theme, type ThemeProps } from "@radix-ui/themes";
import React from "react";
import { ACCENT_COLOR } from "@/lib/constants";
import { useAppearance } from "../hooks/use-theme";

const RadixProvider: React.FC<ThemeProps> = (props) => {
  const appearance = useAppearance();
  return (
    <Theme
      appearance={appearance}
      accentColor={ACCENT_COLOR}
      grayColor="gray"
      radius="large"
      {...props}
    />
  );
};

export default RadixProvider;
