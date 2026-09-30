import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  Trash2, 
  Copy, 
  Check, 
  Volume2, 
  VolumeX, 
  Lightbulb, 
  HelpCircle, 
  Layers, 
  Languages, 
  ArrowRight,
  Bot,
  User,
  Wand2,
  BookOpen
} from 'lucide-react';
import { ChatMessage, StudentLevel, AppLanguage } from '../types';
import { MarkdownRenderer } from './MarkdownRenderer';
import { SUBJECTS } from '../data/subjects';

interface ChatViewProps {
  level: StudentLevel;
  setLevel: (lvl: StudentLevel) => void;
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  initialPrompt?: string;
  initialSubject?: string;
  onNavigateToQuiz?: (topic: string, subject: string) => void;
  onTopicCompleted?: (topic: string) => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  level,
  setLevel,
  language,
  setLanguage,
  initialPrompt,
  initialSubject,
  onNavigateToQuiz,
  onTopicCompleted,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string>(
    initialSubject || 'General Academic'
  );
  const [inputMessage, setInputMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        id: 'welcome-1',
        role: 'assistant',
        content: `### 👋 Greetings! I am EduGenie, your Google Gemini AI Tutor.
I'm here to explain any academic subject in simple, step-by-step clarity.

**How can I assist your learning today?**
- 📐 **Mathematics & Physics**: Derivations, step-by-step calculus, proofs.
- 💻 **Computer Science & Coding**: Algorithms, data structures, code walkthroughs.
- 🤖 **Artificial Intelligence**: Neural networks, backprop, transformers, ML math.
- 📚 **Writing & Grammar**: Essay structures, academic rhetoric, literature.

*Feel free to ask in English or தமிழ் (Tamil). If an explanation feels too dense, simply click **"Explain Simpler 🪄"** below any message!*`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        subject: 'General Academic',
        level,
        language,
      },
    ];
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Handle incoming initialPrompt
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim()) {
      handleSend(initialPrompt);
    }
  }, [initialPrompt]);

  const handleSend = async (customPrompt?: string, actionType: string = 'standard') => {
    const promptToSend = customPrompt || inputMessage;
    if (!promptToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: promptToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      subject: selectedSubject,
      level,
      language,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInputMessage('');
    setLoading(true);

    try {
      // Build conversation payload
      const historyPayload = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: historyPayload,
          subject: selectedSubject,
          level,
          language,
          action: actionType,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch AI answer');
      }

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        subject: selectedSubject,
        level,
        language,
        actionRequested: actionType,
      };

      setMessages((prev) => [...prev, assistantMsg]);

      // If user asked a meaningful topic, log completion
      if (promptToSend.length > 5 && onTopicCompleted) {
        onTopicCompleted(`${selectedSubject}: ${promptToSend.slice(0, 30)}...`);
      }
    } catch (err: any) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `⚠️ **Note from EduGenie:** ${err.message || 'Could not connect to Gemini service. Please verify your connection or try again.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        subject: selectedSubject,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleActionModifier = (action: string) => {
    if (loading || messages.length === 0) return;
    const lastAssistantMsg = [...messages].reverse().find((m) => m.role === 'assistant');
    if (!lastAssistantMsg) return;

    let prompt = '';
    if (action === 'simplify') {
      prompt = 'Can you explain the above concept in an even simpler, friendlier way using an everyday analogy?';
    } else if (action === 'step_by_step') {
      prompt = 'Please break down the above concept or solution into clear, numbered step-by-step instructions.';
    } else if (action === 'analogy') {
      prompt = 'Give me a vivid, real-world everyday analogy to help me intuitively remember this.';
    } else if (action === 'tamil_translate') {
      prompt = 'Can you explain the key points of the above concept in clear Tamil (தமிழ்)?';
    }

    handleSend(prompt, action);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (text: string, id: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (speakingMsgId === id) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Clean markdown hashes/backticks for clean speech
    const cleanText = text
      .replace(/[#*`_>]/g, '')
      .replace(/\|/g, '')
      .replace(/\[.*?\]/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setSpeakingMsgId(null);
    utterance.onerror = () => setSpeakingMsgId(null);

    setSpeakingMsgId(id);
    window.speechSynthesis.speak(utterance);
  };

  const handleClear = () => {
    if (window.confirm('Clear current chat conversation?')) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setMessages([
        {
          id: 'welcome-reset',
          role: 'assistant',
          content: 'Chat cleared! What academic topic would you like to explore next?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          subject: selectedSubject,
        },
      ]);
    }
  };

  // Pre-curated starter questions based on selected subject
  const currentSubjectObj = SUBJECTS.find((s) => s.name === selectedSubject) || SUBJECTS[0];

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[580px] bg-white rounded-2xl border border-slate-200/80 shadow-md overflow-hidden">
      {/* Top Header Controls Bar */}
      <div className="p-3.5 sm:px-5 border-b border-slate-200/80 bg-slate-50/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <span>EduGenie Academic Tutor</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Powered by Google Gemini 3.8 Flash
            </p>
          </div>
        </div>

        {/* Subject dropdown & quick action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Subject Selector */}
          <div className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-xs shadow-2xs">
            <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="bg-transparent font-semibold text-slate-800 text-xs focus:outline-none cursor-pointer"
            >
              <option value="General Academic">General Academic</option>
              {SUBJECTS.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Level Switcher */}
          <div className="hidden sm:flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-xs shadow-2xs">
            <Layers className="w-3.5 h-3.5 text-indigo-600" />
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value as StudentLevel)}
              className="bg-transparent font-semibold text-slate-800 text-xs focus:outline-none cursor-pointer"
            >
              <option value="Beginner">Beginner (Analogies)</option>
              <option value="Intermediate">Intermediate (College)</option>
              <option value="Advanced">Advanced (Rigorous)</option>
            </select>
          </div>

          {/* Quick Language Switcher */}
          <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-slate-200 text-xs shadow-2xs">
            <Languages className="w-3.5 h-3.5 text-indigo-600" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as AppLanguage)}
              className="bg-transparent font-semibold text-slate-800 text-xs focus:outline-none cursor-pointer"
            >
              <option value="en">English</option>
              <option value="ta">தமிழ் (Tamil)</option>
              <option value="bilingual">English + தமிழ்</option>
            </select>
          </div>

          {/* Clear button */}
          <button
            onClick={handleClear}
            title="Clear Chat"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Stream Container */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-gradient-to-b from-slate-50/50 via-white to-slate-50/30">
        {messages.map((message) => {
          const isUser = message.role === 'user';
          const isSpeaking = speakingMsgId === message.id;

          return (
            <div
              key={message.id}
              className={`flex gap-3 sm:gap-4 max-w-4xl ${
                isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
              }`}
            >
              {/* Avatar Icon */}
              <div
                className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center shadow-xs text-xs font-bold ${
                  isUser
                    ? 'bg-slate-900 text-white'
                    : 'bg-gradient-to-tr from-indigo-600 to-violet-600 text-white'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`flex-1 rounded-2xl p-4 sm:p-5 shadow-xs transition-all ${
                  isUser
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-white border border-slate-200/90 text-slate-900 rounded-tl-none'
                }`}
              >
                {/* Header metadata */}
                <div
                  className={`flex items-center justify-between pb-2 mb-2 border-b text-[11px] ${
                    isUser
                      ? 'border-indigo-500/60 text-indigo-100'
                      : 'border-slate-100 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">
                      {isUser ? 'You' : 'EduGenie'}
                    </span>
                    {message.subject && (
                      <span className="px-1.5 py-0.5 rounded bg-black/10 text-[10px] font-medium">
                        {message.subject}
                      </span>
                    )}
                  </div>
                  <span>{message.timestamp}</span>
                </div>

                {/* Message Content */}
                {isUser ? (
                  <p className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">
                    {message.content}
                  </p>
                ) : (
                  <MarkdownRenderer content={message.content} />
                )}

                {/* Assistant Message Actions */}
                {!isUser && (
                  <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                    {/* Prompt Modifiers for deeper learning */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        onClick={() => handleActionModifier('simplify')}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-semibold transition-colors"
                        title="Get a simpler explanation with analogies"
                      >
                        <Wand2 className="w-3 h-3" />
                        <span>Explain Simpler 🪄</span>
                      </button>

                      <button
                        onClick={() => handleActionModifier('step_by_step')}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium transition-colors"
                        title="Show step-by-step numbered breakdown"
                      >
                        <span>Step-by-step 🪜</span>
                      </button>

                      <button
                        onClick={() => handleActionModifier('analogy')}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 text-[11px] font-medium transition-colors"
                        title="Provide real-world analogy"
                      >
                        <Lightbulb className="w-3 h-3 text-amber-500" />
                        <span>Analogy 💡</span>
                      </button>

                      <button
                        onClick={() => handleActionModifier('tamil_translate')}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-medium transition-colors"
                        title="Translate explanation to Tamil"
                      >
                        <span>தமிழ் (Tamil) 🔄</span>
                      </button>

                      {onNavigateToQuiz && (
                        <button
                          onClick={() => {
                            // Extract approximate topic
                            const topic = message.subject || 'This Topic';
                            onNavigateToQuiz(topic, selectedSubject);
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-medium transition-colors"
                          title="Generate a quiz on this topic"
                        >
                          <HelpCircle className="w-3 h-3 text-emerald-600" />
                          <span>Quiz Me 🎯</span>
                        </button>
                      )}
                    </div>

                    {/* Copy and Voice Read buttons */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleSpeak(message.content, message.id)}
                        className={`p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors ${
                          isSpeaking ? 'text-indigo-600 bg-indigo-50' : ''
                        }`}
                        title={isSpeaking ? 'Stop listening' : 'Listen to explanation'}
                      >
                        {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={() => handleCopy(message.content, message.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        title="Copy text"
                      >
                        {copiedId === message.id ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex gap-3 sm:gap-4 max-w-xl mr-auto">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shrink-0 flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <div className="rounded-2xl p-4 bg-white border border-slate-200/90 shadow-xs text-slate-700 text-xs">
              <div className="flex items-center gap-2 text-indigo-600 font-semibold mb-1">
                <span className="animate-pulse">EduGenie is thinking...</span>
              </div>
              <p className="text-slate-500 text-[11px]">
                Structuring simple explanation with examples and step-by-step guidance.
              </p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Starter Bubbles */}
      <div className="px-4 py-2 bg-slate-50 border-t border-slate-200/60 overflow-x-auto">
        <div className="flex items-center gap-1.5 text-xs whitespace-nowrap">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-indigo-500" />
            Suggestions:
          </span>
          {currentSubjectObj.sampleQuestions.slice(0, 3).map((q, idx) => (
            <button
              key={idx}
              disabled={loading}
              onClick={() => handleSend(q)}
              className="px-2.5 py-1 rounded-full bg-white hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 border border-slate-200 text-xs transition-colors shrink-0 shadow-2xs"
            >
              {q.length > 50 ? q.slice(0, 50) + '...' : q}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Chat Input Form */}
      <div className="p-3 sm:p-4 bg-white border-t border-slate-200/80">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={loading}
              placeholder={
                language === 'ta'
                  ? `கேள்வி கேட்கவும் (${selectedSubject})... அல்லது எ.கா. "இதை எளிதாக விளக்கு"`
                  : `Ask any academic question in ${selectedSubject}... (e.g. "Derive Bernoulli's equation step by step")`
              }
              className="w-full pl-4 pr-10 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all shadow-2xs"
            />
            <button
              type="button"
              onClick={() => {
                if (inputMessage.trim()) {
                  handleSend(`Explain this with a simple everyday analogy: ${inputMessage}`);
                }
              }}
              title="Add analogy request"
              className="absolute right-3 top-3 text-slate-400 hover:text-amber-600 transition-colors"
            >
              <Lightbulb className="w-4 h-4" />
            </button>
          </div>

          <button
            type="submit"
            disabled={!inputMessage.trim() || loading}
            className="px-4 sm:px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm shadow-md shadow-indigo-200 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
