import { format, addDays } from 'date-fns';
import { ja } from 'date-fns/locale';
import { ScheduleData, TimeRange, DisplayFormat } from '../types/schedule';

/**
 * 時間インデックスを時間文字列に変換する
 *
 * @param index 時間インデックス（15分単位、0-95）
 * @param displayFormat 表示形式
 * @returns 時間文字列（例: "13:00"）
 */
export function formatTimeFromIndex(index: number, displayFormat: DisplayFormat = 'ja'): string {
  const hour = Math.floor(index / 4);
  const minute = (index % 4) * 15;

  switch (displayFormat) {
    case 'en':
      return `${hour % 12 || 12}:${minute.toString().padStart(2, '0')} ${hour < 12 ? 'AM' : 'PM'}`;
    case 'short':
      return `${hour}:${minute.toString().padStart(2, '0')}`;
    case 'ja':
    default:
      return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  }
}

/**
 * 時間範囲を文字列に変換する
 *
 * @param timeRange 時間範囲
 * @param displayFormat 表示形式
 * @returns 時間範囲文字列（例: "13:00-15:00"）
 */
export function formatTimeRange(timeRange: TimeRange, displayFormat: DisplayFormat = 'ja'): string {
  const start = formatTimeFromIndex(timeRange.startIndex, displayFormat);
  const end = formatTimeFromIndex(timeRange.endIndex, displayFormat);
  return `${start}-${end}`;
}

/**
 * 日付を文字列に変換する
 *
 * @param baseDate 基準日（YYYYMMDD形式）
 * @param relativeDay 基準日からの相対日数
 * @param displayFormat 表示形式
 * @returns 日付文字列（例: "2025年3月26日(水)"）
 */
export function formatDate(baseDate: string, relativeDay: number, displayFormat: DisplayFormat = 'ja'): string {
  const year = parseInt(baseDate.substring(0, 4));
  const month = parseInt(baseDate.substring(4, 6)) - 1; // 0-indexed
  const day = parseInt(baseDate.substring(6, 8));

  const date = addDays(new Date(year, month, day), relativeDay);

  switch (displayFormat) {
    case 'en':
      return format(date, 'MMM d, yyyy (EEE)', { locale: ja });
    case 'short':
      return format(date, 'M/d (EEE)', { locale: ja });
    case 'ja':
    default:
      return format(date, 'yyyy年M月d日(EEE)', { locale: ja });
  }
}

/**
 * スケジュールデータを人間が読みやすい形式に変換する
 *
 * @param schedule スケジュールデータ
 * @param displayFormat 表示形式
 * @returns 人間が読みやすい形式の文字列
 */
export function formatSchedule(schedule: ScheduleData, displayFormat: DisplayFormat = 'ja'): string {
  if (!schedule.dateRanges.length) {
    return '選択された日時はありません';
  }

  return schedule.dateRanges.map(dateRange => {
    const dateStr = formatDate(schedule.baseDate, dateRange.relativeDay, displayFormat);

    const timeRangesStr = dateRange.timeRanges
      .map(timeRange => formatTimeRange(timeRange, displayFormat))
      .join(', ');

    return `${dateStr} ${timeRangesStr}`;
  }).join('\n');
}

/**
 * 現在の日時からスケジュールデータの初期値を作成する
 *
 * @returns 初期スケジュールデータ
 */
export function createInitialSchedule(): ScheduleData {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  return {
    baseDate: `${year}${month}${day}`,
    dateRanges: []
  };
}
