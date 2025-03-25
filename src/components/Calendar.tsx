'use client';

import React, { useState, useCallback } from 'react';
import { Calendar as BigCalendar, Views, SlotInfo, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, addDays, differenceInCalendarDays, startOfDay } from 'date-fns';
import { ja } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useSchedule } from './ScheduleContext';
import { indexToTime } from '../lib/encode';
import { timeToIndex } from '../lib/decode';

// ロケール設定
const locales = {
  'ja': ja,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { locale: ja }),
  getDay,
  locales,
});

// 時間表示のフォーマットを設定
const formats = {
  timeGutterFormat: 'H:mm', // 時間軸の表示を24時間表記（0:00, 1:00,...）
  eventTimeRangeFormat: ({ start, end }: { start: Date; end: Date }, culture: string | undefined, localizer: unknown) => {
    // localizerがformat関数を持っていることを確認
    if (localizer && typeof localizer === 'object' && 'format' in localizer &&
        typeof (localizer as Record<string, unknown>).format === 'function') {
      // 型安全な方法でformat関数を呼び出す
      const formatter = (localizer as { format: (date: Date, format: string, culture?: string) => string });
      const formattedStart = formatter.format(start, 'H:mm', culture);
      const formattedEnd = formatter.format(end, 'H:mm', culture);
      return `${formattedStart} – ${formattedEnd}`;
    }
    // フォールバック
    return `${start.getHours()}:${start.getMinutes().toString().padStart(2, '0')} – ${end.getHours()}:${end.getMinutes().toString().padStart(2, '0')}`;
  },
  agendaTimeFormat: 'H:mm',
};

// イベントの型定義
interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  relativeDay: number;
  timeRangeIndex: number;
}

/**
 * カレンダーコンポーネント
 */
