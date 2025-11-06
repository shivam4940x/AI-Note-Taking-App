import { Hono } from "hono";
import { handle } from "hono/vercel";
import { cors } from "hono/cors";
import { auth } from "@/lib/auth";
import { session } from "@/hono/middlewares/global";
import Notes from "@/hono/routes/notes";
import Gemeni from "@/hono/routes/ai.gemeni";

const routes = [
  { path: "/notes", router: Notes },
  { path: "/gemeni", router: Gemeni },
];

const app = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
}>().basePath("/api");

app.use(
  "/auth/*",
  cors({
    origin: process.env.BETTER_AUTH_URL!,
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    credentials: true,
  })
);

// better-auth server handlers
app.on(["POST", "GET"], "/auth/*", (c) => auth.handler(c.req.raw));

// session middleware (after auth)
app.use("*", session);

app.get("/hono", (c) => c.json({ message: "Hello from Hono!" }));

for (const r of routes) {
  app.route(r.path, r.router);
}
export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
