"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useNoteStore } from "@/store/useNoteStore";
import { useEffect, useState } from "react";
import Loading from "../utils/loading";
import { Button } from "../ui/button";

export default function NoteList() {
  const router = useRouter();
  const params = useSearchParams();
  const selected = params.get("note");
  const { notes, fetchNotes, setSelectedNoteId, hasMore } = useNoteStore();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await fetchNotes({ page });
      setLoading(false);
      if (selected) setSelectedNoteId(selected);
    };
    load();
  }, [page, selected, setSelectedNoteId, fetchNotes]);

  if (loading && notes.length === 0) {
    return (
      <div className="flex gap-2 justify-center items-center">
        <Loading />
        loading...
      </div>
    );
  }

  return (
    <div>
      <ul className="space-y-2 group p-4">
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

      <Button
        variant={"ghost"}
        disabled={!hasMore}
        onClick={() => {
          setPage((p) => p + 1);
        }}
        className="w-full"
      >
        {loading ? <Loading /> : hasMore ? "Show more" : "No more notes"}
      </Button>
    </div>
  );
}
