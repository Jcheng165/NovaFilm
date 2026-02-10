**MovieVerse Discovery & Watchlist App**

Live Demo: https://nova-film-ten.vercel.app/

A modern, high-performance movie discovery application that allows users to explore global cinema, track community trends, and manage a personal watchlist.
This project focuses on Software Design Patterns, Performance Optimization, and UX Accessibility.

**Key Features**
1. Dual Trending Engine: Compares global hits via the TMDB API against "Community Trends" driven by real-time search analytics stored in Appwrite.
2. Smart Search: Implemented with a Custom Debounce Hook to minimize API overhead and prevent rate-limiting.
3. Dynamic Hero System: Automatically selects a high-quality backdrop from daily trending movies to provide a fresh UI experience on every visit.
4. Advanced Filtering: Browse by genre or search across thousands of titles with integrated pagination.
5. Persistent Watchlist: A personalized "save" system using Guest Sessions (UUID) and LocalStorage, allowing users to build collections without a mandatory login.
6. Deep-Dive Details: Interactive modals featuring trailers, cast lists, streaming providers (US), and user reviews.

**Technical Highlights**
- Software Design Patterns
- Adapter Pattern (Data Normalization): Implemented a custom data adapter to normalize varying schemas between the external TMDB API and the internal Appwrite database. This ensures UI components, such as MovieCard, remain decoupled and reusable.
- Controlled Components: Managed all search inputs and filters as controlled components to ensure a "single source of truth" for the application state.
**Performance Optimization**
Search Debouncing: Optimized network traffic by implementing a 1000ms delay on search execution, reducing API calls by up to 80% during active typing.
API Efficiency: Utilized TMDB's append_to_response parameter to consolidate metadata (videos, credits, reviews) into a single HTTP request.
Hardware Acceleration: Leveraged CSS will-change properties and Tailwind transitions for smooth 60fps animations.

****Accessibility ****
- Reduced Motion: Fully respects user system preferences for animations via the @media (prefers-reduced-motion) query.
- Semantic HTML: Utilizes ARIA roles (role="status") and screen-reader-only labels (sr-only) to ensure compatibility with assistive technologies.

**Tech Stack**
- Frontend: React 18 (Hooks, Functional Components)
- Styling: Tailwind CSS v4 (Modern CSS Variables and Nesting)
- Backend: Appwrite (NoSQL Database-as-a-Service)
- Data Source: TMDB API
- Deployment: Vercel

**Installation and Setup**
1. Clone the repository
    - git clone https://github.com/Jcheng165/movie-app.git
    - cd movie-app
3. Install dependencies
   - npm install
4. Environment Variables
Create a .env file in the root directory based on the structure below, and add your credentials
    - VITE_TMDB_API_KEY= your_tmdb_key
    - VITE_APPWRITE_PROJECT_ID= your_project_id
    - VITE_APPWRITE_DATABASE_ID= your_db_id
    - VITE_APPWRITE_TABLE_ID= your_metrics_table_id
    - VITE_APPWRITE_WATCHLIST_TABLE_ID= your_watchlist_table_id
   
6. Run the development server
    - npm run dev
   
**Author**
Jacky Cheng

GitHub: https://github.com/Jcheng165
