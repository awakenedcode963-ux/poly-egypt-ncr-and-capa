import React, { useState } from 'react';
import { Bot, Send, Sparkles, Lightbulb, FileText, RefreshCw, HelpCircle, AlertCircle } from 'lucide-react';
import { MasterDataState, InspectionLog } from '../types';

interface AiAssistantViewProps {
  masterData: MasterDataState;
  logs: InspectionLog[];
}

export const AiAssistantView: React.FC<AiAssistantViewProps> = ({ masterData, logs }) => {
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    {
      sender: 'ai',
      text: 'مرحباً بك! أنا استشاري الجودة الذكي الخاص بمصنع الأنابيب والوصلات (PPR & UPVC). كيف يمكنني مساعدتك اليوم؟ يمكنك سؤالي عن معادلات Google Sheets، خطط الإجراءات التصحيحية (CAPA)، أو طريقة حل أخطاء الشيت.'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const suggestedPrompts = [
    'كيف أنشئ قائمة منسدلة (Data Validation) في Google Sheets لربط الكود باسم المنتج؟',
    'ماهي خطة العمل التصحيحية والوقائية (CAPA) للحد من عيوب فقاعات الهواء (Air Bubbles) وسماكة الجدار؟',
    'اعطني معادلة XLOOKUP صحيحة للبحث عن اسم المنتج في الاكسيل لمنع خطأ N/A#.',
    'كيف أقوم بدراسة السبب الجذري (Fishbone Diagram) لبيضوية الأنابيب العالية عند التبريد؟'
  ];

  const handleSend = async (promptText?: string) => {
    const textToSend = promptText || input;
    if (!textToSend.trim() || loading) return;

    setMessages(prev => [...prev, { sender: 'user', text: textToSend }]);
    if (!promptText) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          context: {
            pipesCount: masterData.pipes.length,
            fittingsCount: masterData.fittings.length,
            inspectorsCount: masterData.inspectors.length,
            logsCount: logs.length
          }
        })
      });

      const data = await res.json();
      if (res.ok && data.result) {
        setMessages(prev => [...prev, { sender: 'ai', text: data.result }]);
      } else {
        setMessages(prev => [...prev, { 
          sender: 'ai', 
          text: 'عذراً، حدث خطأ أثناء التواصل مع الذكاء الاصطناعي: ' + (data.error || 'الرجاء المحاولة لاحقاً') 
        }]);
      }
    } catch (err: any) {
      setMessages(prev => [...prev, { 
        sender: 'ai', 
        text: 'حدث خطأ في الاتصال بالخادم: ' + (err.message || err) 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-500 rounded-xl text-slate-950">
              <Bot className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold">مساعد الجودة والبيانات الذكي (Gemini Quality Consultant)</h2>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            استشارات هندسية فورية لنظم الجودة بالمصانع، معادلات Google Sheets، والتحليل الجذري للعيوب.
          </p>
        </div>

        <span className="text-xs font-bold px-3 py-1.5 bg-amber-500/20 text-amber-300 rounded-full border border-amber-500/30 flex items-center gap-1.5 shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" /> مدعوم بـ Gemini 2.5 Flash
        </span>
      </div>

      {/* Suggested Prompts */}
      <div className="space-y-2">
        <p className="text-xs font-bold text-slate-500 flex items-center gap-1">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
          <span>أسئلة شائعة واقتراحات استشارية:</span>
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {suggestedPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              disabled={loading}
              className="p-3 bg-white hover:bg-amber-50/60 border border-slate-200 hover:border-amber-300 rounded-xl text-right text-xs font-medium text-slate-700 hover:text-amber-950 transition-all shadow-xs cursor-pointer"
            >
              💬 {p}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-4 min-h-[380px] max-h-[500px] overflow-y-auto">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 ${
              msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            <div className={`p-2 rounded-xl text-white shrink-0 ${
              msg.sender === 'user' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-900'
            }`}>
              {msg.sender === 'user' ? 'أنت' : <Bot className="w-5 h-5 text-amber-400" />}
            </div>

            <div className={`p-4 rounded-2xl text-sm leading-relaxed max-w-[85%] whitespace-pre-line ${
              msg.sender === 'user'
                ? 'bg-amber-500 text-slate-950 font-medium rounded-tr-none'
                : 'bg-slate-50 text-slate-800 border border-slate-200/80 rounded-tl-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3 text-slate-400 text-xs font-medium py-2">
            <RefreshCw className="w-4 h-4 animate-spin text-amber-500" />
            <span>جاري تحليل السؤال وكتابة التوصيات الاستشارية...</span>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2"
      >
        <input
          type="text"
          placeholder="اكتب سؤالك المهني هنا..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 shadow-xs"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-6 py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-sm rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2 shrink-0"
        >
          <Send className="w-4 h-4" />
          <span>إرسال</span>
        </button>
      </form>
    </div>
  );
};
