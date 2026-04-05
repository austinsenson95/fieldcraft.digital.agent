import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono();

// CORS
app.use(
  "*",
  cors({
    origin: process.env.CORS_ORIGIN ?? "http://localhost:3000",
  })
);

// Health check
app.get("/health", (c) => {
  return c.json({ status: "ok", uptime: process.uptime() });
});

// Routes (Phase 3+)
// import { contactRoute } from "./routes/contact";
// import { personalizeRoute } from "./routes/personalize";
// app.route("/contact", contactRoute);
// app.route("/personalize", personalizeRoute);

const PORT = Number(process.env.BACKEND_PORT ?? 3001);

serve({ fetch: app.fetch, port: PORT }, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
