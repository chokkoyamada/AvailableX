import { DisplayFormat } from '../types/schedule';

// 翻訳データ
export const translations = {
  ja: {
    subtitle: "日程調整をシンプルに",
    selectDateTime: "選択された日時",
    copyText: "テキストをコピー",
    copyUrl: "URLをコピー",
    clearAll: "全データクリア",
    copied: "コピーしました",
    urlCopied: "URLをコピーしました",
    confirmDelete: "この時間範囲を削除しますか？",
    confirmClear: "全てのスケジュールをクリアしますか？",
    selectFromCalendar: "カレンダーから日時を選択してください",
    // 共有スケジュール関連
    addSharedSchedule: "他の人の予定を追加",
    enterSharedUrl: "共有URLを入力",
    invalidScheduleUrl: "有効なスケジュールURLではありません",
    failedToLoadSchedule: "スケジュールの読み込みに失敗しました",
    add: "追加",
    addedSchedules: "追加済みの予定",
    otherSchedule: "他の人の予定",
    mySchedule: "自分の予定",
    remove: "削除",
    enterUserName: "ユーザー名（オプション）",

    // 重なり表示関連
    overlappingTimeRanges: "全員参加可能な時間",
    noOverlappingTime: "全員が参加可能な時間はありません",
    copyOverlappingTime: "共通時間をコピー",
    participants: "参加者"
  },
  en: {
    subtitle: "Schedule adjustment simplified",
    selectDateTime: "Selected Date & Time",
    copyText: "Copy Text",
    copyUrl: "Copy URL",
    clearAll: "Clear All",
    copied: "Copied",
    urlCopied: "URL Copied",
    confirmDelete: "Do you want to delete this time range?",
    confirmClear: "Do you want to clear all schedules?",
    selectFromCalendar: "Please select date and time from the calendar",
    // 共有スケジュール関連
    addSharedSchedule: "Add Other's Schedule",
    enterSharedUrl: "Enter shared URL",
    invalidScheduleUrl: "Invalid schedule URL",
    failedToLoadSchedule: "Failed to load schedule",
    add: "Add",
    addedSchedules: "Added Schedules",
    otherSchedule: "Other's Schedule",
    mySchedule: "My Schedule",
    remove: "Remove",
    enterUserName: "Username (optional)",

    // 重なり表示関連
    overlappingTimeRanges: "Time Slots Available for Everyone",
    noOverlappingTime: "No time slots available for everyone",
    copyOverlappingTime: "Copy Common Time",
    participants: "Participants"
  }
};

// 翻訳キーの型定義
export type TranslationKey = keyof typeof translations.ja;

// 翻訳関数
export function translate(key: TranslationKey, language: DisplayFormat): string {
  if (language === 'short') {
    language = 'en'; // shortフォーマットの場合は英語を使用
  }

  return translations[language][key];
}
