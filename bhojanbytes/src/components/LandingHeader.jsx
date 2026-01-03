import { Sparkles, ShieldCheck, Zap } from "lucide-react";

export default function LandingHeader() {
    return (
        <div className="text-center space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 animate-in fade-in slide-in-from-top-4 duration-1000">
                <div className="relative">
                    <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
                    <div className="absolute inset-0 bg-indigo-400 blur-md opacity-20" />
                </div>
                <span className="text-[11px] font-black tracking-[0.2em] uppercase text-indigo-400/90">
                    AI-Powered Analysis
                </span>
            </div>

            {/* Hero Text */}
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white leading-[0.9] animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                REASONING <br />
                <span className="bg-gradient-to-r from-indigo-400 via-violet-200 to-indigo-400 bg-clip-text text-transparent italic">
                    ENGINE.
                </span>
            </h1>

            <p className="max-w-md mx-auto text-gray-400 text-sm md:text-base leading-relaxed font-medium px-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                Deep ingredient reasoning for modern nutrition. Scan ingredients, get absolute clarity.
            </p>
        </div>
    );
}
