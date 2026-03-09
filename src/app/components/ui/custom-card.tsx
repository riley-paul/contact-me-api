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
      <CardHeader className="gap-3">
        <CardTitle className="flex items-center gap-2">
          <div className="bg-primary text-primary-foreground rounded-md p-1">
            <Icon className="size-4" />
          </div>
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
