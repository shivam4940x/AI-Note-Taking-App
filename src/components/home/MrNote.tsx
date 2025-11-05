"use client";

import { useEffect, useState } from "react";
import { Note } from "@/generated";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import RichTextEditor from "../RichEditor";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";

export default function MrNote({
  selectedNote,
}: {
  selectedNote: Note | undefined;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(selectedNote?.content ?? "");
  const [title, setTitle] = useState(selectedNote?.title ?? "");
  async function handleSave() {
    if (!selectedNote) return;

    await fetch(`/api/notes/${selectedNote.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: value }),
    });

    setEditing(false);
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
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title..."
          style={{
            background: "none",
          }}
          className="md:text-2xl dark:bg-none rounded-none px-1 font-medium border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
        />

        <Button size="sm" onClick={handleSave}>
          Save
        </Button>
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
