import React, { useState, useRef, useEffect } from 'react';
import {
  HeartIcon,
  SparklesIcon,
  BeakerIcon,
  PaperAirplaneIcon,
  UserIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// 打字机效果组件
const TypingIndicator: React.FC = () => {
  return (
    <div className="flex space-x-1 px-2">
      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
    </div>
  );
};

export const TCMChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [assistantId, setAssistantId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: inputValue,
          stream: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      let assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: '',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      setAssistantId(assistantMessage.id);

      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              break;
            }

            setMessages(prev =>
              prev.map(msg =>
                msg.id === assistantMessage.id
                  ? { ...msg, content: msg.content + data }
                  : msg
              )
            );
          }
        }
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        type: 'assistant',
        content: '抱歉，发生了错误，请稍后重试。',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setAssistantId(null);
    }
  };

  return (
    <div className="w-full h-screen">
      {/* 聊天容器 - 弹性占满全屏 */}
      <div className="w-full h-full bg-white/90 backdrop-blur-sm rounded-none sm:rounded-xl shadow-xl border border-emerald-100 overflow-hidden flex flex-col">
        {/* 聊天头部 - 响应式设计 */}
        <header className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 px-4 sm:px-6 py-3 sm:py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="bg-white/20 p-1.5 sm:p-2 rounded-lg backdrop-blur-sm">
                <CpuChipIcon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm sm:text-lg">AI中医助手</h3>
                <p className="text-emerald-100 text-xs sm:text-sm hidden sm:block">智能辨证 · 科学诊疗</p>
              </div>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <div className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse"></div>
              <span className="text-white text-xs sm:text-sm font-medium">在线</span>
            </div>
          </div>
        </header>

        {/* 消息区域 - 弹性布局，占满剩余空间 */}
        <div
          className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6 bg-gradient-to-b from-emerald-50/30 to-white scrollbar-thin scrollbar-thumb-emerald-300 scrollbar-track-transparent"
          role="log"
          aria-live="polite"
          aria-label="聊天消息"
        >
          {messages.length === 0 && (
            <div className="text-center text-emerald-700 py-8 sm:py-12 h-full flex flex-col justify-center">
              {/* 欢迎界面 - 响应式设计 */}
              <div className="mb-6 sm:mb-8">
                <div className="relative inline-block">
                  {/* 主图标 - 响应式尺寸 */}
                  <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-xl">
                    <BeakerIcon className="w-10 h-10 sm:w-16 sm:h-16 text-white" />
                  </div>
                  {/* 装饰性光环 */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl sm:rounded-3xl blur-lg opacity-30 -z-10"></div>
                  {/* 小装饰图标 - 响应式定位 */}
                  <div className="absolute -top-2 sm:-top-3 -right-2 sm:-right-3 bg-gradient-to-br from-orange-400 to-red-500 p-2 sm:p-3 rounded-lg sm:rounded-xl shadow-lg">
                    <SparklesIcon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="absolute -bottom-2 sm:-bottom-3 -left-2 sm:-left-3 bg-gradient-to-br from-rose-400 to-pink-500 p-2 sm:p-3 rounded-lg sm:rounded-xl shadow-lg">
                    <HeartIcon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                  </div>
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-emerald-800 mb-3 sm:mb-4 tracking-tight">
                欢迎使用中医智能诊疗助手
              </h2>

              <p className="text-emerald-700 text-base sm:text-lg mb-4 sm:mb-6 max-w-xs sm:max-w-md mx-auto leading-relaxed">
                请详细描述您的症状，我将基于中医理论为您提供专业的辨证分析和治疗建议
              </p>

              {/* 功能特色卡片 - 响应式网格 */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-xs sm:max-w-2xl mx-auto mt-6 sm:mt-8">
                <div className="bg-white/70 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-emerald-100 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="bg-emerald-100 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mb-2 sm:mb-3 mx-auto">
                    <SparklesIcon className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
                  </div>
                  <h4 className="font-semibold text-emerald-800 mb-1 text-sm sm:text-base">AI智能分析</h4>
                  <p className="text-emerald-600 text-xs sm:text-sm">深度学习中医辨证</p>
                </div>

                <div className="bg-white/70 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-teal-100 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="bg-teal-100 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mb-2 sm:mb-3 mx-auto">
                    <BeakerIcon className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600" />
                  </div>
                  <h4 className="font-semibold text-teal-800 mb-1 text-sm sm:text-base">科学诊疗</h4>
                  <p className="text-teal-600 text-xs sm:text-sm">结合现代医学知识</p>
                </div>

                <div className="bg-white/70 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-cyan-100 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="bg-cyan-100 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mb-2 sm:mb-3 mx-auto">
                    <HeartIcon className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-600" />
                  </div>
                  <h4 className="font-semibold text-cyan-800 mb-1 text-sm sm:text-base">个性化建议</h4>
                  <p className="text-cyan-600 text-xs sm:text-sm">针对个体差异调理</p>
                </div>
              </div>
            </div>
          )}

          {/* 消息列表 - 可访问性优化 */}
          {messages.map((message, index) => (
            <div
              key={message.id}
              className="flex items-start w-full"
              aria-label={`${message.type === 'user' ? '用户' : 'AI助手'}消息`}
            >
              {message.type === 'assistant' ? (
                <>
                  {/* 助手：头像在左，气泡在右 */}
                  <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-md bg-gradient-to-br from-emerald-600 to-teal-700 mr-3" aria-hidden="true">
                    <CpuChipIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div className="max-w-[75%] sm:max-w-xs lg:max-w-md">
                    <div className="px-3 sm:px-5 py-2 sm:py-3 rounded-xl sm:rounded-2xl shadow-md border bg-white text-emerald-800 border-emerald-100">
                      {message.content ? (
                        <p className="whitespace-pre-wrap leading-relaxed text-sm sm:text-base">{message.content}</p>
                      ) : (isLoading && assistantId === message.id) ? (
                        <div className="flex items-center space-x-2">
                          <TypingIndicator />
                          <span className="text-emerald-700 text-sm">AI正在分析中...</span>
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap leading-relaxed text-sm sm:text-base text-emerald-400">AI正在准备回答...</p>
                      )}
                    </div>
                    <time className="text-xs mt-1 sm:mt-2 px-2 block text-left text-emerald-500" dateTime={message.timestamp.toISOString()}>
                      {message.timestamp.toLocaleTimeString()}
                    </time>
                  </div>
                </>
              ) : (
                <>
                  {/* 用户：气泡靠右，头像在右侧 */}
                  <div className="flex-1 flex justify-end">
                    <div className="max-w-[75%] sm:max-w-xs lg:max-w-md">
                      <div className="px-3 sm:px-5 py-2 sm:py-3 rounded-xl sm:rounded-2xl shadow-md border bg-gradient-to-br from-orange-500 to-red-600 text-white border-orange-400 ml-auto">
                        <p className="whitespace-pre-wrap leading-relaxed text-sm sm:text-base">{message.content}</p>
                      </div>
                      <time className="text-xs mt-1 sm:mt-2 px-2 block text-right text-orange-600" dateTime={message.timestamp.toISOString()}>
                        {message.timestamp.toLocaleTimeString()}
                      </time>
                    </div>
                  </div>
                  <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-md bg-gradient-to-br from-orange-500 to-red-600 ml-3" aria-hidden="true">
                    <UserIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                </>
              )}
            </div>
          ))}

          {/* 加载状态 - 优化动画和可访问性 */}
          {isLoading && !assistantId && (
            <div className="flex items-start space-x-2 sm:space-x-3 justify-start" aria-live="assertive">
              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-full flex items-center justify-center shadow-md" aria-hidden="true">
                <CpuChipIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="bg-white px-3 sm:px-5 py-2 sm:py-3 rounded-xl sm:rounded-2xl shadow-md border border-emerald-100">
                <div className="flex items-center space-x-2">
                  <TypingIndicator />
                  <span className="text-emerald-700 text-sm font-medium">AI正在分析中...</span>
                </div>
              </div>
            </div>
          )}

          {/* 滚动到底部锚点 */}
          <div ref={messagesEndRef} aria-hidden="true" />
        </div>

        {/* 输入区域 - 固定在底部，响应式设计 */}
        <footer className="bg-gradient-to-r from-emerald-50 to-teal-50 border-t border-emerald-100 p-3 sm:p-6 flex-shrink-0">
          <form onSubmit={handleSubmit} className="flex space-x-2 sm:space-x-4">
            {/* 输入框 - 响应式尺寸，可访问性优化 */}
            <div className="flex-1 relative">
              <label htmlFor="symptom-input" className="sr-only">
                请输入您的症状描述
              </label>
              <input
                id="symptom-input"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder="请详细描述您的症状（例如：不耐疲劳，口燥、咽干，舌红少苔）"
                className="w-full px-4 sm:px-5 py-3 sm:py-4 pr-10 sm:pr-12 bg-white border-2 border-emerald-200 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-300 placeholder-emerald-400 text-emerald-800 shadow-sm text-sm sm:text-base"
                disabled={isLoading}
                aria-describedby="input-help"
                autoComplete="off"
              />
              {/* 输入框装饰图标 */}
              <div className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2" aria-hidden="true">
                <BeakerIcon className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
              </div>
            </div>

            {/* 发送按钮 - 响应式尺寸，可访问性优化 */}
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="min-w-[44px] h-11 sm:min-w-[48px] sm:h-12 px-4 sm:px-8 bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-semibold rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl hover:from-emerald-700 hover:to-teal-800 focus:outline-none focus:ring-4 focus:ring-emerald-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg active:scale-95 transition-all duration-300 flex items-center justify-center space-x-1 sm:space-x-2"
              aria-label={isLoading ? "AI正在分析，请稍候" : "发送症状描述进行咨询"}
            >
              {isLoading ? (
                <TypingIndicator />
              ) : (
                <>
                  <PaperAirplaneIcon className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  <span className="hidden sm:inline">咨询</span>
                </>
              )}
            </button>
          </form>

          {/* 提示文字 - 可访问性优化 */}
          <div className="mt-3 sm:mt-4 text-center">
            <p id="input-help" className="text-emerald-600 text-xs sm:text-sm">
              💡 提示：描述越详细，诊断越准确。包括症状、体征、舌象、脉象等信息。
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};
