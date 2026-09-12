# outro — house rules

An outro-page generator: fill in a few fields and get a page that is ready to screenshot. This is the only rulebook for AI; if you change a rule, a command, a directory, or an environment fact, change it in the same commit.

## How to work

- State the plan in Chinese before you start; report only conclusions, changed files, and validation results
- Never edit `README.md`: it is the author's own file, not the AI's to touch
- Batch tool calls when they can run in parallel; save tokens: skip reconciliation tests, probes, and online checks, and merge commands where possible; keep each command under 10s
- Run the gate (see "Validation") after a change, then commit; when a tradeoff is unclear, ask first — do not re-argue a rejected direction

## Commits

- One thing per commit; a single line `<type>: <description>` (English, ≤50 chars, no punctuation; type is feat / fix / docs / style / refactor / test / chore)
- Do not push unless explicitly asked (to push, prefix `GIT_SSH_COMMAND="ssh -F /dev/null"`, and do not verify online afterwards); `dist/` is not committed, and throwaway tools live in `.git/`

## Validation

There is no lint; the gate is three commands (run them as one):

```bash
npm run typecheck && npm test && npm run build
```

- Unit tests touch only **pure functions** (`tests/`): data movement, archive migration, content filtering, canvas geometry. UI and styling are not tested — those are checked by eye, and no assertion is more accurate than looking
- The dev server is at http://localhost:5173; a background one is often already running, so do not start another; transforms are cached per second, so after editing a file `touch` it and `curl` comparing a signature string (compare module by module); if a style change is not visible, restart it first
- Use probes only when reading the code cannot settle the question: scripts live in `.git/`, measure in one pass and close Firefox when done; create the profile first, use a single BiDi session, and switch `PROBE_PORT` if the port is taken; measure real geometry with headless BiDi
- The Chromium probe path is same-origin and easier to write: have the probe page write its result into `<pre>` and pull the DOM back with `chromium --headless --no-sandbox --user-data-dir=$PWD/.git/probe-profile --virtual-time-budget=15000 --dump-dom <url>`; without `--user-data-dir` it cannot write the default profile directory and will not start at all
- If you cannot kill someone else's dev server, ask the user to restart it; if you started one, `job_kill` it before replacing it; kill processes with `pkill -x` or a saved PID; install dependencies with `npm ci --cache /tmp/npm-cache`

## Code conventions

- One-dimensional layout is always flex + `gap-*` (rows, columns, nesting, proportional two-column splits); write `min-w-0` on every column; write `items-start` only in the row direction; use the parent's `gap` for spacing on conditional rendering, not `space-y-*`; a bare child in a column that should be content-width gets `self-start`
- Use `grid` only for genuinely two-dimensional layout (currently just the metadata table) and write the column template explicitly; a `<label>` wraps exactly one control, and a group of options uses `<div role="group" aria-label>`
- Use icon components for UI symbols (`ui/icons.tsx` wraps `lucide-preact`), never font characters; draw separators and underlines with elements; install dependencies on demand, and do not copy a trimmed-down version
- One piece of knowledge has exactly one definition (comments included): copy in `lib/copy.ts`, content in `lib/outro.ts`, box appearance in `ui/inputs.tsx`, motion in `ui/tokens.ts`, the fully clickable row in `ui/LinkList.tsx`, canvas geometry in `lib/frame.ts`, and the index tables in `_registry.ts(x)`
- Saving an image means putting the on-screen copy into an SVG and letting the browser draw it onto a canvas — one button per output, no second rendering path (`lib/image.ts`): clone the shell with its CSS into an SVG viewport, the viewport being the `data-card` block (lay the shell out at the design width, then shift it left by the gap the centering left); the design widths and ratios are hardcoded in `OUTPUTS`, and before capture the shell is mounted on an off-screen stage and laid out at that width; what goes into the `<img>` is a `data:` URL and **must not go back to `blob:`** — Chromium treats an SVG with a `foreignObject` inside a blob as cross-origin, which taints the canvas so `toBlob` throws a SecurityError (Firefox does not taint, so it only shows up in Chromium; measured 2026-09)
- The design width only fixes the breakpoint, not the card width (pinning `min-width` would override the width cap); on the clone the `data-card` width is pinned back and the height comes from the card, and "at least one viewport tall" is stripped from the clone; leave a margin of at least a quarter of the longer side of **the captured block** around the canvas, pad to the ratio, and hardcode the scale at 2
- Keep controls and the card separate: the final page has no controls, going back is by clicking anywhere, and actions live in the third wizard step
- A survey is data: a question writes `into` (`meta` / `block` / `title` / `footer`) to say where the answer goes, and only writes `build` when it needs processing; finishing a survey lays the answered parts over `DEFAULT_CARD` rather than clearing it (a title or footer that was asked but left empty becomes an empty string, and empty metadata and text blocks are dropped)
- Back to the form: content that has taken shape stops on the last step (`formAtLastStep`), reset goes back to the first step, and otherwise the form remembers the step you were viewing — the step is the form's own state and is not in the URL; the four button variants differ only in color (40px outer height, 32px padding, 1px border), and dangerous actions rely on color and wording
- Footer links are a navigation list (`ui/LinkList.tsx`): `nav > ul > li > a`, stacked tight, muted at rest, blue with an underline on hover; the same heading level uses the same style, shared via `HEADING` in `tokens.ts`
- One-line expressions in a module use `const` arrows, and anything that needs a block uses a `function` declaration; components are always `function` — the same kind of thing does not switch style just for convenience
- Identifiers, error and log messages, test titles, commit messages, and documentation (README, this file) are in English; comments are in Chinese, describing design intent only, not implementation, values, or class names; keep the notes on constants and props; migration anchors only recognize old archives
- Do not write custom CSS; the only exceptions are `.safe-area` and the `@custom-variant press` in `style.css`; Tailwind's scan sources are hardcoded in `style.css` as `source(none)` + `@source`, so adding a directory means adding a line

