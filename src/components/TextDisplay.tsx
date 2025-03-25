'use client';

import React, { useState } from 'react';
import { useSchedule } from './ScheduleContext';
import { formatSchedule } from '../utils/format';
import { encodeScheduleForUrl } from '../lib/encode';

/**
 * テキスト表示コンポーネント
 * 選択された日時範囲を人間が読みやすい形式で表示し、クリップボードにコピーする機能を提供
 */
export default function TextDisplay() {
  const { state } = useSchedule();
  const { schedule, displayFormat, theme } = state;

  const [copied, setCopied] = useState(false);
  const [urlCopied, setUrlCopied] = useState(false);

  // スケジュールを人間が読みやすい形式に変換
  const formattedSchedule = formatSchedule(schedule, displayFormat);

  // URLを生成
  const generateUrl = () => {
    const baseUrl = window.location.origin + window.location.pathname;
    const encodedSchedule = encodeScheduleForUrl(schedule);
    return `${baseUrl}?schedule=${encodedSchedule}`;
  };

  // テキストをクリップボードにコピー
  const copyToClipboard = (text: string, setCopiedState: React.Dispatch<React.SetStateAction<boolean>>) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setCopiedState(true);
        setTimeout(() => setCopiedState(false), 2000);
      },
      (err) => {
        console.error('クリップボードへのコピーに失敗しました:', err);
      }
    );
  };

  // 選択された日時がない場合のメッセージ
  if (!schedule.dateRanges.length) {
    return (
      <div className={`p-4 rounded-md ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-700'}`}>
        <p className="text-center">カレンダーから日時を選択してください</p>
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-md ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-700'}`}>
      <h3 className="text-lg font-semibold mb-2">選択された日時</h3>

      {/* テキスト表示 */}
      <div className={`p-3 rounded-md mb-4 whitespace-pre-line ${
        theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'
      }`}>
        {formattedSchedule}
      </div>

      {/* コピーボタン */}
      <div className="flex flex-col sm:flex-row gap-2">
        <button
          onClick={() => copyToClipboard(formattedSchedule, setCopied)}
          className={`px-4 py-2 rounded-md flex items-center justify-center ${
            theme === 'dark'
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {copied ? (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              コピーしました
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                />
              </svg>
              テキストをコピー
            </>
          )}
        </button>

        <button
          onClick={() => copyToClipboard(generateUrl(), setUrlCopied)}
          className={`px-4 py-2 rounded-md flex items-center justify-center ${
            theme === 'dark'
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          {urlCopied ? (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              URLをコピーしました
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
              URLをコピー
            </>
          )}
        </button>
      </div>
    </div>
  );
}
