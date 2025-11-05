"use client";

import { useEffect, useState } from "react";
import { Note } from "@/generated";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import RichTextEditor from "../RichEditor";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { toast } from "sonner";
import Loading from "../utils/loading";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MrNote({
  selectedNote,
}: {
  selectedNote: Note | undefined;
}) {
  const [editing, setEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState(selectedNote?.content ?? "");
  const [title, setTitle] = useState(selectedNote?.title ?? "");
  const router = useRouter();
  async function handleSave() {
    if (!selectedNote) return;
    if (title.trim() == "") {
      toast.error("Title can't be empty");
      return;
    }
    setIsLoading(true);

    toast.promise(
      fetch(`/api/notes/${selectedNote.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: value, title }),
      }).finally(() => {
        setIsLoading(false);
      }),
      {
        loading: "Updating...",
        success: "Updated",
        error: "Failed to save",
      }
    );
    setEditing(false);
    router.refresh();
    router.refresh();
  }
  async function handleDelete() {
    if (!selectedNote) return;

    setIsLoading(true);

    try {
      toast.promise(
        fetch(`/api/notes/${selectedNote.id}`, {
          method: "DELETE",
        }),
        {
          loading: "Deleting...",
          success: "Deleted",
          error: "Failed to delete",
        }
      );
      router.refresh();
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    setValue(selectedNote?.content ?? "");
    setTitle(selectedNote?.title ?? "");
    setEditing(false);
  }, [selectedNote]);

  if (!selectedNote) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No note selected</CardTitle>
        </CardHeader>
        <CardContent>Select a note on the left.</CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex justify-between items-center gap-2">
        <Input
          value={title}
          style={{ background: "none" }}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title..."
          className="md:text-2xl bg-transparent rounded-none px-1 font-medium border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
        />

        <div className="flex gap-2 justify-center items-center">
          <Button
            disabled={isLoading}
            variant="ghost"
            size="lg"
            onClick={handleSave}
            className="bg-gray-600/10"
          >
            {isLoading ? <Loading /> : "update"}
          </Button>

          <Button
            disabled={isLoading}
            variant="ghost"
            size="lg"
            className="red"
            onClick={handleDelete}
          >
            <Trash />
          </Button>
        </div>
      </CardHeader>

      <Separator />

      <CardContent
        onClick={() => !editing && setEditing(true)}
        className="cursor-text h-full"
      >
        <RichTextEditor content={value} setContent={setValue} />
      </CardContent>
    </Card>
  );
}
