import { DisplayFormat } from '../types/schedule';

// 翻訳データ
export const translations = {
  ja: {
    selectDateTime: "選択された日時",
    copyText: "テキストをコピー",
    copyUrl: "URLをコピー",
    clearAll: "全データクリア",
    copied: "コピーしました",
    urlCopied: "URLをコピーしました",
    confirmDelete: "この時間範囲を削除しますか？",
    confirmClear: "全てのスケジュールをクリアしますか？",
    selectFromCalendar: "カレンダーから日時を選択してください"
  },
  en: {
    selectDateTime: "Selected Date & Time",
    copyText: "Copy Text",
    copyUrl: "Copy URL",
    clearAll: "Clear All",
    copied: "Copied",
    urlCopied: "URL Copied",
    confirmDelete: "Do you want to delete this time range?",
    confirmClear: "Do you want to clear all schedules?",
    selectFromCalendar: "Please select date and time from the calendar"
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
