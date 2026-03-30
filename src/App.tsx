import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { About } from './components/About';
import { Portfolio } from './components/Portfolio';
import { Experience } from './components/Experience';
import { ArticlesAndTestimonials } from './components/ArticlesAndTestimonials';
import { DailyLife } from './components/DailyLife';
import { Footer } from './components/Footer';
import { Marquee } from './components/Marquee';
import { AdminDaily } from './components/AdminDaily';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  if (window.location.pathname === '/admin') {
    return <AdminDaily />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <motion.div
            key="home"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Hero onAboutClick={() => setActiveTab('about')} />
            <Services onTabClick={(id) => setActiveTab(id)} />
          </motion.div>
        );
      case 'about':
        return (
          <motion.div
            key="about"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <About />
          </motion.div>
        );
      case 'works':
        return (
          <motion.div
            key="works"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Portfolio />
          </motion.div>
        );
      case 'articles':
        return (
          <motion.div
            key="articles"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <ArticlesAndTestimonials />
          </motion.div>
        );
      case 'daily':
        return (
          <motion.div
            key="daily"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <DailyLife />
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen selection:bg-brand-yellow selection:text-black">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="min-h-[80vh]">
        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>
      </main>

      <Marquee />
      <Footer setActiveTab={setActiveTab} />
      
      {/* Floating Chat Bubble */}
      <div className="fixed bottom-8 right-8 z-50">
        <button className="w-16 h-16 bg-white border-4 border-black rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center hover:translate-y-[-2px] transition-transform">
          <img
            src="https://picsum.photos/seed/chat/100/100"
            alt="Chat"
            className="w-12 h-12 rounded-full border-2 border-black"
          />
        </button>
      </div>
    </div>
  );
}
