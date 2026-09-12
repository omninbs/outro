# outro

Fill in a few fields and export an image that works directly as a video outro page.

- Entries: fill it in yourself without a preset, or let a survey walk you through it (a survey is data; adding one needs no code change)
- Three output formats: portrait 2:3, square 1:1, landscape 3:2, each saved as a PNG with one click
- Content stays in your own browser (localStorage); there is no backend and nothing is uploaded

## Usage

Online: https://omninbs.github.io/outro/

Want a single file that works offline and opens on double-click: run `npm run build` once and send the other person `dist/index.html` (it opens fine over `file://`).

## Development

```bash
npm ci
npm run dev        # http://localhost:5173
npm run typecheck  # types
npm test           # unit tests for pure functions: data movement, archive migration, content filtering, canvas geometry
npm run build      # produces a single dist/index.html
```

Stack: Vite + Preact + TypeScript (strict) + Tailwind v4, with `vite-plugin-singlefile` inlining the output into one HTML file; image capture uses the browser's own SVG and canvas, with no graphics library.

## Design notes

The design and its tradeoffs are written down in [`AGENTS.md`](./AGENTS.md) — that file is a rulebook for AI, but every line in it is a design decision:
breakpoints are judged by the **box** width (the same layout has one definition in the page and when capturing, independent of the viewer's window), copy and content each have a single definition, and the final page is the very screen that gets screenshotted (the saved image is a clone of it, not a second rendering).

## License

MIT

> This project's code and documentation were written by AI together with the author.
