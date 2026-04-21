"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function upsertGoal(formData: FormData) {
  const yearRaw = String(formData.get("year") ?? "").trim();
  const targetRaw = String(formData.get("targetBooks") ?? "").trim();
  const year = Number(yearRaw);
  const targetBooks = Number(targetRaw);
  if (!Number.isFinite(year) || !Number.isFinite(targetBooks)) {
    throw new Error("Year and target must be numbers");
  }

  await prisma.goal.upsert({
    where: { year },
    update: { targetBooks },
    create: { year, targetBooks },
  });
  revalidatePath("/goals");
  revalidatePath("/stats");
  revalidatePath("/");
}

export async function deleteGoal(year: number) {
  await prisma.goal.delete({ where: { year } });
  revalidatePath("/goals");
  revalidatePath("/stats");
  revalidatePath("/");
}
