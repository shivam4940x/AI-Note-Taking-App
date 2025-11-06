"use client";
import { Button } from "@/components/ui/button";
import Loading from "@/components/utils/loading";
import { useState } from "react";

const AiBtn = ({
  isLoading,
  onSummary,
  onImprove,
  onTags,
}: {
  isLoading: boolean;
  onSummary: () => void;
  onImprove: () => void;
  onTags: () => void;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <Button
        disabled={isLoading}
        variant="ghost"
        size="lg"
        onClick={() => setOpen((v) => !v)}
        className="
          animate-gradient
          bg-linear-to-r from-indigo-500/30 via-purple-500/30 to-pink-500/30
          hover:from-indigo-500/50 hover:via-purple-500/50 hover:to-pink-500/50
          backdrop-blur-sm border border-white/10
          transition-all duration-300
        "
      >
        {isLoading ? <Loading /> : "AI"}
      </Button>

      {open && (
        <div
          className="
      absolute right-0 mt-2 w-56 rounded-md
      border border-black/10 dark:border-white/10
      bg-white/80 dark:bg-black/80
      backdrop-blur-md p-1 shadow-lg z-50
      opacity-0 translate-y-1 scale-95 animate-dropdown-in
    "
        >
          <div className="px-2 py-1 text-xs text-gray-600 dark:text-gray-300">
            AI Tools
          </div>

          <button
            onClick={() => {
              setOpen(false);
              onSummary();
            }}
            className="
        w-full text-left px-3 py-2 text-sm rounded
        text-black dark:text-white
        hover:bg-black/5 dark:hover:bg-white/10
      "
          >
            AI Summary
          </button>

          <button
            onClick={() => {
              setOpen(false);
              onImprove();
            }}
            className="
        w-full text-left px-3 py-2 text-sm rounded
        text-black dark:text-white
        hover:bg-black/5 dark:hover:bg-white/10
      "
          >
            AI Improve
          </button>

          <button
            onClick={() => {
              setOpen(false);
              onTags();
            }}
            className="
        w-full text-left px-3 py-2 text-sm rounded
        text-black dark:text-white
        hover:bg-black/5 dark:hover:bg-white/10
      "
          >
            AI Tags
          </button>
        </div>
      )}
    </div>
  );
};

export default AiBtn;
