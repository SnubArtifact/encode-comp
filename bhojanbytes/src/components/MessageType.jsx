import { useState, useRef, useEffect } from "react";
import { Paperclip, ArrowUp, X, Sparkles, ImageIcon } from "lucide-react";

export default function MessageType({ onSend }) {
  const [input, setInput] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 300)}px`;
    }
  }, [input, imagePreview]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  function handleSubmit(e) {
    e.preventDefault();
    if (!input.trim() && !imagePreview) return;

    // Pass both text and image to the parent
    onSend(input, imagePreview);

    setInput("");
    setImagePreview(null);
  }

  return (
    <div className="w-full px-4 pb-8">
      <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto flex items-end gap-3">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />

        {/* 1. ATTACHMENT BUTTON */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="mb-1 p-2.5 rounded-xl bg-white dark:bg-[#1a1f2e] border border-gray-200 dark:border-gray-800 text-gray-500 hover:text-indigo-500 transition-all flex-shrink-0 shadow-sm"
        >
          <Paperclip className="w-5 h-5 rotate-45" />
        </button>

        {/* 2. THE MAIN INPUT CONTAINER */}
        <div className="flex-1 flex flex-col bg-white dark:bg-[#1a1f2e] border-2 border-gray-100 dark:border-gray-800 rounded-[22px] overflow-hidden focus-within:border-indigo-500/40 focus-within:ring-4 focus-within:ring-indigo-500/5 transition-all shadow-sm">

          {/* IMAGE PREVIEW AREA */}
          {imagePreview && (
            <div className="px-4 pt-4 animate-in fade-in zoom-in duration-300">
              <div className="relative inline-block group">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-24 w-24 object-cover rounded-xl border-2 border-indigo-500/20"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-gray-900 text-white rounded-full p-1 shadow-lg hover:bg-red-500 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          )}

          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Describe the product or upload ingredients..."
            className="w-full bg-transparent border-none focus:ring-0 text-[15px] py-3 px-5 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 resize-none max-h-[300px] overflow-y-auto leading-relaxed"
          />
        </div>

        {/* 3. SEND BUTTON */}
        <button
          type="submit"
          disabled={!input.trim() && !imagePreview}
          className={`mb-1 p-2.5 rounded-xl transition-all flex-shrink-0 ${input.trim() || imagePreview
            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 scale-105"
            : "bg-gray-100 dark:bg-gray-800 text-gray-300 dark:text-gray-600 cursor-not-allowed"
            }`}
        >
          <ArrowUp className="w-5 h-5 stroke-[3px]" />
        </button>
      </form>
    </div>
  );
}