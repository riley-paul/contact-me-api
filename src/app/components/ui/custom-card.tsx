import { Card, Heading, Text } from "@radix-ui/themes";
import type { LucideIcon } from "lucide-react";
import React from "react";

type Props = React.PropsWithChildren<{
  title: string;
  subtitle: string;
  icon: LucideIcon;
}>;

const CustomCard: React.FC<Props> = ({
  title,
  subtitle,
  icon: Icon,
  children,
}) => {
  return (
    <Card size="3" className="grid gap-6">
      <header>
        <span className="flex items-center gap-2">
          <Icon className="text-accent-11 size-5" />
          <Heading as="h3" size="4">
            {title}
          </Heading>
        </span>
        <Text size="2" color="gray">
          {subtitle}
        </Text>
      </header>
      {children}
    </Card>
  );
};

export default CustomCard;
