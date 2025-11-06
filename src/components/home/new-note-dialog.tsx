"use client";

import { useState } from "react";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useNoteStore } from "@/store/useNoteStore";
// zod schema
const NoteSchema = z.object({
  title: z.string().min(1, "Title is required"),
});

export default function NewNoteDialog() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { addNewNote } = useNoteStore();
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const parsed = NoteSchema.safeParse({ title });
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }

    
    setError("");
    setIsLoading(true);
    await addNewNote(parsed.data);
    setTitle("");
    setOpen(false);
    setIsLoading(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add a note</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Note</DialogTitle>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && <p className="text-sm text-red-500">{error}</p>}

          <Input
            placeholder="Note Title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Button disabled={isLoading} type="submit" className="w-full">
            Save Note
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
