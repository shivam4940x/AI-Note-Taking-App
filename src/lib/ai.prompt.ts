export function getAIPrompt(
  type: "summary" | "improve" | "tags",
  value: string
) {
  switch (type) {
    case "summary":
      return `
You are rewriting notes for a personal knowledge base.

Output Format (important):
- Output **clean HTML only** (no Markdown).
- Use <p> for paragraphs and <ul><li> for bullet points.
- Do not wrap output in code fences or backticks.
- Do not add CSS, inline styles, classes, or <html>/<body> tags.

Task:
Summarize the following text.

Requirements:
- Start with one concise sentence introducing the main topic in a <p>.
- Then provide 3–5 key ideas inside a <ul><li> list.
- Then end with one short synthesis paragraph in <p>.
- Entire result should stay under 200 words.

Text to summarize:
${value}
      `.trim();

    case "improve":
      return `
You are refining notes for clarity and readability.

Output Format (important):
- Return **clean HTML only** (no Markdown).
- Preserve existing structure: keep headings, paragraphs, and lists.
- Do not wrap output in code fences or backticks.
- Do not add new content, interpretations, or remove meaning.

Task:
Rewrite the text below to be clearer and smoother while preserving intent.

Raw text to improve:
${value}
      `.trim();

    case "tags":
      return `
Analyze the text and produce topic tags.

Output Format (important):
- Output only a single **comma-separated** line (e.g., tag1, tag2, tag3).
- No HTML, no explanations, no sentences, no quotes.

Task:
Generate 8–12 short tags capturing the main themes.

Text for analysis:
${value}
      `.trim();

    default:
      throw new Error("Invalid AI prompt type");
  }
}
