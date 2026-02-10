/**
 * TrendingMovies — Toggle Community (Appwrite) vs Global (TMDB). Adapter: movie_id → id for modal.
 *
 * @param {Array} props.localMovies - Top searches (Appwrite)
 * @param {Array} props.globalMovies - Trending (TMDB)
 * @param {string} props.localError - Appwrite error
 * @param {string} props.globalError - TMDB error
 * @param {Function} props.onMovieClick - Open movie details
 */
import React, { useState } from 'react';

const TrendingMovies = ({ localMovies, globalMovies, localError, globalError, onMovieClick }) => {
  /* true = Community (Top Searches), false = Global (Global Hits) */
  const [isLocalTrending, setIsLocalTrending] = useState(true);

  return (
    <section className="trending">
      
      {/* --- Header & Toggle Switch --- */}
      <div className="trending-header">
        <h2>{isLocalTrending ? "Top Searches" : "Global Hits"}</h2>
        
        <div className="toggle-container">
          <button 
            onClick={() => setIsLocalTrending(true)}
            className={`toggle-btn ${isLocalTrending ? 'active' : 'inactive'}`}
          >
            Community
          </button>
          
          <button 
            onClick={() => setIsLocalTrending(false)}
            className={`toggle-btn ${!isLocalTrending ? 'active' : 'inactive'}`}
          >
            Global
          </button>
        </div>
      </div>

      {/* --- CONTENT LOGIC --- */}
      {/* Error Handling Strategy:
         We dynamically check the error state of the CURRENTLY active tab.
         This prevents showing a global API error if the user is just looking at local data.
      */}
      {(isLocalTrending ? localError : globalError) ? (
        
        <div className="w-full text-center py-10 bg-dark-100/50 rounded-lg border border-red-500/20">
            <p className="text-red-400 font-medium">
                {isLocalTrending ? localError : globalError}
            </p>
            <p className="text-gray-500 text-sm mt-1">Please try again later.</p>
        </div>

      ) : (

        <ul>
            {isLocalTrending ? (
            // === LOCAL LIST (Appwrite Data Source) ===
            localMovies.map((movie, index) => (
                <li 
                key={movie.$id}
                // DATA NORMALIZATION (Adapter Pattern):
                // Appwrite stores the ID as 'movie_id', but our Modal expects 'id'.
                // We spread the movie object and override the ID on the fly to match the expected schema.
                onClick={() => onMovieClick({ ...movie, id: movie.movie_id })} 
                className="cursor-pointer"
                >
                <p>{index + 1}</p>
                <img src={movie.poster_url} alt={movie.title} />
                </li>
            ))
            ) : (
            // === GLOBAL LIST (TMDB Data Source) ===
            globalMovies.map((movie, index) => (
                <li 
                key={movie.id} 
                onClick={() => onMovieClick(movie)} 
                className="cursor-pointer"
                >
                <p>{index + 1}</p>
                <img 
                    src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/No-Movie.png'} 
                    alt={movie.title} 
                />
                </li>
            ))
            )}
        </ul>
      )}
    </section>
  );
};

export default TrendingMovies;