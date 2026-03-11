import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./App.css";
import App from "./App";
import ChatWidget from "./components/ChatWidget";

// 1. Local Development / Static Site rendering
const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

// 2. Global Widget Export for Shopify / HTML sites
// To use on any site, just include the script and call window.PolicyRAGWidget.mount()
declare global {
  interface Window {
    PolicyRAGWidget: {
      mount: (config?: { companyId?: string; subject?: string }) => void;
    };
  }
}

window.PolicyRAGWidget = {
  mount: (config) => {
    // Prevent multiple mountains
    if (document.getElementById("policy-rag-widget-root")) return;

    const container = document.createElement("div");
    container.id = "policy-rag-widget-root";
    document.body.appendChild(container);

    // Pass config down if needed (ChatWidget would need to accept props)
    // For now we just bind it to window object for hooks to read if necessary
    if (config) {
      (window as any).__PRW_CONFIG = config;
    }

    createRoot(container).render(
      <StrictMode>
        <ChatWidget />
      </StrictMode>
    );
  }
};
