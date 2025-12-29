import { Bot, User, Copy, Check, ExternalLink } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function MessageList({ messages, isTyping }) {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const scrollRef = useRef(null);

  // Smooth scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="w-full max-w-3xl mx-auto min-h-full">
      {messages.length === 0 ? (
        /* --- EMPTY STATE --- */
        <div className="h-[75vh] flex flex-col items-center justify-center text-center px-6 animate-in fade-in zoom-in duration-700">
          <div className="w-20 h-20 mb-6 flex items-center justify-center rounded-[2rem] bg-indigo-600 shadow-2xl shadow-indigo-500/20 text-white">
            <Bot size={40} />
          </div>
          <h1 className="text-4xl font-black dark:text-white mb-2 tracking-tight">Bhojanbytes</h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg max-w-sm">
            Upload a photo of food labels for a <span className="text-indigo-500">deep reasoning analysis.</span>
          </p>
        </div>
      ) : (
        /* --- MESSAGE FEED --- */
        <div className="flex flex-col py-24 space-y-8 px-4"> 
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex w-full animate-in slide-in-from-bottom-4 fade-in duration-500 fill-mode-both ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className={`flex items-start gap-4 max-w-[88%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                
                {/* Avatar */}
                <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center mt-1 border shadow-sm ${
                  msg.role === "assistant" 
                  ? "bg-white dark:bg-[#1a1f2e] text-indigo-500 border-gray-100 dark:border-indigo-500/20" 
                  : "bg-gray-900 border-gray-800 text-white"
                }`}>
                  {msg.role === "assistant" ? <Bot size={22} /> : <User size={22} />}
                </div>

                {/* Message Content Container */}
                <div className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                  <div className={`
                    relative 
                    rounded-[24px] 
                    overflow-hidden
                    shadow-sm
                    transition-all duration-300
                    ${msg.role === "assistant" 
                      ? "bg-white dark:bg-[#1a1f2e] text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-800 rounded-tl-none" 
                      : "bg-indigo-600 text-white rounded-tr-none shadow-indigo-500/10"
                    }
                  `}>
                    
                    {/* Image Render (If present in message) */}
                    {msg.image && (
                      <div className="p-2">
                        <img 
                          src={msg.image} 
                          alt="Ingredient Scan" 
                          className="max-w-xs md:max-w-sm h-auto rounded-xl object-cover border border-black/5 dark:border-white/5" 
                        />
                      </div>
                    )}

                    {/* Text content with increased padding and line height */}
                    <div className="px-6 py-4">
                      <p className="text-[15px] leading-[1.6] whitespace-pre-wrap break-words">
                        {msg.content}
                      </p>
                    </div>
                  </div>

                  {/* Message Actions */}
                  {msg.role === "assistant" && (
                    <div className="flex gap-2 mt-2 ml-1">
                      <button 
                        onClick={() => copyToClipboard(msg.content, index)} 
                        className="p-2 text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-white/5 rounded-lg transition-all"
                        title="Copy Response"
                      >
                        {copiedIndex === index ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {/* --- TYPING INDICATOR --- */}
          {isTyping && (
            <div className="flex gap-4 items-start animate-in fade-in duration-300">
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#1a1f2e] border border-gray-100 dark:border-indigo-500/20 flex items-center justify-center text-indigo-500">
                <Bot size={22} />
              </div>
              <div className="bg-white dark:bg-[#1a1f2e] border border-gray-200 dark:border-gray-800 rounded-[24px] rounded-tl-none px-7 py-5 flex gap-1.5 shadow-sm">
                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></span>
              </div>
            </div>
          )}
          
          <div ref={scrollRef} className="h-12" />
        </div>
      )}
    </div>
  );
}