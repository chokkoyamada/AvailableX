import { ScheduleData } from '../types/schedule';

/**
 * エンコードされた文字列からスケジュールデータをデコードする
 *
 * 形式: 基準日_(相対日数):(開始インデックス)-(終了インデックス),…;(相対日数):...
 * 例: 20250301_24:54-69,84-96;25:60-72
 * ユーザー名がある場合: 20250301_24:54-69,84-96;25:60-72|山田太郎
 *
 * @param encoded エンコードされた文字列
 * @returns デコードされたスケジュールデータ
 */
export function decodeSchedule(encoded: string): ScheduleData {
  try {
    // ユーザー名がある場合は分離
    let userName: string | undefined;
    let scheduleData = encoded;

    if (encoded.includes('|')) {
      const [scheduleStr, userNameStr] = encoded.split('|');
      scheduleData = scheduleStr;
      userName = userNameStr;
    }

    const [baseDate, rest] = scheduleData.split("_");

    if (!baseDate || !rest) {
      throw new Error("Invalid encoded format");
    }

    const dateRanges = rest.split(";").map((part) => {
      const [relativeDay, times] = part.split(":");

      if (!relativeDay || !times) {
        throw new Error("Invalid date range format");
      }

      const timeRanges = times.split(",").map((t) => {
        const [start, end] = t.split("-").map(Number);

        if (isNaN(start) || isNaN(end)) {
          throw new Error("Invalid time range format");
        }

        return { startIndex: start, endIndex: end };
      });

      return { relativeDay: Number(relativeDay), timeRanges };
    });

    return { baseDate, dateRanges, userName };
  } catch (error) {
    console.error("Error decoding schedule:", error);
    // デコードに失敗した場合は空のスケジュールを返す
    return { baseDate: getCurrentDateString(), dateRanges: [] };
  }
}

/**
 * URLクエリパラメータからスケジュールデータをデコードする
 *
 * @param encodedUrl URLクエリパラメータからのエンコードされた文字列
 * @returns デコードされたスケジュールデータ
 */
export function decodeScheduleFromUrl(encodedUrl: string): ScheduleData {
  try {
    const decoded = decodeURIComponent(encodedUrl);
    return decodeSchedule(decoded);
  } catch (error) {
    console.error("Error decoding schedule from URL:", error);
    // デコードに失敗した場合は空のスケジュールを返す
    return { baseDate: getCurrentDateString(), dateRanges: [] };
  }
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
 * 時間と分を時間インデックスに変換する
 *
 * @param hour 時間（0-23）
 * @param minute 分（0-59）
 * @returns 時間インデックス（15分単位、0-95）
 */
export function timeToIndex(hour: number, minute: number): number {
  return hour * 4 + Math.floor(minute / 15);
}
