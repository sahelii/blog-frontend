import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app with StoryHub branding', () => {
  render(<App />);
  expect(screen.getByText(/StoryHub/i)).toBeInTheDocument();
});
