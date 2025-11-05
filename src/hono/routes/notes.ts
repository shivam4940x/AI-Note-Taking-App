// /app/api/note/add/route.ts (Next.js + Hono integration)

import { auth } from "@/lib/auth";
import { createNote, getNotes } from "@/prisma/modules/notes";
import { Hono } from "hono";

const Notes = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
}>();

Notes.get("/", async (c) => {
  const user = c.get("user");
  if (!user || user == null) return c.json({ error: "Unauthorized" }, 401);
  const page = Number(c.req.query("page") ?? 1);
  const limit = Number(c.req.query("limit") ?? 10);
  const query = c.req.query("q") ?? "";

  const result = await getNotes(user.id, {
    page,
    limit,
    query,
  });

  if (!result.ok) return c.json({ error: result.error }, 500);

  return c.json(result, 200);
});

Notes.post("/add", async (c) => {
  const user = c.get("user");
  if (!user) return c.json({ error: "Unauthorized" }, 401);

  const { title, content } = await c.req.json();
  const result = await createNote(user.id, title, content);

  if (!result.ok) return c.json({ error: result.error }, 500);
  return c.json({ success: true, note: result.note }, 201);
});

export default Notes;
