'use client';

import React from 'react';
import { useSchedule } from './ScheduleContext';
import { IconButton } from './ui/IconButton';

/**
 * ライト/ダークモード切り替えボタンコンポーネント
 */
export default function ThemeToggle() {
  const { state, dispatch } = useSchedule();
  const { theme } = state;

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';

    // document.documentElementに'dark'クラスを追加/削除
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    dispatch({ type: 'SET_THEME', theme: newTheme });
  };

  // 初期テーマの適用
  React.useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <IconButton
      onClick={toggleTheme}
      ariaLabel={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        // 月アイコン（ダークモードに切り替え）
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-gray-700"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      ) : (
        // 太陽アイコン（ライトモードに切り替え）
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-yellow-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      )}
    </IconButton>
  );
}
