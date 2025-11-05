"use client";

import { useState, useEffect } from "react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandGroup,
  CommandEmpty,
} from "@/components/ui/command";
import { Note } from "@/generated";
import Loading from "../utils/loading";

export default function SearchWithSuggestions() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false); // <<< key change

  useEffect(() => {
    if (!query) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    const timeout = setTimeout(async () => {
      setLoading(true);
      const res = await fetch(`/api/notes?q=${encodeURIComponent(query)}`);
      const data = await res.json();

      setResults(data.ok ? data.data : []);
      setLoading(false);
      setHasSearched(true); // <<< indicates search finished
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div className="relative w-full">
      <Command className="rounded-lg border">
        <CommandInput
          placeholder="Search notes..."
          value={query}
          onValueChange={setQuery}
        />

        {query && (
          <CommandList className="absolute top-full left-0 w-full bg-background border rounded-lg shadow-md mt-1 z-50">
            {loading && (
              <div className="py-3 flex justify-center items-center gap-2 text-sm">
                <Loading />
                Searching...
              </div>
            )}

            {!loading && hasSearched && results.length === 0 && (
              <CommandEmpty>No results found.</CommandEmpty>
            )}

            {!loading && results.length > 0 && (
              <CommandGroup>
                {results.map((note) => (
                  <CommandItem
                    key={note.id}
                    onSelect={() => setQuery(note.title)}
                  >
                    {note.title}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        )}
      </Command>
    </div>
  );
}
