# 📅 AvailableX - Meeting Scheduler Web App

このウェブアプリは、簡単に会議の候補日時を選択して共有できるツールです。
Next.js + TypeScript + Tailwind CSS を利用し、クライアントサイドのみで動作します。

---

## 🚀 機能概要

- **カレンダー UI で日時を簡単に選択**

  - カレンダー上でクリック＆ドラッグで日時範囲を指定
  - 最大 30 個程度の日時範囲を指定可能

- **日時データのテキスト表示**

  - 選択した日時範囲を Human Readable なテキスト形式で表示
  - 簡単にコピーして Slack やメール等で共有可能

- **共有可能な Permalink 生成**
  - 選択日時を圧縮して URL のクエリパラメータに含める
  - URL を共有するだけで候補日時を閲覧可能

---

## 📝 日時範囲のデータ形式（URL 用）

URL に含める日時範囲データのフォーマットは以下の通りです。

```plaintext
基準日_(相対日数):(開始インデックス)-(終了インデックス),…;(相対日数):...
```

- **例:**

```
20250301_24:54-69,84-96;25:60-72
```

- 基準日と日時範囲データは UTC を基準とします。

---

## 📌 利用する主な技術・ライブラリ

- Next.js（最新安定版）
- TypeScript
- Tailwind CSS
- React Big Calendar（カレンダー UI）
- date-fns（日付処理）

---

## 📂 プロジェクト構成

```
.
├── components
│   └── Calendar.tsx
├── lib
│   ├── encode.ts
│   └── decode.ts
├── utils
│   └── format.ts
├── pages
│   └── index.tsx
├── styles
│   └── globals.css
└── types
    └── schedule.ts
```

---

## 📐 データ型（TypeScript）

```typescript
// types/schedule.ts
export type TimeRange = {
  startIndex: number;
  endIndex: number;
};

export type DateRanges = {
  relativeDay: number;
  timeRanges: TimeRange[];
};

export type ScheduleData = {
  baseDate: string; // YYYYMMDD
  dateRanges: DateRanges[];
};
```

---

## 🔗 URL エンコード・デコード例

### エンコード（データ → URL）

```typescript
// lib/encode.ts
export function encodeSchedule(schedule: ScheduleData): string {
  const encodedDates = schedule.dateRanges
    .map((dr) => {
      const ranges = dr.timeRanges
        .map((tr) => `${tr.startIndex}-${tr.endIndex}`)
        .join(",");
      return `${dr.relativeDay}:${ranges}`;
    })
    .join(";");

  return `${schedule.baseDate}_${encodedDates}`;
}
```

### デコード（URL → データ）

```typescript
// lib/decode.ts
export function decodeSchedule(encoded: string): ScheduleData {
  const [baseDate, rest] = encoded.split("_");
  const dateRanges = rest.split(";").map((part) => {
    const [relativeDay, times] = part.split(":");
    const timeRanges = times.split(",").map((t) => {
      const [start, end] = t.split("-").map(Number);
      return { startIndex: start, endIndex: end };
    });
    return { relativeDay: Number(relativeDay), timeRanges };
  });

  return { baseDate, dateRanges };
}
```

---

## 🌐 使い方の流れ

1. ウェブアプリにアクセスする
2. カレンダー上で日時範囲をクリック＆ドラッグで指定
3. 選択した日時範囲が自動的にテキスト表示される
4. 「URL を生成」ボタンで共有可能な Permalink を取得
5. URL を Slack やメールで共有し、クリックした人はカレンダーを確認できる

---

## 🚧 開発手順

```bash
# プロジェクト作成
yarn create next-app meeting-scheduler --typescript --tailwind

# 必要ライブラリ追加
yarn add react-big-calendar date-fns

# 開発サーバー起動
yarn dev
```

---
