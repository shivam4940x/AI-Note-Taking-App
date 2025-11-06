import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import SearchWithSuggestions from "@/components/home/SearchBar";

import NoteList from "@/components/home/NoteList";
import MrNote from "@/components/home/MrNote";
import ThemeToggle from "@/components/utils/ThemeToggle";
import NewNoteDialog from "@/components/home/new-note-dialog";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Logout } from "@/components/utils/Logout";

export default async function Home() {
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
  const res = await fetch(`${process.env.BETTER_AUTH_URL}/api/notes/len`, {
    cache: "no-store",
    headers: {
      cookie,
    },
  });

  // explicitly type the JSON response
  const notesLen: { ok: boolean; data: number } = await res.json();

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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User style={{ width: "1.1rem", height: "1.1rem" }} />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent side="bottom" align="end" sideOffset={6}>
                <div className="p-1 text-lg min-w-40">
                  {[
                    { label: "Username", value: session.user.name },
                    { label: "Email", value: session.user.email },
                    {
                      label: "Email Verified",
                      value: session.user.emailVerified ? "Yes" : "No",
                    },
                    {
                      label: "Created At",
                      value: session.user.createdAt?.toLocaleDateString(),
                    },
                  ].map(({ label, value }) => (
                    <DropdownMenuLabel key={label} className="text-base px-1">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-500 dark:text-gray-400">
                          {label}:
                        </span>
                        {value}
                      </div>
                    </DropdownMenuLabel>
                  ))}

                  {/* <DropdownMenuItem>Profile</DropdownMenuItem> */}
                  <div className="bg-white/10 w-full h-px rounded-full my-3"></div>
                  <DropdownMenuItem className="cursor-pointer red p-0">
                    <Logout />
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="md:grid grid-cols-3 flex overflow-hidden relative grow">
        <aside className="border-r p-4 flex flex-col w-full">
          <div className="flex justify-between items-center text-2xl p-2">
            <h2 className="font-semibold mb-2 ">
              Your Notes ({notesLen.data})
            </h2>
            <NewNoteDialog />
          </div>
          <Separator className="mb-4" />
          <ScrollArea className="flex-1">
            <NoteList />
          </ScrollArea>
        </aside>

        <section className="absolute left-full w-full h-full transition-transform duration-300 ease-in-out col-span-2 md:p-6 md:sticky top-0 md:min-h-[calc(100vh-5rem)] NoteWrapper">
          <MrNote />
        </section>
      </main>
    </div>
  );
}
