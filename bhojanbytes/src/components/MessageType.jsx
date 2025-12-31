import { useState, useRef, useEffect } from "react";
import { Paperclip, ArrowUp, X } from "lucide-react";

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
    <div className="w-full px-6 pb-10">
      <div className="relative max-w-4xl mx-auto flex items-end gap-4" onSubmit={handleSubmit}>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />

        {/* Attachment button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="mb-1.5 p-4 rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-[#1a1f2e] dark:to-[#151924] border-2 border-gray-200 dark:border-gray-800 text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300 dark:hover:border-indigo-500/40 transition-all flex-shrink-0 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
          title="Attach image"
        >
          <Paperclip className="w-6 h-6 rotate-45" strokeWidth={2.5} />
        </button>

        {/* Main input container */}
        <div className="flex-1 flex flex-col bg-gradient-to-br from-white to-gray-50 dark:from-[#1a1f2e] dark:to-[#151924] border-2 border-gray-200 dark:border-gray-800 rounded-[32px] overflow-hidden focus-within:border-indigo-400 dark:focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10 dark:focus-within:ring-indigo-500/20 transition-all shadow-xl hover:shadow-2xl">
          
          {/* Image preview */}
          {imagePreview && (
            <div className="px-6 pt-5 animate-in fade-in zoom-in duration-300">
              <div className="relative inline-block group">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity"></div>
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="relative h-28 w-28 object-cover rounded-2xl border-2 border-indigo-500/30 shadow-lg" 
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-full p-1.5 shadow-xl hover:scale-110 active:scale-95 transition-transform"
                >
                  <X size={16} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          )}

          {/* Textarea */}
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
            className="w-full bg-transparent border-none focus:ring-0 text-[16px] py-5 px-7 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 resize-none max-h-[300px] overflow-y-auto leading-[1.6] font-medium"
          />
        </div>

        {/* Send button */}
        <button
          type="submit"
          disabled={!input.trim() && !imagePreview}
          className={`mb-1.5 p-4 rounded-2xl transition-all flex-shrink-0 shadow-lg ${
            input.trim() || imagePreview
              ? "bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-indigo-500/40 hover:shadow-indigo-500/50 hover:scale-110 active:scale-95 hover:from-indigo-500 hover:to-purple-500" 
              : "bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900 text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-60"
          }`}
          title={input.trim() || imagePreview ? "Send message" : "Type a message or attach an image"}
        >
          <ArrowUp className="w-6 h-6 stroke-[3px]" />
        </button>
      </div>
    </div>
  );
}