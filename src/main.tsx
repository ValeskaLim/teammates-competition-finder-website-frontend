import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const useStrictMode = import.meta.env.VITE_STRICT_MODE === "TRUE";

createRoot(document.getElementById("root")!).render(
  useStrictMode ? (
    <StrictMode>
      <App />
    </StrictMode>
  ) : (
    <App />
  )
);
