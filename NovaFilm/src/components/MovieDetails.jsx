/**
 * MovieDetails — Modal: trailer, cast, reviews, streaming. One API call (append_to_response). Focus trap, Escape, error + retry.
 *
 * @param {Object} props.movie - Movie with at least { id } for fetch
 * @param {Function} props.onClose - Close handler (Escape, button, overlay)
 */
import { useEffect, useState, useRef } from 'react';
import Spinner from './Spinner';

const API_BASE_URL = `https://api.themoviedb.org/3`;

const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`
    }
};

const MovieDetails = ({ movie, onClose }) => {
    const [details, setDetails] = useState(null);
    const [trailerKey, setTrailerKey] = useState(null);
    const [providers, setProviders] = useState(null);
    const [cast, setCast] = useState([]);
    const [error, setError] = useState(null);
    const [retryCount, setRetryCount] = useState(0);
    const modalRef = useRef(null);
    const previousActiveElement = useRef(null);

    useEffect(() => {
        const fetchDetails = async () => {
            setError(null);
            try {
                /* Single request for all extended data - reduces API calls */
                const endpoint = `${API_BASE_URL}/movie/${movie.id}?append_to_response=videos,reviews,watch/providers,credits`;
                const response = await fetch(endpoint, API_OPTIONS);

                if (!response.ok) {
                    throw new Error(`Failed to fetch: ${response.status}`);
                }

                const data = await response.json();

                if (!data || !data.videos) {
                    throw new Error('Invalid response from API');
                }

                setDetails(data);

                /* Find first YouTube trailer for embedding */
                const trailer = data.videos.results.find(
                    (vid) => vid.type === "Trailer" && vid.site === "YouTube"
                );
                setTrailerKey(trailer ? trailer.key : null);

                /* US-only: flatrate = subscription streaming (Netflix, etc.) */
                const usProviders = data['watch/providers']?.results?.US?.flatrate;
                setProviders(usProviders || []);

                /* Top 10 cast members for display */
                if (data.credits && data.credits.cast) {
                    setCast(data.credits.cast.slice(0, 10));
                }
            } catch (err) {
                console.error("Error fetching details:", err);
                setError(err.message || 'Failed to load movie details');
            }
        };

        if (movie) fetchDetails();
    }, [movie, retryCount]);
    

    // Escape key listener
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    // Focus trap: when modal has content, focus close button and trap Tab/Shift+Tab
    useEffect(() => {
        if (!error && !details) return;

        previousActiveElement.current = document.activeElement;
        const closeBtn = modalRef.current?.querySelector('.close-btn');
        closeBtn?.focus();

        const handleTabKey = (e) => {
            if (e.key !== 'Tab' || !modalRef.current) return;

            const focusables = modalRef.current.querySelectorAll(FOCUSABLE_SELECTOR);
            const first = focusables[0];
            const last = focusables[focusables.length - 1];

            if (e.shiftKey) {
                if (document.activeElement === first) {
                    e.preventDefault();
                    last?.focus();
                }
            } else {
                if (document.activeElement === last) {
                    e.preventDefault();
                    first?.focus();
                }
            }
        };

        document.addEventListener('keydown', handleTabKey);
        return () => {
            document.removeEventListener('keydown', handleTabKey);
            previousActiveElement.current?.focus();
        };
    }, [error, details]);

    // Render loading, error, or content
    if (error) {
        return (
            <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
                <div ref={modalRef} className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <button onClick={onClose} className="close-btn" aria-label="Close">&times;</button>
                    <div className="py-12 text-center">
                        <p className="text-red-400 font-medium mb-2">Failed to load movie details</p>
                        <p className="text-gray-400 text-sm mb-4">{error}</p>
                        <button
                            onClick={() => setRetryCount((c) => c + 1)}
                            className="px-4 py-2 rounded-lg bg-dark-100 border border-gray-800 hover:bg-gray-800 transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!details) {
        return <Spinner />;
    }
        
    return (
        <div className="modal-overlay"
             onClick={(e) => e.stopPropagation()}
             role="dialog"
             aria-modal="true"
             aria-labelledby="movie-detail-title"
        >
            <div ref={modalRef}
                 className="modal-content"
                 onClick={(e) => e.stopPropagation()}
                 role="dialog"
                 aria-modal="true"
                 aria-labelledby="movie-detail-title"
            >
                 

                {/* Close Button */}
                <button onClick={onClose} className='close-btn' aria-label='Close movie details'>&times;</button>

                <div className ="details-grid">

                    {/* === LEFT COLUMN: Poster & Providers === */}
                    <div className='poster-column'>
                        <img
                        src={details.poster_path ? `https://image.tmdb.org/t/p/w500${details.poster_path}` : '/No-Movie.png'}
                        alt ={details.title}
                        className='poster-img'
                        />
                    {/* Streaming Availability Section */}
                        {providers && providers.length >0 && (
                            <section className='providers-section' aria-label='Streaming availability'>
                                <h2 className='section-heading-sm'>Watch On:</h2>
                                <ul className='provider-icons'>
                                    {providers.map((provider) => (
                                    <li key={provider.provider_id}>
                                        <img 
                                            src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                                            alt={provider.provider_name}
                                            title={provider.provider_name}
                                        />
                                    </li>
                                    ))}
                                </ul>
                            </section>
                        )}     
                    </div>

                    {/* === RIGHT COLUMN: Info, Trailer, Reviews === */}
                    <div className = 'info-column'>
                        <h1 id= "movie-detail-title" className = 'movie-title'>{details.title}</h1>
                        <p className = 'movie-tagline'>{details.tagline}</p>

                        {/* Embedded YouTube Trailer */}
                        {trailerKey && (
                        <div className = 'trailer-section'>
                            <div className = 'video-frame'>
                                <iframe
                                    src={`https://www.youtube.com/embed/${trailerKey}`}
                                    title={`Official trailer for ${details.title}`}
                                    allowFullScreen
                                    />
                            </div>
                            <a
                                href={`https://www.youtube.com/watch?v=${trailerKey}`}
                                target='_blank'
                                rel='noreferrer'
                                className='youtube-link' 
                            >
                                Watch on YouTube instead ↗
                            </a>
                        </div>
                        )}

                        {/* Synopsis */}
                        <h2 className='section-heading'>Overview</h2>
                        <p className='overview-text'>{details.overview}</p>
                        
                        {/* Cast List */}
                        {cast.length > 0 && (
                            <div className='cast-section'>
                                <h2 className='section-heading'> Top Cast</h2>
                                <ul className='cast-list'> 
                                    {cast.map((actor) => (
                                        <li key={actor.id} className='cast-card'>
                                            <img
                                            src={actor.profile_path ? `https://image.tmdb.org/t/p/w185${actor.profile_path}` : '/No-Movie.png'} 
                                            alt={actor.name}
                                            />
                                        <p className='cast-name'> {actor.name}</p>
                                        <p className='cast-character' aria-label={`Plays character ${actor.character}`}>{actor.character}</p>
                                        </li> 
                                    ))} 
                                </ul>
                            </div>
                        )}

                        {/* User Reviews */}
                        <h2 className='section-heading'> Reviews</h2>
                        <div className='reviews-container'>
                            {details.reviews?.results?.length > 0 ? (
                                details.reviews.results.slice(0,3).map((review) => (
                                    <div key={review.id} className='review-card'>    
                                        <p className='author'>{review.author}</p>
                                        <p className='content'>{review.content}</p>
                                    </div>
                                ))
                            ): (
                                <p className='text-gray-500'>No reviews found.</p>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );

};



export default MovieDetails;