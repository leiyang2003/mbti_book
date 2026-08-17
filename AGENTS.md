# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## Selected direction

- The authoritative visual target is `selected-design.png`, the first displayed ideation result selected by the user.
- Preserve the Japanese premium-book identity: quiet, warm, restrained; Mincho-led typography; blue-gray `#536B7A`, warm gold `#B3915A`, warm paper `#F5F2EC`; generous editorial whitespace; original GPT Image 2 watercolor illustrations.
- The prototype's core path is home hero → chapter preview → complete-book reader. The reader must expose all 17 locked Japanese-edition items: guide, prologue, chapters 1–12, epilogue, 30-day workbook, and references.
- Preserve the byte-equivalent Markdown snapshots in `src/content/`. Display-layer adjustments may rename the internal heading `注（編集用）` to `本章の注`, but must not rewrite or omit source content.
- The same reader also exposes the 17 locked Chinese Premium items from `src/content/zh/`. Chinese book and UI text use the `Songti SC`-first font stack and the same Premium watercolor assets. Keep chapter indices and slugs aligned across languages so readers can switch without losing their place.
- The reader also exposes the 17 locked `en-US` items from `src/content/en/`. English uses the same selected visual composition, a Baskerville-first reading stack, localized alt text and UI, and the same aligned chapter indices/slugs. Do not translate from the Chinese snapshot; the English edition is locked directly to the Japanese source.
- Keep the full table of contents, current-chapter state, previous/next navigation, bookmark state, reading progress, tables, notes, lists, and external links accessible on desktop and mobile.
- Public guestbook messages live in the fixed `data/comments.json` file on the GitHub `comments` branch. Production writes go through `api/comments.js`; never expose `COMMENTS_GITHUB_TOKEN` to browser code or commit it. Local preview uses ignored `.local/comments.json` data. Preserve backward compatibility with existing comments and allow new entries to carry a `ja`, `zh`, or `en` locale tag while remaining visible in all editions.
- Do not introduce 16-type avatar grids, quiz-first framing, SaaS card stacks, gamification, gradients, glassmorphism, or corporate-training styling.
