# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

| Command | Action |
| :-- | :-- |
| `npm run dev` | Starts local dev server at `localhost:4321` |
| `npm run build` | Build production site to `./dist/` |
| `npm run preview` | Preview build locally before deploying |
| `npm run astro ...` | Run CLI commands like `astro add`, `astro check` |

## Project Architecture

This is an **Astro-based static site generator** project with React integration, featuring a personal website with a retro Windows 98 aesthetic theme.

### Core Technologies
- **Astro 5.11.1** - Static site generator with island architecture
- **React 19.1.0** - Interactive components only where needed
- **TypeScript** - Strict configuration throughout
- **98.css** - Windows 98 styling library

### Key Architectural Patterns

**Island Architecture**: React components are loaded selectively using `client:load` directive. Most content is static HTML generated at build time.

**Component Organization**: React components are organized by feature in subdirectories:
- `src/components/minesweeper/` - Game-specific components
- `src/hooks/` - Custom React hooks for complex state management
- `src/utils/` - Pure utility functions
- `src/types/` - TypeScript type definitions

**Styling Strategy**: Uses 98.css for base Windows 98 theme, with component-specific CSS files (e.g., `minesweeper.css`) for custom styling.

### Directory Structure

```
src/
├── components/          # React/Astro components
├── hooks/              # Custom React hooks
├── layouts/            # Astro layouts
├── pages/              # File-based routing
├── styles/             # CSS files
├── types/              # TypeScript types
└── utils/              # Utility functions
```

### Component Architecture Example

The Minesweeper game demonstrates the project's modular architecture:

- **`useMinesweeper.ts`** - Custom hook managing game state and logic
- **`minesweeper/`** - Organized component hierarchy:
  - `Cell.tsx` - Individual game cell
  - `GameBoard.tsx` - Grid container
  - `StatusPanel.tsx` - Game status display
- **`utils/minesweeper.ts`** - Pure game logic functions
- **`types/minesweeper.ts`** - TypeScript interfaces

### Development Workflow

1. Components use TypeScript interfaces for props
2. Game logic is separated into utils and hooks
3. Styles are component-scoped and prefixed (e.g., `minesweeper-cell`)
4. Build process validates TypeScript and generates static HTML

### Deployment

Automated GitHub Pages deployment via GitHub Actions to `artisavotins.com`. The deployment workflow builds the site and deploys to GitHub Pages on push to main branch.