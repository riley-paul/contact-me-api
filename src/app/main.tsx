import { RouterProvider, createRouter } from "@tanstack/react-router";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import RadixProvider from "@/components/radix-provider";
import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import CustomToaster from "@/components/custom-toaster";
import { Spinner } from "@radix-ui/themes";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60 * 5 } },
  mutationCache: new MutationCache({
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  }),
});

const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
  defaultPendingComponent: Spinner,
  // defaultErrorComponent: ({ error }) => <ErrorPage error={error} goHome />,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Render the app
export default () => (
  <QueryClientProvider client={queryClient}>
    <RadixProvider>
      <RouterProvider router={router} />
      <CustomToaster />
    </RadixProvider>
  </QueryClientProvider>
);
