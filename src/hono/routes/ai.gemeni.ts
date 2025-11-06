import { Hono } from "hono";
import { requireSession } from "../middlewares/global";
import { auth } from "@/lib/auth";
import { GoogleGenAI } from "@google/genai";

const Gemeni = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
}>();
// eslint-disable-next-line react-hooks/rules-of-hooks
Gemeni.use("*", requireSession);

Gemeni.post("/generate", async (c) => {
  const { input } = await c.req.json(); // text from client

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: input,
  });

  return c.json({ output: response.text });
});
export default Gemeni;