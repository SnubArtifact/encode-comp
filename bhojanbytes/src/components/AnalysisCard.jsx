import React, { useEffect, useState } from 'react';
import { CheckCircle2, AlertTriangle, Info, ArrowRight, Activity, ShieldCheck, Zap, Leaf, HeartPulse, Scale, AlertOctagon, Sparkles } from 'lucide-react';

const IntentIcon = ({ label }) => {
    switch (label) {
        case 'muscle_building': return <Activity className="w-5 h-5 text-blue-400" />;
        case 'fat_loss': return <Scale className="w-5 h-5 text-teal-400" />;
        case 'allergy_avoidance': return <ShieldCheck className="w-5 h-5 text-amber-400" />;
        case 'energy_focus': return <Zap className="w-5 h-5 text-yellow-400" />;
        case 'dietary_constraint': return <Leaf className="w-5 h-5 text-emerald-400" />;
        case 'general_health': return <HeartPulse className="w-5 h-5 text-rose-400" />;
        default: return <Info className="w-5 h-5 text-indigo-400" />;
    }
};

const RiskBadge = ({ level }) => {
    const colors = {
        high: 'text-rose-400 bg-rose-500/10 border-rose-500/20 shadow-[0_0_12px_rgba(244,63,94,0.15)]',
        medium: 'text-amber-400 bg-amber-500/10 border-amber-500/20 shadow-[0_0_12px_rgba(245,158,11,0.15)]',
        low: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
    };
    return (
        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border backdrop-blur-md ${colors[level] || colors.low}`}>
            {level} Risk
        </span>
    );
};

export default function AnalysisCard({ data }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    if (!data || !data.inferred_intent) return null;

    const { inferred_intent, primary_conflicts, secondary_tradeoffs, overall_assessment, uncertainty_notes } = data;

    return (
        <div className={`w-full scale-105 translate-y-4 max-w-3xl mx-auto !my-0 bg-[#0f172a]/70 backdrop-blur-3xl rounded-[1.2rem] overflow-hidden shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] border border-white/10  transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-6 opacity-0 scale-[0.98]'}`}>

            {/* --- HEADER --- */}
            <div className="animate-gradient bg-gradient-to-br from-indigo-900/40 via-violet-900/40 to-indigo-900/40 !p-3 lg:!p-5 relative overflow-hidden border-b border-white/5">
                {/* Advanced Light leak effects */}
                <div className="absolute top-[-40%] left-[-10%] w-[80%] h-[150%] bg-indigo-500/10 blur-[140px] rounded-full rotate-12 pointer-events-none mix-blend-screen" />
                <div className="absolute bottom-[-40%] right-[-10%] w-[80%] h-[150%] bg-violet-600/10 blur-[140px] rounded-full -rotate-12 pointer-events-none mix-blend-screen" />

                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-2 relative z-10 text-white">
                    <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                            <div className="relative group">
                                <Sparkles className="w-4 h-4 text-indigo-300 group-hover:scale-125 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-indigo-400 blur-lg opacity-40 animate-pulse" />
                            </div>
                            <h2 className="text-[8px] font-black tracking-[0.3em] uppercase text-indigo-300/80">Intelligence Engine</h2>
                        </div>
                        <p className="text-base md:text-lg lg:text-xl font-bold leading-tight text-white/95  italic tracking-tight underline decoration-indigo-500/30 underline-offset-[5px]">
                            "{overall_assessment}"
                        </p>
                    </div>


                </div>
            </div>

            {/* --- MAIN GRID --- */}
            <div className="!p-3 lg:!p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-4">

                {/* COLUMN 1: INTENT & RESULTS */}
                <div className="space-y-3 stagger-in stagger-1">
                    <div className="flex items-center gap-2 group cursor-default">
                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full group-hover:scale-150 transition-transform shadow-[0_0_6px_rgba(99,102,241,0.4)]" />
                        <h3 className="text-indigo-100/90 font-black text-[9px] tracking-[0.15em] uppercase">Verdict</h3>
                    </div>

                    <div className="bg-white/[0.03] backdrop-blur-sm rounded-[0.8rem] !p-3 border border-white/[0.08] hover:bg-white/[0.06] transition-all duration-500 hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] group/item border-t-white/20">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="p-1.5 bg-indigo-500/10 rounded-[0.6rem] border border-indigo-500/20 group-hover/item:rotate-12 transition-transform duration-500">
                                <IntentIcon label={inferred_intent.label} />
                            </div>
                            <span className="font-black text-white text-sm capitalize">{inferred_intent.label.replace(/_/g, " ")}</span>
                        </div>

                        <ul className="space-y-2">
                            {inferred_intent.reasoning.map((reason, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-[11px] text-white/50 leading-snug group/li cursor-default">
                                    <div className="mt-1 w-1 h-1 rounded-full bg-indigo-500/30 group-hover/li:bg-indigo-400 group-hover/li:scale-125 transition-all shrink-0" />
                                    <span className="group-hover/li:text-white/90 transition-colors">{reason}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* COLUMN 2: CRITICAL ALERTS */}
                <div className="space-y-3 stagger-in stagger-2">
                    <div className="flex items-center gap-2 group cursor-default">
                        <div className="w-1.5 h-1.5 bg-rose-500 rounded-full group-hover:scale-150 transition-transform shadow-[0_0_6px_rgba(244,63,94,0.4)]" />
                        <h3 className="text-indigo-100/90 font-black text-[9px] tracking-[0.15em] uppercase">Flags</h3>
                    </div>

                    <div className="flex flex-col gap-3 h-full">
                        {primary_conflicts.length > 0 ? (
                            primary_conflicts.map((conflict, idx) => (
                                <div key={idx} className="bg-rose-500/[0.03] rounded-[0.8rem] !p-3 border border-rose-500/10 border-l-2 border-l-rose-500/60 hover:bg-rose-500/[0.06] transition-all duration-500 group/alert">
                                    <div className="flex justify-between items-center mb-1.5">
                                        <span className="font-bold text-white text-xs capitalize">{conflict.ingredient}</span>
                                        <RiskBadge level={conflict.risk_level} />
                                    </div>
                                    <p className="text-[9px] text-white/40 leading-snug font-medium group-hover/alert:text-white/70 transition-colors">
                                        {conflict.why_it_matters}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <div className="bg-emerald-500/[0.02] rounded-[1rem] !p-4 border border-emerald-500/10 flex flex-col items-center justify-center text-center space-y-2 group">
                                <div className="relative">
                                    <ShieldCheck className="w-6 h-6 text-emerald-500 opacity-30 group-hover:scale-110 transition-transform group-hover:rotate-6" />
                                    <div className="absolute inset-0 bg-emerald-500 blur-2xl opacity-10 animate-pulse" />
                                </div>
                                <p className="text-[9px] text-emerald-400/80 font-bold tracking-wide">Goal Aligned</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* COLUMN 3: TRADEOFFS */}
                <div className="space-y-3 stagger-in stagger-3">
                    <div className="flex items-center gap-2 group cursor-default">
                        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full group-hover:scale-150 transition-transform shadow-[0_0_6px_rgba(245,158,11,0.4)]" />
                        <h3 className="text-indigo-100/90 font-black text-[9px] tracking-[0.15em] uppercase">Notes</h3>
                    </div>

                    <div className="flex flex-col gap-3 h-full">
                        {secondary_tradeoffs.length > 0 ? (
                            secondary_tradeoffs.map((tradeoff, idx) => (
                                <div key={idx} className="bg-white/[0.02] rounded-[0.8rem] !p-3 border border-white/[0.06] hover:bg-white/[0.06] transition-all duration-500 cursor-default group/trade">
                                    <span className="font-bold text-white block mb-1 capitalize text-xs tracking-tight group-hover/trade:text-amber-200 transition-colors">{tradeoff.ingredient}</span>
                                    <p className="text-[9px] text-white/40 leading-snug group-hover/trade:text-white/70 transition-colors font-medium">
                                        {tradeoff.explanation}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <div className="bg-white/5 rounded-[1rem] !p-4 border border-white/10 flex flex-col items-center justify-center text-center opacity-30">
                                <Info className="w-4 h-4 text-white/40 mb-1" />
                                <p className="text-[10px] text-white/70 font-bold">Standard</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>

            {/* --- FOOTER --- */}
            <div className="!px-3 lg:!px-5 !py-2.5 bg-white/[0.03] border-t border-white/5 flex flex-col lg:flex-row justify-between items-center gap-3 relative overflow-hidden">
                <div className="absolute inset-0 bg-indigo-600/5 opacity-50 blur-3xl pointer-events-none" />

                <div className="flex flex-col lg:flex-row items-center gap-3 relative z-10 w-full">
                    <div className={`flex items-center gap-2 !px-3 !py-1.5 rounded-full border backdrop-blur-md transition-all duration-700 ${uncertainty_notes.length > 0 ? 'bg-amber-500/10 border-amber-500/20' : 'bg-emerald-500/10 border-emerald-500/20'}`}>
                        {uncertainty_notes.length > 0 ? <AlertOctagon className="w-3 h-3 text-amber-500" /> : <ShieldCheck className="w-3 h-3 text-emerald-500" />}
                        <span className={`text-[9px] font-black uppercase tracking-[0.1em] ${uncertainty_notes.length > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                            {uncertainty_notes.length > 0 ? `${uncertainty_notes.length} Uncertainties` : 'Verified'}
                        </span>
                    </div>

                    {uncertainty_notes.length > 0 && (
                        <div className="flex items-center gap-2 relative z-10">
                            <div className="w-0.5 h-2 bg-amber-500/50 rounded-full" />
                            <p className="text-[8px] text-white/30 leading-none font-medium italic tracking-wide">
                                {uncertainty_notes.join(" • ")}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
