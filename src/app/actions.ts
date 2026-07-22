"use server";

import { revalidatePath } from "next/cache";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";
import { DECISIONS } from "@/lib/constants";

async function saveImage(file: File | null): Promise<string | undefined> {
  if (!file || file.size === 0) return undefined;

  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });

  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  const fileName = `${Date.now()}-${safeName}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadsDir, fileName), buffer);

  return `/uploads/${fileName}`;
}

export async function createItem(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const decisionRaw = String(formData.get("decision") ?? "Keep");
  const notes = String(formData.get("notes") ?? "").trim();
  const image = formData.get("image") as File | null;

  if (!name || !category) {
    throw new Error("Name and category are required");
  }

  const decision = DECISIONS.includes(decisionRaw as (typeof DECISIONS)[number])
    ? decisionRaw
    : "Keep";

  const imageUrl = await saveImage(image);

  await prisma.item.create({
    data: {
      name,
      category,
      decision,
      notes: notes || undefined,
      imageUrl,
    },
  });

  revalidatePath("/");
  revalidatePath("/summary");
}

export async function updateItem(id: string, formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const decisionRaw = String(formData.get("decision") ?? "Keep");
  const notes = String(formData.get("notes") ?? "").trim();

  if (!name || !category) {
    throw new Error("Name and category are required");
  }

  const decision = DECISIONS.includes(decisionRaw as (typeof DECISIONS)[number])
    ? decisionRaw
    : "Keep";

  await prisma.item.update({
    where: { id },
    data: { name, category, decision, notes: notes || null },
  });

  revalidatePath("/");
  revalidatePath("/summary");
}

export async function deleteItem(id: string) {
  await prisma.item.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/summary");
}
