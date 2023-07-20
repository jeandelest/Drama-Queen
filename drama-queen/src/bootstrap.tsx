import React from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { type RoutingStrategy, createRouter } from "./ui/routing/createRouter";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { injectLegacyEntryQueens } from "core/injectLegacyQueens";
import { AuthProvider } from "ui/auth";
import { ApiClientProvider } from "ui/api/context";

const queryClient = new QueryClient({
});

const mount = ({
  mountPoint,
  initialPathname,
  routingStrategy,
}: {
  mountPoint: HTMLElement;
  initialPathname?: string;
  routingStrategy?: RoutingStrategy;
}) => {

  console.log("Mount Drama Queen")
  //injectLegacyEntryQueens();

  const router = createRouter({ strategy: routingStrategy, initialPathname });
  const root = createRoot(mountPoint);
  root.render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider authType={import.meta.env.VITE_AUTH_TYPE}>
        <ApiClientProvider apiUrl={import.meta.env.VITE_QUEEN_API_URL}>
          <RouterProvider router={router} />
        </ApiClientProvider>
      </AuthProvider>
    </QueryClientProvider>
  );

  return () => queueMicrotask(() => root.unmount());
};

export { mount };