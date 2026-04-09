# Pokepath TD Save Editor

An unofficial web-based save editor for [Pokepath Tower Defense](https://pokepath.gg/). Load your base64-encoded save file, modify your player data, and export it back — all in the browser.

**Live site: [azewilous.github.io/pokepath-td-save-editor](https://azewilous.github.io/pokepath-td-save-editor/)**

> This is an unofficial tool. If you enjoy Pokepath TD, please support the original creator at [pokepath.gg](https://pokepath.gg/).

---

## Features

- **Parse & Export** — Load a base64 save string or `.txt` file, decode it, edit it, and re-export
- **Player Tab** — Edit name, gold, stars, ribbons, health, records, and secrets
- **Inventory Tab** — 12×8 item grid with sprite previews, carrier lookup, add/remove items
- **Team Tab** — Edit level, target mode, held item, and toggles (shiny, mega, favourite) per slot
- **Box Tab** — Compact view of all stored Pokémon with level and toggles
- **Achievements Tab** — Unlock or lock any achievement
- **Stats Tab** — Edit all player stats; view defeated species

---

## Stack

- [SolidJS](https://solidjs.com/) — reactive UI
- [Vite](https://vitejs.dev/) — build tooling
- [Vitest](https://vitest.dev/) + [@solidjs/testing-library](https://github.com/solidjs/solid-testing-library) — testing

---

## Getting Started

Requires Node >= 22.

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Commands

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm test` | Run tests |
| `npm run test:ui` | Run tests with Vitest UI |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run format` | Format source files with Prettier |

---

## Project Structure

```
src/
  components/
    layout/       Navbar, Hero, Footer
    shared/       Toast
    editor/       DataInterface, SaveEditor
    tabs/         PlayerTab, InventoryTab, TeamTab, BoxTab, AchievementsTab, StatsTab
  routes/
    index.tsx     Root page
  types/
    save.ts       SaveData type definitions
    items.ts      GameItem types + helpers
    versions.ts   Supported game versions
  styles/
    shared.css    Shared component styles
  test/
    fixtures.ts   Mock save data for tests
    setup.ts      Vitest/jsdom setup
    unit/         Pure function tests
    components/   Component render tests
    integration/  Full page tests
  app.css         Global reset + CSS variables
  entry-client.tsx  App entry point
```

---

## Disclaimer

This editor is not affiliated with or endorsed by the creators of Pokepath Tower Defense. Use at your own risk — always keep a backup of your original save data before making changes.
