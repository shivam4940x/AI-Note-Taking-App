"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Note } from "@/generated";

export default function NoteList({ notes }: { notes: Note[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const selected = params.get("note");

  return (
    <ul className="space-y-2">
      {notes.map((note) => (
        <li key={note.id}>
          <Card
            onClick={() => router.push(`/?note=${note.id}`)}
            className={`cursor-pointer hover:bg-accent transition 
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
