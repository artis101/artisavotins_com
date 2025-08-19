# GEMINI.md

## Project Overview

This project is a personal website for Artis Avotins, built with [Astro](https://astro.build/) and [React](https://react.dev/). The website serves as a personal portfolio, showcasing skills and experience, and includes a functional Minesweeper game. The styling is reminiscent of a vintage operating system.

## Building and Running

The project uses `npm` for dependency management and running scripts.

*   **Install dependencies:**
    ```bash
    npm install
    ```
*   **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at http://localhost:4321.
*   **Build for production:**
    ```bash
    npm run build
    ```
    The production-ready files will be located in the `dist/` directory.
*   **Preview the production build:**
    ```bash
    npm run preview
    ```

## Development Conventions

*   **Frameworks:** The project is built using Astro for the main site structure and static pages, and React for interactive components like the Minesweeper game.
*   **Styling:** The styling is done using a combination of inline styles and a dedicated CSS file for the Minesweeper game (`src/styles/minesweeper.css`). The overall theme is a retro, "sunken-panel" look.
*   **Components:** Astro components are used for the main layout and static content, while React components are used for dynamic and interactive elements.
*   **Game Logic:** The Minesweeper game's logic is encapsulated in a React hook (`src/hooks/useMinesweeper.ts`) and utility functions (`src/utils/minesweeper.ts`).
