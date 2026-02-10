/**
 * MovieGenres Component
 * Horizontally scrollable genre filter pills. Fetches genre list from TMDB on mount.
 * Controlled component: parent owns selectedGenre state.
 *
 * @param {number|null} props.selectedGenre - Active genre ID (null = "All")
 * @param {Function} props.onSelectGenre - Callback(genreId) to update filter in parent
 */
import React, { useEffect, useState } from 'react';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
};

const MovieGenres = ({ selectedGenre, onSelectGenre }) => {
  const [genres, setGenres] = useState([]);
  const [error, setError] = useState(null);

  /* Fetch genre list once on mount - used for filter pills */
  useEffect(() => {
    const fetchGenres = async () => {
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/genre/movie/list?language=en`, API_OPTIONS);

        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }

        const data = await response.json();
        setGenres(data.genres || []);
      } catch (err) {
        console.error("Error fetching genres:", err);
        setError('Could not load genres');
      }
    };

    fetchGenres();
  }, []);

  return (
    <div className="genre-list">
      {error && (
        <p className="basis-full text-center text-gray-400 text-sm mb-2">{error}</p>
      )}
      {/* "All" Filter Button */}
      <button
        onClick={() => onSelectGenre(null)}
        className={`genre-pill ${!selectedGenre ? 'active' : ''}`}
      >
        All
      </button>

      {/* Dynamic Genre List */}
      {genres.map((genre) => (
        <button
          key={genre.id}
          onClick={() => onSelectGenre(genre.id)}
          // Conditionally apply 'active' class for visual feedback
          className={`genre-pill ${selectedGenre === genre.id ? 'active' : ''}`}
        >
          {genre.name}
        </button>
      ))}
    </div>
  );
};

export default MovieGenres;