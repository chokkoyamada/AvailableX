import { DisplayFormat } from '../types/schedule';

// 翻訳データ
export const translations = {
  ja: {
    subtitle: "「この日時いけます」をサクッと共有",
    selectDateTime: "選択された日時",
    possessiveSuffix: "さんの",
    availableTimes: "候補日時",
    sharedSchedule: "共有された予定",
    editSchedule: "この予定を編集する",
    addMySchedule: "この予定に自分の予定を追加する",
    copyText: "テキストをコピー",
    copyUrl: "URLとして共有する",
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

    // 追加モード関連
    originalSchedule: "元の予定",
    myAddedSchedule: "自分が追加した予定",
    addMode: "予定追加モード",
    addModeDescription: "元の予定に自分の予定を追加しています",
    shareWithBothSchedules: "両方の予定を含めて共有",

    // 重なり表示関連
    overlappingTimeRanges: "全員参加可能な時間",
    noOverlappingTime: "全員が参加可能な時間はありません",
    copyOverlappingTime: "共通時間をコピー",
    participants: "参加者"
  },
  en: {
    subtitle: "Quickly share your available times",
    selectDateTime: "Selected Date & Time",
    possessiveSuffix: "'s ",
    availableTimes: "Available Times",
    sharedSchedule: "Shared Schedule",
    editSchedule: "Edit This Schedule",
    addMySchedule: "Add My Schedule to This",
    copyText: "Copy Text",
    copyUrl: "Share as URL",
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

    // 追加モード関連
    originalSchedule: "Original Schedule",
    myAddedSchedule: "My Added Schedule",
    addMode: "Add Schedule Mode",
    addModeDescription: "Adding your schedule to the original schedule",
    shareWithBothSchedules: "Share with Both Schedules",

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
