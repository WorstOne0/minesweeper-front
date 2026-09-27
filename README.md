# Minesweeper

> Minesweeper in the browser at [minesweeper.kuuhaku.dev](https://minesweeper.kuuhaku.dev): three board
> sizes, a first click that never hits a mine, flags and chords.

---

## Features

- **Three boards** — Easy 9×9 with 10 mines, Medium 18×18 with 40, Hard 24×24 with 99, picked from the
  gear.
- **A safe start** — mines go down on the first click, never on that cell or around it, so every game
  opens with room to play.
- **Flags** — right click, or hold a cell on a phone; the counter shows the mines left.
- **Chords** — click an open number with as many flags around it to open the rest of its neighbours.
- **A timer** from the first click to the end, and a board that locks once the game is won or lost.
- The board scales with the window, down to a phone.

---

## Tech stack

Next.js 16 (App Router, Turbopack, standalone output) · React 19 · TypeScript · Tailwind CSS 4 · Zustand

---

## Getting started

Requires Node 20.9+ and pnpm.

```bash
pnpm install
pnpm dev                 # http://localhost:3000
```

---

## Project structure

```
src/
  app/
    layout.tsx            metadata, Nunito and Graduate
    page.tsx              the sidebar (timer, mines left, retry, difficulty) and the result
    _components/          board, cell
  core/
    controllers/          game_controller — the board, the status, the clock
    models/               Cell, Board, DIFFICULTIES
  utils/                  minesweeper — placing mines, opening cells, chords
  styles/                 tokens → theme → base
public/logo/              icon.svg
```

---

## Deploy

Docker, standalone output on port 3000:

```bash
docker compose up -d --build
```

The container joins the external `nginx-proxy` network as `minesweeper`. On the VPS, Nginx Proxy
Manager forwards `minesweeper.kuuhaku.dev` to `minesweeper:3000` — a route set up by hand in its UI;
the `VIRTUAL_*` variables in `docker-compose.yml` are only read by jwilder/nginx-proxy.
