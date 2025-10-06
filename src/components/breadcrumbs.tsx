import { Button } from "@radix-ui/themes";
import React from "react";

export type BreadcrumbProps = {
  href: string;
  text: string;
};

const Breadcrumb: React.FC<BreadcrumbProps> = ({ href, text }) => {
  return (
    <Button asChild variant="ghost" color="gray" size="1">
      <a href={href}>{text}</a>
    </Button>
  );
};

const Breadcrumbs: React.FC<{ breadcrumbs: BreadcrumbProps[] }> = ({
  breadcrumbs,
}) => {
  return (
    <nav className="flex items-center gap-2.5">
      {breadcrumbs.map((breadcrumb, index) => (
        <React.Fragment key={index}>
          {index > 0 && <span>/</span>}
          <Breadcrumb href={breadcrumb.href} text={breadcrumb.text} />
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
