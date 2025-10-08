import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { qMessages } from "../queries";
import HeaderContainer from "../components/ui/header-container";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/app/components/ui/breadcrumb";
import MessageTable from "../components/messages/message-table";
import { Skeleton } from "@radix-ui/themes";

export const Route = createFileRoute("/messages/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: messages = [], isLoading } = useQuery(qMessages());
  return (
    <article className="flex-1">
      <HeaderContainer>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Messages</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </HeaderContainer>
      <section className="p-6">
        <Skeleton loading={isLoading}>
          <MessageTable
            messages={messages}
            className="h-[calc(100vh-3rem-3.5rem-1px)]"
          />
        </Skeleton>
      </section>
    </article>
  );
}
