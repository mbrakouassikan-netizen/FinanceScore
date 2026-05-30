'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { MessageCircle, X, Send, Bot } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [showBadge, setShowBadge] = useState(false);
  const [showNotification, setShowNotification] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Don't show on assistant page
  if (pathname === '/assistant') {
    return null;
  }

  // Show badge after 2 seconds, hide after 5 seconds
  useEffect(() => {
    const badgeTimer = setTimeout(() => setShowBadge(true), 2000);
    const hideTimer = setTimeout(() => setShowBadge(false), 7000);
    return () => {
      clearTimeout(badgeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  // Hide notification when chat opens
  useEffect(() => {
    if (isOpen) {
      setShowNotification(false);
    }
  }, [isOpen]);

  // Add welcome message when chat opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          role: 'assistant',
          content: 'Bonjour ! Je suis l\'assistant CultureFinance. Pose-moi ta question sur l\'épargne, les transferts, le crédit ou le budget 👋',
        },
      ]);
    }
  }, [isOpen, messages.length]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const suggestions = [
    "C'est quoi le LEP ?",
    "Meilleur service transfert ?",
    "Taux Livret A 2026 ?",
  ];

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages.slice(-6), userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await response.json();
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response || 'Désolé, une erreur est survenue.',
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Désolé, une erreur est survenue. Réessaie plus tard.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(input);
    }
  };

  return (
    <>
      {/* Badge "Une question ?" */}
      {showBadge && !isOpen && (
        <div className="fixed bottom-20 right-20 z-50 bg-[#0f172a] border border-[rgba(74,222,128,0.3)] rounded-[12px] px-3.5 py-2 text-[12px] text-[#e2e8f0] shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-300">
          Une question ? Je suis là 👋
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#4ade80] shadow-[0_4px_20px_rgba(74,222,128,0.3)] flex items-center justify-center hover:scale-105 transition-transform"
      >
        {isOpen ? (
          <X size={24} className="text-[#052e16]" />
        ) : (
          <MessageCircle size={24} className="text-[#052e16]" />
        )}
        {/* Notification dot */}
        {showNotification && !isOpen && (
          <span className="absolute top-0 right-0 w-3 h-3 bg-[#ef4444] border-2 border-[#4ade80] rounded-full animate-pulse" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[340px] sm:w-[340px] md:w-[340px] bg-[#0f172a] border border-[rgba(74,222,128,0.2)] rounded-[16px] shadow-[0_20px_60px_rgba(0,0,0,0.5)] animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#0a1628] border-b border-[rgba(74,222,128,0.1)] rounded-t-[16px]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#052e16] border-2 border-[#4ade80] flex items-center justify-center">
                <Bot size={16} className="text-[#4ade80]" />
              </div>
              <div>
                <h3 className="text-[13px] font-semibold text-[#e2e8f0]">Assistant CultureFinance</h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#4ade80] rounded-full animate-pulse" />
                  <span className="text-[11px] text-[#4ade80]">En ligne · IA connectée</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[#94a3b8] hover:text-[#e2e8f0] transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="h-[220px] overflow-y-auto px-4 py-3 space-y-3">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`max-w-[85%] px-3 py-2 rounded-[12px] text-[13px] leading-relaxed ${
                  message.role === 'assistant'
                    ? 'bg-[#1e293b] text-[#cbd5e1] rounded-tl-[2px]'
                    : 'bg-[rgba(74,222,128,0.1)] text-[#86efac] border border-[rgba(74,222,128,0.2)] rounded-tr-[2px] ml-auto'
                }`}
              >
                {message.content}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-1 px-3 py-2 bg-[#1e293b] rounded-[12px] rounded-tl-[2px] w-fit">
                <span className="w-1.5 h-1.5 bg-[#4ade80] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-[#4ade80] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-[#4ade80] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          {messages.length === 1 && !isLoading && (
            <div className="px-4 pb-2 flex flex-wrap gap-2">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSendMessage(suggestion)}
                  className="px-3 py-1.5 bg-[#1e293b] border border-[#334155] rounded-[16px] text-[11px] text-[#94a3b8] hover:border-[rgba(74,222,128,0.4)] hover:text-[#4ade80] transition-all"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="px-4 pb-4">
            <div className="flex items-center gap-2 bg-[#1e293b] border border-[#334155] rounded-[20px] px-3 py-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Pose ta question..."
                className="flex-1 bg-transparent text-[13px] text-[#e2e8f0] placeholder:text-[#64748b] outline-none"
              />
              <button
                onClick={() => handleSendMessage(input)}
                disabled={!input.trim() || isLoading}
                className="text-[#4ade80] hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
