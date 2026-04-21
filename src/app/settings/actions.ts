"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { applyImport, type ExportBundle } from "@/lib/dataExchange";

export async function importFromJson(formData: FormData) {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("Select a JSON export file");
  }

  const text = await file.text();
  let parsed: ExportBundle;
  try {
    parsed = JSON.parse(text) as ExportBundle;
  } catch {
    throw new Error("File is not valid JSON");
  }

  const result = await applyImport(parsed);
  revalidatePath("/library");
  revalidatePath("/authors");
  revalidatePath("/shelves");
  revalidatePath("/tags");
  revalidatePath("/goals");
  redirect(`/settings?created=${result.created}&skipped=${result.skipped}`);
}
