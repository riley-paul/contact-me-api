import type { LucideIcon } from "lucide-react";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";

type Props = React.PropsWithChildren<{
  title: string;
  subtitle: string;
  icon: LucideIcon;
  footer?: React.ReactNode;
}>;

const CustomCard: React.FC<Props> = ({
  title,
  subtitle,
  icon: Icon,
  children,
  footer,
}) => {
  return (
    <Card className="shrink-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="text-primary size-5" />
          <h4>{title}</h4>
        </CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>

      <CardContent>{children}</CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  );
};

export default CustomCard;
