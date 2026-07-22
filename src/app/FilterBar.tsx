"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { DECISIONS } from "@/lib/constants";

export default function FilterBar({ categories }: { categories: string[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const category = searchParams.get("category") ?? "";
  const decision = searchParams.get("decision") ?? "";

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-center gap-3 text-sm">
      <div className="flex items-center gap-2">
        <label htmlFor="category-filter" className="font-medium">
          Category
        </label>
        <select
          id="category-filter"
          value={category}
          onChange={(e) => updateParam("category", e.target.value)}
          className="rounded-md border border-neutral-300 px-2 py-1"
        >
          <option value="">All</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="decision-filter" className="font-medium">
          Decision
        </label>
        <select
          id="decision-filter"
          value={decision}
          onChange={(e) => updateParam("decision", e.target.value)}
          className="rounded-md border border-neutral-300 px-2 py-1"
        >
          <option value="">All</option>
          {DECISIONS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      {(category || decision) && (
        <button
          onClick={() => router.push("/")}
          className="text-neutral-500 underline"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
