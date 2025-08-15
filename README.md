# Rogue Minesweeper

A browser-based roguelike twist on the classic Minesweeper game. Navigate progressively larger minefields, collect gold, and purchase upgrades to survive deeper levels.

## Features

- **Dynamic levels:** Grid size and mine density increase as you progress, challenging your deduction skills.
- **Shields as health:** Instead of immediate failure, shields let you survive multiple mistakes.
- **Gold economy:** Earn gold from safe tiles and use it to purchase upgrades or items.
- **Permanent upgrade shop:** Spend end-of-run gold on upgrades like extra shields or starting gold to power up future runs.
- **Inter-level item shop:** Buy temporary items with rarity-based loot to aid in the next level.
- **Flag cycle:** Right-click tiles to cycle between a flag, a question mark for uncertain tiles, and a blank state.
- **Responsive design:** Built with Tailwind CSS and custom fonts for a retro sci-fi feel.

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/USER/rogue-minesweeper.git
   cd rogue-minesweeper
   ```
2. **Start a static web server** (recommended)
   ```bash
   npx serve
   # or
   python -m http.server 8000
   ```
3. **Open the game**
   Navigate to the served URL (e.g., <http://localhost:3000>) and open `index.html`.

> You can also open `index.html` directly in a browser, but some browsers restrict local file access; a web server is recommended.

## Project Structure

```
├── data
│   ├── permanentUpgrades.js   # definitions for long-term upgrades
│   └── temporaryItems.js      # item pools by rarity for inter-level shop
├── index.html                 # main game with embedded logic and UI
└── README.md
```

## Data Definitions
- **Permanent Upgrades** – found in [`data/permanentUpgrades.js`](data/permanentUpgrades.js). Each upgrade defines its name, description, cost scaling, and effect.
- **Temporary Items** – located in [`data/temporaryItems.js`](data/temporaryItems.js). Items are grouped by rarity and applied for the upcoming level or run.

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

No license has been specified. If you plan to use this project, please contact the repository owner.

## Acknowledgements

- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling via CDN.
- [Google Fonts](https://fonts.google.com/) for the Orbitron and Roboto Mono fonts.
