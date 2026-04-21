"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { toSlug } from "@/lib/slug";

export async function createTag(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) throw new Error("Name is required");

  const color = String(formData.get("color") ?? "").trim() || null;
  const slug = toSlug(name);

  await prisma.tag.create({ data: { name, slug, color } });
  revalidatePath("/tags");
  redirect("/tags");
}

export async function deleteTag(id: number) {
  await prisma.tag.delete({ where: { id } });
  revalidatePath("/tags");
  redirect("/tags");
}

export async function toggleBookTag(bookId: number, tagId: number) {
  const existing = await prisma.bookTag.findUnique({
    where: { bookId_tagId: { bookId, tagId } },
  });
  if (existing) {
    await prisma.bookTag.delete({
      where: { bookId_tagId: { bookId, tagId } },
    });
  } else {
    await prisma.bookTag.create({ data: { bookId, tagId } });
  }
  revalidatePath(`/books/${bookId}`);
  revalidatePath("/tags");
}
