import React from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { type RoutingStrategy, createRouter } from "./ui/routing/createRouter";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { injectLegacyEntryQueens } from "core/injectLegacyQueens";
import { AuthProvider } from "ui/auth";

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
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  );

  return () => queueMicrotask(() => root.unmount());
};

export { mount };