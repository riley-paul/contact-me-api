import { RouterProvider, createRouter } from "@tanstack/react-router";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import { Spinner } from "./components/ui/spinner";

const router = createRouter({
  basepath: "/admin",
  routeTree,
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
  defaultPendingComponent: () => (
    <div className="flex h-full w-full items-center justify-center">
      <Spinner />
    </div>
  ),

  // defaultErrorComponent: ({ error }) => <ErrorPage error={error} goHome />,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Render the app
export default () => <RouterProvider router={router} />;
