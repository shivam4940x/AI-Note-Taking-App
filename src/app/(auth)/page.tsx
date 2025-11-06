import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import SearchWithSuggestions from "@/components/home/SearchBar";
import { InterfaceGetResult } from "@/types/crud.interfaces";
import { Note } from "@/generated";
import NoteList from "@/components/home/NoteList";
import MrNote from "@/components/home/MrNote";
import ThemeToggle from "@/components/utils/ThemeToggle";
import NewNoteDialog from "@/components/home/new-note-dialog";
import { Separator } from "@/components/ui/separator";
import ProfileMenu from "@/components/home/ProfileMenu";

export default async function Home({
  searchParams,
}: {
  searchParams: { note?: string };
}) {
  const requestHeaders = headers();
  const cookie = requestHeaders.get("cookie") ?? "";
  const session = await auth.api.getSession({
    headers: {
      cookie,
    },
  });

  if (!session || !session.user) {
    redirect("/login");
  }
  const res = await fetch(`${process.env.BETTER_AUTH_URL}/api/notes`, {
    cache: "no-store",
    headers: {
      cookie,
    },
  });

  // explicitly type the JSON response
  const result: InterfaceGetResult<Note[]> = await res.json();
  const notes = result.ok ? result.data : [];
  const selectedNoteId = searchParams.note;
  const selectedNote = notes.find((n) => n.id === selectedNoteId);

  return (
    <div className="flex flex-col h-screen">
      <header className="border-b p-4 flex md:grid grid-cols-3">
        <div className="pr-3 grow">
          <SearchWithSuggestions />
        </div>
        <div className="col-span-2 flex justify-end items-center gap-2">
          <div>
            <ThemeToggle />
          </div>
          <div className="text-sm">
            <ProfileMenu />
          </div>
        </div>
      </header>

      <main className="md:grid grid-cols-3 flex overflow-hidden relative grow">
        <aside className="border-r p-4 flex flex-col w-full">
          <div className="flex justify-between items-center text-2xl p-2">
            <h2 className="font-semibold mb-2 ">Your Notes ({notes.length})</h2>
            <NewNoteDialog />
          </div>
          <Separator className="mb-4" />
          <ScrollArea
            className="flex-1"
            style={{
              overflowX: "visible",
            }}
          >
            <NoteList notes={notes} />
          </ScrollArea>
        </aside>

        <section className="absolute left-full w-full h-full transition-transform duration-300 ease-in-out col-span-2 md:p-6 md:sticky top-0 md:min-h-[calc(100vh-5rem)] NoteWrapper">
          <MrNote selectedNote={selectedNote} />
        </section>
      </main>
    </div>
  );
}
