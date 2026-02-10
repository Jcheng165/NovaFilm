import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from './useDebounce.js';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 1000));
    expect(result.current).toBe('initial');
  });

  it('does not update debounced value before delay expires', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'first', delay: 1000 } }
    );

    expect(result.current).toBe('first');

    rerender({ value: 'second', delay: 1000 });
    expect(result.current).toBe('first');

    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(result.current).toBe('first');
  });

  it('updates debounced value after delay expires', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'first', delay: 1000 } }
    );

    rerender({ value: 'second', delay: 1000 });

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current).toBe('second');
  });

  it('cancels previous timeout when value changes rapidly', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'first', delay: 1000 } }
    );

    rerender({ value: 'second', delay: 1000 });
    act(() => vi.advanceTimersByTime(500));
    rerender({ value: 'third', delay: 1000 });
    act(() => vi.advanceTimersByTime(500));
    expect(result.current).toBe('first');

    act(() => vi.advanceTimersByTime(500));
    expect(result.current).toBe('third');
  });
});
