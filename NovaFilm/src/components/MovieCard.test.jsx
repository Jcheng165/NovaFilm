import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MovieCard from './MovieCard.jsx';

const mockMovie = {
  id: 1,
  title: 'Inception',
  vote_average: 8.4,
  poster_path: '/path/to/poster.jpg',
  release_date: '2010-07-16',
  original_language: 'en',
};

describe('MovieCard', () => {
  it('renders movie title and rating', () => {
    const mockOnClick = vi.fn();
    const mockOnToggleLike = vi.fn();

    render(
      <MovieCard
        movie={mockMovie}
        onClick={mockOnClick}
        isLiked={false}
        onToggleLike={mockOnToggleLike}
      />
    );

    expect(screen.getByText('Inception')).toBeInTheDocument();
    expect(screen.getByText('8.4')).toBeInTheDocument();
  });

  it('displays year from release_date', () => {
    const mockOnClick = vi.fn();
    const mockOnToggleLike = vi.fn();

    render(
      <MovieCard
        movie={mockMovie}
        onClick={mockOnClick}
        isLiked={false}
        onToggleLike={mockOnToggleLike}
      />
    );

    expect(screen.getByText('2010')).toBeInTheDocument();
  });

  it('calls onClick when card is clicked', () => {
    const mockOnClick = vi.fn();
    const mockOnToggleLike = vi.fn();

    render(
      <MovieCard
        movie={mockMovie}
        onClick={mockOnClick}
        isLiked={false}
        onToggleLike={mockOnToggleLike}
      />
    );

    const card = screen.getByText('Inception').closest('.movie-card');
    fireEvent.click(card);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('calls onToggleLike when like button is clicked', () => {
    const mockOnClick = vi.fn();
    const mockOnToggleLike = vi.fn();

    render(
      <MovieCard
        movie={mockMovie}
        onClick={mockOnClick}
        isLiked={false}
        onToggleLike={mockOnToggleLike}
      />
    );

    const likeButton = screen.getByRole('button', { name: /add to watchlist/i });
    fireEvent.click(likeButton);
    expect(mockOnToggleLike).toHaveBeenCalledWith(mockMovie);
  });
});
