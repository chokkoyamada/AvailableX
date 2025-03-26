'use client';

import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

// クライアントサイドのみで動作するコンポーネントを動的にインポート
const App = dynamic(() => import('../components/App'), { ssr: false });

// SearchParamsを使用するコンポーネント
function AppWithSearchParams() {
  const searchParams = useSearchParams();
  const viewMode = searchParams.get('viewMode');

  // viewModeパラメータが'view'の場合は共有表示モードとして扱う
  const isSharedView = viewMode === 'view';

  return <App isSharedView={isSharedView} />;
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AppWithSearchParams />
    </Suspense>
  );
}
