import React from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { createRouter } from "./ui/routing/router-factory";
import { RoutingStrategy } from "./ui/routing/types";
import { injectLegacyEntryQueens } from "core/injectLegacyQueens";
import { AuthProvider } from "ui/auth";

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
    <AuthProvider authType={import.meta.env.VITE_AUTH_TYPE}>
      <RouterProvider router={router} />
    </AuthProvider>
  );

  return () => queueMicrotask(() => root.unmount());
};

export { mount };