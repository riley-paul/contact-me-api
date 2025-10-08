import { createFileRoute } from "@tanstack/react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/app/components/ui/breadcrumb";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/app/components/ui/empty";

import { Button, Separator } from "@radix-ui/themes";
import { DraftingCompassIcon, PlusIcon } from "lucide-react";
import HeaderContainer from "../components/ui/header-container";

export const Route = createFileRoute("/projects/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <article className="flex-1">
      <HeaderContainer>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Projects</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </HeaderContainer>
      <Empty className="h-full">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <DraftingCompassIcon />
          </EmptyMedia>
          <EmptyTitle>No Project Selected</EmptyTitle>
          <EmptyDescription>
            Select a project from the list, or create a new project to get
            started.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant="outline">
            <PlusIcon className="size-3" />
            New Project
          </Button>
        </EmptyContent>
      </Empty>
    </article>
  );
}
