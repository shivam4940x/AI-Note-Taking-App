import { Note, Prisma } from "@/generated";
import prisma from "@/prisma/main.prisma";
import { InterfaceGetResult } from "@/types/crud.interfaces";

export async function createNote(userId: string, title: string, content = "") {
  try {
    const note = await prisma.note.create({
      data: { title, content, userId },
    });
    return { ok: true, note };
  } catch (err) {
    console.error(err);
    return { ok: false, error: "Failed to create note" };
  }
}

export async function getNotes(
  userId: string,
  {
    page = 1,
    limit = 10,
    query = "",
  }: {
    page?: number;
    limit?: number;
    query?: string;
  } = {}
): Promise<InterfaceGetResult<Note[]>> {
  try {
    const skip = (page - 1) * limit;

    const where: Prisma.NoteFindManyArgs["where"] = {
      userId,
      title: { contains: query.trim(), mode: "insensitive" },
    };

    const [notes, total] = await Promise.all([
      prisma.note.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.note.count({ where }),
    ]);

    return {
      ok: true,
      data: notes,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  } catch (err) {
    console.error(err);
    return { ok: false, error: "Failed to fetch notes" };
  }
}
export async function getNotesLen(userId: string) {
  try {
    const total = await prisma.note.count({ where: { userId } });
    return {
      ok: true,
      data: total,
    };
  } catch (err) {
    console.error(err);
    return { ok: false, error: "Failed to fetch notes" };
  }
}

export async function getNote(userId: string, noteId: string) {
  try {
    const note = await prisma.note.findFirst({
      where: { id: noteId, userId },
    });
    if (!note) return { ok: false, error: "Note not found" };
    return { ok: true, note };
  } catch {
    return { ok: false, error: "Failed to fetch note" };
  }
}

export async function updateNote(
  noteId: string,
  data: { title?: string; content?: string }
) {
  try {
    const note = await prisma.note.update({
      where: { id: noteId },
      data,
    });

    return { ok: true, note };
  } catch (err) {
    console.error(err);
    return { ok: false, error: "Failed to update note" };
  }
}

export async function deleteNote(noteId: string) {
  try {
    await prisma.note.delete({
      where: { id: noteId },
    });
    return { ok: true };
  } catch {
    return { ok: false, error: "Failed to delete note" };
  }
}
