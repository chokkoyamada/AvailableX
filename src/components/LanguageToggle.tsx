'use client';

import React from 'react';
import { useSchedule } from './ScheduleContext';
import { IconButton } from './ui/IconButton';

/**
 * 言語切替ボタンコンポーネント
 */
export default function LanguageToggle() {
  const { state, dispatch } = useSchedule();
  const { displayFormat } = state;

  // 現在の言語が日本語かどうか
  const isJapanese = displayFormat === 'ja';

  // 言語切替関数
  const toggleLanguage = () => {
    const newFormat = isJapanese ? 'en' : 'ja';
    dispatch({ type: 'SET_DISPLAY_FORMAT', displayFormat: newFormat });
  };

  return (
    <IconButton
      onClick={toggleLanguage}
      ariaLabel={`Switch to ${isJapanese ? 'English' : '日本語'}`}
    >
      <div className="h-6 w-6 flex items-center justify-center text-white">
        <span className="font-bold text-sm">
          {isJapanese ? 'EN' : 'JA'}
        </span>
      </div>
    </IconButton>
  );
}
