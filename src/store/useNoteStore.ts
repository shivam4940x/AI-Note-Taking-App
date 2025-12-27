import { create } from "zustand";

const STORAGE_KEY = "notes";
export type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
};

const loadNotes = (): Note[] => {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
};

const saveNotes = (notes: Note[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
};

interface NoteStore {
  notes: Note[];
  selectedNote: Note | null;

  setNotes: (notes: Note[]) => void;
  setSelectedNote: (note: Note | null) => void;

  fetchNotes: () => void;
  addNewNote: (data: { title: string; content?: string }) => void;
  updateNote: (id: string, data: Partial<Note>) => void;
  deleteNote: (id: string) => void;
}

export const useNoteStore = create<NoteStore>((set, get) => ({
  notes: [],
  selectedNote: null,

  setNotes: (notes) => {
    saveNotes(notes);
    set({ notes });
  },

  setSelectedNote: (note) => set({ selectedNote: note }),

  fetchNotes: () => {
    let notes = loadNotes();

    if (notes.length === 0) {
      const welcome: Note = {
        id: crypto.randomUUID(),
        title: "Welcome 👋",
        content: `<h2>Welcome to your notes!</h2><p>Start writing 🚀</p>`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      notes = [welcome];
      saveNotes(notes);
    }

    set({ notes });
  },

  addNewNote: ({ title, content = "" }) => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      title,
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const notes = [newNote, ...get().notes];
    saveNotes(notes);
    set({ notes, selectedNote: newNote });
  },

  updateNote: (id, data) => {
    const notes = get().notes.map((n) =>
      n.id === id ? { ...n, ...data, updatedAt: new Date() } : n
    );
    saveNotes(notes);
    set({ notes });
  },

  deleteNote: (id) => {
    const notes = get().notes.filter((n) => n.id !== id);
    saveNotes(notes);
    set({ notes, selectedNote: null });
  },
}));
