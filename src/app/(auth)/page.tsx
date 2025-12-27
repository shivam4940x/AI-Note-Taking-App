import { ScrollArea } from "@/components/ui/scroll-area";
import SearchWithSuggestions from "@/components/home/SearchBar";
import NoteList from "@/components/home/NoteList";
import MrNote from "@/components/home/MrNote";
import ThemeToggle from "@/components/utils/ThemeToggle";
import NewNoteDialog from "@/components/home/new-note-dialog";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  
  return (
    <div className="flex flex-col h-screen">
      <header className="border-b p-4 flex md:grid grid-cols-3">
        <div className="pr-3 grow">
          <SearchWithSuggestions />
        </div>
        <div className="col-span-2 flex justify-end items-center gap-2">
          <ThemeToggle />
        </div>
      </header>

      <main className="md:grid grid-cols-3 flex overflow-hidden relative grow">
        <aside className="border-r p-4 flex flex-col w-full h-full overflow-scroll">
          <div className="flex justify-between items-center text-2xl p-2">
            <h2 className="font-semibold mb-2">Your Notes</h2>
            <NewNoteDialog />
          </div>
          <Separator className="my-2" />
          <ScrollArea className="flex-1">
            <NoteList />
          </ScrollArea>
        </aside>

        <section className="absolute left-full w-full h-full transition-transform duration-300 ease-in-out col-span-2 md:p-6 md:sticky top-0">
          <MrNote />
        </section>
      </main>
    </div>
  );
}
