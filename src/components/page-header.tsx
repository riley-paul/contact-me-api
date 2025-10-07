import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type Props = React.PropsWithChildren<{
  breadcrumbs: { text: string; href: string }[];
}>;

const PageHeader: React.FC<Props> = ({ breadcrumbs, children }) => {
  return (
    <div className="flex items-center justify-between">
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map(({ text, href }, index) => (
            <React.Fragment key={index}>
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {index === breadcrumbs.length - 1 ? (
                  <BreadcrumbPage>{text}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={href}>{text}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex items-center gap-3">{children}</div>
    </div>
  );
};

export default PageHeader;
