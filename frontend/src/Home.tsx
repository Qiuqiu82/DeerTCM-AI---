import React, { useEffect, useState } from 'react';
import Hero from './components/Hero';
import FeatureCard from './components/FeatureCard';
import ChatCard from './components/ChatCard';
import Footer from './components/Footer';

export default function Home() {
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    // 如果 URL hash 包含 #chat，则直接进入聊天（用于新窗口）
    if (typeof window !== 'undefined' && window.location.hash === '#chat') {
      setShowChat(true);
    }
  }, []);

  const openChatInNewWindow = () => {
    const url = window.location.origin + window.location.pathname + '#chat';
    // 打开新窗口并聚焦
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white text-emerald-900">
      {!showChat ? (
        <>
          <header className="py-12">
            <Hero />
          </header>

          <section className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FeatureCard
                title="开始对话"
                desc="与中医智能助手进行会话，获取辨证建议"
                iconName="Sparkles"
                onClick={openChatInNewWindow}
              />
              <FeatureCard
                title="API 开放平台"
                desc="调用模型，快速集成到你的系统"
                iconName="Beaker"
              />
            </div>
          </section>

          <footer className="mt-12">
            <Footer />
          </footer>
        </>
      ) : (
        // 全屏展示 ChatCard（当通过 #chat 打开或在当前窗口触发）
        <main className="w-full h-screen">
          <div className="w-full h-full">
            <ChatCard fullScreen />
          </div>
        </main>
      )}
    </div>
  );
}


