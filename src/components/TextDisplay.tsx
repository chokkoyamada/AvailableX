'use client';

import React, { useState } from 'react';
import { useSchedule } from './ScheduleContext';
import { formatSchedule } from '../utils/format';
import { encodeScheduleForUrl } from '../lib/encode';
import { decodeScheduleFromUrl } from '../lib/decode';
import { translate } from '../utils/i18n';
import { generateId, generateRandomColor } from '../utils/scheduleUtils';

/**
 * テキスト表示コンポーネント
 * 選択された日時範囲を人間が読みやすい形式で表示し、クリップボードにコピーする機能を提供
 */
export default function TextDisplay() {
  const { state, dispatch } = useSchedule();
  const { schedule, displayFormat, theme } = state;

  const [copied, setCopied] = useState(false);
  const [urlCopied, setUrlCopied] = useState(false);
  const [sharedUrl, setSharedUrl] = useState('');
  const [error, setError] = useState('');
  const [userName, setUserName] = useState('');

  // スケジュールを人間が読みやすい形式に変換
  const formattedSchedule = formatSchedule(schedule, displayFormat);

  // URLを生成
  const generateUrl = () => {
    const baseUrl = window.location.origin + window.location.pathname;
    // ユーザー名を含めたスケジュールデータを作成
    const scheduleWithUserName = userName.trim()
      ? { ...schedule, userName: userName.trim() }
      : schedule;
    const encodedSchedule = encodeScheduleForUrl(scheduleWithUserName);
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
        <p className="text-center">{translate('selectFromCalendar', displayFormat)}</p>
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-md ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-700'}`}>
      <h3 className="text-lg font-semibold mb-2">{translate('selectDateTime', displayFormat)}</h3>

      {/* テキスト表示 */}
      <div className={`p-3 rounded-md mb-4 whitespace-pre-line ${
        theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'
      }`}>
        {formattedSchedule}
      </div>

      {/* コピーボタンと全データクリアボタン */}
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
              {translate('copied', displayFormat)}
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
              {translate('copyText', displayFormat)}
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
              {translate('urlCopied', displayFormat)}
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
              {translate('copyUrl', displayFormat)}
            </>
          )}
        </button>

        <button
          onClick={() => {
            if (window.confirm(translate('confirmClear', displayFormat))) {
              dispatch({ type: "CLEAR_SCHEDULE" });
            }
          }}
          className={`px-4 py-2 rounded-md flex items-center justify-center ${
            theme === 'dark'
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-red-500 hover:bg-red-600 text-white'
          }`}
        >
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
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          {translate('clearAll', displayFormat)}
        </button>
      </div>

      {/* ユーザー名入力フィールド（オプション） */}
      <div className="mt-4 mb-4">
        <input
          type="text"
          placeholder={'ユーザー名（オプション）'}
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className={`w-full px-3 py-2 border rounded-md ${
            theme === 'dark'
              ? 'bg-gray-700 text-white border-gray-600'
              : 'bg-white text-gray-800 border-gray-300'
          }`}
        />
      </div>

      {/* 他の人の予定を追加するフォーム */}
      <div className="mt-6 border-t pt-4">
        <h3 className="text-lg font-semibold mb-2">{translate('addSharedSchedule', displayFormat)}</h3>
        <div className="flex flex-col gap-2">
          <input
            type="text"
            placeholder={translate('enterSharedUrl', displayFormat)}
            value={sharedUrl}
            onChange={(e) => setSharedUrl(e.target.value)}
            className={`px-3 py-2 border rounded-md ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-800 border-gray-300'}`}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            onClick={() => {
              setError('');
              try {
                // URLからスケジュールパラメータを抽出
                const url = new URL(sharedUrl);
                const scheduleParam = url.searchParams.get('schedule');

                if (!scheduleParam) {
                  setError(translate('invalidScheduleUrl', displayFormat) || '有効なスケジュールURLではありません');
                  return;
                }

                // スケジュールデータをデコード
                const decodedSchedule = decodeScheduleFromUrl(scheduleParam);

                // ランダムな色を生成
                const color = generateRandomColor();

                // スケジュールを追加
                dispatch({
                  type: 'ADD_SHARED_SCHEDULE',
                  id: generateId(),
                  schedule: decodedSchedule,
                  color
                });

                // 入力フィールドをクリア
                setSharedUrl('');
              } catch (error) {
                setError(translate('failedToLoadSchedule', displayFormat) || 'スケジュールの読み込みに失敗しました');
                console.error(error);
              }
            }}
            className={`px-4 py-2 rounded-md flex items-center justify-center ${
              theme === 'dark'
                ? 'bg-purple-600 hover:bg-purple-700 text-white'
                : 'bg-purple-500 hover:bg-purple-600 text-white'
            }`}
          >
            {translate('add', displayFormat) || '追加'}
          </button>
        </div>

        {/* 追加済みの共有スケジュール一覧 */}
        {state.sharedSchedules.length > 0 && (
          <div className="mt-4">
            <h4 className="font-medium mb-2">{translate('addedSchedules', displayFormat) || '追加済みの予定'}</h4>
            <ul className="space-y-2">
              {state.sharedSchedules.map((shared) => (
                <li key={shared.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className="w-4 h-4 rounded-full mr-2"
                      style={{ backgroundColor: shared.color }}
                    ></div>
                    <span>
                      {shared.schedule.userName || translate('otherSchedule', displayFormat)} #{shared.id.substring(0, 4)}
                    </span>
                  </div>
                  <button
                    onClick={() => dispatch({ type: 'REMOVE_SHARED_SCHEDULE', id: shared.id })}
                    className="text-red-500 text-sm"
                  >
                    {translate('remove', displayFormat) || '削除'}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
