'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import Link from 'next/link';
import { Send, RefreshCw, Bot } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string | null;
}

interface ToolLink {
  label: string;
  href: string;
}

const SUGGESTIONS = [
  "Comment optimiser mes transferts au pays ?",
  "Quelle épargne choisir en 2026 ?",
  "Comment calculer ma capacité d'emprunt ?",
  "C'est quoi le taux d'endettement ?",
];

const TOOL_DETECTORS: { keywords: string[]; label: string; href: string }[] = [
  {
    keywords: ['comparateur de transfert', 'transfert'],
    label: 'Essayer le comparateur →',
    href: '/simulateurs/transfert',
  },
  {
    keywords: ['simulateur épargne', 'livret', 'épargne'],
    label: 'Simuler mon épargne →',
    href: '/simulateurs/epargne',
  },
  {
    keywords: ["simulateur crédit", "capacité d'emprunt", "capacité d'emprunt"],
    label: 'Simuler mon crédit →',
    href: '/simulateurs/credit',
  },
  {
    keywords: ['simulateur budget', 'budget'],
    label: 'Tester mon budget →',
    href: '/simulateurs/budget',
  },
];

const WELCOME_CONTENT =
  "Bonjour ! Je suis l'assistant CultureFinance. Je suis là pour t'aider à mieux comprendre la finance — épargne, crédit, transferts, budget... Pose-moi ta question !";

function getToolLinks(content: string): ToolLink[] {
  const lower = content.toLowerCase();
  const seen = new Set<string>();
  const links: ToolLink[] = [];
  for (const detector of TOOL_DETECTORS) {
    if (detector.keywords.some((k) => lower.includes(k)) && !seen.has(detector.href)) {
      seen.add(detector.href);
      links.push({ label: detector.label, href: detector.href });
    }
  }
  return links;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const gamifCalled = useRef(false);

  useEffect(() => {
    setMessages([{ role: 'assistant', content: WELCOME_CONTENT, timestamp: new Date().toISOString() }]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMsg: Message = { role: 'user', content: trimmed, timestamp: new Date().toISOString() };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput('');
    setIsLoading(true);
    setShowSuggestions(false);

    if (!gamifCalled.current) {
      gamifCalled.current = true;
      const email = localStorage.getItem('cf_email');
      if (email) {
        fetch('/api/gamification/action', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, action: 'assistant_use', details: { question: trimmed } }),
        }).catch(() => {});
      }
    }

    try {
      const contextMessages = next.slice(-10).map((m) => ({ role: m.role, content: m.content }));
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: contextMessages }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.content ?? "Désolé, je n'ai pas pu traiter ta question. Réessaie.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: "Une erreur est survenue. Vérifie ta connexion et réessaie.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const resetConversation = () => {
    setMessages([{ role: 'assistant', content: WELCOME_CONTENT, timestamp: new Date().toISOString() }]);
    setInput('');
    setIsLoading(false);
    setShowSuggestions(true);
    gamifCalled.current = false;
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0d0f1a' }}>
      <div className="max-w-3xl mx-auto px-4 py-12">

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#4ade80]/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-[#4ade80]" />
              </div>
              <div>
                <h1 className="text-2xl font-serif font-bold text-white">Assistant CultureFinance</h1>
                <p className="text-[#94a3b8] text-sm">
                  Pose tes questions sur la finance — réponses claires et adaptées à la diaspora
                </p>
              </div>
            </div>
            <button
              onClick={resetConversation}
              className="flex items-center gap-2 px-3 py-2 border border-white/20 text-[#94a3b8] rounded-full text-xs hover:border-[#4ade80] hover:text-[#4ade80] transition-all flex-shrink-0"
            >
              <RefreshCw className="w-3 h-3" />
              <span className="hidden sm:inline">Nouvelle conversation</span>
            </button>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <span className="px-3 py-1 bg-[#4ade80]/20 text-[#4ade80] text-xs font-semibold rounded-full w-fit">
              IA — Éducation financière
            </span>
            <p className="text-[#475569] text-xs max-w-sm">
              Cet assistant fournit des informations éducatives générales. Pour toute décision financière, consulte un professionnel agréé.
            </p>
          </div>
        </div>

        {/* Chat window */}
        <div
          className="rounded-2xl border border-white/10 mb-4 overflow-y-auto p-4 space-y-5"
          style={{ backgroundColor: '#111827', height: '60vh' }}
        >
          {messages.map((msg, i) => {
            const toolLinks = msg.role === 'assistant' ? getToolLinks(msg.content) : [];
            const isWelcome = i === 0 && msg.role === 'assistant';

            return (
              <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div
                  className={`max-w-[85%] px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user' ? 'rounded-2xl rounded-br-sm' : 'rounded-2xl rounded-bl-sm'
                  }`}
                  style={
                    msg.role === 'user'
                      ? { backgroundColor: '#052e16', color: '#86efac' }
                      : { backgroundColor: '#1e293b', color: '#e2e8f0' }
                  }
                >
                  {msg.content}
                </div>

                {/* Tool links */}
                {toolLinks.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {toolLinks.map((link, j) => (
                      <Link
                        key={j}
                        href={link.href}
                        className="px-3 py-1 bg-[#4ade80]/20 text-[#4ade80] text-xs font-medium rounded-full hover:bg-[#4ade80]/30 transition-all border border-[#4ade80]/30"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}

                {/* Quick suggestions under welcome message */}
                {isWelcome && showSuggestions && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {SUGGESTIONS.map((s, j) => (
                      <button
                        key={j}
                        onClick={() => sendMessage(s)}
                        className="px-3 py-1.5 bg-white/5 text-[#94a3b8] text-xs rounded-full border border-white/10 hover:border-[#4ade80]/40 hover:text-white transition-all text-left"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}

                {/* Timestamp */}
                {msg.timestamp && (
                  <span className="text-[#334155] text-xs mt-1">{formatTime(msg.timestamp)}</span>
                )}
              </div>
            );
          })}

          {/* Loading dots */}
          {isLoading && (
            <div className="flex items-start">
              <div className="px-4 py-3 rounded-2xl rounded-bl-sm" style={{ backgroundColor: '#1e293b' }}>
                <span className="flex gap-1 items-center h-4">
                  <span className="w-2 h-2 bg-[#4ade80] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-[#4ade80] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-[#4ade80] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder="Ex: Comment fonctionne le Livret A ?"
            className="flex-1 px-5 py-3 rounded-full bg-white/5 border border-white/20 text-white placeholder-[#334155] focus:outline-none focus:border-[#4ade80] transition-all disabled:opacity-50 text-sm"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={isLoading || !input.trim()}
            className="w-12 h-12 bg-[#4ade80] text-black rounded-full flex items-center justify-center hover:bg-[#4ade80]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            aria-label="Envoyer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
