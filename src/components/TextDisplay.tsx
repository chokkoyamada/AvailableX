'use client';

import React, { useState } from 'react';
import { useSchedule } from './ScheduleContext';
import { formatSchedule } from '../utils/format';
import { encodeScheduleForUrl } from '../lib/encode';
import { translate } from '../utils/i18n';

/**
 * テキスト表示コンポーネント
 * 選択された日時範囲を人間が読みやすい形式で表示し、クリップボードにコピーする機能を提供
 */
export default function TextDisplay() {
  const { state, dispatch } = useSchedule();
  const { schedule, displayFormat, theme, viewMode, viewerName } = state;

  const [copied, setCopied] = useState(false);
  const [urlCopied, setUrlCopied] = useState(false);
  const [userName, setUserName] = useState('');

  // スケジュールを人間が読みやすい形式に変換
  const formattedSchedule = formatSchedule(schedule, displayFormat);

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

  // 閲覧モード用のヘッダー
  const renderViewModeHeader = () => {
    if (viewMode !== 'view') return null;

    return (
      <div className={`p-3 mb-4 rounded-md ${
        theme === 'dark' ? 'bg-teal-800 text-white' : 'bg-teal-100 text-teal-800'
      }`}>
        <h2 className="text-lg font-semibold">
          {viewerName
            ? `${viewerName}${translate('possessiveSuffix', displayFormat)}${translate('availableTimes', displayFormat)}`
            : translate('sharedSchedule', displayFormat)}
        </h2>

        {/* 元の予定がある場合は表示 */}
        {state.originalSchedule && (
          <div className="mt-2 mb-2">
            <h3 className="font-medium">{translate('originalSchedule', displayFormat)}</h3>
            <div className={`p-2 rounded-md text-sm whitespace-pre-line ${
              theme === 'dark' ? 'bg-blue-700 text-white' : 'bg-blue-50 text-blue-800'
            }`}>
              {formatSchedule(state.originalSchedule, displayFormat)}
            </div>

            <h3 className="font-medium mt-2">{translate('myAddedSchedule', displayFormat)}</h3>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2 mt-2">
          <button
            onClick={() => {
              // 編集モードに切り替え、ルートパスに遷移
              const baseUrl = window.location.origin;
              const currentParams = new URLSearchParams(window.location.search);

              // viewModeパラメータを削除
              currentParams.delete('viewMode');

              // 他のパラメータを保持したままURLを構築
              const queryString = currentParams.toString();
              const redirectUrl = queryString ? `${baseUrl}?${queryString}` : baseUrl;

              window.location.href = redirectUrl;
            }}
            className={`px-4 py-2 rounded-md ${
              theme === 'dark'
                ? 'bg-teal-600 hover:bg-teal-700 text-white'
                : 'bg-teal-500 hover:bg-teal-600 text-white'
            }`}
          >
            {translate('editSchedule', displayFormat)}
          </button>

          <button
            onClick={() => {
              // 追加モードに切り替え
              const baseUrl = window.location.origin;
              const currentParams = new URLSearchParams(window.location.search);

              // scheduleパラメータをoriginalScheduleに変換
              const scheduleParam = currentParams.get('schedule');
              if (scheduleParam) {
                currentParams.delete('schedule');
                currentParams.set('originalSchedule', scheduleParam);
              }

              // viewModeをaddに設定
              currentParams.set('viewMode', 'add');

              // URLを構築して遷移
              const queryString = currentParams.toString();
              const redirectUrl = `${baseUrl}?${queryString}`;

              window.location.href = redirectUrl;
            }}
            className={`px-4 py-2 rounded-md ${
              theme === 'dark'
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {translate('addMySchedule', displayFormat)}
          </button>
        </div>
      </div>
    );
  };

  // 追加モード用のヘッダー
  const renderAddModeHeader = () => {
    if (viewMode !== 'add' || !state.originalSchedule) return null;

    return (
      <div className={`p-3 mb-4 rounded-md ${
        theme === 'dark' ? 'bg-blue-800 text-white' : 'bg-blue-100 text-blue-800'
      }`}>
        <h2 className="text-lg font-semibold">
          {translate('addMode', displayFormat)}
        </h2>
        <p className="text-sm mb-2">
          {translate('addModeDescription', displayFormat)}
        </p>

        {/* 元の予定の表示 */}
        <div className="mt-2 mb-2">
          <h3 className="font-medium">{translate('originalSchedule', displayFormat)}</h3>
          <div className={`p-2 rounded-md text-sm whitespace-pre-line ${
            theme === 'dark' ? 'bg-blue-700 text-white' : 'bg-blue-50 text-blue-800'
          }`}>
            {formatSchedule(state.originalSchedule, displayFormat)}
          </div>
        </div>

        <div className="mt-2">
          <h3 className="font-medium">{translate('myAddedSchedule', displayFormat)}</h3>
        </div>
      </div>
    );
  };

  // URLを生成
  const generateUrl = () => {
    const baseUrl = window.location.origin + window.location.pathname;

    // 追加モードの場合は両方のスケジュールを含める
    if (viewMode === 'add' && state.originalSchedule) {
      const encodedOriginalSchedule = encodeScheduleForUrl(state.originalSchedule);
      const encodedMySchedule = encodeScheduleForUrl(schedule);
      const usernameParam = userName.trim()
        ? `&username=${encodeURIComponent(userName.trim())}`
        : '';

      return `${baseUrl}?originalSchedule=${encodedOriginalSchedule}&mySchedule=${encodedMySchedule}${usernameParam}&viewMode=view`;
    }

    // 通常モードの場合は従来通り
    const encodedSchedule = encodeScheduleForUrl(schedule);
    const usernameParam = userName.trim()
      ? `&username=${encodeURIComponent(userName.trim())}`
      : '';

    return `${baseUrl}?schedule=${encodedSchedule}${usernameParam}&viewMode=view`;
  };

  return (
    <div className={`p-4 rounded-md ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-700'}`}>
      {/* 閲覧モード用ヘッダー */}
      {renderViewModeHeader()}

      {/* 追加モード用ヘッダー */}
      {renderAddModeHeader()}

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
              ? 'bg-teal-600 hover:bg-teal-700 text-white'
              : 'bg-teal-500 hover:bg-teal-600 text-white'
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
              ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
              : 'bg-cyan-500 hover:bg-cyan-600 text-white'
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

        {/* 編集モードの場合のみクリアボタンを表示 */}
        {viewMode !== 'view' && (
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
        )}
      </div>

      {/* ユーザー名入力フィールド（編集モードの場合のみ表示） */}
      {viewMode !== 'view' && (
        <div className="mt-4 mb-4">
          <input
            type="text"
            placeholder={translate('enterUserName', displayFormat)}
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md ${
              theme === 'dark'
                ? 'bg-gray-700 text-white border-gray-600'
                : 'bg-white text-gray-800 border-gray-300'
            }`}
          />
        </div>
      )}

      {/* 重なっている時間範囲の表示は削除 */}

      {/* 他の人の予定を追加する機能は削除 */}
    </div>
  );
}
