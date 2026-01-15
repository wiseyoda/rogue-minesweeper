# Dungeon Delver

A browser-based, Dungeons & Dragons‑inspired twist on the classic Minesweeper game. Explore progressively larger dungeons filled with hidden monsters, collect gold, and buy upgrades to push deeper each run.

## Features

- **Progressive difficulty** – grid size and monster density grow with each level, challenging your deduction skills.
- **Lives and shields** – start with three hearts and burn through shields before losing lives.
- **Gold economy** – earn gold from safe tiles and level completion to spend on upgrades and items.
- **Permanent upgrade shop** – invest end-of-run gold on long-term upgrades like extra lives or starting gold.
- **Inter-level item shop** – purchase temporary buffs between levels from a rarity-based item pool.
- **Inventory & highscores** – track permanent upgrades, active buffs, highest level reached and max gold earned.
- **Flag cycle** – right-click tiles to cycle between flag, question mark and blank states.
- **Responsive design** – Tailwind CSS and custom fonts provide a retro fantasy feel.

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/USER/dungeon-delver.git
   cd dungeon-delver
   ```
2. **Start a static web server** (from the project root)
   ```bash
   npx serve
   # or
   python -m http.server 8000
   ```
3. **Open the game**
   Navigate to the served URL and load `public/index.html` (e.g. <http://localhost:3000/public/>).

> Opening the file directly may work, but using a web server avoids browser restrictions on ES module imports.

## Project Structure

```
├── public/
│   └── index.html             # base HTML shell
├── src/
│   ├── data/
│   │   ├── permanentUpgrades.js
│   │   └── temporaryItems.js
│   ├── game.js                # core gameplay logic
│   ├── main.js                # entry point wiring events and starting runs
│   ├── shop.js                # upgrade & inter-level shops
│   ├── state.js               # player and game state
│   └── ui.js                  # DOM helpers and rendering
├── styles/
│   └── style.css              # custom styles and grid appearance
└── README.md
```

## Data Definitions

- **Permanent Upgrades** – `src/data/permanentUpgrades.js` defines long-term upgrades with names, descriptions, costs and effects.
- **Temporary Items** – `src/data/temporaryItems.js` lists shop items by rarity and their in-game effects.

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

No license has been specified. If you plan to use this project, please contact the repository owner.

## Acknowledgements

- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling via CDN.
- [Google Fonts](https://fonts.google.com/) for the Cinzel and Merriweather fonts.
