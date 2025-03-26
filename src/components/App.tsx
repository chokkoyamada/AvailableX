"use client";

import React from "react";
import { ScheduleProvider } from "./ScheduleContext";
import Calendar from "./Calendar";
import TextDisplay from "./TextDisplay";
import ThemeToggle from "./ThemeToggle";
import LanguageToggle from "./LanguageToggle";
import { useSchedule } from "./ScheduleContext";
import { translate } from "../utils/i18n";

/**
 * アプリケーションのメインコンポーネント
 */
interface AppProps {
  isSharedView?: boolean;
}

export default function App({ isSharedView = false }: AppProps) {
  return (
    <ScheduleProvider initialViewMode={isSharedView ? 'view' : 'edit'}>
      <AppContent />
    </ScheduleProvider>
  );
}

/**
 * アプリケーションのコンテンツコンポーネント
 * ScheduleProviderのコンテキストを使用するため、別コンポーネントとして定義
 */
function AppContent() {
  const { state } = useSchedule();
  const { displayFormat, theme } = state;
  return (
    <div className="min-h-screen flex flex-col">
      {/* ヘッダー */}
      <header className={`p-4 shadow-md text-white ${
        theme === 'dark'
          ? 'bg-teal-700'
          : 'bg-teal-500'
      }`}>
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex flex-col sm:flex-row sm:items-center">
            <h1 className="text-2xl font-bold">AvailableX</h1>
            <p className="text-sm text-teal-100 sm:ml-3 sm:mt-0 mt-1">
              {translate("subtitle", displayFormat)}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="flex-grow container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* カレンダー */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <Calendar />
            </div>
          </div>

          {/* テキスト表示 */}
          <div className="lg:col-span-2">
            <div className="sticky top-4">
              <TextDisplay />
            </div>
          </div>
        </div>
      </main>

      {/* フッター */}
      <footer className="bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 p-4 mt-8">
        <div className="container mx-auto text-center">
          <div className="flex flex-col items-center space-y-2">
            <p className="text-sm">
              &copy; 2025 <a href="https://www.kirishikistudios.com/" className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 hover:underline">Kirishiki Studios</a>
            </p>
            <div className="flex items-center space-x-4">
              <a href="https://github.com/chokkoyamada/AvailableX" className="text-sm flex items-center text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 hover:underline" target="_blank" rel="noopener noreferrer">
                <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
