import React from 'react';
import { useTheme } from '../ThemeContext';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import HowItWorks from '../components/HowItWorks';
import CoreFeatures from '../components/CoreFeatures';
import DemoSection from '../components/DemoSection';
import DashboardPreview from '../components/DashboardPreview';
import Testimonials from '../components/Testimonials';
import Impact from '../components/Impact';
import CTASection from '../components/CTASection';
import Footer from '../components/Footer';
import ChatBotWidget from '../components/ChatBotWidget';

const LandingPage = () => {
    const { darkMode } = useTheme();
    
    return (
        <div className={`overflow-x-hidden min-h-screen transition-colors duration-500 ${darkMode ? 'bg-background-dark text-white' : 'bg-background-light text-slate-900'}`}>
            <Navbar />
            <main>
                <HeroSection />
                <HowItWorks />
                <CoreFeatures />
                <DemoSection />
                <DashboardPreview />
                <Testimonials />
                <Impact />
                <CTASection />
            </main>
            <Footer />
            <ChatBotWidget />
        </div>
    );
};

export default LandingPage;
