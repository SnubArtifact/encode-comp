import React, { useState, useEffect } from 'react';
import { Loader2, BrainCircuit, Search, Database, Sparkles } from 'lucide-react';

const LOADING_STEPS = [
    { icon: Search, text: "Scanning ingredients..." },
    { icon: Database, text: "Consulting nutrition database..." },
    { icon: BrainCircuit, text: "Analyzing conflicts & trade-offs..." },
    { icon: Sparkles, text: "Synthesizing final insights..." }
];

export default function LoadingStatus() {
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentStep((prev) => (prev + 1) % LOADING_STEPS.length);
        }, 1200); // Rotate every 1.2 seconds

        return () => clearInterval(interval);
    }, []);

    const StepIcon = LOADING_STEPS[currentStep].icon;

    return (
        <div className="flex items-center gap-4 bg-white dark:bg-[#1a1f2e] border border-indigo-100 dark:border-indigo-500/20 px-6 py-4 rounded-2xl shadow-lg shadow-indigo-500/5 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="relative">
                <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-20 animate-pulse" />
                <div className="bg-indigo-50 dark:bg-indigo-500/20 p-2 rounded-xl relative">
                    <Loader2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400 animate-spin" />
                </div>
            </div>

            <div className="flex flex-col min-w-[180px]">
                <span className="text-xs font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-wider mb-0.5">
                    AI Reasoning
                </span>
                <div className="flex items-center gap-2">
                    <StepIcon className="w-4 h-4 text-indigo-400 dark:text-indigo-300" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200 animate-in fade-in slide-in-from-right-2 duration-300 key={currentStep}">
                        {LOADING_STEPS[currentStep].text}
                    </span>
                </div>
            </div>
        </div>
    );
}
