"use client";

import { useRef, useState, useTransition } from "react";
import { createItem } from "./actions";
import { DECISIONS, SUGGESTED_CATEGORIES } from "@/lib/constants";

export default function AddItemForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);
    try {
      await createItem(formData);
      formRef.current?.reset();
    } catch {
      setError("Couldn't add that item — make sure it has a name and category.");
    }
  }

  return (
    <form
      ref={formRef}
      action={(formData) => startTransition(() => handleSubmit(formData))}
      className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm"
    >
      <h2 className="mb-3 text-base font-semibold">Add an item</h2>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Name</label>
          <input
            name="name"
            required
            placeholder="e.g. Old tax returns 2019"
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Category</label>
          <input
            name="category"
            required
            list="category-suggestions"
            placeholder="e.g. Files"
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
          <datalist id="category-suggestions">
            {SUGGESTED_CATEGORIES.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Decision</label>
          <select
            name="decision"
            defaultValue="Keep"
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          >
            {DECISIONS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Photo (optional)</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            className="w-full text-sm"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium">Notes (optional)</label>
          <textarea
            name="notes"
            rows={2}
            placeholder="Anything worth remembering about this item"
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>
      </div>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="mt-4 rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {isPending ? "Adding…" : "Add item"}
      </button>
    </form>
  );
}
