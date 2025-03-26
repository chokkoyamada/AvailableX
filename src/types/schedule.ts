/**
 * 時間範囲を表す型
 * startIndex: 開始時間のインデックス（15分単位、0-95）
 * endIndex: 終了時間のインデックス（15分単位、0-95）
 */
export type TimeRange = {
  startIndex: number;
  endIndex: number;
};

/**
 * 特定の日の時間範囲のコレクションを表す型
 * relativeDay: 基準日からの相対日数
 * timeRanges: その日の時間範囲の配列
 */
export type DateRanges = {
  relativeDay: number;
  timeRanges: TimeRange[];
};

/**
 * スケジュールデータ全体を表す型
 * baseDate: 基準日（YYYYMMDD形式）
 * dateRanges: 日付ごとの時間範囲のコレクション
 * userName: 共有者名（オプション）
 */
export type ScheduleData = {
  baseDate: string; // YYYYMMDD
  dateRanges: DateRanges[];
  userName?: string; // オプションの共有者名
};

/**
 * 表示形式の種類を表す型
 */
export type DisplayFormat = 'ja' | 'en' | 'short';

/**
 * テーマの種類を表す型
 */
export type Theme = 'light' | 'dark';
