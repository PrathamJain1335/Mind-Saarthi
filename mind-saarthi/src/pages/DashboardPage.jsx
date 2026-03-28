import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../AuthContext';
import { useTheme } from '../ThemeContext';
import { useNavigate, Link } from 'react-router-dom';
import { 
  LogOut, Activity, Brain, TrendingUp, Calendar, 
  MessageSquare, ShieldAlert, Heart, ChevronRight,
  LayoutDashboard, Settings, User, Download, Eye,
  CheckCircle2, Circle, AlertCircle, MapPin, Phone,
  Search, Filter, ArrowUpRight, Clock, ShieldCheck, Shield
} from 'lucide-react';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, 
    Tooltip, ResponsiveContainer, BarChart, Bar, Cell
} from 'recharts';
import api from '../api';
import LogoImg from '../assets/mind-saarthi-logo.png';
import PremiumCard from '../components/common/PremiumCard';
import ThemeToggle from '../components/common/ThemeToggle';

const DashboardPage = () => {
    const { user, token, logout } = useAuth();
    const { darkMode } = useTheme();
    const navigate = useNavigate();
    
    // Core Dashboard State
    const [stats, setStats] = useState(null);
    const [reports, setReports] = useState([]);
    const [plans, setPlans] = useState([]);
    const [risks, setRisks] = useState([]);
    const [progress, setProgress] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    
    // Filters & Search
    const [searchTerm, setSearchTerm] = useState('');
    const [riskFilter, setRiskFilter] = useState('All');

    useEffect(() => {
        if (!token) { navigate('/login'); return; }

        const fetchData = async () => {
            try {
                const [sRes, rRes, pRes, riskRes, progRes] = await Promise.all([
                    api.get('/dashboard'),
                    api.get('/reports'),
                    api.get('/plans'),
                    api.get('/risk-history'),
                    api.get('/daily-progress')
                ]);
                
                setStats(sRes.data);
                setReports(rRes.data);
                setPlans(pRes.data);
                setRisks(riskRes.data);
                setProgress(progRes.data);
            } catch (err) {
                console.error("Data fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [token, navigate]);

    const handleLogout = () => { logout(); navigate('/'); };

    const handleMarkTask = async (taskName, currentStatus) => {
        try {
            await api.post('/mark-task', { task_name: taskName, completed: !currentStatus });
            // Refresh progress
            const res = await api.get('/daily-progress');
            setProgress(res.data);
        } catch (err) { console.error(err); }
    };

    const downloadPDF = async (reportId) => {
        try {
            const response = await api.get(`/download-report/${reportId}`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `MindSaarthi_Report_${reportId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) { console.error("PDF Download error:", err); }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
                <motion.div 
                   animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
                   transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                   className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full"
                />
            </div>
        );
    }

    const name = stats?.name || user?.name || "User";
    const mentalHealthScore = 85; // Mock score logic can be improved

    // Filtering logic for reports
    const filteredReports = reports.filter(r => {
        const matchesSearch = r.summary.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              r.detected_issues.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRisk = riskFilter === 'All' || r.risk_level === riskFilter;
        return matchesSearch && matchesRisk;
    });

    const sidebarItems = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'reports', label: 'Session Reports', icon: FileTextIcon },
        { id: 'plans', label: 'Recovery Plans', icon: Brain },
        { id: 'risk', label: 'Risk History', icon: ShieldAlert },
        { id: 'profile', label: 'Profile Settings', icon: User },
    ];

    function FileTextIcon(props) { return <Activity {...props} />; }

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] text-slate-900 dark:text-white transition-colors duration-500 flex flex-col">
            {/* Background Blobs */}
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
                <div className="bg-blob w-[800px] h-[800px] bg-primary/5 -top-40 -left-40 blur-[150px]" />
                <div className="bg-blob w-[600px] h-[600px] bg-accent/5 -bottom-20 -right-20 blur-[120px] delay-1000" />
            </div>

            {/* Header */}
            <header className="glass shadow-sm py-4 sticky top-0 z-50 border-b border-white/10">
                <div className="container mx-auto px-6 max-w-7xl flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-2 hover:scale-105 transition-transform">
                        <img src={LogoImg} alt="Mind Saarthi" className="h-10 w-auto" />
                    </Link>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-1 glass px-3 py-1.5 rounded-xl border border-primary/10">
                            <ShieldCheck size={16} className="text-primary" />
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-60">HIPAA Secure</span>
                        </div>
                        <ThemeToggle />
                        <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-2" />
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold leading-tight">{name}</p>
                                <p className="text-[10px] uppercase tracking-tighter opacity-50">Premium Member</p>
                            </div>
                            <button 
                                onClick={handleLogout} 
                                className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-red-500 dark:hover:text-red-400 rounded-xl transition-all active:scale-90"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-6 max-w-7xl py-12 flex-1 flex flex-col md:flex-row gap-8">
                {/* Mobile Tab switcher */}
                <div className="md:hidden flex overflow-x-auto gap-2 pb-4 scrollbar-hide">
                   {sidebarItems.map((item) => (
                       <button
                           key={item.id}
                           onClick={() => setActiveTab(item.id)}
                           className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all ${
                               activeTab === item.id 
                               ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                               : 'bg-white/50 dark:bg-white/5 border border-white/10'
                           }`}
                       >
                           {item.label}
                       </button>
                   ))}
                </div>

                {/* Sidebar Navigation - Desktop */}
                <aside className="hidden md:flex flex-col gap-2 w-64 shrink-0">
                    {sidebarItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${
                                activeTab === item.id 
                                ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-105' 
                                : 'hover:bg-primary/5 text-slate-500 dark:text-slate-400'
                            }`}
                        >
                            <item.icon size={20} />
                            <span className="font-bold text-sm tracking-tight">{item.label}</span>
                        </button>
                    ))}

                    <div className="mt-8 p-6 glass rounded-3xl border border-primary/10 relative overflow-hidden group">
                        <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                        <Brain size={32} className="text-primary mb-3" />
                        <h4 className="font-bold text-xs uppercase tracking-widest mb-1">Session Left</h4>
                        <p className="text-2xl font-black">Unlimited</p>
                        <p className="text-[10px] opacity-60 mt-2">Professional AI assistance active</p>
                    </div>
                </aside>

                {/* Main Dashboard Content */}
                <main className="flex-1 overflow-hidden min-h-[70vh]">
                    <AnimatePresence mode="wait">
                        {activeTab === 'overview' && (
                            <motion.div
                                key="overview"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                {/* Top Hero Stats */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <PremiumCard className="relative overflow-hidden flex flex-col justify-between">
                                        <div className="absolute top-0 right-0 p-6 opacity-10">
                                            <Activity size={100} className="text-primary" />
                                        </div>
                                        <div>
                                            <h4 className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Mental Health Score</h4>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-5xl font-black text-primary">{mentalHealthScore}</span>
                                                <span className="text-sm font-bold opacity-40">/ 100</span>
                                            </div>
                                        </div>
                                        <div className="mt-4 flex items-center gap-2 text-xs font-bold text-emerald-500">
                                            <TrendingUp size={14} />
                                            <span>+12% from last week</span>
                                        </div>
                                    </PremiumCard>

                                    <PremiumCard className="relative overflow-hidden flex flex-col justify-between">
                                        <div className="absolute top-0 right-0 p-6 opacity-10">
                                            <ShieldAlert size={100} className="text-accent" />
                                        </div>
                                        <div>
                                            <h4 className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Current Risk Level</h4>
                                            <p className={`text-4xl font-black uppercase ${stats?.latest_risk === 'High' ? 'text-accent' : stats?.latest_risk === 'Moderate' ? 'text-amber-500' : 'text-primary'}`}>
                                                {stats?.latest_risk || 'Low'}
                                            </p>
                                        </div>
                                        <p className="mt-4 text-[10px] font-medium opacity-60">Based on analysis of 12 patterns</p>
                                    </PremiumCard>

                                    <PremiumCard className="relative overflow-hidden flex flex-wrap justify-between gap-4">
                                        <div className="flex-1">
                                            <h4 className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Daily Checklist</h4>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-4xl font-black">{Math.round(progress?.progress || 0)}%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-slate-100 dark:bg-white/5 rounded-full mt-3 overflow-hidden">
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${progress?.progress}%` }}
                                                    className="h-full bg-gradient-to-r from-primary to-blue-400"
                                                />
                                            </div>
                                        </div>
                                        <Link to="/chat" className="p-3 bg-primary text-white rounded-2xl self-center shadow-lg shadow-primary/20 hover:scale-110 active:scale-90 transition-all">
                                            <ArrowUpRight size={24} />
                                        </Link>
                                    </PremiumCard>
                                </div>

                                {/* Mood ChartSection */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    <PremiumCard className="lg:col-span-2 min-h-[400px]">
                                        <div className="flex items-center justify-between mb-8">
                                            <div>
                                                <h3 className="text-xl font-bold">Emotional Pulse</h3>
                                                <p className="text-xs text-slate-500">Weekly sentiment intensity overview</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-xs font-bold">7D</button>
                                                <button className="px-3 py-1 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg text-xs font-bold">30D</button>
                                            </div>
                                        </div>
                                        
                                        <div className="h-[300px] w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <AreaChart data={stats?.mood_history || []}>
                                                    <defs>
                                                        <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="#175dc5" stopOpacity={0.3}/>
                                                            <stop offset="95%" stopColor="#175dc5" stopOpacity={0}/>
                                                        </linearGradient>
                                                    </defs>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} />
                                                    <XAxis 
                                                        dataKey="timestamp" 
                                                        axisLine={false} 
                                                        tickLine={false} 
                                                        tick={{ fontSize: 10, fontWeight: 700, fill: darkMode ? '#64748b' : '#94a3b8' }}
                                                    />
                                                    <YAxis hide />
                                                    <Tooltip 
                                                        contentStyle={{ 
                                                            backgroundColor: darkMode ? '#1e293b' : '#fff', 
                                                            border: 'none', 
                                                            borderRadius: '16px', 
                                                            boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' 
                                                        }}
                                                        itemStyle={{ color: '#175dc5', fontWeight: 800 }}
                                                    />
                                                    <Area 
                                                        type="monotone" 
                                                        dataKey={(d) => d.risk === 'High' ? 100 : d.risk === 'Moderate' ? 60 : 30} 
                                                        name="Mood Intensity"
                                                        stroke="#175dc5" 
                                                        strokeWidth={4}
                                                        fillOpacity={1} 
                                                        fill="url(#colorMood)" 
                                                    />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </PremiumCard>

                                    {/* Daily Tracker Sidebar */}
                                    <PremiumCard className="flex flex-col gap-6">
                                        <div className="flex items-center gap-3">
                                            <Calendar className="text-primary" size={24} />
                                            <h3 className="text-xl font-bold">Today's Plan</h3>
                                        </div>
                                        
                                        <div className="space-y-4 flex-1">
                                            {progress?.tasks.map((task) => (
                                                <button
                                                    key={task.task_name}
                                                    onClick={() => handleMarkTask(task.task_name, task.completed)}
                                                    className="w-full flex items-center gap-4 p-4 rounded-2xl glass-card text-left transition-all hover:translate-x-1 group"
                                                >
                                                    {task.completed ? 
                                                        <CheckCircle2 className="text-emerald-500 shrink-0" size={20} /> : 
                                                        <Circle className="text-slate-300 dark:text-white/10 shrink-0" size={20} />
                                                    }
                                                    <span className={`text-sm font-bold tracking-tight ${task.completed ? 'opacity-40 line-through' : ''}`}>
                                                        {task.task_name}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>

                                        <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                                            <p className="text-[10px] uppercase font-bold tracking-widest opacity-60 mb-2">Consistency Streak</p>
                                            <div className="flex gap-2">
                                                {[1,2,3,4,5,6,7].map(d => (
                                                    <div key={d} className={`h-2 flex-1 rounded-full ${d <= 4 ? 'bg-primary' : 'bg-slate-200 dark:bg-white/10'}`} />
                                                ))}
                                            </div>
                                        </div>
                                    </PremiumCard>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'reports' && (
                            <motion.div
                                key="reports"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-6"
                            >
                                <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
                                    <h2 className="text-3xl font-black tracking-tight">Session History</h2>
                                    <div className="flex gap-4 w-full md:w-auto">
                                        <div className="relative flex-1 md:w-64">
                                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input 
                                                type="text" 
                                                placeholder="Search session insights..." 
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="w-full pl-12 pr-4 py-3 rounded-2xl glass border-white/10 focus:ring-2 ring-primary/20 outline-none font-bold text-sm"
                                            />
                                        </div>
                                        <select 
                                            value={riskFilter}
                                            onChange={(e) => setRiskFilter(e.target.value)}
                                            className="px-4 py-3 rounded-2xl glass border-white/10 outline-none font-bold text-sm appearance-none cursor-pointer"
                                        >
                                            <option value="All">All Risks</option>
                                            <option value="High">High Only</option>
                                            <option value="Moderate">Moderate</option>
                                            <option value="Low">Low</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    {filteredReports.map((report) => (
                                        <motion.div
                                            key={report._id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="group glass-card p-6 flex flex-col md:flex-row items-center gap-6 border-white/10 hover:border-primary/30 transition-all"
                                        >
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                                                report.risk_level === 'High' ? 'bg-accent/10 text-accent' : 
                                                report.risk_level === 'Moderate' ? 'bg-amber-500/10 text-amber-500' : 'bg-primary/10 text-primary'
                                            }`}>
                                                <Activity size={28} />
                                            </div>

                                            <div className="flex-1 space-y-1">
                                                <div className="flex items-center gap-3">
                                                    <h3 className="font-bold text-lg leading-tight">Interaction #{report._id.slice(-4)}</h3>
                                                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                                                        report.risk_level === 'High' ? 'bg-accent text-white' : 
                                                        report.risk_level === 'Moderate' ? 'bg-amber-500 text-white' : 'bg-primary text-white'
                                                    }`}>
                                                        {report.risk_level}
                                                    </span>
                                                </div>
                                                <p className="text-sm opacity-60 font-medium line-clamp-1">{report.summary}</p>
                                                <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest opacity-40">
                                                    <span className="flex items-center gap-1.5"><Clock size={12} /> {report.created_at}</span>
                                                    <span className="flex items-center gap-1.5"><Shield size={12} /> {report.detected_issues}</span>
                                                </div>
                                            </div>

                                            <div className="flex gap-2 w-full md:w-auto">
                                                <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-primary/10 hover:text-primary transition-all font-bold text-sm">
                                                    <Eye size={18} /> View
                                                </button>
                                                <button 
                                                    onClick={() => downloadPDF(report._id)}
                                                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary text-white shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all font-bold text-sm"
                                                >
                                                    <Download size={18} /> PDF
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                    {filteredReports.length === 0 && (
                                        <div className="py-20 text-center opacity-30 flex flex-col items-center gap-4">
                                            <FileTextIcon size={64} strokeWidth={1} />
                                            <p className="font-bold uppercase tracking-widest">No matching reports found</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'plans' && (
                            <motion.div
                                key="plans"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                            >
                                {plans.map((plan) => (
                                    <PremiumCard key={plan._id} className="relative group">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                                                <Brain size={24} />
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                                plan.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-100 text-slate-400'
                                            }`}>
                                                {plan.status}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold mb-2 capitalize">{plan.issue_type.replace('_', ' ')} Strategy</h3>
                                        <p className="text-sm opacity-60 mb-6 font-medium line-clamp-2">{plan.plan.daily_routine}</p>
                                        
                                        <div className="space-y-3 mb-8">
                                            {plan.plan.tips.slice(0, 3).map((tip, i) => (
                                                <div key={i} className="flex items-center gap-3 text-xs font-bold opacity-70">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                    {tip}
                                                </div>
                                            ))}
                                        </div>

                                        <button className="w-full py-4 rounded-2xl bg-slate-100 dark:bg-white/5 font-black uppercase tracking-widest text-xs hover:bg-primary/10 hover:text-primary transition-all">
                                            Deep Dive into Plan
                                        </button>
                                    </PremiumCard>
                                ))}
                            </motion.div>
                        )}

                        {activeTab === 'risk' && (
                            <motion.div
                                key="risk"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="max-w-4xl mx-auto"
                            >
                                <div className="space-y-8 relative">
                                    <div className="absolute left-8 top-4 bottom-4 w-px bg-slate-200 dark:bg-white/10" />
                                    
                                    {risks.map((risk, index) => (
                                        <div key={risk._id} className="relative pl-20 group">
                                            <div className="absolute left-6 top-1 w-4 h-4 rounded-full bg-red-500 shadow-xl shadow-red-500/50 z-10 group-hover:scale-150 transition-transform" />
                                            
                                            <div className="glass-card p-8 border-red-500/20 group-hover:border-red-500/40 transition-all">
                                                <div className="flex justify-between items-start mb-4">
                                                    <span className="text-xs font-black uppercase tracking-widest opacity-40">{risk.timestamp}</span>
                                                    <div className="flex gap-2">
                                                        {risk.alert_sent && <span className="p-1 px-2 rounded-md bg-accent/10 text-accent text-[8px] font-bold uppercase tracking-tighter">SMS Alert Sent</span>}
                                                        {risk.location_shared && <span className="p-1 px-2 rounded-md bg-primary/10 text-primary text-[8px] font-bold uppercase tracking-tighter">Loc Shared</span>}
                                                    </div>
                                                </div>
                                                <p className="text-lg font-bold mb-6 text-slate-800 dark:text-red-100 italic">"{risk.user_message}"</p>
                                                
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-white/10">
                                                    <div className="flex items-center gap-3 text-sm font-medium">
                                                        <MapPin size={18} className="text-blue-500" />
                                                        <span>{risk.hospital_suggested || 'Nearest Medical Center Logged'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-sm font-medium">
                                                        <Phone size={18} className="text-emerald-500" />
                                                        <span>{risk.doctor_contact || 'On-Call Counselor Alerted'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {risks.length === 0 && (
                                        <div className="py-20 text-center glass rounded-[2.5rem] border border-emerald-500/10 p-20 flex flex-col items-center gap-6">
                                            <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                                <ShieldCheck size={40} />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-black mb-2">Secure & Stable</h3>
                                                <p className="opacity-60 max-w-sm mx-auto font-medium">No high-risk events detected on your account. Your emotional guardian is continuously monitoring for safety.</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                        
                        {activeTab === 'profile' && (
                            <motion.div
                                key="profile"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="max-w-2xl mx-auto space-y-6"
                            >
                                <PremiumCard className="p-10 space-y-8">
                                    <div className="flex items-center gap-6">
                                        <div className="w-24 h-24 rounded-[2rem] bg-primary flex items-center justify-center text-white text-4xl font-black shadow-2xl">
                                            {name[0]}
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-black tracking-tight">{name}</h2>
                                            <p className="opacity-60 font-medium">{user?.email}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 gap-6 pt-8 border-t border-white/5">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Default Location</label>
                                            <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-white/10">
                                                <MapPin size={20} className="text-primary" />
                                                <span className="font-bold">New Delhi, India (Home)</span>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Primary Emergency Contact</label>
                                            <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-white/10">
                                                <Heart size={20} className="text-accent" />
                                                <span className="font-bold">+91 999 000 1234 (Guardian)</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <button className="flex-1 py-4 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20">Save Profile</button>
                                        <button className="flex-1 py-4 rounded-2xl border border-primary/20 text-primary font-black uppercase tracking-widest text-xs">Manage Security</button>
                                    </div>
                                </PremiumCard>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
};

export default DashboardPage;
