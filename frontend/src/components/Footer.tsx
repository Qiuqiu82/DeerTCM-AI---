import React from 'react';

export default function Footer() {
  return (
    <div className="bg-white mt-12 border-t border-emerald-100">
      <div className="max-w-screen-lg mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-6 text-sm text-emerald-700">
        <div>
          <div className="font-semibold text-emerald-800 mb-2">关于</div>
          <div>中医智能助手</div>
        </div>
        <div>
          <div className="font-semibold text-emerald-800 mb-2">产品</div>
          <div>聊天</div>
          <div>API</div>
        </div>
        <div>
          <div className="font-semibold text-emerald-800 mb-2">法律 & 安全</div>
          <div>隐私政策</div>
        </div>
        <div>
          <div className="font-semibold text-emerald-800 mb-2">联系我们</div>
          <div>邮件</div>
        </div>
      </div>
    </div>
  );
}


