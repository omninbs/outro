# outro — house rules

An outro-page generator: fill in a few fields and get a page that is ready to screenshot. This is the only rulebook for AI; change it in the same commit as the rule, command, directory, or environment fact it covers.

## How to work

- State the plan in Chinese before starting; report only conclusions, changed files, and validation.
- Never edit `README.md` — it is the author's file, not the AI's.
- Batch parallel tool calls; save tokens: skip reconciliation tests, probes, and online checks, and merge commands where possible; keep each command under 10s.
- Run the gate, then commit. When a tradeoff is unclear, ask first — do not re-argue a rejected direction.

## Commits

| Rule | Value |
|---|---|
| Shape | one thing per commit; a single line `<type>: <description>` |
| Style | English, ≤50 chars, no punctuation |
| Types | `feat` / `fix` / `docs` / `style` / `refactor` / `test` / `chore` |
| Push | only when explicitly asked (prefix `GIT_SSH_COMMAND="ssh -F /dev/null"`); never verify online afterwards |
| Excluded | `dist/` is not committed; throwaway tools live in `.git/` |

## Validation

No lint. The gate is one line:

```bash
npm run typecheck && npm test && npm run build
```

| Topic | Rule |
|---|---|
| Unit tests | touch only **pure functions** (`tests/`): data movement, archive migration, content filtering, canvas geometry. UI and styling are not tested — check them by eye; no assertion beats looking |
| Dev server | http://localhost:5173; a background one is often already running, so do not start another. Transforms are cached per second: after editing a file `touch` it and `curl` for a signature string (compare module by module). Restart it first if a style change is invisible |
| Probes | only when the code cannot settle the question; scripts live in `.git/`; measure in one pass and close Firefox when done; create the profile first, use a single BiDi session, and switch `PROBE_PORT` if the port is taken; measure real geometry with headless BiDi |
| Chromium probe | same-origin and easier to write: let the probe page write its result into `<pre>` and pull the DOM back with `chromium --headless --no-sandbox --user-data-dir=$PWD/.git/probe-profile --virtual-time-budget=15000 --dump-dom <url>`; without `--user-data-dir` it cannot write the default profile directory and will not start at all |
| Processes | cannot kill someone else's dev server — ask the user to restart it; if you started one, `job_kill` it before replacing it; kill with `pkill -x` or a saved PID; install deps with `npm ci --cache /tmp/npm-cache` |

## Code conventions

**Layout**

- One-dimensional layout is always flex + `gap-*` (rows, columns, nesting, proportional two-column splits); `min-w-0` on every column; `items-start` only in the row direction; conditional rendering takes its spacing from the parent's `gap`, not `space-y-*`; a bare child in a column that should be content-width gets `self-start`.
- `grid` only for genuinely two-dimensional layout (currently just the metadata table), with the column template written explicitly; a `<label>` wraps exactly one control, and a group of options uses `<div role="group" aria-label>`.
- Use icon components for UI symbols (`ui/icons.tsx` wraps `lucide-preact`), never font characters; draw separators and underlines with elements; install dependencies on demand, and do not copy a trimmed-down version.

**One definition per piece of knowledge (comments included)**

| Knowledge | Home |
|---|---|
| copy | `lib/copy.ts` |
| content | `lib/outro.ts` |
| box appearance | `ui/inputs.tsx` |
| motion | `ui/tokens.ts` |
| fully clickable row | `ui/LinkList.tsx` |
| canvas geometry | `lib/frame.ts` |
| index tables | `_registry.ts(x)` |
| page table | `pages/_registry.tsx` |

**Image capture** (`lib/image.ts`)

- Saving an image means putting the on-screen copy into an SVG and letting the browser draw it onto a canvas — one button per output, no second rendering path.
- The viewport is the `data-card` block: clone the shell with its CSS, lay the shell out at the design width, then shift it left by the gap the centering left.
- The design widths and ratios are hardcoded in `OUTPUTS`; before capture the shell is mounted on an off-screen stage and laid out at that width.
- What goes into the `<img>` is a `data:` URL and **must not go back to `blob:`** — Chromium treats an SVG with a `foreignObject` inside a blob as cross-origin, which taints the canvas so `toBlob` throws a SecurityError (Firefox does not taint, so only Chromium shows it; measured 2026-09).
- The design width only fixes the breakpoint, not the card width (pinning `min-width` would override the width cap); on the clone the `data-card` width is pinned back and the height comes from the card, and "at least one viewport tall" is stripped from the clone. Leave a margin of at least a quarter of the longer side of **the captured block** around the canvas, pad to the ratio, and hardcode the scale at 2.

**Behaviour**

- Keep controls and the card separate: the final page has no controls, going back is by clicking anywhere, and actions live in the third wizard step.
- Footer links are a navigation list (`ui/LinkList.tsx`): `nav > ul > li > a`, stacked tight, muted at rest, blue with an underline on hover; one heading level, one style, shared via `HEADING` in `tokens.ts`.
| Back to the wizard: each step is its own page, content that has taken shape stops on the last step, reset goes back to the first step, and the step you were viewing is the address itself (one hash per step) — so refresh, history, and links from other pages all keep it. The four button variants differ only in color (40px outer height, 32px padding, 1px border), and dangerous actions rely on color and wording.
- Home is not a route: it is where a hash that names no page lands (empty included), so `App` renders the page that name matches, or the home fallback, and leaving a page just clears the hash.

