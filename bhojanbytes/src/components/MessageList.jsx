import { Bot, User, Copy, Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function MessageList({ messages, isTyping }) {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const scrollRef = useRef(null);
  const prevLen = useRef(messages.length);

  // Smooth scroll to bottom on new messages, but avoid jumping after assistant replies
  useEffect(() => {
    if (!scrollRef.current) return;

    // Find nearest scrollable parent (e.g., the main container with overflow-y-auto)
    const findScrollParent = (node) => {
      let el = node.parentElement;
      while (el) {
        const style = getComputedStyle(el);
        if (/auto|scroll/.test(style.overflowY)) return el;
        el = el.parentElement;
      }
      return document.scrollingElement || document.documentElement;
    };

    const container = findScrollParent(scrollRef.current);
    const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
    const SCROLL_THRESHOLD = 120; // px - only auto-scroll when user is near bottom
    const isAtBottom = distanceFromBottom <= SCROLL_THRESHOLD;

    // If this is the first message and it's from the user, don't auto-scroll (prevents initial jump)
    if (messages.length === 1 && messages[0].role === "user") {
      prevLen.current = messages.length;
      return;
    }

    // Only auto-scroll when user is already near the bottom (prevents forced jumps while reading history)
    if (messages.length !== prevLen.current || (isTyping && isAtBottom)) {
      if (isAtBottom) {
        // Align to bottom of the container smoothly
        container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
      }
    }

    prevLen.current = messages.length;
  }, [messages, isTyping]);

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto min-h-full">
      {messages.length === 0 ? (
        /* Empty state */
        <div className="h-[80vh] flex flex-col items-center justify-center text-center px-8 animate-in fade-in zoom-in duration-700">
          <div className="mb-8 w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-2xl shadow-indigo-500/30 animate-in zoom-in duration-500">
            <Bot size={36} className="text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-6xl font-black font-sohne bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 dark:from-white dark:via-indigo-200 dark:to-purple-200 bg-clip-text text-transparent mb-4 tracking-tight">
            Bhojanbytes
          </h1>
          <p className="text-gray-600 font-sohne dark:text-gray-400 text-xl max-w-lg leading-relaxed">
            Upload a photo of food labels for a{" "}
            <span className="text-indigo-600 dark:text-indigo-400 font-bold">
              deep reasoning analysis
            </span>
          </p>
        </div>
      ) : (
        /* Message feed */
        <div className="flex flex-col py-32 space-y-12 px-6">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex w-full animate-in slide-in-from-bottom-4 fade-in duration-500 fill-mode-both ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div
                className={`flex items-start gap-6 max-w-[82%] ${
                  msg.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {/* Avatar */}
                <div
                  className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform hover:scale-105 ${
                    msg.role === "assistant"
                      ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-indigo-500/30"
                      : "bg-gradient-to-br from-gray-800 to-gray-900 text-white shadow-gray-900/40"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <Bot size={22} strokeWidth={2.5} />
                  ) : (
                    <User size={20} strokeWidth={2.5} />
                  )}
                </div>

                {/* Message Content Container */}
                <div
                  className={`flex flex-col gap-3 ${
                    msg.role === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`
                    relative 
                    rounded-3xl 
                    overflow-hidden
                    shadow-xl
                    transition-all duration-300 hover:shadow-2xl
                    ${
                      msg.role === "assistant"
                        ? "bg-white dark:bg-[#1a1f2e] text-gray-800 dark:text-gray-100 border-2 border-gray-100 dark:border-gray-800/80 rounded-tl-lg shadow-gray-200/60 dark:shadow-none"
                        : "bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-tr-lg shadow-indigo-500/30"
                    }
                  `}
                  >
                    {/* Image Render */}
                    {msg.image && (
                      <div className="p-4 md:p-6">
                        <img
                          src={msg.image}
                          alt="Ingredient Scan"
                          className="max-w-xs md:max-w-md h-auto rounded-2xl object-cover border-2 border-black/10 dark:border-white/10 shadow-2xl"
                        />
                      </div>
                    )}

                    {/* Text content */}
                    <div className="px-4 md:px-6 py-4 md:py-6">
                      <p className="
  text-[16.5px]
  leading-[1.9]
  whitespace-pre-wrap
  break-words
  font-normal
  tracking-[0.01em]
">
  {msg.content}
</p>
                    </div>
                  </div>

                  {/* Message Actions */}
                  {msg.role === "assistant" && (
                    <div className="flex gap-3 ml-1">
                      <button
                        onClick={() => copyToClipboard(msg.content, index)}
                        className="p-2.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95"
                        title="Copy Response"
                      >
                        {copiedIndex === index ? (
                          <Check size={15} className="text-green-500" strokeWidth={2.5} />
                        ) : (
                          <Copy size={15} strokeWidth={2.5} />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex gap-5 items-start animate-in fade-in duration-300">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30 flex items-center justify-center text-white">
                <Bot size={22} strokeWidth={2.5} />
              </div>
              <div className="bg-white dark:bg-[#1a1f2e] border-2 border-gray-100 dark:border-gray-800/80 rounded-3xl rounded-tl-lg px-10 md:px-6 py-10 md:py-6 flex gap-2 shadow-xl shadow-gray-200/60 dark:shadow-none">
                <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-2.5 h-2.5 bg-pink-500 rounded-full animate-bounce"></span>
              </div>
            </div>
          )}

          <div ref={scrollRef} className="h-16" />
        </div>
      )}
    </div>
  );
}