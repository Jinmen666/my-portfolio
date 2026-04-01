import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp, Moon, Sun, Monitor, Coffee } from 'lucide-react';

export const Mascot: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [message, setMessage] = useState('拽我一下试试！✨');

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMessage('起飞咯！🚀');
    setTimeout(() => setMessage('拽我一下试试！✨'), 2000);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    setMessage(isDarkMode ? '天亮啦！☀️' : '晚安时间！🌙');
    setTimeout(() => setMessage('拽我一下试试！✨'), 2000);
  };

  const drinkCoffee = () => {
    setMessage('真香！☕️');
    setTimeout(() => setMessage('精神满满！💪'), 2000);
    setTimeout(() => setMessage('拽我一下试试！✨'), 4000);
  };

  return (
    <div className="fixed bottom-10 right-10 z-50 flex flex-col items-center gap-4 hidden md:flex">
      {/* Scroll Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 10, scale: 0.5 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.5 }}
            onClick={scrollToTop}
            className="w-12 h-12 bg-white border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center hover:bg-brand-blue hover:text-white transition-colors"
          >
            <ArrowUp size={24} strokeWidth={3} />
          </motion.button>
        )}
      </AnimatePresence>

      <motion.div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        drag
        dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
        whileHover={{ scale: 1.1 }}
        className="relative cursor-grab active:cursor-grabbing"
      >
        {/* Speech Bubble */}
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.5 }}
          animate={{ 
            opacity: isHovered ? 1 : 0, 
            y: isHovered ? -70 : 10,
            scale: isHovered ? 1 : 0.5
          }}
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 bg-white border-4 border-black px-4 py-2 rounded-2xl font-black text-xs whitespace-nowrap shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] pointer-events-none"
        >
          {message}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-black"></div>
        </motion.div>

        {/* Action Menu (Visible on hover) */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: -80 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute top-0 flex flex-col gap-2"
            >
              <button onClick={toggleTheme} title="切换主题" className="w-10 h-10 bg-brand-yellow border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center hover:translate-y-[-2px] transition-transform">
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button onClick={drinkCoffee} title="喝咖啡" className="w-10 h-10 bg-brand-pink border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center hover:translate-y-[-2px] transition-transform">
                <Coffee size={18} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Character Body */}
        <motion.div
          animate={{
            y: [0, -10, 0],
            rotate: isHovered ? [0, -5, 5, 0] : 0
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="relative w-20 h-20 bg-brand-yellow border-4 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center justify-center gap-2 overflow-hidden"
        >
          {/* Eyes */}
          <div className="flex gap-4">
            <motion.div 
              animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
              transition={{ duration: 3, repeat: Infinity, times: [0, 0.45, 0.5, 0.55, 1] }}
              className="w-3 h-3 bg-black rounded-full"
            />
            <motion.div 
              animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
              transition={{ duration: 3, repeat: Infinity, times: [0, 0.45, 0.5, 0.55, 1] }}
              className="w-3 h-3 bg-black rounded-full"
            />
          </div>
          {/* Mouth */}
          <motion.div 
            animate={{ 
              width: isHovered ? 24 : 12,
              height: isHovered ? 12 : 4,
              borderRadius: isHovered ? "0 0 12px 12px" : "2px"
            }}
            className="bg-black rounded-full"
          />
          {/* Blush */}
          <div className="absolute bottom-4 flex justify-between w-full px-2">
            <div className="w-3 h-1.5 bg-brand-pink/40 rounded-full blur-[1px]" />
            <div className="w-3 h-1.5 bg-brand-pink/40 rounded-full blur-[1px]" />
          </div>
        </motion.div>
        
        {/* Little Feet */}
        <div className="flex justify-around w-full px-4 -mt-1">
          <div className="w-4 h-3 bg-black rounded-t-lg" />
          <div className="w-4 h-3 bg-black rounded-t-lg" />
        </div>
      </motion.div>
    </div>
  );
};
