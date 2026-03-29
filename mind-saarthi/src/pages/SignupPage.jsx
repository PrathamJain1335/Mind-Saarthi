import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, AlertTriangle, ArrowLeft, Lock, Mail, User, CheckCircle2, Activity } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { useTheme } from '../ThemeContext';
import LogoImg from '../assets/mind-saarthi-logo.png';
import ThemeToggle from '../components/common/ThemeToggle';

const SignupPage = () => {
    const { darkMode } = useTheme();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [shakeCount, setShakeCount] = useState(0);

    const navigate = useNavigate();

    // Basic real-time validation
    const isNameValid = name.trim().length > 2;
    const isEmailValid = email.includes('@') && email.includes('.');
    const isPasswordValid = password.length >= 6;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!isNameValid || !isEmailValid || !isPasswordValid) {
            setError(password.length < 6 ? "Password must be at least 6 characters" : "Please fill in all fields correctly.");
            setShakeCount(c => c + 1);
            return;
        }

        setLoading(true);

        try {
            await api.post('/signup', { name, email, password });
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.error || "Failed to create account. Please try again.");
            setShakeCount(c => c + 1);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 w-full flex flex-col lg:flex-row bg-white dark:bg-slate-950 overflow-hidden font-sans transition-colors duration-500">
            
            {/* Absolute Controls */}
            <div className="absolute top-6 left-6 z-50 flex items-center gap-4">
                <Link to="/" className="p-2.5 bg-white/10 hover:bg-white/20 dark:bg-black/20 dark:hover:bg-black/40 backdrop-blur-md rounded-xl transition-all active:scale-95 text-[#ff1d24] dark:text-slate-200">
                    <ArrowLeft size={20} />
                </Link>
                <div className="text-[#ff1d24] dark:text-slate-200">
                    <ThemeToggle />
                </div>
            </div>

            {/* LEFT PANEL: BRANDING / VISUAL */}
            <div className="hidden md:flex w-full lg:w-[45%] xl:w-[50%] relative overflow-hidden bg-gradient-to-br from-[#175dc5] via-[#175dc5]/90 to-[#ff1d24]/20 flex-col justify-center p-12 lg:p-20 shadow-2xl z-10">
                <div className="absolute inset-0 pointer-events-none overflow-hidden mix-blend-screen opacity-40">
                    <motion.div
                        animate={{ x: [0, 50, 0], y: [0, -50, 0], scale: [1, 1.2, 1] }}
                        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -top-[20%] -left-[10%] w-[500px] h-[500px] bg-blue-400/30 blur-[100px] rounded-full"
                    />
                    <motion.div
                        animate={{ x: [0, -60, 0], y: [0, 60, 0], scale: [1, 1.3, 1] }}
                        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-[40%] -right-[20%] w-[600px] h-[600px] bg-[#ff1d24]/10 blur-[120px] rounded-full"
                    />
                </div>

                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10 flex flex-col mt-auto mb-auto max-w-lg"
                >
                    <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 leading-tight font-poppins">
                        Begin Your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-red-200">Wellness Journey.</span>
                    </h1>
                    <p className="text-lg lg:text-xl text-blue-100/80 mb-12 font-medium leading-relaxed max-w-md">
                        Join MindSaarthi AI today and experience personalized mental health support that understands you.
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-max px-8 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold backdrop-blur-sm transition-all shadow-lg"
                    >
                        Learn More
                    </motion.button>
                </motion.div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
            </div>

            {/* RIGHT PANEL: AUTH FORM */}
            <div className="flex-1 w-full flex items-center justify-center p-6 lg:p-12 relative bg-slate-50 dark:bg-slate-950/50">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="w-full max-w-md"
                >
                    <motion.div
                        animate={shakeCount > 0 ? { x: [-10, 10, -10, 10, 0] } : {}}
                        transition={{ duration: 0.4 }}
                        className="w-full bg-white/90 dark:bg-slate-900/80 backdrop-blur-2xl p-8 rounded-[2.5rem] shadow-2xl border border-slate-200/50 dark:border-white/10 relative shadow-[#175dc5]/5 dark:shadow-black/50"
                    >
                        <div className="flex flex-col items-center mb-6">
                            <div className="relative mb-4">
                                <div className="absolute inset-0 bg-[#ff1d24]/10 blur-2xl rounded-full" />
                                <img src={LogoImg} alt="Mind Saarthi Logo" className="h-14 w-auto relative z-10" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-1">Create Account</h2>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 text-center">Start your mental wellness journey</p>
                        </div>

                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mb-4 overflow-hidden"
                                >
                                    <div className="p-3 bg-[#ff1d24]/5 border border-[#ff1d24]/20 rounded-xl flex items-start gap-3 text-[#ff1d24] text-xs font-semibold shadow-sm">
                                        <AlertTriangle className="shrink-0 mt-0.5" size={16} />
                                        <span>{error}</span>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Name Input */}
                            <div className="space-y-1">
                                <label className="text-xs font-bold px-1 text-slate-600 dark:text-slate-400 uppercase tracking-wide">Full Name</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#ff1d24] transition-colors" size={18} />
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full pl-11 pr-10 py-3 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#ff1d24]/30 focus:border-[#ff1d24]/50 transition-all shadow-sm"
                                        placeholder="Your Name"
                                    />
                                    {isNameValid && <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500" size={16} />}
                                </div>
                            </div>

                            {/* Email Input */}
                            <div className="space-y-1">
                                <label className="text-xs font-bold px-1 text-slate-600 dark:text-slate-400 uppercase tracking-wide">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#ff1d24] transition-colors" size={18} />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-11 pr-10 py-3 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#ff1d24]/30 focus:border-[#ff1d24]/50 transition-all shadow-sm"
                                        placeholder="name@email.com"
                                    />
                                    {isEmailValid && <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500" size={16} />}
                                </div>
                            </div>

                            {/* Password Input */}
                            <div className="space-y-1">
                                <label className="text-xs font-bold px-1 text-slate-600 dark:text-slate-400 uppercase tracking-wide">Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#ff1d24] transition-colors" size={18} />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-11 pr-12 py-3 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#ff1d24]/30 focus:border-[#ff1d24]/50 transition-all shadow-sm"
                                        placeholder="Min. 6 characters"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#ff1d24] transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={loading}
                                type="submit"
                                className="w-full py-3 mt-4 rounded-xl bg-gradient-to-r from-[#175dc5] to-[#ff1d24] text-white text-sm font-bold shadow-lg shadow-[#175dc5]/20 hover:shadow-[#ff1d24]/20 transition-all flex justify-center items-center overflow-hidden relative group"
                            >
                                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    {loading ? <Activity size={18} className="animate-spin" /> : "Create Account"}
                                </span>
                            </motion.button>
                        </form>

                        <div className="mt-6 text-center text-sm font-medium text-slate-600 dark:text-slate-400">
                            Already have an account?
                            <Link to="/login" className="text-[#ff1d24] font-bold ml-1.5 hover:opacity-80 transition-opacity">Log In</Link>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default SignupPage;
