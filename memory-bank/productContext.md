# AvailableX 製品コンテキスト

## 解決する問題
会議やイベントの日程調整は、多くの場合、以下のような問題を抱えています：
1. 複数の候補日時を提案する際の表現が煩雑になりがち
2. メールやチャットでの日程調整は誤解や見落としが発生しやすい
3. 既存のスケジュール調整ツールは機能が多すぎたり、アカウント登録が必要だったりする

AvailableXは、これらの問題を解決するために、シンプルかつ効率的な日程調整の方法を提供します。

## ユーザーストーリー
1. **会議の主催者として**、複数の候補日時を視覚的に選択し、それを簡単に共有したい
2. **会議の参加者として**、提案された候補日時を明確に理解し、自分の予定と照らし合わせたい
3. **チームリーダーとして**、チーム内の日程調整をスムーズに行い、時間を節約したい
4. **リモートワーカーとして**、異なるタイムゾーンの人とも簡単に日程調整をしたい

## ユーザー体験の目標
1. **シンプルさ**: 余計な機能や複雑な操作を排除し、直感的に使えるインターフェース
2. **効率性**: 最小限のクリックで日時選択から共有までを完了できる
3. **視認性**: カレンダー表示で日時の関係性を視覚的に把握しやすくする
4. **プライバシー**: アカウント登録不要、データはクライアントサイドのみで処理
5. **アクセシビリティ**: 様々なデバイスやブラウザから利用可能

## 使用シナリオ
### シナリオ1: チーム会議の調整
1. チームリーダーがAvailableXを開く
2. 来週の候補となる複数の時間帯をカレンダーで選択
3. 生成されたURLをチームのSlackチャンネルに共有
4. チームメンバーはURLをクリックして候補日時を確認
5. 各自の都合をチャットで返信

### シナリオ2: クライアントとの面談設定
1. 営業担当者が自分の空き時間をAvailableXで選択
2. 生成されたURLをメールでクライアントに送信
3. クライアントは登録不要で候補日時を確認
4. クライアントは都合の良い時間をメールで返信

### シナリオ3: 国際的なミーティング調整
1. 異なるタイムゾーンにいるチームメンバーが共通の会議時間を探す
2. AvailableXで自分のタイムゾーンの空き時間を選択
3. URLを共有し、他のメンバーは自分のタイムゾーンで時間を確認
4. 全員が参加可能な時間帯を特定

## 差別化ポイント
1. **アカウント登録不要**: プライバシーを重視し、即座に利用開始可能
2. **クライアントサイドのみ**: サーバー不要でデータ漏洩リスクを最小化
3. **URLによる共有**: シンプルなリンク共有で複雑な日時情報を伝達
4. **視覚的な日時選択**: カレンダーUIによる直感的な操作
5. **軽量で高速**: 最小限の機能に絞ることで読み込み時間を短縮
