import { useState } from "react";
import { Moon, Sun } from "lucide-react";
import MessageList from "./MessageList";
import MessageType from "./MessageType";
import { useDarkMode } from "../hooks/useDarkMode";
import { analyzeIngredients } from "../lib/analyzeIngredients";
import { extractTextFromImage } from "../lib/extractTextFromImage";

export default function Chat() {
  const [isDark, toggleDarkMode] = useDarkMode();
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  /**
   * handleSend now accepts two parameters. 
   * These come directly from the handleSubmit in MessageType.jsx
   */
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
    // --- Ingredient parsing (simple, conservative) ---
    const ingredients = textInput
      .split(",")
      .map(i => i.trim())
      .filter(Boolean);

    // --- Call your Groq reasoning engine ---
    const result = await analyzeIngredients(ingredients);

    // --- Co-pilot style synthesis (NOT raw JSON dump) ---
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
          "I couldn’t reliably infer the product’s alignment from this input. More context or clearer ingredient patterns may be needed.",
        image: null,
      },
    ]);
  } finally {
    setIsTyping(false);
  }
}


  return (
    <div className={`flex flex-col h-screen w-full transition-colors duration-300 overflow-hidden relative ${isDark ? 'bg-[#0b0f1a]' : 'bg-gray-50'}`}>
      
      {/* --- TECHNICAL GRID BACKGROUND --- */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.04] dark:opacity-[0.07] pointer-events-none" 
        style={{ 
          backgroundImage: `linear-gradient(${isDark ? '#6366f1' : '#000'} 1px, transparent 1px), 
                            linear-gradient(90deg, ${isDark ? '#6366f1' : '#000'} 1px, transparent 1px)`,
          backgroundSize: '35px 35px' 
        }}
      />

      {/* --- HEADER --- */}
      <header className="fixed top-0 w-full flex justify-end p-5 z-50 pointer-events-none">
        <button
          onClick={toggleDarkMode}
          className="p-3 rounded-2xl bg-white/70 dark:bg-gray-800/40 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl pointer-events-auto transition-transform active:scale-95"
        >
          {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
        </button>
      </header>

      {/* --- CHAT AREA --- */}
      <main className="flex-1 w-full overflow-y-auto z-10 custom-scrollbar flex flex-col items-center">
        <div className="w-full max-w-3xl flex-1">
          <MessageList messages={messages} isTyping={isTyping} />
        </div>
      </main>

      {/* --- INPUT AREA --- */}
      <footer className="w-full flex flex-col items-center shrink-0 pb-8 pt-4 z-20 bg-gradient-to-t from-gray-50 dark:from-[#0b0f1a] via-gray-50/90 dark:via-[#0b0f1a]/90 to-transparent">
        <div className="w-full max-w-4xl">
          {/* Passing the handleSend function to the input component */}
          <MessageType onSend={handleSend} />
          
          <p className="text-[11px] text-center text-gray-400 dark:text-gray-500 mt-4 tracking-widest font-medium uppercase select-none">
            Bhojanbytes AI-Native Nutrition Intelligence
          </p>
        </div>
      </footer>

      {/* --- CUSTOM CSS FOR SCROLLBAR --- */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${isDark ? '#1e293b' : '#e2e8f0'};
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #6366f1;
        }
      `}</style>
    </div>
  );
}