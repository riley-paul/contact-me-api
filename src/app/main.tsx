import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

import React from "react";
import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { toast } from "sonner";
import AlertSystem from "@/components/alert-system/alert-system
import RadixProvider from "@/components/radix-provider
import CustomToaster from "@/components/custom-toaster
import { Spinner } from "@radix-ui/themes";
import { alertSystemAtom } from "../components/alert-system/alert-system.store";
import { getDefaultStore } from "jotai/vanilla";

const store = getDefaultStore();

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60 * 5 } },
  mutationCache: new MutationCache({
    onSuccess: () => {
      queryClient.invalidateQueries();
      store.set(alertSystemAtom, { type: "close" });
    },
    onError: (error) => {
      console.error(error);
      toast.error(error.message ?? "Server Error");
    },
  }),
});

const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
  scrollRestoration: true,
  defaultPendingComponent: () => (
    <div className="flex h-full w-full items-center justify-center">
      <Spinner />
    </div>
  ),
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RadixProvider>
        <RouterProvider router={router} />
        <CustomToaster />
        <AlertSystem />
      </RadixProvider>
    </QueryClientProvider>
  );
};

export default App;
