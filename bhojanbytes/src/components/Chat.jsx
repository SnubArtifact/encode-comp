import { useState, useEffect } from "react";
import { Moon, Sun, Menu, Sparkles } from "lucide-react";
import MessageList from "./MessageList";
import MessageType from "./MessageType";
import HistorySidebar from "./HistorySidebar";
import LoadingStatus from "./LoadingStatus";
import { useDarkMode } from "../hooks/useDarkMode";
import { analyzeIngredients } from "../lib/analyzeIngredients";
import { extractTextFromImage } from "../lib/extractTextFromImage";
import LandingHeader from "./LandingHeader";

export default function Chat() {
  const [isDark, toggleDarkMode] = useDarkMode();
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [history, setHistory] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showResultMode, setShowResultMode] = useState(false);

  // Load history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("bhojanbytes_history");
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Save history whenever it changes
  useEffect(() => {
    localStorage.setItem("bhojanbytes_history", JSON.stringify(history));
  }, [history]);

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

      // --- Improved Co-pilot Response ---
      // We now pass the raw data to the renderer for the Rich UI Card
      const aiMsg = {
        role: "assistant",
        content: result.overall_assessment, // Fallback text for copy/accessibility
        analysisResult: result, // <--- New structured data field
        image: null,
      };

      setMessages([...updatedMessages, aiMsg]);
      setShowResultMode(true); // <--- Focus on result

      // --- Save to History ---
      const newHistoryItem = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        summary: ingredients.slice(0, 3).join(", ") + (ingredients.length > 3 ? "..." : ""),
        overall_assessment: result.overall_assessment,
        messages: [...updatedMessages, aiMsg] // Save the full conversation state or just the result?
        // Saving the result context is better for reloading
      };

      // Add to front, keep max 50
      setHistory(prev => [newHistoryItem, ...prev].slice(0, 50));

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

  const handleHistorySelect = (item) => {
    // Determine how to restore. For now, let's just set the messages to what was saved.
    // If the saved item has 'messages', use that.
    if (item.messages) {
      setMessages(item.messages);
    }
    setIsSidebarOpen(false);
  };

  const handleClearHistory = () => {
    if (confirm("Are you sure you want to clear all history?")) {
      setHistory([]);
    }
  };

  const startNewAnalysis = () => {
    setShowResultMode(false);
    setMessages([]);
  };

  return (
    <div className="flex h-screen w-full transition-colors duration-300 overflow-hidden relative bg-[#0b0f1a]">

      {/* --- SIDEBAR --- */}
      <HistorySidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        history={history}
        onSelect={handleHistorySelect}
        onClear={handleClearHistory}
      />

      {/* --- CONTENT WRAPPER --- */}
      <div className={`flex-1 flex flex-col h-full w-full transition-all duration-300 ${isSidebarOpen ? 'lg:pl-80' : ''}`}>

        {/* --- TECHNICAL GRID BACKGROUND --- */}
        <div
          className="absolute inset-0 z-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(#6366f1 1px, transparent 1px), 
                              linear-gradient(90deg, #6366f1 1px, transparent 1px)`,
            backgroundSize: '35px 35px'
          }}
        />

        {/* --- HEADER --- */}
        <header className="fixed top-0 w-full flex justify-between items-center p-5 z-40 pointer-events-none text-white">
          {/* Left: Sidebar Toggle */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className={`p-3 rounded-2xl bg-gray-900/40 backdrop-blur-xl border border-gray-700/50 shadow-lg pointer-events-auto transition-all active:scale-95 group hover:bg-gray-800 ${isSidebarOpen ? 'opacity-0 translate-x-[-20px]' : 'opacity-100 translate-x-0'}`}
          >
            <Menu className="w-5 h-5 text-gray-300 group-hover:text-indigo-400 transition-colors" />
          </button>
        </header>


        {/* --- MAIN AREA LOGIC --- */}
        {messages.length === 0 ? (

          /* === LANDING MODE (CENTERED) === */
          <main className="flex-1 w-full flex flex-col justify-center items-center z-10 px-4">
            <div className="w-full max-w-2xl transform transition-all duration-500">
              <LandingHeader />
              <div className="mt-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                <MessageType onSend={handleSend} />
              </div>



            </div>
          </main>

        ) : showResultMode ? (

          /* === RESULT FOCUS MODE (AI RESPONSE ONLY) === */
          <main className="flex-1 w-full flex flex-col items-center justify-start z-10 p-2 md:p-4 pt-4 md:pt-6 overflow-y-auto custom-scrollbar">
            <div className="w-full max-w-3xl animate-in zoom-in-95 fade-in duration-700 flex flex-col items-center">
              <div className="w-full">
                <MessageList messages={[messages[messages.length - 1]]} isFocusMode={true} />
              </div>

              <footer className="mt-2 flex justify-center pb-6 shrink-0">
                <button
                  onClick={startNewAnalysis}
                  className="px-6 py-2.5 rounded-[1.2rem] translate-y-13 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-[10px] tracking-widest shadow-[0_12px_24px_-8px_rgba(79,70,229,0.3)] transition-all hover:scale-105 active:scale-95 flex items-center gap-2 group"
                >
                  <Sparkles className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
                  NEW SCAN
                </button>
              </footer>
            </div>
          </main>

        ) : (

          /* === CHAT MODE (LIST + BOTTOM BAR) === */
          <>
            <main className="flex-1 w-full overflow-y-auto z-10 custom-scrollbar flex flex-col items-center pt-24 pb-4">
              <div className="w-full max-w-5xl flex-1 px-4 md:px-10">
                {/* Message List */}
                <MessageList messages={messages} isTyping={false} />

                {/* Loading Status */}
                {isTyping && (
                  <div className="w-full max-w-3xl mx-auto px-4 pb-8 -mt-8 animate-in fade-in slide-in-from-bottom-5">
                    <LoadingStatus />
                  </div>
                )}
              </div>
            </main>

            {/* Input Area (Docked Bottom) */}
            <footer className="w-full flex flex-col items-center shrink-0 pb-10 pt-4 z-20 bg-gradient-to-t from-[#0b0f1a] via-[#0b0f1a]/90 to-transparent">
              <div className="w-full max-w-4xl px-4">
                <MessageType onSend={handleSend} />
              </div>
            </footer>
          </>

        )}

      </div>

      {/* --- CUSTOM CSS FOR SCROLLBAR --- */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1e293b;
          border-radius: 10px;
          border: 2px solid transparent;
          background-clip: content-box;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #6366f1;
        }
      `}</style>
    </div >
  )
}
