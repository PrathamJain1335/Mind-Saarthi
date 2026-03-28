import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Brain, Heart, Sparkles, MessageSquare, Briefcase } from 'lucide-react';
import { useTheme } from '../ThemeContext';

const WebTabPreview = () => {
    const { darkMode } = useTheme();
    const [messages, setMessages] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);

    const scenario = [
        { type: 'user', text: "I've been feeling overwhelmed and anxious lately...", delay: 1000 },
        { type: 'ai', text: "I hear you. Let's explore those feelings in a safe space. Can you tell me when they feel strongest?", delay: 2000 },
        { type: 'user', text: "Mostly at night, thinking about work and everything I need to do.", delay: 1500 },
        { type: 'ai', text: "That's a common trigger. Our assessment shows a 'Moderate' stress level. I'll summarize this for your doctor while keeping our session confidential.", delay: 2500 }
    ];

    useEffect(() => {
        if (currentStep < scenario.length) {
            const timer = setTimeout(() => {
                setMessages(prev => [...prev, scenario[currentStep]]);
                setCurrentStep(prev => prev + 1);
            }, scenario[currentStep].delay);
            return () => clearTimeout(timer);
        } else {
            const restartTimer = setTimeout(() => {
                setMessages([]);
                setCurrentStep(0);
            }, 5000);
            return () => clearTimeout(restartTimer);
        }
    }, [currentStep]);

    return (
        <div className="relative group max-w-4xl mx-auto">
            {/* Background Glow */}
            <div className={`absolute -inset-4 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-[3rem] blur-3xl opacity-20 group-hover:opacity-40 transition duration-1000 animate-pulse-slow -z-10`} />
            
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className={`relative rounded-[2.5rem] border border-white/20 dark:border-primary/5 overflow-hidden shadow-2xl flex flex-col h-[500px] backdrop-blur-xl transition-colors duration-500 ${darkMode ? 'bg-slate-950/80' : 'bg-white/80'}`}
            >
                {/* Browser Header */}
                <div className={`h-12 border-b flex items-center px-6 justify-between shrink-0 transition-colors duration-500 ${darkMode ? 'bg-slate-900/50 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                        <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                        <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                    </div>
                    <div className={`flex items-center gap-2 px-4 py-1.5 rounded-xl border text-[10px] font-bold tracking-tight transition-colors duration-500 ${darkMode ? 'bg-white/5 border-white/10 text-slate-400' : 'bg-white border-slate-200 text-slate-500'}`}>
                        <Shield size={12} className="text-emerald-500" />
                        mindsaarthi.ai/secure-session
                    </div>
                    <div className="w-12"></div>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* Mock Sidebar */}
                    <div className={`w-48 border-r p-5 space-y-6 hidden md:block transition-colors duration-500 ${darkMode ? 'bg-slate-900/30 border-white/5' : 'bg-slate-50/50 border-slate-100'}`}>
                        <div className={`h-8 w-full rounded-xl animate-pulse ${darkMode ? 'bg-white/5' : 'bg-primary/5'}`}></div>
                        <div className="space-y-4">
                            {[Brain, Heart, MessageSquare, Briefcase].map((Icon, i) => (
                                <div key={i} className={`flex items-center gap-3 p-2.5 rounded-xl border transition-colors duration-500 ${darkMode ? 'bg-white/5 border-white/5 text-primary' : 'bg-white border-slate-100 text-primary'}`}>
                                    <Icon size={16} />
                                    <div className={`h-1.5 w-16 rounded-full ${darkMode ? 'bg-white/10' : 'bg-slate-200'}`}></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 flex flex-col p-6">
                        <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                            <AnimatePresence mode="popLayout">
                                {messages.map((msg, i) => (
                                    <motion.div
                                        key={i + msg.text}
                                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`max-w-[85%] px-5 py-3.5 rounded-2xl text-sm font-medium shadow-sm ${
                                            msg.type === 'user' 
                                            ? 'bg-primary text-white rounded-tr-none' 
                                            : `border rounded-tl-none ${darkMode ? 'bg-white/5 border-white/10 text-slate-300' : 'bg-white border-slate-100 text-slate-600'}`
                                        }`}>
                                            {msg.text}
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            {currentStep < scenario.length && (
                                <div className="flex gap-2 p-2 px-4 rounded-full glass w-fit">
                                    <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.4, 1, 0.4] }} className="w-2 h-2 bg-primary rounded-full"></motion.div>
                                    <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.4, 1, 0.4] }} transition={{ delay: 0.2 }} className="w-2 h-2 bg-primary rounded-full"></motion.div>
                                    <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.4, 1, 0.4] }} transition={{ delay: 0.4 }} className="w-2 h-2 bg-primary rounded-full"></motion.div>
                                </div>
                            )}
                        </div>

                        {/* Input Mockup */}
                        <div className={`mt-6 pt-6 border-t flex gap-3 transition-colors duration-500 ${darkMode ? 'border-white/5' : 'border-slate-100'}`}>
                            <div className={`flex-1 h-12 rounded-2xl border px-5 flex items-center text-sm font-medium transition-colors duration-500 ${darkMode ? 'bg-white/5 border-white/10 text-slate-500' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                                Type your thoughts...
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
                                <Sparkles size={18} />
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Overlays */}
            <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-6 -right-12 glass p-4 rounded-2xl border-primary/20 shadow-2xl hidden lg:block"
            >
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-xs font-black uppercase tracking-widest text-emerald-500">Live Encryption</span>
                </div>
            </motion.div>

            <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute -bottom-10 -left-12 glass p-5 rounded-3xl border-primary/20 shadow-2xl hidden lg:block max-w-[220px]"
            >
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 bg-primary/10 rounded-xl">
                        <Brain size={20} className="text-primary" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Emotion Context</span>
                </div>
                <div className="space-y-2">
                    <div className={`h-1.5 w-full rounded-full overflow-hidden ${darkMode ? 'bg-white/10' : 'bg-slate-100'}`}>
                         <motion.div animate={{ width: ["20%", "80%", "40%"] }} transition={{ duration: 8, repeat: Infinity }} className="h-full bg-primary" />
                    </div>
                    <div className={`h-1.5 w-3/4 rounded-full overflow-hidden ${darkMode ? 'bg-white/10' : 'bg-slate-100'}`}>
                         <motion.div animate={{ width: ["40%", "20%", "60%"] }} transition={{ duration: 6, repeat: Infinity }} className="h-full bg-accent" />
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default WebTabPreview;
