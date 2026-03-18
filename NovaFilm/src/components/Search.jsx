/**
 * Search — Controlled input with icon and clear button. Single source of truth in parent.
 *
 * @param {string} props.searchTerm - Current value
 * @param {Function} props.setSearchTerm - Callback to update parent state
 */
import React from 'react';

const Search = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="search">
        <div>
            <img src="/Search.svg" alt="Search" />

          {/* Controlled: value from parent, onChange updates parent state */}
            <input
                type="text"
                placeholder="Search through thousands of movies"
                aria-label="Search movies"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

          {/* Clear button: only visible when there's text to clear */}
            {searchTerm.length > 0 && (
            <button onClick={() => setSearchTerm('')} className="clear-btn">
                <img src="/refresh.svg" alt="Reset Search" />
            </button>
        )}

        </div>
    </div>
  )
}

export default Search
