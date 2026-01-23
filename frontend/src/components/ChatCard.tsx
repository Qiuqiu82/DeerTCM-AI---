import React from 'react';
import { CpuChipIcon } from '@heroicons/react/24/outline';
import { TCMChat } from './TCMChat';

type Props = {
  fullScreen?: boolean;
};

export default function ChatCard({ fullScreen = false }: Props) {
  const containerClass = fullScreen
    ? 'fixed inset-0 z-50 bg-white rounded-none sm:rounded-2xl shadow-2xl border border-emerald-100 overflow-hidden flex flex-col'
    : 'w-full h-[calc(100vh-220px)] sm:h-[640px] bg-white rounded-2xl shadow-2xl border border-emerald-100 overflow-hidden flex flex-col';

  return (
    <div className={containerClass}>
      <header className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 p-2 rounded-md">
            <CpuChipIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-semibold">AI中医助手</div>
            <div className="text-xs text-emerald-100">智能辨证 · 科学诊疗</div>
          </div>
        </div>
        <div className="text-xs">在线</div>
      </header>

      <div className="flex-1 overflow-hidden">
        <TCMChat />
      </div>
    </div>
  );
}


