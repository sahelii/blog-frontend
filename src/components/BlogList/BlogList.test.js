import React from 'react';
import { render, screen } from '@testing-library/react';
import BlogList from './BlogList';

const mockPosts = [
  {
    _id: '1',
    title: 'First Post',
    content: 'Content of first post',
    author: { name: 'Author One' },
    tags: ['tech'],
    date: new Date().toISOString(),
  },
  {
    _id: '2',
    title: 'Second Post',
    content: 'Content of second post',
    author: { name: 'Author Two' },
    tags: ['life'],
    date: new Date().toISOString(),
  },
];

jest.mock('../../hooks/usePosts', () => ({
  usePosts: jest.fn(),
}));

const { usePosts } = require('../../hooks/usePosts');

describe('BlogList', () => {
  it('renders loading skeleton when loading and no posts', () => {
    usePosts.mockReturnValue({
      posts: [],
      loading: true,
      error: null,
      pagination: null,
    });
    render(<BlogList />);
    expect(screen.getByText(/Discover Stories/i)).toBeInTheDocument();
    expect(screen.queryByText('First Post')).not.toBeInTheDocument();
  });

  it('renders posts when loaded', () => {
    usePosts.mockReturnValue({
      posts: mockPosts,
      loading: false,
      error: null,
      pagination: { totalPages: 1, currentPage: 1 },
    });
    render(<BlogList />);
    expect(screen.getByText('First Post')).toBeInTheDocument();
    expect(screen.getByText('Second Post')).toBeInTheDocument();
  });
});
