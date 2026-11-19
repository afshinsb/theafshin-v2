import { createRoot, hydrateRoot } from "react-dom/client";
import "@fontsource-variable/space-grotesk/wght.css";
import "@fontsource-variable/manrope/wght.css";
import "./index.css";
import { App } from "./App";

const root = document.getElementById("root");
if (root) {
  const ui = <App path={window.location.pathname} />;
  if (root.hasChildNodes()) hydrateRoot(root, ui);
  else createRoot(root).render(ui);
}
