import React from 'react';
import { motion } from 'framer-motion';
import { Bot, HeartPulse, ShieldAlert, Lock, Zap, BarChart } from 'lucide-react';
import { useTheme } from '../ThemeContext';

const CoreFeatures = () => {
    const { darkMode } = useTheme();
    const features = [
        {
            id: 1,
            name: 'AI Chatbot',
            description: 'Engage in natural, empathetic conversations backed by cutting-edge NLP technology.',
            icon: <Bot className="w-8 h-8" />
        },
        {
            id: 2,
            name: 'Emotion Detection',
            description: 'Real-time analysis of text patterns and tone to detect underlying emotional states.',
            icon: <HeartPulse className="w-8 h-8" />
        },
        {
            id: 3,
            name: 'Risk Scoring',
            description: 'Proprietary algorithms that assign stress and depression risk scores accurately.',
            icon: <ShieldAlert className="w-8 h-8" />
        },
        {
            id: 4,
            name: 'Privacy First',
            description: 'End-to-end encryption ensuring your mental health data is visible only to you.',
            icon: <Lock className="w-8 h-8" />
        },
        {
            id: 5,
            name: 'Instant Insights',
            description: 'Get immediate feedback and coping strategies tailored to your current emotional state.',
            icon: <Zap className="w-8 h-8" />
        },
        {
            id: 6,
            name: 'Clinical Dashboard',
            description: 'Export actionable reports and trends to share with your healthcare provider.',
            icon: <BarChart className="w-8 h-8" />
        }
    ];

    return (
        <section id="features" className="py-24 transition-colors duration-500 overflow-hidden">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="text-center mb-16">
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-bold mb-6"
                    >
                        Core Features
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="opacity-60 max-w-2xl mx-auto text-lg font-medium"
                    >
                        Advanced machine learning combined with deep clinical insights to provide safe and empathetic care.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="group relative glass p-8 rounded-[2.5rem] border-white/10 dark:border-primary/5 cursor-pointer shadow-xl shadow-slate-200/20 dark:shadow-none"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-primary/10 dark:bg-primary/20 text-primary flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-inner">
                                {feature.icon}
                            </div>
                            <h3 className="text-2xl font-bold mb-4">
                                {feature.name}
                            </h3>
                            <p className="opacity-60 leading-relaxed font-medium">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CoreFeatures;
