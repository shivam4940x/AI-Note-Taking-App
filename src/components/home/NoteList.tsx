"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useNoteStore } from "@/store/useNoteStore";
import { useEffect } from "react";

export default function NoteList() {
  const router = useRouter();
  const params = useSearchParams();
  const selected = params.get("note");
  const { notes, fetchNotes, setSelectedNoteId } = useNoteStore();

  useEffect(() => {
    fetchNotes();
    if (selected) {
      setSelectedNoteId(selected);
    }
  }, [fetchNotes, selected, setSelectedNoteId]);

  return (
    <ul className="space-y-2 group px-6 py-4">
      {notes.map((note) => (
        <li key={note.id} className="note transition-transform">
          <Card
            onClick={() => {
              setSelectedNoteId(note.id);
              router.push(`/?note=${note.id}`);
            }}
            className={`cursor-pointer hover:bg-accent transition py-4  
              ${selected === note.id ? "border border-primary" : ""}`}
          >
            <CardHeader className="flex items-center">
              <CardTitle className="text-sm">{note.title}</CardTitle>
            </CardHeader>
          </Card>
        </li>
      ))}
    </ul>
  );
}
