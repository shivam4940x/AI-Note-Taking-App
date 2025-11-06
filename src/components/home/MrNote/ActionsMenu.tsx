import { useEffect, useRef, useState } from "react";
import { MoreVertical, CheckCircle, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import Loading from "@/components/utils/loading";
import clsx from "clsx";

type Props = {
  isLoading: boolean;
  isChanged: boolean;
  handleSave: () => void;
  handleDelete: () => void;
  AiFeatures: {
    onSummary: () => void;
    onImprove: () => void;
    onTags: () => void;
  };
};

export function SmolActionsMenu({
  isLoading,
  isChanged,
  handleSave,
  handleDelete,
  AiFeatures,
}: Props) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!menuRef.current?.contains(t) && !btnRef.current?.contains(t)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  // Close on Escape; focus trigger when closing
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btnRef.current?.focus();
      }
      // simple arrow navigation
      if (open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
        e.preventDefault();
        const items =
          menuRef.current?.querySelectorAll<HTMLButtonElement>(
            "[data-menu-item]"
          );
        if (!items || items.length === 0) return;
        const arr = Array.from(items);
        const idx = arr.findIndex((el) => el === document.activeElement);
        let next = 0;
        if (idx === -1) next = 0;
        else if (e.key === "ArrowDown") next = (idx + 1) % arr.length;
        else next = (idx - 1 + arr.length) % arr.length;
        arr[next].focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Focus first item when opening
  useEffect(() => {
    if (!open) return;
    const first =
      menuRef.current?.querySelector<HTMLButtonElement>("[data-menu-item]");
    first?.focus();
  }, [open]);

  const itemBase =
    "w-full text-left px-3 py-2 text-sm rounded outline-none " +
    "text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10 " +
    "disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="relative inline-block">
      <Button
        variant={"ghost"}
        ref={btnRef}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="rounded-md border border-white/10 hover:bg-white/5"
      >
        {isLoading ? <Loading /> : <MoreVertical />}
      </Button>

      {open && (
        <div
          ref={menuRef}
          role="menu"
          aria-label="Note actions"
          className="
            absolute right-0 mt-2 w-56 rounded-md z-50
            border border-black/10 dark:border-white/10
            bg-white/80 dark:bg-black/80 backdrop-blur-md p-1 shadow-lg
            opacity-0 translate-y-1 scale-95 animate-dropdown-in
          "
        >
          <div className="px-2 py-1 text-xs text-gray-600 dark:text-gray-300">
            Actions
          </div>

          <button
            role="menuitem"
            data-menu-item
            onClick={() => {
              setOpen(false);
              handleSave();
            }}
            disabled={isLoading || !isChanged}
            className={itemBase}
          >
            <span className="inline-flex items-center gap-2">
              Save
              <CheckCircle className="h-4 w-4" />
            </span>
          </button>

          <div className="px-2 py-1 text-[10px] uppercase tracking-wide text-gray-500">
            AI Tools
          </div>

          <button
            role="menuitem"
            data-menu-item
            onClick={() => {
              setOpen(false);
              AiFeatures.onSummary();
            }}
            className={itemBase}
          >
            AI Summary
          </button>

          <button
            role="menuitem"
            data-menu-item
            onClick={() => {
              setOpen(false);
              AiFeatures.onImprove();
            }}
            className={itemBase}
          >
            AI Improve
          </button>

          <button
            role="menuitem"
            data-menu-item
            onClick={() => {
              setOpen(false);
              AiFeatures.onTags();
            }}
            className={itemBase}
          >
            AI Tags
          </button>

          <div className="my-1 h-px bg-black/10 dark:bg-white/10" />

          <button
            role="menuitem"
            data-menu-item
            onClick={() => {
              setOpen(false);
              handleDelete();
            }}
            disabled={isLoading}
            className={clsx(itemBase, "red")}
          >
            <span className="inline-flex items-center gap-2">
              <Trash className="h-4 w-4" />
              Delete
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