## Responsive

- Breakpoints are width-only (the numbers live in `@theme`, and there are no width numbers in code): narrow < 30rem (`narrow:`), medium (default), large ≥ 64rem (`wide:`); `landscape:` / `portrait:` are retired
- Narrow and wide measure the box (container queries): in a page the box is the page width, and when capturing it is the design width; `PageShell` is the only place that measures; write the conditions as `(width >= number)` / `(width < number)`
- Narrow is a one-dimensional flow: containers carry no horizontal padding, surfaces touch the edges and lose their side borders and corners, and that padding is carried once by the text and controls themselves via `px-inset` (the only 16 in the app); bare controls, and bare text and lists inside edge-touching surfaces, carry it themselves
- Metadata rows stack vertically on narrow screens (the same rule for the editor and the list): the name and value count as one item, tighter within an item than between items; the final page is the exception
- Wrapping is decided by the breakpoint or by content: structure is hardcoded per breakpoint (footer ends, action row, two columns), and `flex-wrap` is only for rows whose count is decided by data
- Motion is gradients only, listed in `tokens.ts` (opacity, text color, background color, border color, display); 150ms, ease-out, no bounce, and nothing moves under `motion-reduce`; geometric quantities are not interpolated; no animation across breakpoints
- Clickable things write `press:` (a hover wrapped in a media query plus a bare active state); writing only `hover:` gives no feedback on touch devices; the feedback is the element changing its own color, with no displacement and no shape change
- The final page (`OutroPage`) follows all three breakpoints and is the screen that gets screenshotted: what must stay consistent is the column (one row) width, and the container cap is back-calculated from that width; it is centered both ways and falls back to the top when the content is taller; the three sections share one flex column with 12px spacing, and only the wide breakpoint splits into columns; the structure does not change per breakpoint

## Content and copy

- UI copy always goes into `COPY` (`lib/copy.ts`), whole-sentence descriptions included; `surveys/*` is content data, and `DEFAULT_CARD` prefills and `persist.ts` old-archive literals are content truths and migration anchors, so they do not go in
- Spell category names out in full; options are common values rather than the full set, long single-choice keeps 「自定义」, and what you type yourself still reaches the outro page
- A long-answer question's options are whole paragraphs laid out vertically as full-width blocks, and tapping one fills the whole paragraph into the box; they are mutually exclusive, the box appears only after tapping 「自定义」, and × reverts
- There is no fallback copy: the title block including its rule, and the footer signature line, do not render; spacing on conditional rendering uses `gap`; there are only two placeholder hints (「不显示」and 「自己写」in the custom form); a prefill that is not shown is not written
- Empty answers are dropped, and an empty list section shows a dashed hint (the hint carries only its inner padding, and on narrow screens the list padding is written on the branch that has content); nothing is truncated, and long text wraps
- Copy is not tailored to a breakpoint: do not write directions or imply structure (「右侧」, 「右上角」, 「第 N 步」all break), and point at positions with coarse wording that does not change per breakpoint

## Environment

- Vite + Preact + TS (strict) + Tailwind v4 + `vite-plugin-singlefile`; icons from `lucide-preact` (on demand); no library for image capture
- Repository `omninbs/outro`, online at https://omninbs.github.io/outro/; data is stored in localStorage (`outro.card.v2`, migrated from old keys) and there is no backend
- Release: pushing to main runs deploy.yml automatically (it runs the gate above; cancel stuck runs in Actions); to hand someone a file, `cp dist/index.html dist/outro.html` (opens over `file://`); `viewport-fit=cover` and `.safe-area` come as a pair, and deleting the meta silently disables it
