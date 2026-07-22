---
title: "Closet Inventory"
slug: "closet-inventory"
created: 2026-07-22
updated: 2026-07-22
status: complete
---

# Closet Inventory — Spec

## D1 — Dream
**Pain Point:** A closet packed with a mix of stuff — files, books, general items — with no clear picture of everything that's in there, making it hard to decide what to keep, donate, toss, or archive.
**Objective:** A simple app to catalog everything as you go through the closet, organized by category, ending in a summary report you can use to make decluttering decisions.
**User Stories:**
- As you, I want to add an item with a name, category, and optional notes, so I have a running record of everything in the closet.
- As you, I want items organized into categories (e.g. Files, Books, Clothing, Miscellaneous — customizable), so I can see what's taking up the most space.
- As you, I want to mark each item as Keep / Donate / Toss / Archive, so I can act on my decluttering decisions (Archive = important, goes into long-term storage rather than staying in active use).
- As you, I want a summary report once I've entered everything — totals by category and by decision — so I have a clear picture to act on.
- As you, I want to edit or remove an item I've already added, in case I made a mistake.

## D2 — Design

### Pages & Screens

#### Inventory
- [MVP] Add item (name, category, decision tag: Keep / Donate / Toss / Archive, optional notes/photo)
- [MVP] View running list of all items added
- [MVP] Filter list by category or decision tag
- [MVP] Edit or delete an existing item

#### Summary Report
- [MVP] Totals by category (e.g. 12 Books, 8 Files, 20 Miscellaneous)
- [MVP] Totals by decision (e.g. 15 Keep, 10 Donate, 5 Toss, 10 Archive)
- [MVP] Generated after items have been entered — viewable any time, updates as you add more

### User Flows

**Cataloging session:** Open Inventory → add item(s) as you go through the closet → optionally filter/review the list → tag each item's decision → check Summary Report for the breakdown.

### Visual Design
- Not decided — /design will handle it automatically
- Mockup: skipped

## D3 — Develop
**Database:** Items list — each item has a name, category, decision tag (Keep/Donate/Toss/Archive), and optional notes. Categories and summary totals are derived from this list.
**Tools & Integrations:** Data should live in or be exportable to Google Sheets/Excel, so the inventory can be viewed/edited outside the app if needed.
**Tech Stack:** Not specified — /build will pick a sensible default, accounting for the spreadsheet export/sync requirement above.
**Constraints:** Single user, no accounts/login needed. Simple, one-shot build — no phased rollout required.
**Agile Loop:** Not needed — simple project, one-shot build.
**Effort Review:** Not needed — no high-risk or low-confidence features identified.
