import { create } from "zustand";
import { Note } from "@/generated";
import { InterfaceGet, InterfaceGetError } from "@/types/crud.interfaces";

interface NoteStore {
  notes: Note[];
  setNotes: (notes: Note[]) => void;

  selectedNoteId: string | null;
  setSelectedNoteId: (id: string | null) => void;

  fetchNotes: (opts?: {
    page?: number;
    limit?: number;
    query?: string;
  }) => Promise<void>;

  updateNote: (id: string, data: Partial<Note>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  addNewNote: (data: { title: string; content?: string }) => Promise<void>;
}

export const useNoteStore = create<NoteStore>((set, get) => ({
  notes: [],
  setNotes: (notes) => set({ notes }),

  selectedNoteId: null,
  setSelectedNoteId: (id) => set({ selectedNoteId: id }),

  fetchNotes: async (opts = {}) => {
    const { page = 1, limit = 10 } = opts;
    if (get().notes.length > 0) return;
    const res = await fetch(`/api/notes?page=${page}&limit=${limit}`, {
      cache: "no-store",
    });
    const result: InterfaceGet<Note[]> | InterfaceGetError = await res.json();
    if (result.ok) set({ notes: result.data as Note[] });
  },
  addNewNote: async (data: { title: string; content?: string }) => {
    await fetch("/api/notes/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  },
  updateNote: async (id: string, data: Partial<Note>) => {
    await fetch(`/api/notes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    set((state) => ({
      notes: state.notes.map((note) =>
        note.id === id ? { ...note, ...data } : note
      ),
    }));
  },
  deleteNote: async (id: string) => {
    await fetch(`/api/notes/${id}`, {
      method: "DELETE",
    });
    set((state) => ({
      notes: state.notes.filter((note) => note.id !== id),
    }));
  },
}));
