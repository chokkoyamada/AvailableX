import { ScheduleData } from '../types/schedule';

/**
 * スケジュールデータをURL用の文字列にエンコードする
 *
 * 形式: 基準日_(相対日数):(開始インデックス)-(終了インデックス),…;(相対日数):...
 * 例: 20250301_24:54-69,84-96;25:60-72
 * ユーザー名がある場合: 20250301_24:54-69,84-96;25:60-72|山田太郎
 *
 * @param schedule エンコードするスケジュールデータ
 * @returns エンコードされた文字列
 */
export function encodeSchedule(schedule: ScheduleData): string {
  const encodedDates = schedule.dateRanges
    .map((dr) => {
      const ranges = dr.timeRanges
        .map((tr) => `${tr.startIndex}-${tr.endIndex}`)
        .join(",");
      return `${dr.relativeDay}:${ranges}`;
    })
    .join(";");

  // ユーザー名がある場合は追加
  const baseEncoded = `${schedule.baseDate}_${encodedDates}`;
  return schedule.userName
    ? `${baseEncoded}|${schedule.userName}`
    : baseEncoded;
}

/**
 * スケジュールデータをURLクエリパラメータ用にエンコードする
 *
 * @param schedule エンコードするスケジュールデータ
 * @returns URLクエリパラメータ用にエンコードされた文字列
 */
export function encodeScheduleForUrl(schedule: ScheduleData): string {
  const encoded = encodeSchedule(schedule);
  return encodeURIComponent(encoded);
}

/**
 * 現在の日付をYYYYMMDD形式の文字列として取得する
 *
 * @returns YYYYMMDD形式の日付文字列
 */
export function getCurrentDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

/**
 * 時間インデックスを時間と分に変換する
 *
 * @param index 時間インデックス（15分単位、0-95）
 * @returns [時間, 分]の配列
 */
export function indexToTime(index: number): [number, number] {
  const hour = Math.floor(index / 4);
  const minute = (index % 4) * 15;
  return [hour, minute];
}
