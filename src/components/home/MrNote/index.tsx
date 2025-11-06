"use client";

import { useEffect, useState } from "react";
import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import RichTextEditor from "../../RichEditor";
import { Input } from "../../ui/input";
import { Separator } from "../../ui/separator";
import { toast } from "sonner";
import Loading from "../../utils/loading";
import { ArrowLeft, CheckCircle, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import AiBtn from "./AIBtn";
import { useNoteStore } from "@/store/useNoteStore";
import { SmolActionsMenu } from "./ActionsMenu";
import { useAiActions } from "@/hooks/ai";

export default function MrNote() {
  const [editing, setEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { updateNote, selectedNote, deleteNote, setSelectedNote } = useNoteStore();
  const [value, setValue] = useState(selectedNote?.content ?? "");
  const [title, setTitle] = useState(selectedNote?.title ?? "");
  const router = useRouter();
  const [NoteWrapper, setNoteWrapper] = useState<HTMLDivElement | null>(null);
  const [isSmol, setIsSmol] = useState(true);
  const [isChanged, setIsChanged] = useState(false);

  //handlers
  async function handleSave() {
    if (!selectedNote) return;
    if (title.trim() === "") {
      toast.error("Title can't be empty");
      return;
    }

    setIsLoading(true);

    toast.promise(
      updateNote(selectedNote.id, { content: value, title })
        .then(() => {
          setIsChanged(false);
        })
        .finally(() => {
          setIsLoading(false);
        }),
      {
        loading: "Updating...",
        success: "Updated",
        error: "Failed to save",
      }
    );

    setEditing(false);
  }
  async function handleDelete() {
    if (!selectedNote) return;

    setIsLoading(true);
    try {
      toast.promise(deleteNote(selectedNote.id), {
        loading: "Deleting...",
        success: "Deleted",
        error: "Failed to delete",
      });
      setIsChanged(false);
      router.push("/");
      if (isSmol && NoteWrapper) {
        NoteWrapper.style.transform = "translateX(0%)";
      }
    } finally {
      setIsLoading(false);
    }
  }
  // AI Features
  const AI = useAiActions({ value, setValue, setTitle, setIsLoading });
  // all useEffects here
  useEffect(() => {
    if (!editing) {
      setValue(selectedNote?.content ?? "");
      setTitle(selectedNote?.title ?? "");
    }
  }, [selectedNote, editing]);
  useEffect(() => {
    if (!selectedNote) return;
    const contentChanged = value !== (selectedNote.content ?? "");
    const titleChanged = title !== (selectedNote.title ?? "");

    setIsChanged(contentChanged || titleChanged);
  }, [value, title, selectedNote]);

  useEffect(() => {
    if (!isSmol) return;
    if (!NoteWrapper) {
      const wrapper = document.querySelector(".NoteWrapper") as HTMLDivElement;
      setNoteWrapper(wrapper);
    }
    if (NoteWrapper && selectedNote) {
      NoteWrapper.style.transform = "translateX(-100%)";
    }
  }, [selectedNote, NoteWrapper, isSmol]);

  useEffect(() => {
    const handleResize = () => {
      setIsSmol(window.innerWidth < 768);
    };
    setIsSmol(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  if (!selectedNote) {
    return (
      <Card className="rounded-none h-full">
        <CardHeader>
          <CardTitle>No note selected</CardTitle>
        </CardHeader>
        <CardContent>Select a note on the left.</CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-none h-full">
      <CardHeader className="flex justify-between items-center gap-2">
        {isSmol && (
          <Button
            variant={"ghost"}
            onClick={() => {
              if (NoteWrapper) {
                NoteWrapper.style.transform = "translateX(0%)";
                router.push("/");
              }
              setSelectedNote(null)
            }}
          >
            <ArrowLeft />
          </Button>
        )}
        <Input
          value={title}
          style={{ background: "none" }}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title..."
          className="md:text-2xl text-center md:text-left bg-transparent rounded-none px-1 font-medium border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
        />

        {isSmol ? (
          <SmolActionsMenu
            isLoading={isLoading}
            isChanged={isChanged}
            handleSave={handleSave}
            handleDelete={handleDelete}
            AiFeatures={AI}
          />
        ) : (
          <div className="flex gap-2 justify-center items-center">
            <Button
              disabled={isLoading}
              variant="ghost"
              size="lg"
              className="red"
              onClick={handleDelete}
            >
              {" "}
              <Trash />{" "}
            </Button>{" "}
            <Separator orientation="vertical" className="" />
            <Button
              disabled={isLoading || !isChanged}
              variant="ghost"
              size="lg"
              onClick={handleSave}
              className="bg-gray-600/10"
            >
              {" "}
              {isLoading ? (
                <Loading />
              ) : (
                <>
                  Save
                  <CheckCircle />
                </>
              )}
            </Button>
            <AiBtn isLoading={isLoading} AI={AI} />{" "}
          </div>
        )}
      </CardHeader>

      <Separator className="hidden md:block" />

      <CardContent
        onClick={() => !editing && setEditing(true)}
        className="cursor-text h-full overflow-scroll pb-12 md:pb-0"
      >
        <RichTextEditor content={value} setContent={setValue} />
      </CardContent>
    </Card>
  );
}
