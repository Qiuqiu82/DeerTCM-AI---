import React from 'react';
import { BeakerIcon, SparklesIcon, HeartIcon } from '@heroicons/react/24/outline';
import { TCMChat } from './components/TCMChat';

function App() {
  return (
    <div className="min-h-screen bg-emerald-50">
      {/* 聊天卡片占满全屏，由 TCMChat 控制布局 */ }
      <TCMChat />
    </div>
  );
}

export default App;
