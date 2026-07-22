import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import AddItemForm from "./AddItemForm";
import FilterBar from "./FilterBar";
import ItemList from "./ItemList";

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; decision?: string }>;
}) {
  const { category, decision } = await searchParams;

  const [items, allItems] = await Promise.all([
    prisma.item.findMany({
      where: {
        category: category || undefined,
        decision: decision || undefined,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.item.findMany({ select: { category: true } }),
  ]);

  const categories = Array.from(new Set(allItems.map((i) => i.category))).sort();

  return (
    <div className="flex flex-col gap-6">
      <AddItemForm />

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">
            Inventory ({items.length})
          </h2>
          <Suspense>
            <FilterBar categories={categories} />
          </Suspense>
        </div>
        <ItemList items={items} />
      </div>
    </div>
  );
}
