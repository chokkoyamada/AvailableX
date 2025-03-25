'use client';

import dynamic from 'next/dynamic';

// クライアントサイドのみで動作するコンポーネントを動的にインポート
const App = dynamic(() => import('../components/App'), { ssr: false });

export default function Home() {
  return <App />;
}
