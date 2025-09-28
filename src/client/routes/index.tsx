import { createFileRoute } from "@tanstack/react-router";
import App from "../App.js";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return <App />;
}

