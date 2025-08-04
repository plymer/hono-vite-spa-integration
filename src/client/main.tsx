import ReactDOM from "react-dom/client";
import { StrictMode } from "react";
import App from "./App.js";

const rootElement = document.getElementById("app")!;

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

