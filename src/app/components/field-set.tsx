import { Text } from "@radix-ui/themes";
import React from "react";

type Props = React.PropsWithChildren<{ label: string; error?: string }>;

const FieldSet: React.FC<Props> = ({ label, error, children }) => {
  return (
    <fieldset>
      <Text
        as="label"
        size="2"
        weight="medium"
        className="grid gap-2"
        ml="1"
        mb="2"
      >
        {label}
      </Text>
      {children}
      {error && (
        <Text size="1" color="red" ml="2" mt="-1">
          {error}
        </Text>
      )}
    </fieldset>
  );
};

export default FieldSet;
