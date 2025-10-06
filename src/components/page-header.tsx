import React from "react";
import type { BreadcrumbProps } from "./breadcrumbs";
import Breadcrumbs from "./breadcrumbs";

type Props = React.PropsWithChildren<{ breadcrumbs: BreadcrumbProps[] }>;

const PageHeader: React.FC<Props> = ({ breadcrumbs, children }) => {
  return (
    <div className="flex items-center justify-between">
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <div className="flex items-center gap-3">{children}</div>
    </div>
  );
};

export default PageHeader;
