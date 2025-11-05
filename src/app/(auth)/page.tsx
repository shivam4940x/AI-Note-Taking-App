import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import NewNoteDialog from "@/components/home/new-note-dialog";
import SearchWithSuggestions from "@/components/home/SearchBar";
import { InterfaceGetResult } from "@/types/crud.interfaces";
import { Note } from "@/generated";
import NoteList from "@/components/home/NoteList";
import MrNote from "@/components/home/MrNote";
import ThemeToggle from "@/components/utils/ThemeToggle";

export default async function Home({
  searchParams,
}: {
  searchParams: { note?: string };
}) {
  const session = await auth.api.getSession({
    headers: headers(),
  });

  if (!session || !session.user) {
    redirect("/login");
  }
  const res = await fetch(`${process.env.BETTER_AUTH_URL}/api/notes`, {
    cache: "no-store",
    headers: headers(),
  });

  // explicitly type the JSON response
  const result: InterfaceGetResult<Note[]> = await res.json();
  const notes = result.ok ? result.data : [];
  const selectedNoteId = searchParams.note;
  const selectedNote = notes.find((n) => n.id === selectedNoteId);

  return (
    <>
      <header className="border-b p-4 flex justify-between items-center">
        <div>
          {/* <h1 className="text-2xl font-semibold">
            Welcome, {session.user.name}!
          </h1> */}
          <SearchWithSuggestions />
        </div>
        <div>
          <ThemeToggle />
        </div>
        <NewNoteDialog />
        <div className="text-sm">profile icon</div>
      </header>

      <main className="grid grid-cols-3">
        <aside className="border-r p-4 flex flex-col ">
          <h2 className="font-semibold mb-2">Your Notes</h2>
          <ScrollArea className="flex-1">
            <NoteList notes={notes} />
          </ScrollArea>
        </aside>

        <section className="col-span-2 p-6 sticky top-0 min-h-[calc(100vh-5rem)]">
          <MrNote selectedNote={selectedNote} />
        </section>
      </main>
    </>
  );
}
