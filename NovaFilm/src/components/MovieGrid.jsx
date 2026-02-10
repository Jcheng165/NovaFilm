import React from 'react'
import MovieCard from './MovieCard.jsx';
import Spinner from './Spinner.jsx';

/**
 * MovieGrid — Results area: Loading | Error | List | Empty. Uses MovieCard; empty state only when debounce settled.
 *
 * @param {boolean} props.isLoading - Show spinner
 * @param {string} props.errorMessage - API error message
 * @param {Array} props.movieList - Movies to render
 * @param {string} props.searchTerm - Raw input (header / empty state)
 * @param {string} props.debouncedSearchTerm - Query sent to API
 * @param {Function} props.onMovieClick - Open details modal
 * @param {Function} props.onClearSearch - Clear search and reset page
 * @param {Array} props.watchlist - Saved movies (heart state)
 * @param {Function} props.onToggleWatchlist - Add/remove watchlist
 */

const MovieGrid = ({ 
  isLoading, 
  errorMessage, 
  movieList, 
  searchTerm, 
  debouncedSearchTerm,
  onMovieClick,
  onClearSearch,
  watchlist,
  onToggleWatchlist
}) => {
  
  return (
    <section className='all-movies'>
      
      {/* Dynamic Header: Changes context based on search activity */}
      <h2>{searchTerm ? `Search Results for "${searchTerm}"` : 'All Movies'}</h2>

      {/* CONDITIONAL RENDERING FLOW:
        Loading -> Error -> Success (List) -> Empty State */}

      {isLoading ? (
        <Spinner />
      ) : errorMessage ? (
        <p className='text-red-500'>{errorMessage}</p>
      ) : movieList.length > 0 ? (
        <ul>

          {movieList.map((movie) => {
            // Check if the current movie exists in the watchlist to set initial button state
            const isLiked = watchlist?.some((item) => item.movie_id === movie.id);
            
            return (
            <MovieCard 
              key={movie.id} 
              movie={movie}
              onClick={() => onMovieClick(movie)}
              isLiked={isLiked}
              onToggleLike={onToggleWatchlist}
            />
          )
        })}
      </ul>

      ) : (
        // === EMPTY STATE ===
        // We check (searchTerm === debouncedSearchTerm) to ensure we don't show 
        // "No Movies Found" while the user is currently typing (before the debounce triggers).
        searchTerm === debouncedSearchTerm && (
          <div className='no-results'>
            <p className='text-white text-xl font-bold mt-4'>No Movies Found</p>
            <p className='text-gray-400 mt-2'> 
              We couldn't find any movies matching "{searchTerm}". Please try different keywords.
            </p>
            <button
              onClick={onClearSearch}
              className='mt-6 text-indigo-400 hover:text-indigo-300 transition-colors underline'
            >
              CLEAR SEARCH
            </button>
          </div>
        )
      )}
    </section>
  );
};

export default MovieGrid