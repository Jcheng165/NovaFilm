import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Search from './Search.jsx';

describe('Search', () => {
  it('renders search input with placeholder', () => {
    const mockSetSearchTerm = vi.fn();
    render(<Search searchTerm="" setSearchTerm={mockSetSearchTerm} />);

    const input = screen.getByPlaceholderText(/search through thousands of movies/i);
    expect(input).toBeInTheDocument();
  });

  it('has aria-label for accessibility', () => {
    const mockSetSearchTerm = vi.fn();
    render(<Search searchTerm="" setSearchTerm={mockSetSearchTerm} />);

    const input = screen.getByLabelText(/search movies/i);
    expect(input).toBeInTheDocument();
  });

  it('displays the controlled value', () => {
    const mockSetSearchTerm = vi.fn();
    render(<Search searchTerm="Inception" setSearchTerm={mockSetSearchTerm} />);

    const input = screen.getByDisplayValue('Inception');
    expect(input).toBeInTheDocument();
  });

  it('calls setSearchTerm when user types', () => {
    const mockSetSearchTerm = vi.fn();
    render(<Search searchTerm="" setSearchTerm={mockSetSearchTerm} />);

    const input = screen.getByPlaceholderText(/search through thousands of movies/i);
    fireEvent.change(input, { target: { value: 'Batman' } });

    expect(mockSetSearchTerm).toHaveBeenCalledWith('Batman');
  });

  it('shows clear button when searchTerm has value', () => {
    const mockSetSearchTerm = vi.fn();
    render(<Search searchTerm="test" setSearchTerm={mockSetSearchTerm} />);

    const clearBtn = screen.getByRole('button', { name: /reset search/i });
    expect(clearBtn).toBeInTheDocument();
  });

  it('does not show clear button when searchTerm is empty', () => {
    const mockSetSearchTerm = vi.fn();
    render(<Search searchTerm="" setSearchTerm={mockSetSearchTerm} />);

    const clearBtn = screen.queryByRole('button', { name: /reset search/i });
    expect(clearBtn).not.toBeInTheDocument();
  });
});
