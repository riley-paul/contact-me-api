import { createFileRoute, Link } from "@tanstack/react-router";
import HeaderContainer from "../components/ui/header-container";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/app/components/ui/breadcrumb";
import { useSuspenseQuery } from "@tanstack/react-query";
import { qMessage } from "../queries";

export const Route = createFileRoute("/messages/$messageId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { messageId } = Route.useParams();
  const { data: message } = useSuspenseQuery(qMessage(messageId));
  return (
    <article>
      <HeaderContainer>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/messages">Messages</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{message.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </HeaderContainer>
    </article>
  );
}
