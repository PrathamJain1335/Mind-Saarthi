import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, AlertTriangle, ArrowLeft, Lock, Mail } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../AuthContext';
import { useTheme } from '../ThemeContext';
import LogoImg from '../assets/mind-saarthi-logo.png';
import ThemeToggle from '../components/common/ThemeToggle';

const LoginPage = () => {
    const { darkMode } = useTheme();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const res = await api.post('/login', { email, password });
            login(res.data.user, res.data.token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || "Invalid credentials. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`min-h-screen flex items-center justify-center p-6 relative overflow-hidden transition-colors duration-500 ${darkMode ? 'bg-background-dark text-white' : 'bg-background-light text-slate-900'}`}>
            {/* Background Blobs */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10 bg-gradient-to-br from-primary/5 to-accent/5">
                <div className="bg-blob w-[500px] h-[500px] bg-primary -top-40 -left-20 opacity-20" />
                <div className="bg-blob w-[400px] h-[400px] bg-accent -bottom-20 -right-20 opacity-20 delay-1000" />
            </div>

            <div className="fixed top-6 left-6 flex items-center gap-4">
                <Link to="/" className="p-3 glass rounded-2xl hover:bg-white/20 transition-all active:scale-95">
                    <ArrowLeft size={20} />
                </Link>
                <ThemeToggle />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md glass p-10 rounded-[2.5rem] shadow-2xl relative z-10 border-white/20"
            >
                <div className="flex flex-col items-center mb-10">
                    <img src={LogoImg} alt="Logo" className="h-16 w-auto mb-4" />
                    <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Continue your wellness journey</p>
                </div>

                {error && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-6 p-4 bg-accent/10 border border-accent/20 rounded-2xl flex items-start gap-3 text-accent text-sm font-bold">
                        <AlertTriangle className="shrink-0 mt-0.5" size={18} />
                        <span>{error}</span>
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-bold px-1 opacity-70">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-field pl-12"
                                placeholder="name@email.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold px-1 opacity-70">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-field pl-12 pr-12"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between px-1">
                        <label className="flex items-center gap-2 cursor-pointer group">
                             <input type="checkbox" className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-primary focus:ring-primary/20" />
                             <span className="text-sm font-medium opacity-70">Keep me active</span>
                        </label>
                        <Link to="#" className="text-sm font-bold text-primary hover:underline">Forgot password?</Link>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={loading}
                        type="submit"
                        className="btn-primary w-full !py-4 shadow-xl shadow-primary/20"
                    >
                        {loading ? <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : "Sign In"}
                    </motion.button>
                </form>

                <div className="mt-8 text-center text-sm font-medium">
                    <span className="opacity-60">New to MindSaarthi?</span>
                    <Link to="/signup" className="text-primary font-bold ml-2 hover:underline">Create Account</Link>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
