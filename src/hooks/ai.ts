"use client";
import { getAIPrompt } from "@/lib/ai.prompt";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

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
    setIsLoading(true);

    try {
      const res = await fetch("/api/gemeni/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: prompt }),
      });

      const data = await res.json();
      if (!data.output) return toast.error("AI returned no output");

      onResult(data.output);
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
          setValue(
            `
<h4>Summary</h4>
${output}
<hr />
${value}
    `.trim()
          ),
      }),

    onImprove: () =>
      run({
        prompt: getAIPrompt("improve", value),
        successMessage: "Improved",
        onResult: (output) => setValue(output),
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
          setTitle((prev) => `${prev}  #${tags.join(" #")}`);
        },
      }),
  };
}
