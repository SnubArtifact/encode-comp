import React from 'react';
import { History, X, Clock, ChevronRight, Trash2 } from 'lucide-react';

export default function HistorySidebar({ isOpen, onClose, history, onSelect, onClear }) {
    return (
        <>
            {/* Backdrop for Mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar Panel */}
            <div className={`
        fixed top-0 left-0 h-full w-80 bg-white/95 dark:bg-[#0f1219]/95 backdrop-blur-xl
        border-r border-gray-200 dark:border-gray-800 z-50 transform transition-transform duration-300 ease-out shadow-2xl
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
                <div className="flex flex-col h-full bg-noise"> {/* Assuming a noise global class or just decorative */}

                    {/* Header */}
                    <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white dark:from-[#1a1f2e] dark:to-[#0f1219]">
                        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                            <History className="w-5 h-5" />
                            <h2 className="font-bold text-lg tracking-tight">History</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full text-gray-400 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* List */}
                    <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
                        {history.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-48 text-gray-400 dark:text-gray-600 opacity-70">
                                <Clock className="w-8 h-8 mb-2" />
                                <p className="text-sm font-medium">No past scans yet</p>
                            </div>
                        ) : (
                            history.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => onSelect(item)}
                                    className="w-full text-left p-3 rounded-xl hover:bg-indigo-50 dark:hover:bg-[#1a1f2e] border border-transparent hover:border-indigo-100 dark:hover:border-indigo-500/20 transition-all group relative overflow-hidden"
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="font-semibold text-gray-700 dark:text-gray-200 text-sm line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                            {item.summary || "Ingredient Scan"}
                                        </span>
                                        <span className="text-[10px] text-gray-400 font-mono mt-0.5">
                                            {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                                        {item.overall_assessment}
                                    </p>

                                    {/* Hover Indicator */}
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-400">
                                        <ChevronRight className="w-4 h-4" />
                                    </div>
                                </button>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    {history.length > 0 && (
                        <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#1a1f2e]/30">
                            <button
                                onClick={onClear}
                                className="w-full py-2.5 flex items-center justify-center gap-2 text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                                Clear History
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
