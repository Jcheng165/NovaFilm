import { useEffect, useState } from 'react';

/**
 * useDebounce — Delays value updates until user stops typing. Cuts API calls during search (~80% with 1s delay).
 *
 * @param {*} value - Value to debounce (e.g. search term)
 * @param {number} delay - Ms after last change (default 1000)
 * @returns {*} - Debounced value
 */
export function useDebounce(value, delay = 1000) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    /* Cleanup: cancel timeout if value changes before delay expires */
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
