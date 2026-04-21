"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

function parseOptionalInt(value: FormDataEntryValue | null): number | null {
  if (typeof value !== "string" || value.trim() === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export async function createNote(bookId: number, formData: FormData) {
  const body = String(formData.get("body") ?? "").trim();
  if (!body) throw new Error("Note body is required");

  const page = parseOptionalInt(formData.get("page"));

  await prisma.note.create({ data: { bookId, body, page } });
  revalidatePath(`/books/${bookId}`);
  revalidatePath("/notes");
}

export async function deleteNote(id: number) {
  const note = await prisma.note.findUnique({ where: { id } });
  await prisma.note.delete({ where: { id } });
  if (note) revalidatePath(`/books/${note.bookId}`);
  revalidatePath("/notes");
}
