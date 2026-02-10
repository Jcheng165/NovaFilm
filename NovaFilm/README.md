# NovaFilm — Discover Movies & Watchlist

**Live Demo:** [https://movieapp165.vercel.app/](https://movieapp165.vercel.app/)

A modern movie discovery app for exploring global cinema, tracking community trends, and managing a personal watchlist. Built with React 19, Tailwind CSS v4, and Appwrite — with a focus on **design patterns**, **performance**, and **accessibility**.

---

## Project Highlights

- **Adapter Pattern**: Normalized TMDB vs Appwrite schemas so MovieCard stays decoupled and reusable across multiple data sources
- **Custom Debounce Hook**: Reduced API calls by ~80% during active typing with 1000ms delayed search execution
- **Performance**: Single HTTP request for movie details using TMDB's `append_to_response` (videos, credits, reviews)
- **State Management**: Controlled components + optimistic UI for instant watchlist feedback
- **Accessibility**: ARIA roles, `prefers-reduced-motion` support, semantic HTML, keyboard navigation

## Key Features

- **Dual Trending Engine**: Compares global hits via the TMDB API against "Community Trends" driven by real-time search analytics stored in Appwrite
- **Smart Search**: Custom Debounce Hook to minimize API overhead and prevent rate-limiting
- **Dynamic Hero System**: Automatically selects a high-quality backdrop from daily trending movies for a fresh UI on every visit
- **Advanced Filtering**: Browse by genre or search across thousands of titles with pagination
- **Persistent Watchlist**: Guest Sessions (UUID) + LocalStorage — build collections without login
- **Deep-Dive Details**: Modals with trailers, cast, streaming providers (US), and reviews

## Technical Highlights

**Software Design Patterns**
- Adapter Pattern: Normalized TMDB vs Appwrite schemas so MovieCard stays decoupled and reusable
- Controlled Components: Single source of truth for search and filter state

**Performance Optimization**
- Search Debouncing: 1000ms delay reduces API calls by ~80% during typing
- API Efficiency: TMDB's `append_to_response` fetches videos, credits, reviews in one request
- Hardware Acceleration: CSS transitions for smooth 60fps animations

**Accessibility (A11y)**
- Reduced Motion: Respects `prefers-reduced-motion` system preference
- Semantic HTML: ARIA roles, screen-reader labels, focus trap in modals

## Tech Stack

| Layer    | Technology |
|----------|------------|
| Frontend | React 19 (Hooks, Functional Components) |
| Styling  | Tailwind CSS v4 (CSS Variables, Nesting) |
| Backend  | Appwrite (NoSQL Database) |
| Data     | TMDB API |
| Testing  | Vitest, React Testing Library |
| Deploy   | Vercel |

## Installation & Setup

1. **Clone and enter the repo**

   ```bash
   git clone https://github.com/Jcheng165/movie-app.git NovaFilm
   cd NovaFilm
   ```

   (To rename an existing folder to `NovaFilm`: close the project, rename the folder in File Explorer / Finder, then reopen.)

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment variables**

   Create a `.env` file in the project root with:

   ```env
   VITE_TMDB_API_KEY=your_tmdb_key
   VITE_APPWRITE_PROJECT_ID=your_project_id
   VITE_APPWRITE_DATABASE_ID=your_db_id
   VITE_APPWRITE_TABLE_ID=your_metrics_table_id
   VITE_APPWRITE_WATCHLIST_TABLE_ID=your_watchlist_table_id
   ```

   > Watchlist stores: user_id, movie_id, title, poster_path, vote_average. Optional: add `original_language` (string) in Appwrite for language on saved movies.

4. **Run the dev server**

   ```bash
   npm run dev
   ```

    npm run test

## Author

**Jacky Cheng** · [GitHub](https://github.com/Jcheng165)