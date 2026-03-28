import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, Sparkles, Wind, BookOpen, 
  Moon, Sun, Activity, Heart, Shield, Download
} from 'lucide-react';

const RecoveryPlan = ({ plan }) => {
    if (!plan) return null;

    const sections = [
        { title: "Immediate Action", icon: <Sparkles size={20} />, data: plan.immediate_actions || [], color: "text-primary" },
        { title: "Mindfulness", icon: <Wind size={20} />, data: plan.mindfulness_exercises || [], color: "text-emerald-500" },
        { title: "Journaling", icon: <BookOpen size={20} />, data: plan.journaling_prompts || [], color: "text-fuchsia-500" },
        { title: "Self Care", icon: <Heart size={20} />, data: plan.self_care_tips || [], color: "text-accent" }
    ];

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card overflow-hidden my-6 border-primary/20"
        >
            <div className="bg-primary/10 dark:bg-primary/20 px-6 py-4 border-b border-primary/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Shield className="text-primary" size={24} />
                    <h3 className="text-xl font-bold tracking-tight">Your Personal Recovery Plan</h3>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest bg-white/50 dark:bg-black/20 px-2 py-1 rounded-lg">AI Generated</span>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {sections.map((section, idx) => (
                    <motion.div 
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="space-y-4"
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <span className={section.color}>{section.icon}</span>
                            <h4 className="font-bold text-sm uppercase tracking-wider opacity-80">{section.title}</h4>
                        </div>
                        <div className="space-y-2">
                            {section.data.length > 0 ? section.data.map((item, i) => (
                                <motion.div 
                                    key={i} 
                                    whileHover={{ x: 5 }}
                                    className="flex items-start gap-3 p-3 bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm"
                                >
                                    <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-500" size={16} />
                                    <p className="text-sm leading-relaxed">{item}</p>
                                </motion.div>
                            )) : (
                                <p className="text-sm text-slate-500 italic">No specific tasks recommended yet.</p>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
            
            <div className="p-6 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-800">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                        <Activity size={14} />
                        Follow this plan for at least 24 hours.
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="btn-outline py-2 px-4 text-xs h-10">
                            <Download size={14} /> Export PDF
                        </button>
                        <button className="btn-primary py-2 px-6 text-sm h-10">
                            Track Progress
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default RecoveryPlan;
