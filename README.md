# NovaFilm

[Live Demo](https://nova-film-ten.vercel.app/) | [GitHub Repository](https://github.com/Jcheng165/NovaFilm)

NovaFilm is a professional-grade movie discovery platform built to demonstrate modern frontend architecture, scalable data patterns, and comprehensive testing. It bridges third-party data from TMDB with local community analytics stored in Appwrite to deliver a fast, accessible browsing and watchlist experience.

## Key Features

- **Dual-Source Trending Engine**: A hybrid system that merges global hits from TMDB with local "Community Trends" driven by real-time search analytics stored in Appwrite.
- **Smart Search**: Integrated with a custom debounce flow to optimize network traffic and reduce unnecessary API calls.
- **Dynamic Hero System**: An intelligent backdrop selector that refreshes the visual experience using trending cinema data.
- **Persistent Watchlist**: A no-login-required save system using Guest Sessions (UUID) and LocalStorage for instant engagement.
- **Deep-Dive Modals**: Rich interactive overlays with trailers, cast details, reviews, and US-based streaming providers.

## Technical Highlights

### Software Design Patterns

- **Adapter Pattern (Data Normalization)**: Normalizes differing TMDB and Appwrite schemas into a stable UI-friendly shape, keeping components (e.g., `MovieCard`) decoupled from data-source specifics.
- **Custom Hooks**: Encapsulates reusable behavior such as debounced input handling (`useDebounce`) to keep components focused and state predictable.

### Performance & Optimization

- **Smart Search Flow**: Debounced search reduces redundant API requests during active typing.
- **Hybrid Trending Engine**: Combines “Community Trends” (Appwrite analytics) with global TMDB trending results.
- **Smooth UI**: Tailwind CSS v4 transitions and responsive layout for a polished browsing experience.

### Quality Assurance

- **Unit & Integration Testing**: Built with Vitest and React Testing Library to validate key UI behavior and prevent regressions.
- **Accessibility (A11y)**: Supports `@media (prefers-reduced-motion)` and uses semantic HTML + ARIA for better assistive technology support.

## Tech Stack

- **Frontend**: React 19 (Hooks & Functional Components) + Vite
- **Styling**: Tailwind CSS v4
- **Backend**: Appwrite
- **API**: TMDB (The Movie Database)
- **Testing**: Vitest, React Testing Library
- **Deployment**: Vercel

## Project Structure

The application source lives in `NovaFilm/`:

```text
NovaFilm/
├── public/            # Static assets (icons, images)
└── src/
    ├── components/    # UI components (MovieCard, Search, TrendingMovies, etc.)
    ├── hooks/         # Reusable logic (useDebounce)
    ├── styles/        # Base/theme/component styles
    └── test/          # Vitest setup
```

## Installation & Setup

### Clone the Repository

```bash
git clone https://github.com/Jcheng165/NovaFilm.git
cd NovaFilm/NovaFilm
npm install
```

### Environment Variables

Create a `.env` file in the `NovaFilm/` directory:

```env
VITE_TMDB_API_KEY=your_tmdb_key
VITE_APPWRITE_PROJECT_ID=your_project_id
VITE_APPWRITE_DATABASE_ID=your_db_id
VITE_APPWRITE_TABLE_ID=your_metrics_table_id
VITE_APPWRITE_WATCHLIST_TABLE_ID=your_watchlist_table_id
```

### Run the Development Server

```bash
npm run dev
```

### Run Tests

```bash
npm run test
```

## Author

Jacky Cheng
