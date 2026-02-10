/**
 * MovieCard — Poster, title, rating, year, language. Heart (stopPropagation) + card click (details). Works with TMDB and Appwrite via normalized poster URL.
 *
 * @param {Object} props.movie - { title, poster_path, vote_average, release_date, original_language }
 * @param {Function} props.onClick - Open movie details modal
 * @param {boolean} props.isLiked - In watchlist (heart filled)
 * @param {Function} props.onToggleLike - Add/remove from watchlist
 */
import React from 'react';

const MovieCard = ({ movie, onClick, isLiked, onToggleLike }) => {
  const {title, vote_average, poster_path, release_date, original_language} = movie;

  // Normalize poster URL: TMDB returns "/path" or "path"; ensure single slash
  const posterUrl = poster_path
    ? `https://image.tmdb.org/t/p/w500${poster_path.startsWith('/') ? poster_path : '/' + poster_path}`
    : '/No-Movie.png';

  /* Prevent card click (modal) when user clicks heart - stopPropagation */
  const handleLike = (e) => {
    e.stopPropagation(); 
    onToggleLike(movie);
  }

  return (
    <div className='movie-card relative group '>

      {/* Watchlist Toggle Button
          Positioned absolutely (via CSS) to sit on top of the card.*/}
      
      <button className="like-btn" onClick={handleLike}>
        <img src="/heart.svg" alt="Add to Watchlist"
          className={isLiked ? 'heart-liked' : 'heart-unliked'} />
      </button>
    
    {/* Main Card Content - Triggering the onClick prop when clicked */}

    <div className="movie-card cursor-pointer" onClick={onClick}>

       {/* Poster Image with Fallback */}
      <img src={posterUrl} alt={title} />

      <div className="mt-4">
        <h3>{title}</h3>
        <div className="content">
            <div className="rating">
                <img src="/star.svg" alt="Star Icon"/>
                {/* Format rating to 1 decimal place (e.g., 8.5) or show 'NA' */}
                <p>{vote_average ? vote_average.toFixed(1):`NA`}</p>
            </div>
        
        <span>•</span>
        <p className="lang">{original_language}</p> 
        <span>•</span>
        
        {/* Parse the year from YYYY-MM-DD date string */}
        <p className="year">
            {release_date ? release_date.split(`-`)[0]: `NA`}
        </p>

        </div>

      </div>


    </div>
  </div>
  )
}

export default MovieCard
