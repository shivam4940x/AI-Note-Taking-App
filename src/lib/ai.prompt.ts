export function getAIPrompt(
  type: "summary" | "improve" | "tags",
  value: string
) {
  switch (type) {
    case "summary":
      return `
You are rewriting notes for a personal knowledge base.

Output Format (very important):
- Use **plain Markdown only**.
- No titles or headings unless already present.
- Bullet points should use \`-\` or \`•\`.
- No code blocks, no backticks, no surrounding quotes.

Task:
Summarize the following text into clean, structured Markdown.

Requirements:
- Begin with 1 sentence stating the core topic.
- Then list 3–5 key ideas using bullet points.
- Then provide one short synthesis paragraph.
- Keep the whole result under 200 words.

Text to summarize:
${value}
      `.trim();

    case "improve":
      return `
You are refining notes for clarity and readability.

Output Format (very important):
- Return **polished Markdown only**.
- Do not wrap output in code fences or backticks.
- Preserve bullet lists, headings, and spacing exactly.

Task:
Rewrite the text below into clearer, smoother, and grammatically correct Markdown.

Requirements:
- Fix grammar and sentence flow naturally.
- Preserve original meaning and factual content.
- Keep lists as lists, sections as sections.
- Do not add new information or remove meaning.

Raw text to improve:
${value}
      `.trim();

    case "tags":
      return `
Analyze the text and produce a list of topic tags.

Output Format (very important):
- Return **only** a single comma-separated line.
- No explanations, no sentences, no markdown, no quotes.

Task:
Generate 8–12 short tags representing the key themes of the text.

Requirements:
- Tags should be one or two words each.
- No duplicates.
- Tags should be relevant and specific.

Text for analysis:
${value}
      `.trim();

    default:
      throw new Error("Invalid AI prompt type");
  }
}
