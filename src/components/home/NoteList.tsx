"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useNoteStore } from "@/store/useNoteStore";
import { useEffect } from "react";
import Loading from "../utils/loading";

export default function NoteList() {
  const router = useRouter();
  const params = useSearchParams();
  const selected = params.get("note");
  const { notes, fetchNotes, setSelectedNote } = useNoteStore();

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  useEffect(() => {
    if (selected) {
      const note = notes.find((n) => n.id === selected) || null;
      setSelectedNote(note);
    }
  }, [selected, notes, setSelectedNote]);

  if (!notes.length) {
    return (
      <div className="flex justify-center items-center">
        <Loading /> loading...
      </div>
    );
  }

  return (
    <ul className="space-y-2 p-4">
      {notes.map((note) => (
        <li key={note.id}>
          <Card
            onClick={() => {
              setSelectedNote(note);
              router.push(`/?note=${note.id}`);
            }}
            className={`cursor-pointer hover:bg-accent transition py-4
              ${selected === note.id ? "border border-primary" : ""}`}
          >
            <CardHeader>
              <CardTitle className="text-sm">{note.title}</CardTitle>
            </CardHeader>
          </Card>
        </li>
      ))}
    </ul>
  );
}
