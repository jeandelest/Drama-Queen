import { createRoot } from "react-dom/client";
import { type RoutingStrategy, createRouter } from "ui/routing/createRouter";
import { injectLegacyEntryQueens } from "core/injectLegacyQueens";
import App from "App";


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
    <App />
  );

  return () => queueMicrotask(() => root.unmount());
};



export { mount };