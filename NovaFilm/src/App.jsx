import React, { useEffect, useState } from 'react'
import { useDebounce } from './hooks/useDebounce.js'
import Search from './components/Search.jsx'
import MovieDetails from './components/MovieDetails.jsx';
import TrendingMovies from './components/TrendingMovies.jsx';
import MovieGrid from './components/MovieGrid.jsx';
import MovieGenres from './components/MovieGenres.jsx';
import Pagination from './components/Pagination.jsx';
import WatchList from './components/WatchList.jsx';
import Toast from './components/Toast.jsx';
import { getTrendingMovies, updateSearchCount, getWatchList, addToWatchList, removeFromWatchList } from './appwrite.js';


/* TMDB API Configuration
   Base URL and auth headers for all movie data requests. */
const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

/**
 * App — Main entry component.
 * Orchestrates state, TMDB + Appwrite data flow, and layout.
 * Patterns: controlled components, optimistic UI (watchlist), custom useDebounce.
 */

const App = () => {
  /* --- 1. State Management --- */

  /* Search & filter (debounced search reduces API calls) */
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 1000);
  const [selectedGenre, setSelectedGenre] = useState(null);

  /* Data: movie list, trending (community + global), hero image */
  const [movieList, setMovieList] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [globalTrending, setGlobalTrending] = useState([]);
  const [heroImage, setHeroImage] = useState(null);

  /* UI: loading, errors, view (browse | watchlist), selected movie modal */
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [trendingError, setTrendingError] = useState('');
  const [globalTrendingError, setGlobalTrendingError] = useState('');
  const [view, setView] = useState('browse');
  const [selectedMovie, setSelectedMovie] = useState(null);

  /* Pagination */
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  /* User session: guest UUID + watchlist (persisted in Appwrite) */
  const [watchList, setWatchList] = useState([]);
  const [userId, setUserId] = useState(null);
  const [toast, setToast] = useState({ message: null, isError: false });

  /* --- 2. Data Fetching --- */

  /**
   * Fetches movies: search (query) or discover (genre, page). Updates Appwrite analytics on search.
   */

  const fetchMovies = async (query = ``, genreID=null, pageNum = 1) => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      let endpoint;
      
      /* Search → /search/movie; Browse → /discover/movie (with optional genre) */
      if (query) {
        endpoint = `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&page=${pageNum}`;
      }else{
        endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&page=${pageNum}`;
        if(genreID)
          endpoint+= `&with_genres=${genreID}`;
      }
     
      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }

      const data = await response.json();

      /* TMDB returns success: false on API errors (e.g., invalid key) */
      if (data.success === false) {
        setErrorMessage(data.status_message || 'Failed to fetch movies');
        setMovieList([]);
        return;
      }

      setMovieList(data.results || []);

      setTotalPage(data.total_pages > 500 ? 500 : data.total_pages);

      /* Analytics: record search in Appwrite for "Community Trends" (min 3 chars, first page only) */
      if (query && pageNum === 1 && data.results.length > 0 && query.length >= 3) {
        await updateSearchCount(query, data.results[0]);
      }

    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage('Error fetching movies. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }

  /** Fetches "Community Trends" (top 5 searched terms) from Appwrite. */
  const loadTrendingMovies = async () => {
    setTrendingError(``);
    try{
      const movies = await getTrendingMovies();
      
      setTrendingMovies(movies);

    } catch(error){
      console.error(`Error fetching trending movies: ${error}`);
      setTrendingError(`Could not load local trends.`)
    
    }
  }
  
  /** Fetches TMDB trending/day, picks random hero backdrop from top 10. */
  const loadGlobalTrending = async () => {
    setGlobalTrendingError(``);
    try{
      const response = await fetch(`${API_BASE_URL}/trending/movie/day?language=en-US`, API_OPTIONS);
      const data = await response.json();

      const topMovies = data.results.slice(0,10) || [];
      setGlobalTrending(topMovies);

      if (topMovies.length > 0) {
        const randomIndex = Math.floor(Math.random() * topMovies.length);
        const randomMovie = topMovies[randomIndex];
        const imagePath = randomMovie.backdrop_path || randomMovie.poster_path;

        if (imagePath) {
            setHeroImage(`https://image.tmdb.org/t/p/w1280${imagePath}`);
        }
      }

    } catch(error){
      console.error(`Error fetching global trending movies: ${error}`);
      setGlobalTrendingError(`Could not load local trends.`);
    }
  };
  
  /* --- 3. User Session --- */

  /* On mount: create or load guest UUID, then load watchlist from Appwrite */
  useEffect(() => {
    const initWatchList = async () => {
      try {
        let storeId = localStorage.getItem(`movie_app_user_id`);
        if (!storeId) {
          storeId = crypto.randomUUID();
          localStorage.setItem(`movie_app_user_id`, storeId);
        }
        setUserId(storeId);

        const savedMovies = await getWatchList(storeId);
        setWatchList(savedMovies);
      } catch (err) {
        console.error('Error loading watchlist:', err);
        setToast({ message: 'Could not load watchlist. Please try again.', isError: true });
      }
    };
    initWatchList();
  }, []);
  
  /**
   * Toggle watchlist: add or remove. Optimistic UI + toast on success/error.
   */
  const handleToggleWatchList = async (movie) => {
    /* Wait for session: userId is set in initWatchList (async) */
    if (!userId) {
      setToast({ message: 'Please wait, loading...', isError: true });
      return;
    }

    const existingItem = watchList.find(item => item.movie_id === movie.id);

    if (existingItem) {
      const previousList = [...watchList];
      const updateList = watchList.filter(item => item.movie_id !== movie.id);
      setWatchList(updateList);

      try {
        await removeFromWatchList(existingItem.$id);
        setToast({ message: 'Removed from watchlist', isError: false });
      } catch {
        setWatchList(previousList);
        setToast({ message: 'Failed to remove. Please try again.', isError: true });
      }
    } else {
      const tempItem = { ...movie, movie_id: movie.id, $id: 'temp-' + Date.now() };
      const previousList = [...watchList];
      setWatchList([...watchList, tempItem]);

      try {
        await addToWatchList(userId, movie);
      } catch {
        setWatchList(previousList);
        setToast({ message: 'Failed to add. Please try again.', isError: true });
        return;
      }
      try {
        const savedMovies = await getWatchList(userId);
        setWatchList(savedMovies);
        setToast({ message: 'Added to watchlist!', isError: false });
      } catch {
        setWatchList(previousList);
        setToast({ message: 'Added! Please refresh the page to see your list.', isError: true });
      }
    }
  };

  /* --- 4. Effects: fetch on search/genre/page change --- */

  useEffect(() => {
    fetchMovies(debouncedSearchTerm, selectedGenre, page);
    if (page > 1) {
    document.querySelector(`.all-movies`)?.scrollIntoView({ behavior: 'smooth'});
  }
  }, [debouncedSearchTerm, selectedGenre, page]);

  useEffect(() => {
    loadTrendingMovies();
    loadGlobalTrending();
  }, []);

  const handleGenreSelect = (genreId) => {
    setSelectedGenre(genreId);
    setSearchTerm('');
    setPage(1);
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    if (value) {
      setSelectedGenre(null);
      setPage(1);
    }
  };

  /* --- 5. Render --- */
  return (
    <main>
      <div className="pattern" />

      <div className="wrapper">
        <header>
        {/* Browse | Watchlist tabs */}
        <div className="view-tabs">
          <button
            onClick={() => setView('browse')}
            className={`view-tab ${view === 'browse' ? 'active' : ''}`}
            aria-pressed={view === 'browse'}
            aria-label="Browse movies"
          >
            <img src="/film-reel.svg" alt="" aria-hidden />
            <span>Browse</span>
          </button>
          <button
            onClick={() => setView('watchlist')}
            className={`view-tab ${view === 'watchlist' ? 'active' : ''}`}
            aria-pressed={view === 'watchlist'}
            aria-label={`Watchlist (${watchList.length} saved)`}
          >
            <img src="/heart.svg" alt="" aria-hidden />
            <span>Watchlist ({watchList.length})</span>
          </button>
        </div>

        {/* Dynamic Hero Banner */}
            <div className='hero-banner-container'>
              <img
              src={heroImage || "/Poster.png"} 
              alt="Trending Movie Banner"
              className='hero-banner-img'
              key={heroImage}
              />
              <div className='hero-overlay'></div>
            </div>
          
          <h1>NovaFilm — Find <span className="text-gradient">Movies</span> You'll Enjoy</h1>

          <Search searchTerm={searchTerm} setSearchTerm={handleSearchChange} />
        </header>

    {/* === VIEW SWITCHER === */}  
    {view ==='watchlist'? (
      <WatchList
        watchList ={watchList} 
        onMovieClick={setSelectedMovie}
        onRemoveFromWatchList={(item) => handleToggleWatchList({id:item.movie_id})}
        onBack={() => setView(`browse`)}
        />

    ):(

      // === BROWSE VIEW ===
  <>
        {!searchTerm && (
            <MovieGenres 
                selectedGenre={selectedGenre} 
                onSelectGenre={handleGenreSelect} 
            />
        )}

    {/* Trending Section (Only shows on home page, not during search/filter) */}
   {!searchTerm && !selectedGenre && page ===1 && (trendingMovies.length > 0 || globalTrending.length > 0) && (
          <TrendingMovies 
            localMovies={trendingMovies} 
            globalMovies={globalTrending}
            localError={trendingError}
            globalError={globalTrendingError}
            onMovieClick={setSelectedMovie}
          />
        )}

    <MovieGrid 
            isLoading={isLoading}
            errorMessage={errorMessage}
            movieList={movieList}
            searchTerm={searchTerm}
            debouncedSearchTerm={debouncedSearchTerm}
            onMovieClick={setSelectedMovie}
            onClearSearch={() => {
              setSearchTerm('')
              setPage(1)
            }}
            watchlist={watchList}
            onToggleWatchlist={handleToggleWatchList}
        />

      {/* Pagination Controls */}
      {!isLoading && !errorMessage && movieList.length > 0 && (
          < Pagination
              currentPage={page}
              totalPages={totalPage}
              onPageChange={(newPage) => setPage(newPage)}
          />
      )}
      </>
    )}
</div>
      {/* Movie Details Modal */}      
      {selectedMovie && (
        <MovieDetails
         movie ={selectedMovie}
         onClose={() => setSelectedMovie(null)}
         />
      )}

      {/* Toast notification for watchlist actions */}
      {toast.message && (
        <Toast
          message={toast.message}
          isError={toast.isError}
          onClose={() => setToast({ message: null, isError: false })}
        />
      )}
    </main>
  );
};

export default App;