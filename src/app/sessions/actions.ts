"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

function parseOptionalDate(value: FormDataEntryValue | null): Date | null {
  if (typeof value !== "string" || value.trim() === "") return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export async function createSession(bookId: number, formData: FormData) {
  const startedAt = parseOptionalDate(formData.get("startedAt")) ?? new Date();
  const endedAt = parseOptionalDate(formData.get("endedAt"));
  const pagesRaw = String(formData.get("pagesRead") ?? "").trim();
  const pagesRead = pagesRaw === "" ? 0 : Number(pagesRaw);
  if (!Number.isFinite(pagesRead) || pagesRead < 0) throw new Error("Invalid pages");

  await prisma.readingSession.create({
    data: { bookId, startedAt, endedAt, pagesRead },
  });
  revalidatePath(`/books/${bookId}`);
  revalidatePath("/sessions");
  revalidatePath("/stats");
}

export async function deleteSession(id: number) {
  const session = await prisma.readingSession.findUnique({ where: { id } });
  await prisma.readingSession.delete({ where: { id } });
  if (session) revalidatePath(`/books/${session.bookId}`);
  revalidatePath("/sessions");
  revalidatePath("/stats");
}
