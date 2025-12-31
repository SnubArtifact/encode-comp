import { useState } from "react";
import { Moon, Sun, Sparkles } from "lucide-react";
import MessageList from "./MessageList";
import MessageType from "./MessageType";
import { useDarkMode } from "../hooks/useDarkMode";
import { analyzeIngredients } from "../lib/analyzeIngredients";
import { extractTextFromImage } from "../lib/extractTextFromImage";

export default function Chat() {
  const [isDark, toggleDarkMode] = useDarkMode();
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  
  async function handleSend(userInput, imageAsset = null) {
    if (!userInput.trim() && !imageAsset) return;

    const userMsg = {
      role: "user",
      content: userInput,
      image: imageAsset,
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsTyping(true);
    
    let textInput = userInput;

    // If image is present, extract text
    if (imageAsset) {
      setIsTyping(true);
      const extractedText = await extractTextFromImage(imageAsset);
      textInput = extractedText;
    }

    try {
      // Ingredient parsing (simple, conservative) 
      const ingredients = textInput
        .split(",")
        .map(i => i.trim())
        .filter(Boolean);

      // Calling groq
      const result = await analyzeIngredients(ingredients);

      // JSON ---
      const aiContent = `
Inferred intent: ${result.inferred_intent.label}
Confidence: ${(result.inferred_intent.confidence * 100).toFixed(0)}%

${result.overall_assessment}

${
  result.primary_conflicts.length
    ? `Alignment frictions:\n• ${result.primary_conflicts
        .map(c => c.why_it_matters)
        .join("\n• ")}`
    : ""
}

${
  result.secondary_tradeoffs.length
    ? `\nTradeoffs:\n• ${result.secondary_tradeoffs
        .map(t => t.explanation)
        .join("\n• ")}`
    : ""
}

${
  result.uncertainty_notes.length
    ? `\nUncertainty:\n• ${result.uncertainty_notes.join("\n• ")}`
    : ""
}
`.trim();

      const aiMsg = {
        role: "assistant",
        content: aiContent,
        image: null,
      };

      setMessages([...updatedMessages, aiMsg]);
    } catch (err) {
      console.error(err);

      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content:
            "I couldn't reliably infer the product's alignment from this input. More context or clearer ingredient patterns may be needed.",
          image: null,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  }

  return (
    <div className={`flex flex-col h-screen w-full transition-colors duration-500 overflow-hidden relative ${isDark ? 'bg-gradient-to-br from-[#0a0e1a] via-[#0b0f1a] to-[#050812]' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'}`}>
      
      {/* Animated gradient orbs background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className={`absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 animate-pulse ${isDark ? 'bg-indigo-600' : 'bg-indigo-400'}`} style={{ animationDuration: '4s' }} />
        <div className={`absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 animate-pulse ${isDark ? 'bg-purple-600' : 'bg-purple-400'}`} style={{ animationDuration: '6s', animationDelay: '1s' }} />
        <div className={`absolute top-1/2 left-1/2 w-96 h-96 rounded-full blur-3xl opacity-10 animate-pulse ${isDark ? 'bg-pink-600' : 'bg-pink-400'}`} style={{ animationDuration: '5s', animationDelay: '2s' }} />
      </div>

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.06] pointer-events-none" 
        style={{ 
          backgroundImage: `linear-gradient(${isDark ? '#6366f1' : '#4f46e5'} 1px, transparent 1px), 
                            linear-gradient(90deg, ${isDark ? '#6366f1' : '#4f46e5'} 1px, transparent 1px)`,
          backgroundSize: '40px 40px' 
        }}
      />

      {/* Header with dark mode toggle */}
      <header className="fixed top-0 w-full flex justify-between items-center px-6 py-5 z-50 pointer-events-none">
        {/* Logo area */}
        <div className="flex items-center gap-3 pointer-events-auto">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-xl shadow-indigo-500/30">
            <Sparkles className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
            Bhojanbytes
          </span>
        </div>

        {/* Dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-3.5 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-2xl border-2 border-gray-200/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl pointer-events-auto transition-all duration-300 hover:scale-110 active:scale-95 group"
        >
          {isDark ? (
            <Sun className="w-5 h-5 text-amber-500 group-hover:rotate-180 transition-transform duration-500" strokeWidth={2.5} />
          ) : (
            <Moon className="w-5 h-5 text-indigo-600 group-hover:rotate-12 transition-transform duration-300" strokeWidth={2.5} />
          )}
        </button>
      </header>

      {/* Main chat area */}
      <main className="flex-1 w-full overflow-y-auto z-10 custom-scrollbar flex flex-col items-center pt-20">
        <div className="w-full max-w-4xl flex-1">
          <MessageList messages={messages} isTyping={isTyping} />
        </div>
      </main>

      {/* Input area with gradient fade */}
      <footer className="w-full flex flex-col items-center shrink-0 pb-10 pt-6 z-20 relative">
        {/* Gradient fade overlay */}
        <div className={`absolute inset-x-0 top-0 h-32 pointer-events-none ${isDark ? 'bg-gradient-to-t from-[#0b0f1a] via-[#0b0f1a]/95 to-transparent' : 'bg-gradient-to-t from-white via-white/95 to-transparent'}`} />
        
        <div className="w-full max-w-4xl relative z-10">
          <MessageType onSend={handleSend} />
          
          {/* Footer text with decorative elements */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <div className="h-px w-12 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent" />
            <p className="text-[11px] text-center text-gray-500 dark:text-gray-500 tracking-[0.15em] font-semibold uppercase select-none flex items-center gap-2">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
              AI-Native Nutrition Intelligence
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" style={{ animationDelay: '0.5s' }} />
            </p>
            <div className="h-px w-12 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent" />
          </div>
        </div>
      </footer>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${isDark ? 'rgba(99, 102, 241, 0.3)' : 'rgba(226, 232, 240, 0.8)'};
          border-radius: 10px;
          transition: background 0.3s;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${isDark ? 'rgba(99, 102, 241, 0.6)' : 'rgba(99, 102, 241, 0.8)'};
        }
      `}</style>
    </div>
  );
}