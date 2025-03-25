'use client';

import React from 'react';
import { ScheduleProvider } from './ScheduleContext';
import Calendar from './Calendar';
import TextDisplay from './TextDisplay';
import ThemeToggle from './ThemeToggle';

/**
 * アプリケーションのメインコンポーネント
 */
export default function App() {
  return (
    <ScheduleProvider>
      <AppContent />
    </ScheduleProvider>
  );
}

/**
 * アプリケーションのコンテンツコンポーネント
 * ScheduleProviderのコンテキストを使用するため、別コンポーネントとして定義
 */
function AppContent() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* ヘッダー */}
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">AvailableX</h1>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="flex-grow container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* カレンダー */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <Calendar />
            </div>
          </div>

          {/* テキスト表示 */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <TextDisplay />
            </div>
          </div>
        </div>
      </main>

      {/* フッター */}
      <footer className="bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 p-4 mt-8">
        <div className="container mx-auto text-center">
          <p>© 2025 AvailableX - シンプルな日程調整ツール</p>
        </div>
      </footer>
    </div>
  );
}