export default function Calendar() {
  const { state, dispatch } = useSchedule();
  const { schedule, theme } = state;

  // 現在の日付を基準にする
  const [baseDate] = useState<Date>(() => {
    if (schedule.baseDate) {
      const year = parseInt(schedule.baseDate.substring(0, 4));
      const month = parseInt(schedule.baseDate.substring(4, 6)) - 1; // 0-indexed
      const day = parseInt(schedule.baseDate.substring(6, 8));
      return new Date(year, month, day);
    }
    return new Date();
  });

  // スケジュールデータからカレンダーイベントに変換
  const events = React.useMemo(() => {
    const result: CalendarEvent[] = [];

    schedule.dateRanges.forEach((dateRange) => {
      const date = addDays(baseDate, dateRange.relativeDay);

      dateRange.timeRanges.forEach((timeRange, index) => {
        const [startHour, startMinute] = indexToTime(timeRange.startIndex);
        const [endHour, endMinute] = indexToTime(timeRange.endIndex);

        const start = new Date(date);
        start.setHours(startHour, startMinute, 0, 0);

        const end = new Date(date);
        end.setHours(endHour, endMinute, 0, 0);

        result.push({
          id: `${dateRange.relativeDay}-${index}`,
          title: `${startHour}:${startMinute.toString().padStart(2, '0')} - ${endHour}:${endMinute.toString().padStart(2, '0')}`,
          start,
          end,
          relativeDay: dateRange.relativeDay,
          timeRangeIndex: index,
        });
      });
    });

    return result;
  }, [schedule, baseDate]);

  // 選択イベントの重複防止用フラグと最後の選択時刻
  const [isProcessingSelection, setIsProcessingSelection] = useState(false);
  const [lastSelectionTime, setLastSelectionTime] = useState(0);

  // 日時範囲の選択ハンドラ
  const handleSelectSlot = useCallback(
    (slotInfo: SlotInfo) => {
      // ドラッグ操作の場合のみ処理する（slots配列の長さが1より大きい場合はドラッグ操作）
      if (!slotInfo.slots || slotInfo.slots.length <= 1) {
        return;
      }

      // 現在の時刻を取得
      const now = Date.now();

      // 前回の選択から500ms以内なら無視
      if (now - lastSelectionTime < 500) {
        return;
      }

      // 最後の選択時刻を更新
      setLastSelectionTime(now);

      // 既に処理中なら無視
      if (isProcessingSelection) {
        return;
      }

      // 処理中フラグをセット
      setIsProcessingSelection(true);

      // 非同期処理を使って処理中フラグをリセット（イベントループの次のサイクルで）
      const timer = setTimeout(() => {
        setIsProcessingSelection(false);
      }, 500);

      // 選択データを処理
      const { start, end } = slotInfo;

      // 基準日からの相対日数を計算
      const startDate = new Date(start);

      // 日付部分のみを比較するために時間をリセット（startOfDay関数を使用）
      const startDateOnly = startOfDay(startDate);
      const baseDateOnly = startOfDay(baseDate);

      // カレンダー上の日数差を計算（時間を考慮しない）
      const relativeDay = differenceInCalendarDays(startDateOnly, baseDateOnly);

      // 時間インデックスを計算
      const startHour = startDate.getHours();
      const startMinute = startDate.getMinutes();
      const startIndex = timeToIndex(startHour, startMinute);

      const endDate = new Date(end);
      const endHour = endDate.getHours();
      const endMinute = endDate.getMinutes();
      const endIndex = timeToIndex(endHour, endMinute);

      // 開始と終了が同じ場合は処理しない
      if (startIndex === endIndex) {
        clearTimeout(timer);
        setIsProcessingSelection(false);
        return;
      }

      // 強化された重複チェック
      const isDuplicate = schedule.dateRanges.some(dateRange => {
        if (dateRange.relativeDay !== relativeDay) return false;

        return dateRange.timeRanges.some(timeRange => {
          // 完全一致または非常に近い値（±1）も重複とみなす
          const startDiff = Math.abs(timeRange.startIndex - startIndex);
          const endDiff = Math.abs(timeRange.endIndex - endIndex);

          return (startDiff <= 1 && endDiff <= 1);
        });
      });

      // 重複がなければ時間範囲を追加
      if (!isDuplicate) {
        dispatch({
          type: 'ADD_TIME_RANGE',
          relativeDay,
          startIndex,
          endIndex,
        });
      }
    },
    [baseDate, dispatch, schedule, isProcessingSelection]
  );

  // 現在表示中の日付
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date());

  // ナビゲーションハンドラ（週の切り替え）
  const handleNavigate = useCallback(
    (newDate: Date) => {
      setCurrentDate(newDate);
    },
    []
  );

  // イベントのクリックハンドラ（削除）
  const handleSelectEvent = useCallback(
    (event: CalendarEvent) => {
      const { relativeDay, timeRangeIndex } = event;

      // 確認ダイアログ
      if (window.confirm('この時間範囲を削除しますか？')) {
        dispatch({
          type: 'REMOVE_TIME_RANGE',
          relativeDay,
          index: timeRangeIndex,
        });
      }
    },
    [dispatch]
  );

  // すべてのスケジュールをクリアするハンドラ
  const handleClear = useCallback(() => {
    if (window.confirm("全てのスケジュールをクリアしますか？")) {
      dispatch({ type: "CLEAR_SCHEDULE" });
    }
  }, [dispatch]);

  // イベントのスタイルをカスタマイズ
  const eventPropGetter = useCallback(
    () => {
      return {
        className: 'bg-blue-500 text-white rounded-md border-none',
        style: {
          backgroundColor: theme === 'light' ? '#3b82f6' : '#2563eb',
        },
      };
    },
    [theme]
  );

  return (
    <div className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
      <div className="h-[600px] relative">
        <BigCalendar
          localizer={localizer}
          events={events}
          defaultView={Views.WEEK}
          views={[Views.WEEK]}
          step={15}
          timeslots={1}
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          eventPropGetter={eventPropGetter}
          dayLayoutAlgorithm="no-overlap"
          formats={formats}
          culture="ja"
          className={theme === 'dark' ? 'rbc-dark-theme' : ''}
          date={currentDate}
          onNavigate={handleNavigate}
        />
      </div>
      <div className="mt-4 flex justify-end">
        <button
          onClick={handleClear}
          className="px-3 py-2 bg-red-600 text-white text-sm font-medium rounded shadow-md focus:outline-none hover:bg-red-700 transition-colors duration-150"
        >
          全データクリア
        </button>
      </div>
    </div>
  );
}
