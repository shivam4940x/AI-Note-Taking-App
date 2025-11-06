"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";

export default function AiBtn({
  isLoading,
  AI,
}: {
  isLoading: boolean;
  AI: {
    onSummary: () => void;
    onImprove: () => void;
    onTags: () => void;
  };
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <Button
        disabled={isLoading}
        variant="ghost"
        size="lg"
        onClick={() => setOpen((v) => !v)}
        className="relative"
      >
        <Image
          src="/svg/gemeni.webp"
          alt=""
          height={40}
          width={40}
          className="aspect-square p-2 absolute "
        />
      </Button>

      {open && (
        <div className="absolute right-0 mt-2 min-w-40 rounded-md border bg-white/80 dark:bg-black/80 backdrop-blur-md p-1 shadow-lg z-50 text-sm">
          <div className="px-2 py-1 text-[10px] uppercase tracking-wide text-gray-500">
            AI Tools
          </div>

          <Button
            variant="ghost"
            className="w-full rounded-none justify-start px-2"
            onClick={() => {
              setOpen(false);
              AI.onSummary();
            }}
          >
            AI Summary
          </Button>
          <Button
            variant="ghost"
            className="w-full rounded-none justify-start px-2"
            onClick={() => {
              setOpen(false);
              AI.onImprove();
            }}
          >
            AI Improve
          </Button>
          <Button
            variant="ghost"
            className="w-full rounded-none justify-start px-2"
            onClick={() => {
              setOpen(false);
              AI.onTags();
            }}
          >
            AI Tags
          </Button>
        </div>
      )}
    </div>
  );
}
