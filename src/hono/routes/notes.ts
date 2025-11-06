// /app/api/note/add/route.ts (Next.js + Hono integration)

import { auth } from "@/lib/auth";
import {
  createNote,
  deleteNote,
  getNotes,
  updateNote,
} from "@/prisma/modules/notes";
import { Hono } from "hono";
import { requireSession } from "../middlewares/global";

const Notes = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
}>();
// eslint-disable-next-line react-hooks/rules-of-hooks
Notes.use("*", requireSession);

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
Notes.put("/:id", async (c) => {
  const id = c.req.param("id");
  const { title, content } = await c.req.json();

  const result = await updateNote(id, { title, content });

  if (!result.ok) return c.json({ error: result.error }, 500);
  return c.json({ success: true, note: result.note }, 200);
});
Notes.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const result = await deleteNote(id);

  if (!result.ok) return c.json({ error: result.error }, 500);
  return c.json({ success: true }, 200);
});
export default Notes;
