# Pokédex App

A React + TypeScript Pokémon encyclopedia app powered by [PokéAPI](https://pokeapi.co/).

🔗 **Live Demo:** [https://trinhgliedt.github.io/poke/](https://trinhgliedt.github.io/poke/)

![Pokédex Screenshot](https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png)

## Features

- **Browse Pokémon** — View all 1350+ Pokémon with images, types, abilities, and stats
- **Search & Filter** — Find Pokémon by name, filter by type or ability
- **Sort** — Sort by name, experience, height, or weight
- **Pokémon Details** — View detailed information including base stats and abilities
- **Evolution Map** — See the full evolution chain for each Pokémon
- **My Collection** — Add Pokémon to your personal collection (saved to localStorage)
- **Dark/Light Theme** — Toggle between dark and light mode
- **Responsive Design** — Works on desktop and mobile

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and builds
- **React Router** for navigation
- **PokéAPI** for Pokémon data
- **GitHub Pages** for deployment

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/trinhgliedt/poke.git

# Navigate to the project directory
cd poke

# Install dependencies
npm install

# Start the development server
npm run dev
```
The app will be available at `http://localhost:5173/`

### Build for Production

```bash
npm run build
```

### Deploy to GitHub Pages
```bash
npm run deploy
```

## Data

Pokémon data is pre-fetched and stored in `public/pokemon-data.json` to avoid rate limiting and provide instant load times. The data is sourced from [PokéAPI](https://pokeapi.co/).

## Privacy

- No user data is collected
- Your Pokémon collection is stored locally in your browser's localStorage
- No cookies or tracking

## Acknowledgments

- [PokéAPI](https://pokeapi.co/) for the comprehensive Pokémon data API
- [Pokémon](https://www.pokemon.com/) — Pokémon and Pokémon character names are trademarks of Nintendo

## License

This is a fan project for educational purposes. Not affiliated with Nintendo, Game Freak, or The Pokémon Company.

## Author

Made with ❤️ by [trinhgliedt](https://github.com/trinhgliedt)