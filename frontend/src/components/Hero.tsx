import React from 'react';
import { BeakerIcon, SparklesIcon } from '@heroicons/react/24/outline';

export default function Hero() {
  return (
    <div className="max-w-screen-lg mx-auto text-center px-4">
      <div className="inline-flex items-center justify-center mb-4">
        <div className="bg-gradient-to-br from-emerald-600 to-teal-600 p-3 rounded-xl shadow-lg">
          <BeakerIcon className="w-10 h-10 text-white" />
        </div>
      </div>

      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-emerald-800 mb-3">
        中医临床智能诊疗助手
      </h1>

      <p className="text-teal-600 max-w-xl mx-auto mb-6">
        基于检索增强与生成的中医诊疗助手 — 提供辨证分析、治疗建议与个性化调理方案
      </p>

      {/* <div className="flex justify-center gap-3">
        <div className="inline-flex items-center rounded-full px-4 py-2 bg-emerald-100 text-emerald-700 text-sm font-medium shadow-sm">
          <SparklesIcon className="w-4 h-4 mr-2" />
          AI 智能分析
        </div>
      </div> */}
    </div>
  );
}


