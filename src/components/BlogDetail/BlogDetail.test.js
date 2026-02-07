import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import BlogDetail from './BlogDetail';
import { ToastProvider } from '../../context/ToastContext';

jest.mock('../../hooks/usePosts', () => ({
  usePost: jest.fn(),
}));
jest.mock('../../hooks/useComments', () => ({
  useComments: jest.fn(),
}));
jest.mock('../../firebase', () => ({ auth: { currentUser: null } }));

const { usePost } = require('../../hooks/usePosts');
const { useComments } = require('../../hooks/useComments');

const mockPost = {
  _id: 'post-1',
  title: 'Test Post Title',
  content: 'Test post content body here.',
  author: { name: 'Test Author', email: 'author@test.com' },
  tags: ['test'],
  date: new Date().toISOString(),
};

const mockComments = [
  { _id: 'c1', comment: 'First comment', user: { name: 'User A' } },
  { _id: 'c2', comment: 'Second comment', user: { name: 'User B' } },
];

function renderWithRouter() {
  return render(
    <ToastProvider>
      <MemoryRouter initialEntries={['/posts/post-1']}>
        <Routes>
          <Route path="/posts/:id" element={<BlogDetail />} />
        </Routes>
      </MemoryRouter>
    </ToastProvider>
  );
}

describe('BlogDetail', () => {
  it('shows loading state when loading', () => {
    usePost.mockReturnValue({ post: null, loading: true, error: null });
    useComments.mockReturnValue({ comments: [], addComment: jest.fn() });
    renderWithRouter();
    expect(screen.queryByText('Test Post Title')).not.toBeInTheDocument();
  });

  it('shows post content and comments when loaded', () => {
    usePost.mockReturnValue({ post: mockPost, loading: false, error: null });
    useComments.mockReturnValue({
      comments: mockComments,
      addComment: jest.fn(),
    });
    renderWithRouter();
    expect(screen.getByText('Test Post Title')).toBeInTheDocument();
    expect(screen.getByText(/Test post content body here/i)).toBeInTheDocument();
    expect(screen.getByText('First comment')).toBeInTheDocument();
    expect(screen.getByText('Second comment')).toBeInTheDocument();
  });
});
