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

export const Route = createFileRoute("/projects/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <article className="flex-1">
      <header className="flex h-14 items-center justify-between px-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Projects</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <Separator size="4" />
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
