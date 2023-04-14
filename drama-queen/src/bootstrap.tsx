import React from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { createRouter } from "./routing/router-factory";
import { RoutingStrategy } from "./routing/types";
import { injectLegacyEntryQueens } from "utils/injectLegacyQueens";

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
  injectLegacyEntryQueens();

  const router = createRouter({ strategy: routingStrategy, initialPathname });
  const root = createRoot(mountPoint);
  root.render(<RouterProvider router={router} />);

  return () => queueMicrotask(() => root.unmount());
};

export { mount };