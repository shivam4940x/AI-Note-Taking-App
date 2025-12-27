"use client";
import { getAIPrompt } from "@/lib/ai.prompt";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
import { canUseAI, incrementAI } from "@/lib/ai.rateLimit";

const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

export function useAiActions({
  value,
  setValue,
  setTitle,
  setIsLoading,
}: {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  setTitle: Dispatch<SetStateAction<string>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}) {
  const run = async ({
    prompt,
    successMessage,
    onResult,
  }: {
    prompt: string;
    successMessage: string;
    onResult: (output: string) => void;
  }) => {
    if (!value.trim()) return toast.error("Note is empty");

    // 🔒 RATE LIMIT (before network)
    if (!canUseAI()) {
      toast.error("Daily AI limit reached (5/day)");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(
        `${GEMINI_ENDPOINT}?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
          }),
        }
      );

      const json = await res.json();
      const output = json.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!output) throw new Error();

      onResult(output);

      // 🔒 RATE LIMIT (after success)
      incrementAI();

      toast.success(successMessage);
    } catch {
      toast.error("AI request failed");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    onSummary: () =>
      run({
        prompt: getAIPrompt("summary", value),
        successMessage: "Summarized",
        onResult: (output) =>
          setValue(`<h4>Summary</h4>${output}<hr />${value}`.trim()),
      }),

    onImprove: () =>
      run({
        prompt: getAIPrompt("improve", value),
        successMessage: "Improved",
        onResult: setValue,
      }),

    onTags: () =>
      run({
        prompt: getAIPrompt("tags", value),
        successMessage: "Tags added",
        onResult: (output) => {
          const tags = output
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean);
          setTitle((prev) => `${prev} #${tags.join(" #")}`);
        },
      }),
  };
}
