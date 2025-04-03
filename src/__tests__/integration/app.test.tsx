import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../../components/App';
import { ScheduleProvider } from '../../components/ScheduleContext';

jest.mock('../../components/Calendar', () => {
  return function MockCalendar() {
    return <div data-testid="mock-calendar">Calendar Component</div>;
  };
});

jest.mock('../../components/TextDisplay', () => {
  return function MockTextDisplay() {
    return <div data-testid="mock-text-display">Text Display Component</div>;
  };
});

describe('App Integration', () => {
  it('renders the application with all major components', () => {
    render(
      <ScheduleProvider>
        <App />
      </ScheduleProvider>
    );
    
    expect(screen.getByTestId('mock-calendar')).toBeInTheDocument();
    expect(screen.getByTestId('mock-text-display')).toBeInTheDocument();
    
    const themeToggle = screen.getByRole('button', { name: /dark mode|light mode/i });
    expect(themeToggle).toBeInTheDocument();
    
    const languageToggle = screen.getByRole('button', { name: /english|日本語/i });
    expect(languageToggle).toBeInTheDocument();
  });
});
