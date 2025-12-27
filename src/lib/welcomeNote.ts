import { Note } from "@/store/useNoteStore";


const KEY = "welcome-note-created";

export function shouldCreateWelcomeNote(): boolean {
  if (localStorage.getItem(KEY)) return false;
  localStorage.setItem(KEY, "true");
  return true;
}

export function getWelcomeNote(): Note {
  return {
    id: crypto.randomUUID(),
    title: "Welcome 👋",
    content: `
<h2>Welcome to your notes! 👋</h2>

<ul>
  <li>Write your thoughts</li>
  <li>Organize ideas</li>
  <li>Use AI to summarize or improve</li>
  <li>Generate tags automatically</li>
</ul>

<p>Try summarizing this note 🚀</p>
`.trim(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
