import { Bot, User, Copy, Check, ExternalLink } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import AnalysisCard from "./AnalysisCard";

export default function MessageList({ messages, isTyping, isFocusMode = false }) {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const scrollRef = useRef(null);

  // Smooth scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current && !isFocusMode) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, isFocusMode]);

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="w-full super-spacious flex flex-col space-y-4"> {/* Tightened spacing for better density */}
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`flex w-full animate-in slide-in-from-bottom-4 fade-in duration-500 fill-mode-both ${msg.role === "user" ? "justify-end" : "justify-center"
            }`}
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          {/* --- IF ANALYSIS RESULT EXISTS, RENDER CARD --- */}
          {msg.analysisResult ? (
            <AnalysisCard data={msg.analysisResult} />
          ) : (
            /* --- STANDARD MESSAGE BUBBLE --- */
            <div className={`flex items-start gap-4 max-w-[88%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>

              {/* Avatar */}
              <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center mt-1 border shadow-xl ${msg.role === "assistant"
                ? "bg-indigo-600/10 text-indigo-400 border-indigo-500/20 backdrop-blur-md"
                : "bg-gray-800 border-gray-700 text-white"
                }`}>
                {msg.role === "assistant" ? <Bot size={20} /> : <User size={20} />}
              </div>

              {/* Message Content Container */}
              <div className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                <div className={`
                      relative 
                      rounded-[24px] 
                      overflow-hidden
                      shadow-xl
                      transition-all duration-300
                      ${msg.role === "assistant"
                    ? "bg-[#1f2937]/50 backdrop-blur-xl text-white/90 border border-white/5 rounded-tl-none"
                    : "bg-indigo-600 text-white rounded-tr-none shadow-indigo-500/20 border border-indigo-400/20"
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

                  {/* Text content */}
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
          )}
        </div>
      ))}

      {/* --- TYPING INDICATOR --- */}
      {isTyping && (
        <div className="flex gap-4 items-start animate-in fade-in slide-in-from-left-4 duration-300">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/10 border border-indigo-500/20 backdrop-blur-md flex items-center justify-center text-indigo-400 shadow-xl">
            <Bot size={20} />
          </div>
          <div className="bg-[#1f2937]/50 backdrop-blur-xl border border-white/5 rounded-[24px] rounded-tl-none px-7 py-5 flex gap-1.5 shadow-xl">
            <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
            <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
            <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></span>
          </div>
        </div>
      )}

      {!isFocusMode && <div ref={scrollRef} className="h-12" />}
    </div>
  );
}