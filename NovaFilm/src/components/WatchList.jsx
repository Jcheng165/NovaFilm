/**
 * WatchList — Saved movies. Adapter: Appwrite schema → MovieCard props (reusable component).
 *
 * @param {Array} props.watchList - Appwrite documents (movie_id, title, poster_path, etc.)
 * @param {Function} props.onMovieClick - Open details modal
 * @param {Function} props.onRemoveFromWatchList - Remove movie (pass item with $id)
 * @param {Function} props.onBack - Back to browse view
 */
import React from 'react';
import MovieCard from './MovieCard';

const WatchList = ({ watchList, onMovieClick, onRemoveFromWatchList, onBack }) => {
    return(
        <section className='all-movies'>

            {/* Header Section with Navigation */}
            <div className='watchlist-header'>
                <h2> My Watch List ({watchList.length})</h2>
                
                <button onClick={onBack}>← Back to Browse</button>
            </div>

            {/* Conditional Rendering: Check if list is populated */}
            {watchList.length > 0? (
                <ul>
                    {watchList.map((item) => 
                    <MovieCard
                     key={(item.$id)} // Uses Appwrite's unique document ID

               /*DATA ADAPTER PATTERN:
                 The 'MovieCard' expects a standard TMDB object structure.
                 Since our database schema differs slightly, we reconstruct the object
                 on the fly to ensure component reusability.
              */
                     movie ={{
                        id:item.movie_id,
                        title: item.title,
                        poster_path: item.poster_path,
                        vote_average: item.vote_average,
                        release_date: `saved`, // Placeholder for saved items
                        original_language: item.original_language || `en`
                     }}

                     // Force the 'liked' state to true since these are saved items
                     isLiked={true}

                     // Map the remove action
                     onToggleLike={() => onRemoveFromWatchList(item)}

                     // Ensure the click handler receives the correct ID format
                     onClick={()=> onMovieClick({...item,id: item.movie_id})}
                     />                    
                    )}
                </ul>
            ):(
        // === EMPTY STATE ===
        // Provides visual feedback and a call-to-action when no data exists.
                <div className='watchlist-empty'>
                    <span className='emoji'>🍿</span>
                    <h3>Your watchlist is empty</h3>
                    <p> Start adding movies to build your collection.</p>
                </div>
            )}

        </section>
    );
};

export default WatchList;
