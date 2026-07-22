export const DECISIONS = ["Keep", "Donate", "Toss", "Archive"] as const;
export type Decision = (typeof DECISIONS)[number];

export const SUGGESTED_CATEGORIES = [
  "Files",
  "Books",
  "Clothing",
  "Miscellaneous",
] as const;
