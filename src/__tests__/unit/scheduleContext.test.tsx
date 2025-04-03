import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ScheduleProvider, useSchedule } from '../../components/ScheduleContext';

const TestComponent = () => {
  const { state, dispatch } = useSchedule();
  
  return (
    <div>
      <div data-testid="theme">{state.theme}</div>
      <div data-testid="display-format">{state.displayFormat}</div>
      <button 
        onClick={() => dispatch({ type: 'SET_THEME', theme: state.theme === 'light' ? 'dark' : 'light' })}
        data-testid="toggle-theme-btn"
      >
        Toggle Theme
      </button>
      <button 
        onClick={() => dispatch({ 
          type: 'SET_DISPLAY_FORMAT', 
          displayFormat: state.displayFormat === 'ja' ? 'en' : 'ja' 
        })}
        data-testid="toggle-format-btn"
      >
        Toggle Format
      </button>
    </div>
  );
};

describe('ScheduleContext', () => {
  it('provides initial state', () => {
    render(
      <ScheduleProvider>
        <TestComponent />
      </ScheduleProvider>
    );
    
    const themeElement = screen.getByTestId('theme');
    expect(['light', 'dark']).toContain(themeElement.textContent);
    
    const formatElement = screen.getByTestId('display-format');
    expect(['ja', 'en', 'short']).toContain(formatElement.textContent);
  });
  
  it('toggles theme when dispatch is called', () => {
    render(
      <ScheduleProvider>
        <TestComponent />
      </ScheduleProvider>
    );
    
    const themeElement = screen.getByTestId('theme');
    const initialTheme = themeElement.textContent;
    const toggleButton = screen.getByTestId('toggle-theme-btn');
    
    fireEvent.click(toggleButton);
    
    const newTheme = themeElement.textContent;
    expect(newTheme).not.toBe(initialTheme);
    expect(['light', 'dark']).toContain(newTheme);
  });
  
  it('changes display format when dispatch is called', () => {
    render(
      <ScheduleProvider>
        <TestComponent />
      </ScheduleProvider>
    );
    
    const formatElement = screen.getByTestId('display-format');
    const initialFormat = formatElement.textContent;
    const toggleButton = screen.getByTestId('toggle-format-btn');
    
    fireEvent.click(toggleButton);
    
    const newFormat = formatElement.textContent;
    expect(newFormat).not.toBe(initialFormat);
    expect(['ja', 'en', 'short']).toContain(newFormat);
  });
});
