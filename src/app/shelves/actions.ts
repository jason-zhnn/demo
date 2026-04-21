"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { toSlug } from "@/lib/slug";

export async function createShelf(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) throw new Error("Name is required");

  const description = String(formData.get("description") ?? "").trim() || null;
  const slug = toSlug(name);

  await prisma.shelf.create({ data: { name, slug, description } });
  revalidatePath("/shelves");
  redirect("/shelves");
}

export async function deleteShelf(id: number) {
  await prisma.shelf.delete({ where: { id } });
  revalidatePath("/shelves");
  redirect("/shelves");
}

export async function toggleBookOnShelf(bookId: number, shelfId: number) {
  const existing = await prisma.bookShelf.findUnique({
    where: { bookId_shelfId: { bookId, shelfId } },
  });
  if (existing) {
    await prisma.bookShelf.delete({
      where: { bookId_shelfId: { bookId, shelfId } },
    });
  } else {
    await prisma.bookShelf.create({ data: { bookId, shelfId } });
  }
  revalidatePath(`/books/${bookId}`);
  revalidatePath("/shelves");
}
