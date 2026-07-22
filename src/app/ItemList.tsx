"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { deleteItem, updateItem } from "./actions";
import { DECISIONS } from "@/lib/constants";
import type { Item } from "@/generated/prisma/client";

const DECISION_STYLES: Record<string, string> = {
  Keep: "bg-emerald-100 text-emerald-800",
  Donate: "bg-blue-100 text-blue-800",
  Toss: "bg-red-100 text-red-800",
  Archive: "bg-amber-100 text-amber-800",
};

export default function ItemList({ items }: { items: Item[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-neutral-300 p-6 text-center text-sm text-neutral-500">
        No items yet — add your first one above.
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {items.map((item) =>
        editingId === item.id ? (
          <EditRow
            key={item.id}
            item={item}
            onDone={() => setEditingId(null)}
          />
        ) : (
          <ViewRow
            key={item.id}
            item={item}
            onEdit={() => setEditingId(item.id)}
          />
        )
      )}
    </ul>
  );
}

function ViewRow({ item, onEdit }: { item: Item; onEdit: () => void }) {
  const [isPending, startTransition] = useTransition();

  return (
    <li className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-white p-3">
      {item.imageUrl ? (
        <Image
          src={item.imageUrl}
          alt={item.name}
          width={48}
          height={48}
          className="h-12 w-12 rounded-md object-cover"
        />
      ) : (
        <div className="h-12 w-12 flex-shrink-0 rounded-md bg-neutral-100" />
      )}

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate font-medium">{item.name}</span>
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
              DECISION_STYLES[item.decision] ?? "bg-neutral-100 text-neutral-800"
            }`}
          >
            {item.decision}
          </span>
        </div>
        <p className="truncate text-sm text-neutral-500">
          {item.category}
          {item.notes ? ` · ${item.notes}` : ""}
        </p>
      </div>

      <div className="flex flex-shrink-0 gap-2 text-sm">
        <button onClick={onEdit} className="text-neutral-600 hover:underline">
          Edit
        </button>
        <button
          disabled={isPending}
          onClick={() =>
            startTransition(async () => {
              if (confirm(`Remove "${item.name}" from the inventory?`)) {
                await deleteItem(item.id);
              }
            })
          }
          className="text-red-600 hover:underline disabled:opacity-50"
        >
          Delete
        </button>
      </div>
    </li>
  );
}

function EditRow({ item, onDone }: { item: Item; onDone: () => void }) {
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    await updateItem(item.id, formData);
    onDone();
  }

  return (
    <li className="rounded-lg border border-neutral-300 bg-white p-3">
      <form
        action={(formData) => startTransition(() => handleSubmit(formData))}
        className="grid gap-2 sm:grid-cols-2"
      >
        <input
          name="name"
          defaultValue={item.name}
          required
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
        <input
          name="category"
          defaultValue={item.category}
          required
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
        <select
          name="decision"
          defaultValue={item.decision}
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
        >
          {DECISIONS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <input
          name="notes"
          defaultValue={item.notes ?? ""}
          placeholder="Notes"
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />

        <div className="flex gap-2 sm:col-span-2">
          <button
            type="submit"
            disabled={isPending}
            className="rounded-md bg-neutral-900 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50"
          >
            {isPending ? "Saving…" : "Save"}
          </button>
          <button
            type="button"
            onClick={onDone}
            className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm"
          >
            Cancel
          </button>
        </div>
      </form>
    </li>
  );
}
