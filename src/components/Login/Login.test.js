import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from './Login';

jest.mock('../../authService', () => ({
  login: jest.fn(),
  signUp: jest.fn(),
}));
jest.mock('../../firebase', () => ({ auth: { currentUser: null } }));
jest.mock('../../config', () => ({ endpoint: 'http://test.api' }));

const { login, signUp } = require('../../authService');

function renderLogin() {
  return render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );
}

describe('Login', () => {
  it('renders login form and submits happy path', async () => {
    login.mockResolvedValueOnce(undefined);
    renderLogin();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'user@test.com' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith('user@test.com', 'password123');
    });
  });

  it('shows error state when login fails', async () => {
    login.mockRejectedValueOnce(new Error('Invalid credentials'));
    renderLogin();
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'bad@test.com' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'wrong' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/Authentication error/i)).toBeInTheDocument();
    });
  });
});
