import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, ScanSearch, ShieldCheck } from 'lucide-react';
import { useTheme } from '../ThemeContext';

const HowItWorks = () => {
    const { darkMode } = useTheme();
    const steps = [
        {
            id: 1,
            title: 'Express Yourself',
            description: 'Engage with our friendly AI through voice or text in a safe, judgment-free environment.',
            icon: <MessageSquare className="w-8 h-8 text-primary" />
        },
        {
            id: 2,
            title: 'AI Analysis',
            description: 'Our proprietary NLP engine analyzes tone, sentiment, and emotional patterns in real-time.',
            icon: <ScanSearch className="w-8 h-8 text-accent" />
        },
        {
            id: 3,
            title: 'Get Guidance',
            description: 'Receive an accurate risk score and actionable insights to guide your mental wellness journey.',
            icon: <ShieldCheck className="w-8 h-8 text-emerald-500" />
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.3 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.9, y: 20 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { type: 'spring', stiffness: 100, damping: 20 }
        }
    };

    return (
        <section id="how-it-works" className="py-24 transition-colors duration-500 relative overflow-hidden">
            <div className="container mx-auto px-6 max-w-7xl relative z-10">
                <div className="text-center mb-20">
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-bold mb-6"
                    >
                        Healing in Three Steps
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="opacity-60 max-w-2xl mx-auto text-lg font-medium"
                    >
                        A seamless, science-backed flow designed to accurately map your emotional landscape.
                    </motion.p>
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid md:grid-cols-3 gap-12"
                >
                    {steps.map((step, index) => (
                        <motion.div
                            key={step.id}
                            variants={itemVariants}
                            className="relative flex flex-col items-center text-center group"
                        >
                            <div className="w-24 h-24 rounded-[2rem] glass border-primary/20 flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-500 shadow-xl shadow-primary/5">
                                <div className="absolute -top-3 -right-3 w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center font-bold shadow-lg">
                                    0{step.id}
                                </div>
                                {step.icon}
                            </div>

                            <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                            <p className="opacity-60 leading-relaxed font-medium px-4">
                                {step.description}
                            </p>

                            {index < steps.length - 1 && (
                                <div className="hidden lg:block absolute top-12 left-[70%] w-full h-[2px] bg-gradient-to-r from-primary/20 to-transparent -z-10" />
                            )}
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default HowItWorks;
