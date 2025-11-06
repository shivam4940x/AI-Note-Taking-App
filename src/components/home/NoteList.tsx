"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useNoteStore } from "@/store/useNoteStore";
import { useEffect, useState } from "react";
import Loading from "../utils/loading";

export default function NoteList() {
  const router = useRouter();
  const params = useSearchParams();
  const selected = params.get("note");
  const { notes, fetchNotes, setSelectedNoteId } = useNoteStore();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const load = async () => {
      await fetchNotes();
      setLoading(false);
      if (selected) setSelectedNoteId(selected);
    };
    load();
  }, [fetchNotes, selected, setSelectedNoteId]);
  if (loading) {
    return (
      <div className="flex gap-2 justify-center items-center">
        <Loading />
        loading...
      </div>
    );
  }
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
