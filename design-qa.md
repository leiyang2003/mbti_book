# Design QA

## Evidence

- Source visual truth: `selected-design.png`（1487 × 1058）。
- Final Japanese homepage: `implementation-bilingual-ja-final.jpg`（1487 × 938）。
- Same-state full-view comparison: `design-qa-bilingual-comparison.png`（2974 × 938）。源图裁切至 1487 × 938 后与实现并排，像素密度均为 1×。
- Chinese homepage: `implementation-bilingual-zh-home.jpg`（1487 × 938）。
- Chinese reader: `implementation-bilingual-zh-reader.jpg`（1487 × 938）。
- Public guestbook: `implementation-bilingual-comments.jpg`（1487 × 938）。
- Final Chinese mobile reader: `implementation-bilingual-zh-mobile-final.jpg`（390 × 844）。
- State: bilingual homepage, complete-book reader, guestbook empty/submitted state, desktop and mobile.

## Findings

No actionable P0, P1, or P2 differences remain.

- Fonts and typography: Japanese keeps the verified Mincho stack; Chinese resolves to `Songti SC` first for title, body and UI. The Chinese chapter page preserves the Premium edition's restrained Songti hierarchy, comfortable line length and 1.98–2.05 long-form line height. Long mixed Latin/Chinese headings wrap without clipping.
- Spacing and layout rhythm: the original hero, 748 px first-screen boundary, chapter preview and watercolor composition remain aligned with the selected source. The extra bilingual and message controls make desktop navigation slightly denser but preserve grouping and do not collide at 1487 px. The guestbook extends the same editorial grid instead of introducing a dashboard/card style.
- Colors and tokens: paper, blue-gray `#536B7A`, warm gold `#B3915A`, charcoal and low-saturation watercolor remain consistent. Form success/error colors are restrained and readable.
- Image quality and asset fidelity: both languages reuse the exact 12 GPT Image 2 Premium assets whose Chinese and Japanese copies were byte-identical. No screenshot crop, CSS drawing, handcrafted SVG, gradient or placeholder imagery is used.
- Copy and content: the Japanese reader contains 17 locked items and 170,434 bytes. The Chinese Premium reader contains 17 byte-equivalent source files and 143,071 bytes. Display-only internal note headings become `本章の注` / `本章注释`; source Markdown is unchanged.
- Icons: language controls are text; reader, menu, bookmark, message and send icons use Phosphor with consistent weight and alignment.
- Responsiveness: 390 px reader has a 68 px header, icon-only message/menu controls, no horizontal page overflow and a complete 17-item drawer. The language switch remains available inside the mobile drawer.
- Accessibility: semantic landmarks, labels, dialog naming, `aria-current`, `aria-pressed`, alt text, focus rings, Escape close, reduced-motion handling and visible form status roles are present.
- Guestbook states: empty, typing count, submitting, success, error and populated comment states are implemented. User content is rendered as text, preserving line breaks without injecting HTML.

## Comparison history

### Existing visual-system pass

- Earlier P1/P2 hero crop, title wrapping and preview proportion issues were fixed in the original Japanese build and remain fixed in the bilingual version.

### Bilingual and guestbook pass

- [P2] Initial mobile reader header wrapped the visible `目录` label vertically and hid the language switch after entering a chapter.
- Fix: mobile header now uses compact icon-only message/menu controls; the complete drawer carries the Japanese/Chinese switch and preserves the current chapter across languages.
- Post-fix evidence: `implementation-bilingual-zh-mobile-final.jpg`; measured page overflow is 0 px.
- Residual P3: desktop navigation is denser than the original marketing mock because language and guestbook are real product controls. It remains visually grouped and readable; no functionality is hidden.

## Interactions tested

- Japanese and Chinese homepage switching updates copy, `lang`, title, font stack and URL state.
- Opening Chinese full book enters the correct guide; Chinese table of contents contains 17 items.
- Language switching in the reader preserves chapter index and changes the URL between `#zh-read-*` and `#ja-read-*`.
- Chinese chapter 2 renders one Markdown table and the display heading `本章注释`.
- Reader message action moves to the guestbook.
- Local guestbook submission writes a comment, displays success, adds it to the public list and persists after page reload.
- Mobile drawer contains 17 items and both language controls.
- Desktop and 390 px mobile horizontal overflow: 0 px.
- Browser console warnings/errors: 0.

## Content and build verification

- Chinese Premium source integrity: 17/17 files byte-equivalent to `chinese/manuscript/zh/`.
- Japanese source integrity: 17/17 files retained.
- `npm run build`: passed.
- `npm run test:comments`: 3/3 passed.
- `npm run test:sites`: 4/4 passed.
- Production persistence contract: `api/comments.js` reads and writes `comments:data/comments.json`; write token is server-only.

## Focused comparison rationale

The source mock only specifies the Japanese homepage. Its full-view comparison is therefore the fidelity gate. Chinese reader and guestbook have no source-state mock; they were evaluated against the locked Chinese Premium design brief, the existing reader system and the original watercolor/token set. Separate focused screenshots make typography, form surfaces and responsive controls readable at inspection size.

final result: passed
