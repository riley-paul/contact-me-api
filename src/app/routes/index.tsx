import { Button } from "@radix-ui/themes";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      Hello "/"!
      <Button onClick={() => toast.success("Hello")}>Click me</Button>
    </div>
  );
}
