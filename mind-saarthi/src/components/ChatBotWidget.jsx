import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../AuthContext';
import { useTheme } from '../ThemeContext';
import {
    MessageSquare,
    X,
    Send,
    Bot,
    User,
    Mic,
    MicOff,
    Volume2,
    VolumeX,
    Download,
    Sparkles,
    Shield
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;

const ChatBotWidget = () => {
    const { user } = useAuth();
    const { darkMode } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'bot',
            text: "Hi there! I'm MindSaarthi. This is a safe space to share how you're feeling today. How can I support you?",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [voiceEnabled, setVoiceEnabled] = useState(false);

    const scrollRef = useRef(null);
    const textareaRef = useRef(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = '40px';
            const scrollHeight = textareaRef.current.scrollHeight;
            textareaRef.current.style.height = Math.min(scrollHeight, 120) + 'px';
        }
    }, [inputValue]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping, isOpen]);

    useEffect(() => {
        if (recognition) {
            recognition.continuous = false;
            recognition.interimResults = true;
            const onStart = () => setIsListening(true);
            const onEnd = () => setIsListening(false);
            const onResult = (event) => {
                let currentTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    currentTranscript += event.results[i][0].transcript;
                }
                setInputValue(currentTranscript);
            };
            recognition.addEventListener('start', onStart);
            recognition.addEventListener('end', onEnd);
            recognition.addEventListener('result', onResult);
            return () => {
                recognition.removeEventListener('start', onStart);
                recognition.removeEventListener('end', onEnd);
                recognition.removeEventListener('result', onResult);
            };
        }
    }, []);

    const toggleListening = () => {
        if (!recognition) return alert("Speech recognition not supported.");
        isListening ? recognition.stop() : recognition.start();
    };

    const speakText = (text) => {
        if (!voiceEnabled || !window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
    };

    const handleDownloadReport = () => {
        const doc = new jsPDF();
        doc.setFillColor(23, 93, 197);
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.text("MindSaarthi AI Session Report", 20, 25);
        doc.save(`MindSaarthi_Report_${Date.now()}.pdf`);
    };

    const handleSend = async (e) => {
        if (e) e.preventDefault();
        if (!inputValue.trim() || isTyping) return;
        const userMsg = { id: Date.now(), type: 'user', text: inputValue, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
        setMessages(prev => [...prev, userMsg]);
        const userText = inputValue;
        setInputValue('');
        setIsTyping(true);
        try {
            const response = await fetch('http://localhost:5000/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userText }),
            });
            const data = await response.json();
            const botMsg = {
                id: Date.now() + 1,
                type: 'bot',
                text: data.reply || "I'm here to listen.",
                risk: data.risk,
                sentiment: data.sentiment,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, botMsg]);
            speakText(botMsg.text);
        } catch (error) {
            setMessages(prev => [...prev, { id: Date.now(), type: 'bot', text: "Connection error.", timestamp: "Now" }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <>
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-50 p-4 bg-primary text-white rounded-2xl shadow-2xl flex items-center justify-center group"
            >
                {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
                <div className="absolute inset-0 rounded-2xl bg-primary animate-ping opacity-20 -z-10 group-hover:hidden" />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-24 right-6 z-50 w-full max-w-[380px] h-[600px] glass rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl border-white/20"
                    >
                        {/* Header */}
                        <div className="p-6 bg-primary/10 dark:bg-primary/20 border-b border-primary/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg">
                                    <Bot size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold tracking-tight">MindSaarthi AI</h3>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">Online</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <button onClick={handleDownloadReport} className="p-2 hover:bg-white/20 rounded-xl transition-all"><Download size={18} /></button>
                                <button onClick={() => setVoiceEnabled(!voiceEnabled)} className={`p-2 rounded-xl transition-all ${voiceEnabled ? 'bg-primary text-white' : 'hover:bg-white/20'}`}>
                                    {voiceEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Chat Messages */}
                        <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto flex flex-col gap-4 custom-scrollbar">
                            <div className="flex justify-center mb-4">
                                <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 bg-white/10 rounded-full opacity-40">Today's Session</span>
                            </div>
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex gap-3 max-w-[90%] ${msg.type === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}
                                >
                                    <div className={`px-4 py-3 rounded-2xl text-[14px] leading-relaxed relative ${
                                        msg.type === 'user' 
                                            ? 'bg-primary text-white rounded-tr-none' 
                                            : 'glass border-primary/10 rounded-tl-none'
                                    }`}>
                                        {msg.text}
                                        {msg.risk && (
                                            <div className="mt-3 pt-2 border-t border-black/5 flex gap-2">
                                                <span className="text-[9px] font-black uppercase px-2 py-0.5 bg-accent/10 text-accent rounded-lg">{msg.risk} Risk</span>
                                            </div>
                                        )}
                                        <span className="block mt-1 text-[9px] font-bold opacity-40 uppercase tracking-widest">{msg.timestamp}</span>
                                    </div>
                                </motion.div>
                            ))}
                            {isTyping && (
                                <div className="flex gap-2 p-3 glass w-fit rounded-full rounded-tl-none">
                                    <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.4, 1, 0.4] }} className="w-1.5 h-1.5 bg-primary rounded-full"></motion.div>
                                    <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.4, 1, 0.4] }} transition={{ delay: 0.2 }} className="w-1.5 h-1.5 bg-primary rounded-full"></motion.div>
                                    <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.4, 1, 0.4] }} transition={{ delay: 0.4 }} className="w-1.5 h-1.5 bg-primary rounded-full"></motion.div>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-6 bg-white/5 border-t border-white/5">
                            <form onSubmit={handleSend} className="flex items-end gap-3 glass p-2 rounded-2xl border-white/10">
                                <button type="button" onClick={toggleListening} className={`p-3 rounded-xl transition-all ${isListening ? 'bg-accent text-white' : 'hover:bg-white/10'}`}>
                                    {isListening ? <Mic size={20} /> : <MicOff size={20} />}
                                </button>
                                <textarea
                                    ref={textareaRef}
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Type your reflections..."
                                    className="flex-1 bg-transparent py-2 px-1 outline-none text-sm resize-none custom-scrollbar min-h-[40px]"
                                    rows={1}
                                />
                                <button type="submit" disabled={!inputValue.trim()} className="p-3 bg-primary text-white rounded-xl shadow-lg disabled:opacity-50 active:scale-90 transition-all">
                                    <Send size={20} />
                                </button>
                            </form>
                            <div className="mt-4 flex items-center justify-center gap-2 opacity-30">
                                <Shield size={10} />
                                <span className="text-[9px] font-bold uppercase tracking-widest">Secure AES-256 Protected</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ChatBotWidget;
