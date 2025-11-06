export async function callAI({
  value,
  prompt,
  onResult,
  successMessage,
  setIsLoading,
  toast,
}: {
  value: string;
  prompt: string;
  onResult: (output: string) => void;
  successMessage: string;
  setIsLoading: (loading: boolean) => void;
  toast: typeof import("sonner").toast;
}) {
  if (!value.trim()) {
    toast.error("Note is empty");
    return;
  }

  setIsLoading(true);

  try {
    const res = await fetch("/api/gemeni/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input: prompt }),
    });

    const data = await res.json();

    if (!data.output) {
      toast.error("AI returned no output");
      return;
    }

    onResult(data.output);
    toast.success(successMessage);
  } catch (err) {
    console.error(err);
    toast.error("AI request failed");
  } finally {
    setIsLoading(false);
  }
}
