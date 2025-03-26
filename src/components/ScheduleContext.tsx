'use client';

import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { ScheduleData, Theme, DisplayFormat } from '../types/schedule';
import { createInitialSchedule } from '../utils/format';
import { decodeScheduleFromUrl } from '../lib/decode';

// 状態の型定義
interface ScheduleState {
  schedule: ScheduleData;
  theme: Theme;
  displayFormat: DisplayFormat;
  sharedSchedules: {
    id: string;
    schedule: ScheduleData;
    color: string; // 表示色
  }[];
}

// アクションの型定義
type ScheduleAction =
  | { type: 'ADD_TIME_RANGE'; relativeDay: number; startIndex: number; endIndex: number }
  | { type: 'REMOVE_TIME_RANGE'; relativeDay: number; index: number }
  | { type: 'UPDATE_TIME_RANGE'; relativeDay: number; index: number; startIndex: number; endIndex: number }
  | { type: 'CLEAR_SCHEDULE' }
  | { type: 'SET_SCHEDULE'; schedule: ScheduleData }
  | { type: 'SET_THEME'; theme: Theme }
  | { type: 'SET_DISPLAY_FORMAT'; displayFormat: DisplayFormat }
  | { type: 'ADD_SHARED_SCHEDULE'; id: string; schedule: ScheduleData; color: string }
  | { type: 'REMOVE_SHARED_SCHEDULE'; id: string };

// ブラウザの言語設定を検出する関数
const detectLanguage = (): 'ja' | 'en' => {
  // ブラウザ環境でない場合はデフォルトで日本語を返す
  if (typeof navigator === 'undefined') return 'ja';

  const browserLang = navigator.language.toLowerCase();
  return browserLang.startsWith('ja') ? 'ja' : 'en';
};

// 初期状態
const initialState: ScheduleState = {
  schedule: createInitialSchedule(),
  theme: 'light',
  displayFormat: 'ja', // 初期値は'ja'だが、useEffectで検出した言語に更新される
  sharedSchedules: [], // 他の人のスケジュール
};

// Reducer関数
function scheduleReducer(state: ScheduleState, action: ScheduleAction): ScheduleState {
  switch (action.type) {
    case 'ADD_TIME_RANGE': {
      const { relativeDay, startIndex, endIndex } = action;
      const newSchedule = { ...state.schedule };

      // 既存の日付範囲を探す
      const existingDateRangeIndex = newSchedule.dateRanges.findIndex(
        dr => dr.relativeDay === relativeDay
      );

      if (existingDateRangeIndex >= 0) {
        // 既存の日付範囲に時間範囲を追加
        newSchedule.dateRanges[existingDateRangeIndex].timeRanges.push({
          startIndex,
          endIndex,
        });
      } else {
        // 新しい日付範囲を追加
        newSchedule.dateRanges.push({
          relativeDay,
          timeRanges: [{ startIndex, endIndex }],
        });

        // 日付範囲を相対日数でソート
        newSchedule.dateRanges.sort((a, b) => a.relativeDay - b.relativeDay);
      }

      return { ...state, schedule: newSchedule };
    }

    case 'REMOVE_TIME_RANGE': {
      const { relativeDay, index } = action;
      const newSchedule = { ...state.schedule };

      const dateRangeIndex = newSchedule.dateRanges.findIndex(
        dr => dr.relativeDay === relativeDay
      );

      if (dateRangeIndex >= 0) {
        // 時間範囲を削除
        newSchedule.dateRanges[dateRangeIndex].timeRanges.splice(index, 1);

        // 時間範囲が空になった場合は日付範囲も削除
        if (newSchedule.dateRanges[dateRangeIndex].timeRanges.length === 0) {
          newSchedule.dateRanges.splice(dateRangeIndex, 1);
        }
      }

      return { ...state, schedule: newSchedule };
    }

    case 'UPDATE_TIME_RANGE': {
      const { relativeDay, index, startIndex, endIndex } = action;
      const newSchedule = { ...state.schedule };

      const dateRangeIndex = newSchedule.dateRanges.findIndex(
        dr => dr.relativeDay === relativeDay
      );

      if (dateRangeIndex >= 0 &&
          index >= 0 &&
          index < newSchedule.dateRanges[dateRangeIndex].timeRanges.length) {
        // 時間範囲を更新
        newSchedule.dateRanges[dateRangeIndex].timeRanges[index] = {
          startIndex,
          endIndex
        };
      }

      return { ...state, schedule: newSchedule };
    }

    case 'CLEAR_SCHEDULE':
      return {
        ...state,
        schedule: { ...state.schedule, dateRanges: [] },
      };

    case 'SET_SCHEDULE':
      return { ...state, schedule: action.schedule };

    case 'SET_THEME':
      return { ...state, theme: action.theme };

    case 'SET_DISPLAY_FORMAT':
      return { ...state, displayFormat: action.displayFormat };

    case 'ADD_SHARED_SCHEDULE':
      return {
        ...state,
        sharedSchedules: [
          ...state.sharedSchedules,
          { id: action.id, schedule: action.schedule, color: action.color }
        ]
      };

    case 'REMOVE_SHARED_SCHEDULE':
      return {
        ...state,
        sharedSchedules: state.sharedSchedules.filter(s => s.id !== action.id)
      };

    default:
      return state;
  }
}

// コンテキストの作成
interface ScheduleContextType {
  state: ScheduleState;
  dispatch: React.Dispatch<ScheduleAction>;
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

// プロバイダーコンポーネント
interface ScheduleProviderProps {
  children: ReactNode;
}

export function ScheduleProvider({ children }: ScheduleProviderProps) {
  const [state, dispatch] = useReducer(scheduleReducer, initialState);

  // URLからスケジュールデータを読み込み、ブラウザの言語設定を検出
  useEffect(() => {
    // URLからスケジュールデータを読み込む
    const url = new URL(window.location.href);
    const scheduleParam = url.searchParams.get('schedule');

    if (scheduleParam) {
      try {
        const decodedSchedule = decodeScheduleFromUrl(scheduleParam);
        dispatch({ type: 'SET_SCHEDULE', schedule: decodedSchedule });
      } catch (error) {
        console.error('Failed to decode schedule from URL:', error);
      }
    }

    // ブラウザの言語設定を検出して初期言語を設定
    const detectedLanguage = detectLanguage();
    dispatch({ type: 'SET_DISPLAY_FORMAT', displayFormat: detectedLanguage });
  }, []);

  return (
    <ScheduleContext.Provider value={{ state, dispatch }}>
      {children}
    </ScheduleContext.Provider>
  );
}

// カスタムフック
export function useSchedule() {
  const context = useContext(ScheduleContext);
  if (context === undefined) {
    throw new Error('useSchedule must be used within a ScheduleProvider');
  }
  return context;
}
