import { ScheduleData } from '../types/schedule';

/**
 * 基準日が異なる場合に相対日数を調整する
 *
 * @param ownBaseDate 自分のスケジュールの基準日
 * @param sharedBaseDate 共有スケジュールの基準日
 * @param relativeDay 調整する相対日数
 * @returns 調整された相対日数
 */
export function adjustRelativeDay(
  ownBaseDate: string,
  sharedBaseDate: string,
  relativeDay: number
): number {
  // 基準日をDateオブジェクトに変換
  const ownBase = new Date(
    parseInt(ownBaseDate.substring(0, 4)),
    parseInt(ownBaseDate.substring(4, 6)) - 1,
    parseInt(ownBaseDate.substring(6, 8))
  );

  const sharedBase = new Date(
    parseInt(sharedBaseDate.substring(0, 4)),
    parseInt(sharedBaseDate.substring(4, 6)) - 1,
    parseInt(sharedBaseDate.substring(6, 8))
  );

  // 基準日の差分を計算（ミリ秒）
  const diffDays = Math.round(
    (ownBase.getTime() - sharedBase.getTime()) / (1000 * 60 * 60 * 24)
  );

  // 相対日数を調整
  return relativeDay - diffDays;
}

/**
 * ランダムなIDを生成する
 *
 * @returns ランダムなID文字列
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}

/**
 * 共有スケジュール用のランダムな色を生成する
 *
 * @returns カラーコード
 */
export function generateRandomColor(): string {
  const colors = [
    '#9333ea', // パープル
    '#10b981', // エメラルド
    '#f59e0b', // アンバー
    '#ef4444', // レッド
    '#06b6d4', // シアン
    '#8b5cf6', // バイオレット
    '#ec4899', // ピンク
    '#f97316', // オレンジ
  ];

  return colors[Math.floor(Math.random() * colors.length)];
}
