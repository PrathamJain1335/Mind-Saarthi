import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, Thermometer, Brain, TrendingUp, AlertTriangle, 
  Moon, Zap, ArrowUpRight, ShieldCheck, Heart
} from 'lucide-react';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, 
    Tooltip, ResponsiveContainer, BarChart, Bar, Cell,
    PieChart, Pie, Legend
} from 'recharts';

const DashboardPreview = () => {
    const [activeTab, setActiveTab] = useState('stress_prod');

    // Real-world mock data for the Preview
    const analyticsData = [
        { date: 'Mon', stress: 45, productivity: 85, sleep: 90, mood: 80 },
        { date: 'Tue', stress: 55, productivity: 70, sleep: 75, mood: 65 },
        { date: 'Wed', stress: 85, productivity: 40, sleep: 50, mood: 45 },
        { date: 'Thu', stress: 65, productivity: 60, sleep: 65, mood: 55 },
        { date: 'Fri', stress: 40, productivity: 90, sleep: 85, mood: 88 },
        { date: 'Sat', stress: 30, productivity: 95, sleep: 95, mood: 92 },
        { date: 'Sun', stress: 35, productivity: 88, sleep: 90, mood: 85 },
    ];

    const issueDist = [
        { name: 'Stress', value: 40 },
        { name: 'Anxiety', value: 30 },
        { name: 'Burnout', value: 20 },
        { name: 'Restless', value: 10 },
    ];

    const COLORS = ['#175dc5', '#ff1d24', '#0ea5e9', '#f59e0b'];

    const tabs = [
        { id: 'stress_prod', label: 'Stress vs Productivity', icon: Activity },
        { id: 'sleep_mood', label: 'Sleep vs Mental Health', icon: Moon },
        { id: 'issues', label: 'Issue Distribution', icon: Brain },
    ];

    return (
        <section id="dashboard" className="py-24 bg-white dark:bg-[#0f172a] relative overflow-hidden transition-colors duration-500">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-1/2 h-[600px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4"></div>
            <div className="absolute bottom-0 left-0 w-1/3 h-[400px] bg-accent/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4"></div>

            <div className="container mx-auto px-6 max-w-7xl relative z-10">
                <div className="text-center mb-16">
                    <motion.span 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-primary font-black uppercase tracking-[0.3em] text-[10px] mb-4 block"
                    >
                        Advanced Behavioral Analytics
                    </motion.span>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
                        From Conversation to <span className="text-primary italic">Actionable Insights</span>
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 max-w-3xl mx-auto text-lg font-medium leading-relaxed">
                        “We convert conversational data into real-world behavioral analytics to provide actionable insights, not just emotional feedback.”
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Navigation Sidebar */}
                    <div className="lg:col-span-3 flex flex-col gap-3">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-4 px-6 py-5 rounded-3xl transition-all text-left group ${
                                    activeTab === tab.id 
                                    ? 'bg-primary text-white shadow-2xl shadow-primary/30 scale-[1.02]' 
                                    : 'bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-white/5 hover:bg-primary/5'
                                }`}
                            >
                                <tab.icon size={20} strokeWidth={2.5} />
                                <span className="font-black text-[11px] uppercase tracking-widest">{tab.label}</span>
                            </button>
                        ))}

                        <div className="mt-6 p-8 glass rounded-[2.5rem] border border-primary/10 bg-slate-50/50 dark:bg-white/5">
                            <ShieldCheck className="text-primary mb-4" size={32} />
                            <h4 className="font-black text-[10px] uppercase tracking-widest opacity-40 mb-2">Clinical Grade</h4>
                            <p className="text-xs font-bold leading-relaxed opacity-70">HIPAA compliant architecture for sensitive behavioral data.</p>
                        </div>
                    </div>

                    {/* Chart Display Area */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="lg:col-span-9 bg-white dark:bg-slate-900 rounded-[3rem] p-8 md:p-12 shadow-[0_40px_100px_-24px_rgba(0,0,0,0.15)] dark:shadow-none border border-slate-100 dark:border-white/5 relative overflow-hidden"
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.4 }}
                                className="space-y-8"
                            >
                                {activeTab === 'stress_prod' && (
                                    <div className="space-y-8">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div>
                                                <h3 className="text-2xl font-black text-slate-900 dark:text-white">Stress vs Productivity</h3>
                                                <p className="text-sm font-bold text-slate-400">Behavioral Correlation Index</p>
                                            </div>
                                            <div className="bg-red-500/10 text-red-600 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                                <Zap size={14} /> Inverse Correlation Detected
                                            </div>
                                        </div>

                                        <div className="h-[350px] w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <AreaChart data={analyticsData}>
                                                    <defs>
                                                        <linearGradient id="prevStress" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="#ff1d24" stopOpacity={0.1}/>
                                                            <stop offset="95%" stopColor="#ff1d24" stopOpacity={0}/>
                                                        </linearGradient>
                                                        <linearGradient id="prevProd" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="#175dc5" stopOpacity={0.1}/>
                                                            <stop offset="95%" stopColor="#175dc5" stopOpacity={0}/>
                                                        </linearGradient>
                                                    </defs>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.05} />
                                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }} />
                                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }} />
                                                    <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)' }} />
                                                    <Area type="monotone" dataKey="stress" stroke="#ff1d24" strokeWidth={4} fill="url(#prevStress)" />
                                                    <Area type="monotone" dataKey="productivity" stroke="#175dc5" strokeWidth={4} fill="url(#prevProd)" />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </div>

                                        <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-[2rem] border border-slate-100 dark:border-white/10">
                                            <p className="text-primary font-black uppercase tracking-widest text-[10px] mb-2">Expert Insight</p>
                                            <p className="text-sm font-bold leading-relaxed italic opacity-80">
                                                "Higher stress levels correlate with lower productivity. Your patterns show that managing midweek pressure could improve your weekly achievement by 15%."
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'sleep_mood' && (
                                    <div className="space-y-8">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div>
                                                <h3 className="text-2xl font-black text-slate-900 dark:text-white">Sleep Quality vs mood</h3>
                                                <p className="text-sm font-bold text-slate-400">Circadian Mental Health Analysis</p>
                                            </div>
                                            <div className="bg-primary/10 text-primary px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest">
                                                High Precision Tracker
                                            </div>
                                        </div>

                                        <div className="h-[350px] w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={analyticsData}>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.05} />
                                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }} />
                                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }} />
                                                    <Tooltip contentStyle={{ borderRadius: '20px', border: 'none' }} />
                                                    <Bar dataKey="sleep" radius={[10, 10, 0, 0]}>
                                                        {analyticsData.map((e, i) => <Cell key={i} fill={e.sleep > 70 ? '#175dc5' : '#8b5cf6'} fillOpacity={0.8} />)}
                                                    </Bar>
                                                    <Bar dataKey="mood" radius={[10, 10, 0, 0]} fill="#ff1d24" fillOpacity={0.4} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>

                                        <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-[2rem] border border-slate-100 dark:border-white/10">
                                            <p className="text-primary font-black uppercase tracking-widest text-[10px] mb-2">Expert Insight</p>
                                            <p className="text-sm font-bold leading-relaxed italic opacity-80">
                                                "Poor sleep is negatively impacting your mental well-being. A 2-hour sleep deficit correlates with a 30% drop in overall mood stability."
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'issues' && (
                                    <div className="space-y-8">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div>
                                                <h3 className="text-2xl font-black text-slate-900 dark:text-white">Issue Distribution</h3>
                                                <p className="text-sm font-bold text-slate-400">Primary Stressor Breakdown</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                            <div className="h-[300px]">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <PieChart>
                                                        <Pie 
                                                            data={issueDist} 
                                                            innerRadius={80} 
                                                            outerRadius={120} 
                                                            paddingAngle={8} 
                                                            dataKey="value"
                                                            animationDuration={800}
                                                        >
                                                            {issueDist.map((entry, index) => (
                                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                            ))}
                                                        </Pie>
                                                        <Tooltip />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            </div>
                                            <div className="space-y-4">
                                                {issueDist.map((item, i) => (
                                                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                                                            <span className="font-bold text-sm tracking-tight">{item.name}</span>
                                                        </div>
                                                        <span className="font-black text-sm text-primary">{item.value}%</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-[2rem] border border-slate-100 dark:border-white/10">
                                            <p className="text-primary font-black uppercase tracking-widest text-[10px] mb-2">Expert Insight</p>
                                            <p className="text-sm font-bold leading-relaxed italic opacity-80">
                                                "Your primary trigger is workplace-related stress (40%). Anxiety levels are decreasing compared to your baseline analysis."
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </motion.div>
                </div>

                {/* Vertical Timeline UI Preview */}
                <div className="mt-20">
                    <div className="text-center mb-12">
                        <h3 className="text-2xl font-black tracking-tight">Safety Intervention <span className="text-accent underline decoration-4 underline-offset-4 decoration-accent/30">Timeline</span></h3>
                    </div>
                    
                    <div className="max-w-4xl mx-auto space-y-8 relative pb-20">
                         <div className="absolute left-1/2 -ml-px h-[80%] w-px bg-slate-200 dark:bg-white/10 top-0" />
                         
                         <motion.div 
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="relative flex items-center justify-between"
                         >
                            <div className="w-[45%] text-right p-6 glass-card rounded-[2rem] border-accent/20">
                                <span className="text-[10px] font-black uppercase tracking-widest text-accent block mb-2">12 Mar, 10:30 PM</span>
                                <p className="text-sm font-bold opacity-80 italic">"Detected high distress patterns in conversational tone."</p>
                                <span className="inline-block mt-4 px-3 py-1 bg-accent/10 text-accent text-[8px] font-black rounded-lg">HIGH RISK DETECTED</span>
                            </div>
                            <div className="absolute left-1/2 -ml-3 w-6 h-6 rounded-full bg-accent animate-pulse shadow-xl shadow-accent/50 z-10 border-4 border-white dark:border-slate-900" />
                            <div className="w-[45%]" />
                         </motion.div>

                         <motion.div 
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="relative flex items-center justify-reverse flex-row-reverse"
                         >
                            <div className="w-[45%] text-left p-6 glass-card rounded-[2rem] border-primary/20">
                                <span className="text-[10px] font-black uppercase tracking-widest text-primary block mb-2">12 Mar, 10:32 PM</span>
                                <p className="text-sm font-bold opacity-80">Crisis notification triggered to emergency contact.</p>
                                <span className="inline-block mt-4 px-3 py-1 bg-primary/10 text-primary text-[8px] font-black rounded-lg">ALERT SENT</span>
                            </div>
                            <div className="absolute left-1/2 -ml-3 w-6 h-6 rounded-full bg-primary shadow-xl shadow-primary/50 z-10 border-4 border-white dark:border-slate-900" />
                            <div className="w-[45%]" />
                         </motion.div>

                         <motion.div 
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="relative flex items-center justify-between"
                         >
                            <div className="w-[45%] text-right p-6 glass-card rounded-[2rem] border-emerald-500/20">
                                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 block mb-2">12 Mar, 10:35 PM</span>
                                <p className="text-sm font-bold opacity-80">Nearest hospital suggestion provided with GPS routing.</p>
                                <span className="inline-block mt-4 px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[8px] font-black rounded-lg">HOSPITAL SUGGESTED</span>
                            </div>
                            <div className="absolute left-1/2 -ml-3 w-6 h-6 rounded-full bg-emerald-500 shadow-xl shadow-emerald-500/50 z-10 border-4 border-white dark:border-slate-900" />
                            <div className="w-[45%]" />
                         </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DashboardPreview;
