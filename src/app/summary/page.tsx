import { prisma } from "@/lib/prisma";
import { DECISIONS } from "@/lib/constants";

export default async function SummaryPage() {
  const items = await prisma.item.findMany();
  const total = items.length;

  const byCategory = Object.entries(
    items.reduce<Record<string, number>>((acc, item) => {
      acc[item.category] = (acc[item.category] ?? 0) + 1;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]);

  const byDecision = DECISIONS.map((d) => ({
    decision: d,
    count: items.filter((i) => i.decision === d).length,
  }));

  if (total === 0) {
    return (
      <p className="rounded-lg border border-dashed border-neutral-300 p-6 text-center text-sm text-neutral-500">
        Nothing in the inventory yet — add items on the Inventory page first.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Summary Report</h1>
        <a
          href="/api/export"
          className="rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm font-medium hover:bg-neutral-50"
        >
          Export to Excel
        </a>
      </div>

      <p className="text-sm text-neutral-600">
        {total} item{total === 1 ? "" : "s"} cataloged.
      </p>

      <section className="rounded-lg border border-neutral-200 bg-white p-4">
        <h2 className="mb-3 text-base font-semibold">By category</h2>
        <ul className="space-y-2">
          {byCategory.map(([category, count]) => (
            <li key={category} className="flex items-center gap-3">
              <span className="w-32 flex-shrink-0 truncate text-sm">
                {category}
              </span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-neutral-100">
                <div
                  className="h-full rounded-full bg-neutral-900"
                  style={{ width: `${(count / total) * 100}%` }}
                />
              </div>
              <span className="w-8 flex-shrink-0 text-right text-sm text-neutral-500">
                {count}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-lg border border-neutral-200 bg-white p-4">
        <h2 className="mb-3 text-base font-semibold">By decision</h2>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {byDecision.map(({ decision, count }) => (
            <li
              key={decision}
              className="rounded-md border border-neutral-200 p-3 text-center"
            >
              <div className="text-2xl font-semibold">{count}</div>
              <div className="text-xs text-neutral-500">{decision}</div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
