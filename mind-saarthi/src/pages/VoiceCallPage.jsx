import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../AuthContext';
import { useTheme } from '../ThemeContext';
import { useNavigate } from 'react-router-dom';
import {
    PhoneOff, Mic, MicOff, Activity, Globe, AlertTriangle, Phone
} from 'lucide-react';
import api from '../api';
import LogoImg from '../assets/mind-saarthi-logo.png';

const VoiceCallPage = () => {
    const { user, token } = useAuth();
    const { darkMode } = useTheme();
    const navigate = useNavigate();

    // Core States
    const [callState, setCallStateUi] = useState('idle'); // idle, listening, processing, speaking
    const callStateRef = useRef('idle');
    const setCallState = (state) => {
        callStateRef.current = state;
        setCallStateUi(state);
    };

    const [lang, setLang] = useState('hinglish'); // en, hi, hinglish
    const [transcript, setTranscript] = useState('');

    // Live Transcript
    const [lastUserMsg, setLastUserMsg] = useState('');
    const [lastAiMsg, setLastAiMsg] = useState(null); // { text, risk }

    // Timer
    const [seconds, setSeconds] = useState(0);

    // Refs
    const recognitionRef = useRef(null);
    const audioRef = useRef(new Audio());

    useEffect(() => {
        const interval = setInterval(() => setSeconds(s => s + 1), 1000);
        return () => clearInterval(interval);
    }, []);

    const formatTime = (sec) => {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    // Initialize Speech Recognition
    useEffect(() => {
        if (!('webkitSpeechRecognition' in window)) {
            alert("Your browser does not support Speech Recognition. Please use Chrome/Edge.");
            return;
        }

        const SpeechRecognition = window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;

        recognitionRef.current.onstart = () => {
            setCallState('listening');
            setTranscript('');
        };

        recognitionRef.current.onresult = (event) => {
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                finalTranscript += event.results[i][0].transcript;
            }
            setTranscript(finalTranscript);
        };

        recognitionRef.current.onerror = (event) => {
            console.error("Speech Recognition Error:", event.error);
            if (event.error !== 'no-speech') {
                setCallState('idle');
            }
        };

        recognitionRef.current.onend = () => {
            if (callStateRef.current === 'listening') {
                setCallState('trigger_process');
            }
        };

        return () => {
            recognitionRef.current?.stop();
            audioRef.current?.pause();
        };
    }, []);

    // Listen for the trigger
    useEffect(() => {
        if (callState === 'trigger_process') {
            if (transcript.trim() !== '') {
                setLastUserMsg(transcript);
                processVoiceCommand(transcript);
            } else {
                setCallState('idle');
            }
        }
    }, [callState, transcript]);

    const handleMicToggle = () => {
        if (callState === 'listening') {
            recognitionRef.current?.stop();
            setCallState('idle');
        } else {
            // Check for interruption
            if (callState === 'speaking') {
                audioRef.current.onended = null;
                audioRef.current?.pause();
            }

            recognitionRef.current.lang = lang === 'en' ? 'en-US' : 'en-IN';
            try {
                recognitionRef.current?.start();
            } catch (e) {
                console.error("Already started");
            }
        }
    };

    const processVoiceCommand = async (text) => {
        setCallState('processing');
        setLastAiMsg(null);

        try {
            let detectedLang = lang;
            if (text.match(/[\u0900-\u097F]/)) detectedLang = "hi";
            else if (text.toLowerCase().includes("yaar") || text.toLowerCase().includes("bhai") || text.toLowerCase().includes("theek")) detectedLang = "hinglish";

            setLang(detectedLang);

            const payload = {
                message: text,
                lang: detectedLang
            };

            const response = await api.post('/voice-chat', payload);

            if (response.data.audio_chunks && response.data.audio_chunks.length > 0) {
                setCallState('speaking');

                const { audio_chunks, reply_chunks, risk } = response.data;
                const totalChunks = audio_chunks.length;
                let currentChunkIndex = 0;

                const playNextChunk = async () => {
                    if (currentChunkIndex >= totalChunks || callStateRef.current === 'listening') {
                        if (callStateRef.current === 'speaking' || callStateRef.current === 'processing') {
                            setCallState('idle');
                            setTimeout(() => {
                                if (callStateRef.current !== 'listening') {
                                    try { recognitionRef.current?.start(); } catch (e) { }
                                }
                            }, 400);
                        }
                        return;
                    }

                    const chunkText = reply_chunks[currentChunkIndex] || '';
                    setLastAiMsg({ text: chunkText, risk: currentChunkIndex === 0 ? risk : null });

                    const audioUrl = `data:audio/mpeg;base64,${audio_chunks[currentChunkIndex]}`;
                    audioRef.current.src = audioUrl;

                    audioRef.current.onended = () => {
                        currentChunkIndex++;
                        playNextChunk();
                    };

                    try {
                        await audioRef.current.play();
                    } catch (e) {
                        console.error("Audio playback interrupted", e);
                        setCallState('idle');
                    }
                };

                playNextChunk();

            } else {
                setCallState('idle');
            }

        } catch (error) {
            console.error("Voice Processing Error:", error);
            setLastAiMsg({ text: "Sorry, I am having trouble connecting.", risk: null });
            setCallState('idle');
        }
    };

    const endCall = () => {
        recognitionRef.current?.stop();
        audioRef.current?.pause();
        navigate('/dashboard');
    };

    return (
        <div className="fixed inset-0 bg-white dark:bg-slate-950 text-slate-900 dark:text-white overflow-hidden flex flex-col font-sans transition-colors duration-300">

            {/* TOP BAR */}
            <header className="flex-none px-6 py-4 flex justify-between items-center z-50 border-b border-slate-100 dark:border-white/5">
                <div className="flex items-center gap-3">
                    <img src={LogoImg} alt="Mind Saarthi" className="h-6 w-auto dark:brightness-200" />
                    <span className="font-semibold tracking-wide text-sm text-slate-800 dark:text-slate-200">MindSaarthi AI</span>
                </div>

                <div className="flex items-center gap-4">
                    {/* Status Pill */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={callState}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10"
                        >
                            {callState === 'listening' && (
                                <>
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[11px] font-semibold tracking-wide text-slate-600 dark:text-slate-300">Listening...</span>
                                </>
                            )}
                            {callState === 'processing' && (
                                <>
                                    <Activity size={12} className="text-primary animate-spin" />
                                    <span className="text-[11px] font-semibold tracking-wide text-slate-600 dark:text-slate-300">Thinking...</span>
                                </>
                            )}
                            {callState === 'speaking' && (
                                <>
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                                    <span className="text-[11px] font-semibold tracking-wide text-primary">Speaking...</span>
                                </>
                            )}
                            {callState === 'idle' && (
                                <>
                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                                    <span className="text-[11px] font-semibold tracking-wide text-slate-500">Connected</span>
                                </>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* Timer */}
                    <div className="text-sm font-medium font-mono text-slate-600 dark:text-slate-400">
                        {formatTime(seconds)}
                    </div>
                </div>
            </header>

            {/* CENTER FOCUS AREA */}
            <main className="flex-1 flex flex-col items-center justify-center relative w-full px-4 md:px-6 z-10 overflow-hidden">

                {/* Minimal Avatar */}
                <div className="relative flex items-center justify-center w-32 h-32 md:w-40 md:h-40 mb-12">
                    {/* Subtle animated ring */}
                    <AnimatePresence>
                        {callState === 'listening' && (
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.3, 0.1] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute inset-0 rounded-full bg-emerald-500/10 border border-emerald-500/20"
                            />
                        )}
                        {callState === 'speaking' && (
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: [1, 1.25, 1], opacity: [0.1, 0.2, 0.1] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute inset-[-10px] rounded-full bg-primary/5 border border-primary/10"
                            />
                        )}
                    </AnimatePresence>

                    {/* Clean Central Avatar */}
                    <motion.div
                        animate={{ scale: callState === 'idle' ? [1, 1.02, 1] : 1 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className={`w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center z-10 transition-colors duration-500 shadow-sm border ${callState === 'speaking' ? 'bg-primary/5 border-primary/20 text-primary' :
                                callState === 'listening' ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-600' :
                                    callState === 'processing' ? 'bg-amber-500/5 border-amber-500/20 text-amber-600' :
                                        'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
                            }`}>
                        <Globe size={36} strokeWidth={1.5} />
                    </motion.div>
                </div>

                {/* Minimal Transcript Card */}
                <div className="w-full max-w-lg min-h-[100px] flex items-center justify-center">
                    <AnimatePresence mode="popLayout">
                        {/* User Message */}
                        {callState === 'listening' && (transcript || lastUserMsg) && (
                            <motion.div
                                key={transcript || lastUserMsg}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="w-full text-center px-6"
                            >
                                <p className="text-base text-slate-500 dark:text-slate-400 font-medium">
                                    "{transcript || lastUserMsg}"
                                </p>
                            </motion.div>
                        )}

                        {/* AI Response Card */}
                        {(callState === 'speaking' || callState === 'idle') && lastAiMsg && (
                            <motion.div
                                key={lastAiMsg.text}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-5 rounded-3xl text-center shadow-sm"
                            >
                                {lastAiMsg.risk === 'High' && (
                                    <div className="mb-3 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#175dc5] bg-[#175dc5]/5 px-3 py-1 rounded-full border border-[#175dc5]/10">
                                        <AlertTriangle size={12} /> High Context
                                    </div>
                                )}
                                <p className="text-base md:text-lg font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                                    {lastAiMsg.text}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

            </main>

            {/* BOTTOM SECTION (CONTROLS) */}
            <footer className="flex-none w-full px-6 py-8 pb-10 flex justify-center items-center gap-8 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-t border-slate-100 dark:border-white/5 z-50">

                {/* Language Toggle (Optional) */}
                <select
                    value={lang}
                    onChange={(e) => setLang(e.target.value)}
                    className="w-12 h-12 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-colors rounded-full border border-slate-200 dark:border-white/10 outline-none appearance-none cursor-pointer text-center font-bold text-xs"
                    style={{ textAlignLast: 'center' }}
                >
                    <option value="en">EN</option>
                    <option value="hi">HI</option>
                    <option value="hinglish">HN</option>
                </select>

                {/* Primary Mic Button */}
                <button
                    onClick={handleMicToggle}
                    className={`relative flex items-center justify-center w-[64px] h-[64px] rounded-full transition-all transform hover:scale-105 active:scale-95 shadow-md ${callState === 'listening' ? 'bg-emerald-500 text-white' :
                            callState === 'speaking' ? 'bg-primary text-white' :
                                callState === 'processing' ? 'bg-amber-500 text-white' :
                                    'bg-slate-800 text-white dark:bg-white dark:text-slate-900'
                        }`}
                >
                    {callState === 'listening' ? (
                        <div className="flex items-center gap-1">
                            {[...Array(3)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    animate={{ height: [8, Math.random() * 12 + 10, 8] }}
                                    transition={{ duration: Math.random() * 0.4 + 0.3, repeat: Infinity }}
                                    className="w-1 rounded-full bg-white"
                                />
                            ))}
                        </div>
                    ) : callState === 'speaking' ? (
                        <Phone size={24} className="animate-pulse" />
                    ) : callState === 'processing' ? (
                        <Activity size={24} className="animate-spin" />
                    ) : (
                        <Mic size={24} />
                    )}
                </button>

                {/* Secondary End Call Button */}
                <button
                    onClick={endCall}
                    className="w-12 h-12 rounded-full bg-[#175dc5]/10 hover:bg-[#175dc5] flex items-center justify-center text-[#175dc5] hover:text-white transition-colors"
                >
                    <PhoneOff size={20} />
                </button>

            </footer>
        </div>
    );
};

export default VoiceCallPage;
