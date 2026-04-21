"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

function parseOptionalInt(value: FormDataEntryValue | null): number | null {
  if (typeof value !== "string" || value.trim() === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseOptionalString(value: FormDataEntryValue | null): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

function parseAuthorNames(value: FormDataEntryValue | null): string[] {
  if (typeof value !== "string") return [];
  return value
    .split(",")
    .map((name) => name.trim())
    .filter((name) => name.length > 0);
}

async function upsertAuthors(names: string[]): Promise<number[]> {
  const ids: number[] = [];
  for (const name of names) {
    const author = await prisma.author.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    ids.push(author.id);
  }
  return ids;
}

export async function createBook(formData: FormData) {
  const title = parseOptionalString(formData.get("title"));
  if (!title) throw new Error("Title is required");

  const authorIds = await upsertAuthors(parseAuthorNames(formData.get("authors")));

  const book = await prisma.book.create({
    data: {
      title,
      subtitle: parseOptionalString(formData.get("subtitle")),
      isbn: parseOptionalString(formData.get("isbn")),
      pageCount: parseOptionalInt(formData.get("pageCount")),
      coverUrl: parseOptionalString(formData.get("coverUrl")),
      publishedYear: parseOptionalInt(formData.get("publishedYear")),
      authors: { create: authorIds.map((authorId) => ({ authorId })) },
    },
  });

  revalidatePath("/library");
  redirect(`/books/${book.id}`);
}

export async function updateBook(id: number, formData: FormData) {
  const title = parseOptionalString(formData.get("title"));
  if (!title) throw new Error("Title is required");

  const authorIds = await upsertAuthors(parseAuthorNames(formData.get("authors")));

  await prisma.$transaction([
    prisma.bookAuthor.deleteMany({ where: { bookId: id } }),
    prisma.book.update({
      where: { id },
      data: {
        title,
        subtitle: parseOptionalString(formData.get("subtitle")),
        isbn: parseOptionalString(formData.get("isbn")),
        pageCount: parseOptionalInt(formData.get("pageCount")),
        coverUrl: parseOptionalString(formData.get("coverUrl")),
        publishedYear: parseOptionalInt(formData.get("publishedYear")),
        authors: { create: authorIds.map((authorId) => ({ authorId })) },
      },
    }),
  ]);

  revalidatePath("/library");
  revalidatePath(`/books/${id}`);
  redirect(`/books/${id}`);
}

export async function deleteBook(id: number) {
  await prisma.book.delete({ where: { id } });
  revalidatePath("/library");
  redirect("/library");
}
