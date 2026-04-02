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
import { Mascot } from './components/Mascot';
import { AdminDaily } from './components/AdminDaily';
import { AdminArticles } from './components/AdminArticles';
import { AdminProjects } from './components/AdminProjects';
import { AdminHub } from './components/AdminHub';
import { AdminProfile } from './components/AdminProfile';
import { MessageSquare, X, Send, User, ExternalLink } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab && ['home', 'about', 'works', 'articles', 'daily'].includes(tab)) {
      setActiveTab(tab);
    }
  }, []);

  const setActiveTabWithUrl = (tab: string) => {
    setActiveTab(tab);
    const url = new URL(window.location.href);
    if (tab === 'home') {
      url.searchParams.delete('tab');
      url.searchParams.delete('article');
    } else {
      url.searchParams.set('tab', tab);
      if (tab !== 'articles') url.searchParams.delete('article');
    }
    window.history.replaceState({}, '', url.toString());
  };

  if (window.location.pathname === '/admin/hub') {
    return <AdminHub />;
  }

  if (window.location.pathname === '/admin/profile') {
    return <AdminProfile />;
  }

  if (window.location.pathname === '/admin') {
    return <AdminDaily />;
  }

  if (window.location.pathname === '/admin/articles') {
    return <AdminArticles />;
  }

  if (window.location.pathname === '/admin/projects') {
    return <AdminProjects />;
  }

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    alert(`收到您的留言：${chatMessage}\n（此功能为演示，实际消息将存储在数据库中）`);
    setChatMessage('');
    setIsChatOpen(false);
  };

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
            <Hero onAboutClick={() => setActiveTabWithUrl('about')} />
            <Services onTabClick={(id) => setActiveTabWithUrl(id)} />
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
      <Navbar activeTab={activeTab} setActiveTab={setActiveTabWithUrl} />
      
      <main className="min-h-[80vh]">
        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>
      </main>

      <Marquee />
      <Mascot />
      <Footer setActiveTab={setActiveTabWithUrl} />
      
      {/* Floating Chat Bubble */}
      <div className="fixed bottom-8 right-8 z-50">
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className="absolute bottom-20 right-0 w-80 brutalist-card bg-white p-6 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-black italic">给站长留言</h3>
                <button onClick={() => setIsChatOpen(false)} className="p-1 hover:bg-gray-100 rounded-full">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleChatSubmit} className="space-y-4">
                <textarea
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="有什么想说的吗？"
                  className="w-full p-4 border-4 border-black rounded-xl font-bold focus:outline-none focus:ring-4 focus:ring-brand-yellow/20 h-32 resize-none"
                />
                <button type="submit" className="brutalist-button brutalist-button-primary w-full py-3 justify-center">
                  发送消息
                  <Send size={18} />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <button 
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="w-16 h-16 bg-brand-yellow border-4 border-black rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center hover:translate-y-[-4px] transition-transform active:translate-y-0 active:shadow-none"
        >
          {isChatOpen ? <X size={32} /> : <MessageSquare size={32} />}
        </button>
      </div>
    </div>
  );
}
