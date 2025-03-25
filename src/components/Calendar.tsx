'use client';

import React, { useState, useCallback } from 'react';
import { Calendar as BigCalendar, Views, SlotInfo, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, addDays, differenceInDays } from 'date-fns';
import { ja } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useSchedule } from './ScheduleContext';
import { indexToTime } from '../lib/encode';
import { timeToIndex } from '../lib/decode';

// ロケール設定
const locales = {
  'ja-JP': ja,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { locale: ja }),
  getDay,
  locales,
});

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

  // 日時範囲の選択ハンドラ
  const handleSelectSlot = useCallback(
    (slotInfo: SlotInfo) => {
      const { start, end } = slotInfo;

      // 基準日からの相対日数を計算
      const startDate = new Date(start);
      const baseWeekStart = startOfWeek(baseDate);
      const relativeDay = differenceInDays(startDate, baseWeekStart);

      // 時間インデックスを計算
      const startHour = startDate.getHours();
      const startMinute = startDate.getMinutes();
      const startIndex = timeToIndex(startHour, startMinute);

      const endDate = new Date(end);
      const endHour = endDate.getHours();
      const endMinute = endDate.getMinutes();
      const endIndex = timeToIndex(endHour, endMinute);

      // 時間範囲を追加
      dispatch({
        type: 'ADD_TIME_RANGE',
        relativeDay,
        startIndex,
        endIndex,
      });
    },
    [baseDate, dispatch]
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
    <div className={`h-[600px] ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
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
        formats={localizer.formats}
        className={theme === 'dark' ? 'rbc-dark-theme' : ''}
      />
    </div>
  );
}
