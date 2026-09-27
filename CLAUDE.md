# minesweeper_frontend

Minesweeper at minesweeper.kuuhaku.dev. Next.js 16 (App Router, Turbopack), React 19, Tailwind 4,
Zustand. General code style lives in `../../general/code_style/` (`next.md`); this file is only what
is specific to this app.

## Working agreements

**Do not commit unless I ask.** Leave changes in the working tree so I can review the diff.

- Do not add dependencies without saying so first.
- Verify in a browser (`pnpm dev`, port 3000) at 1440×900 and at phone width, with the console open.

## Rules that matter here

- **The board keeps its original look**: navy page, bright blue raised cells, sunk open cells, the
  numbers' colours, red mines with a blue bomb after a loss. Its glyphs are Font Awesome (`FaBomb`,
  `FaFlag`) on purpose; the rest of the UI uses `MdOutline*`.
- A cell's text, border, radius and shadow are in `em`, and the board sets one font size from its
  width (`cqw`), so one cell works at every board size. Px or rem on a cell breaks Easy and Hard.
- Mines are placed on the first click, away from that cell and its neighbours. The board starts
  empty, so the server render and the first client render match.
- Touch has no right click: holding a cell for 400 ms flags it and the click that follows is dropped.
  Android also fires `contextmenu` at the end of a hold, which the cell ignores after a long press.
- Docker ships the standalone output (`node server.js`, port 3000). The container must stay
  `minesweeper` on 3000: that is what Nginx Proxy Manager forwards to (`../../general/vps/contabo.md`).
