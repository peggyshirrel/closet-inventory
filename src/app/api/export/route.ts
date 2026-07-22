import { prisma } from "@/lib/prisma";

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export async function GET() {
  const items = await prisma.item.findMany({ orderBy: { createdAt: "asc" } });

  const header = ["Name", "Category", "Decision", "Notes", "Added"];
  const rows = items.map((item) => [
    item.name,
    item.category,
    item.decision,
    item.notes ?? "",
    item.createdAt.toISOString().slice(0, 10),
  ]);

  const csv = [header, ...rows]
    .map((row) => row.map((cell) => csvEscape(String(cell))).join(","))
    .join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="closet-inventory.csv"`,
    },
  });
}
