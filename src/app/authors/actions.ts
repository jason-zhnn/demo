"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function updateAuthor(id: number, formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) throw new Error("Name is required");

  const bio = String(formData.get("bio") ?? "").trim() || null;

  await prisma.author.update({ where: { id }, data: { name, bio } });
  revalidatePath(`/authors/${id}`);
  revalidatePath("/authors");
  redirect(`/authors/${id}`);
}

export async function deleteAuthor(id: number) {
  await prisma.author.delete({ where: { id } });
  revalidatePath("/authors");
  redirect("/authors");
}
