import { Hono } from "hono";

import testRoute from "./endpoints/test";

const api = new Hono();

api.route("/test", testRoute);

export default api;

