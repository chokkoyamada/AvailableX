import { ScheduleData, TimeRange, DisplayFormat } from '../types/schedule';
import { translate } from './i18n';

/**
 * ランダムなIDを生成する
 *
 * @returns ランダムなID文字列
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}

/**
 * ランダムな色を生成する
 *
 * @returns ランダムな色のHEX値
 */
export function generateRandomColor(): string {
  // 明るい色のみを生成するために、HSL色空間を使用
  const hue = Math.floor(Math.random() * 360); // 0-359の色相
  const saturation = 70 + Math.floor(Math.random() * 30); // 70-99%の彩度
  const lightness = 45 + Math.floor(Math.random() * 15); // 45-59%の明度

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

/**
 * 基準日の違いを考慮して相対日数を調整する
 *
 * @param ownBaseDate 自分の基準日（YYYYMMDD形式）
 * @param sharedBaseDate 他の人の基準日（YYYYMMDD形式）
 * @param sharedRelativeDay 他の人の相対日数
 * @returns 調整された相対日数
 */
export function adjustRelativeDay(
  ownBaseDate: string,
  sharedBaseDate: string,
  sharedRelativeDay: number
): number {
  // 基準日が同じ場合は調整不要
  if (ownBaseDate === sharedBaseDate) {
    return sharedRelativeDay;
  }

  // 基準日をDate型に変換
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
  const diffMs = sharedBase.getTime() - ownBase.getTime();

  // 日数に変換（1日 = 24時間 * 60分 * 60秒 * 1000ミリ秒）
  const diffDays = Math.round(diffMs / (24 * 60 * 60 * 1000));

  // 相対日数を調整
  return sharedRelativeDay - diffDays;
}

/**
 * 自分の予定と他の人の予定が重なっている時間範囲を計算する
 *
 * @param ownSchedule 自分のスケジュール
 * @param sharedSchedules 他の人のスケジュール配列
 * @param displayFormat 表示形式
 * @returns 重なっている時間範囲の配列
 */
export function findOverlappingTimeRanges(
  ownSchedule: ScheduleData,
  sharedSchedules: { id: string; schedule: ScheduleData; color: string }[],
  displayFormat: DisplayFormat = 'ja'
): { relativeDay: number; timeRanges: TimeRange[]; participants: string[] }[] {
  // 結果を格納する配列
  const overlaps: { relativeDay: number; timeRanges: TimeRange[]; participants: string[] }[] = [];

  // 自分のスケジュールがない場合は空配列を返す
  if (!ownSchedule.dateRanges.length || !sharedSchedules.length) {
    return overlaps;
  }

  // 自分のスケジュールの各日付について処理
  ownSchedule.dateRanges.forEach(ownDateRange => {
    const relativeDay = ownDateRange.relativeDay;

    // その日の自分の時間範囲
    const ownTimeRanges = ownDateRange.timeRanges;

    // その日の他の人の時間範囲を収集
    const sharedTimeRangesByPerson: {
      personId: string;
      personName: string;
      timeRanges: TimeRange[]
    }[] = [];

    sharedSchedules.forEach(shared => {
      // 基準日の調整
      const adjustedDateRanges = shared.schedule.dateRanges.map(dr => ({
        ...dr,
        relativeDay: adjustRelativeDay(
          ownSchedule.baseDate,
          shared.schedule.baseDate,
          dr.relativeDay
        )
      }));

      // 調整した相対日数で他の人のスケジュールを検索
      const sharedDateRange = adjustedDateRanges.find(
        dr => dr.relativeDay === relativeDay
      );

      if (sharedDateRange) {
        sharedTimeRangesByPerson.push({
          personId: shared.id,
          personName: shared.schedule.userName || `${translate('otherSchedule', displayFormat)} #${shared.id.substring(0, 4)}`,
          timeRanges: sharedDateRange.timeRanges
        });
      }
    });

    // 他の人のスケジュールがない場合はスキップ
    if (sharedTimeRangesByPerson.length === 0) {
      return;
    }

    // 自分の各時間範囲について、他の全員と重なっている部分を計算
    ownTimeRanges.forEach(ownTimeRange => {
      // 重なりの候補（最初は自分の時間範囲）
      let potentialOverlap: TimeRange = { ...ownTimeRange };

      // 参加者リスト（最初は自分のみ）
      const participants: string[] = [translate('mySchedule', displayFormat)];

      // 他の人全員の時間範囲と比較
      let allOverlap = true; // 全員と重なるかどうかのフラグ

      sharedTimeRangesByPerson.forEach(person => {
        // その人の時間範囲と重なる部分があるか確認
        let personOverlaps = false;

        person.timeRanges.forEach(sharedTimeRange => {
          // 重なりを計算
          const overlapStart = Math.max(potentialOverlap.startIndex, sharedTimeRange.startIndex);
          const overlapEnd = Math.min(potentialOverlap.endIndex, sharedTimeRange.endIndex);

          // 重なりがある場合
          if (overlapStart < overlapEnd) {
            potentialOverlap = {
              startIndex: overlapStart,
              endIndex: overlapEnd
            };
            personOverlaps = true;
          }
        });

        // その人の時間範囲と重なる部分があれば参加者リストに追加
        if (personOverlaps) {
          participants.push(person.personName);
        } else {
          // 一人でも重ならない人がいれば、全員の重なりはない
          allOverlap = false;
        }
      });

      // 全員と重なる時間範囲があれば結果に追加
      if (allOverlap && participants.length > 1) {
        // 既存の日付範囲を探す
        const existingOverlapIndex = overlaps.findIndex(o => o.relativeDay === relativeDay);

        if (existingOverlapIndex >= 0) {
          // 既存の日付範囲に時間範囲を追加
          overlaps[existingOverlapIndex].timeRanges.push(potentialOverlap);
        } else {
          // 新しい日付範囲を追加
          overlaps.push({
            relativeDay,
            timeRanges: [potentialOverlap],
            participants
          });
        }
      }
    });
  });

  return overlaps;
}