**Survey data**

- A question writes `into` (`meta` / `block` / `title` / `footer`) to say where the answer goes, and writes `build` only when it needs processing.
- Finishing a survey lays the answered parts over `DEFAULT_CARD` rather than clearing it, so a title or footer that was asked but left empty becomes an empty string; empty metadata and text blocks are dropped.

**Style**

- One-line expressions in a module use `const` arrows, and anything needing a block uses a `function` declaration; components are always `function` — the same kind of thing does not switch style for convenience.
- Identifiers, error and log messages, test titles, commit messages, and documentation (README, this file) are in English; comments are Chinese and single-line, design intent only, never implementation, values, or class names; no comment inside JSX; migration anchors only recognize old archives.
- Do not write custom CSS; the only exceptions are `.safe-area` and the `@custom-variant press` in `style.css`. Tailwind's scan sources are hardcoded in `style.css` as `source(none)` + `@source`, so adding a directory means adding a line.

## Responsive

| Topic | Rule |
|---|---|
| Breakpoints | width-only (the numbers live in `@theme`, and there are no width numbers in code): narrow < 30rem (`narrow:`), medium (default), large ≥ 64rem (`wide:`); `landscape:` / `portrait:` are retired |
| Measuring | narrow and wide measure the box (container queries): in a page the box is the page width, and when capturing it is the design width; `PageShell` is the only place that measures; write the conditions as `(width >= number)` / `(width < number)` |
| Narrow flow | one-dimensional: containers carry no horizontal padding, surfaces touch the edges and lose their side borders and corners, and that padding is carried once by the text and controls themselves via `px-inset` (the only 16 in the app); bare controls, and bare text and lists inside edge-touching surfaces, carry it themselves |
| Metadata rows | stack vertically on narrow screens (the same rule for the editor and the list): the name and value count as one item, tighter within an item than between items; the final page is the exception |
| Wrapping | decided by the breakpoint or by content: structure is hardcoded per breakpoint (footer ends, action row, two columns), and `flex-wrap` is only for rows whose count is decided by data |
| Motion | gradients only, listed in `tokens.ts` (opacity, text color, background color, border color, display); 150ms, ease-out, no bounce, and nothing moves under `motion-reduce`; geometric quantities are not interpolated; no animation across breakpoints |
| Press | clickable things write `press:` (a hover wrapped in a media query plus a bare active state); `hover:` alone gives no feedback on touch devices; the feedback is the element changing its own color, with no displacement and no shape change |
| Final page | `OutroPage` follows all three breakpoints and is the screen that gets screenshotted: what must stay consistent is the column (one row) width, and the container cap is back-calculated from that width; it is centered both ways and falls back to the top when the content is taller; the three sections share one flex column with 12px spacing, and only the wide breakpoint splits into columns; the structure does not change per breakpoint |

## Content and copy

| Topic | Rule |
|---|---|
| Where copy lives | UI copy always goes into `COPY` (`lib/copy.ts`), whole-sentence descriptions included; `surveys/*` is content data, and `DEFAULT_CARD` prefills and `persist.ts` old-archive literals are content truths and migration anchors, so they do not go in |
| Category names | spell them out in full; options are common values rather than the full set; long single-choice keeps a custom option, and what you type yourself still reaches the outro page |
| Long-answer options | whole paragraphs laid out vertically as full-width blocks, and tapping one fills the whole paragraph into the box; they are mutually exclusive, the box appears only after tapping the custom option, and × reverts |
| No fallback copy | the title block including its rule, and the footer signature line, do not render; spacing on conditional rendering uses `gap`; there are only two placeholder hints (hide, and write-your-own in the custom form); a prefill that is not shown is not written |
| Empty and long text | empty answers are dropped, and an empty list section shows a dashed hint (the hint carries only its inner padding, and on narrow screens the list padding is written on the branch that has content); nothing is truncated, and long text wraps |
| No breakpoint wording | copy is not tailored to a breakpoint: do not write directions or imply structure (right side, top right, step N all break), and point at positions with coarse wording that does not change per breakpoint |

## Environment

| Topic | Fact |
|---|---|
| Stack | Vite + Preact + TS (strict) + Tailwind v4 + `vite-plugin-singlefile`; icons from `lucide-preact` (on demand); no library for image capture |
| Repository | `omninbs/outro`, online at https://omninbs.github.io/outro/; data is stored in localStorage (`outro.card.v2`, migrated from old keys) and there is no backend |
| Release | pushing to main runs deploy.yml automatically (it runs the gate above; cancel stuck runs in Actions); to hand someone a file, `cp dist/index.html dist/outro.html` (opens over `file://`); `viewport-fit=cover` and `.safe-area` come as a pair, and deleting the meta silently disables it |
