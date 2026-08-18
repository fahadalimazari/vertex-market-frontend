import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App Root Component', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});
