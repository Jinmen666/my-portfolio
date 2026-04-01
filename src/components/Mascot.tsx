import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp, Moon, Sun, Coffee } from 'lucide-react';

export const Mascot: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [message, setMessage] = useState('拽我一下试试！✨');

  useEffect(() => {
    const stored = localStorage.getItem('site_theme');
    const preferred = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldDark = stored ? stored === 'night' : preferred;
    setIsDarkMode(shouldDark);
    document.documentElement.classList.toggle('theme-night', shouldDark);
  }, []);

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
    const next = !isDarkMode;
    setIsDarkMode(next);
    localStorage.setItem('site_theme', next ? 'night' : 'day');
    document.documentElement.classList.toggle('theme-night', next);
    setMessage(next ? '晚安时间！🌙' : '天亮啦！☀️');
    setTimeout(() => setMessage('拽我一下试试！✨'), 2000);
  };

  const drinkCoffee = () => {
    setMessage('真香！☕️');
    setTimeout(() => setMessage('精神满满！💪'), 2000);
    setTimeout(() => setMessage('拽我一下试试！✨'), 4000);
  };

  return (
    <motion.div
      className="fixed bottom-10 right-10 z-50 hidden md:block"
      drag
      dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
      whileHover={{ scale: 1.02 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-[180px] h-[160px]">
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, y: 10, scale: 0.5 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.5 }}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                scrollToTop();
              }}
              className="absolute top-0 right-0 w-12 h-12 bg-white border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center hover:bg-brand-blue hover:text-white transition-colors"
            >
              <ArrowUp size={24} strokeWidth={3} />
            </motion.button>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="absolute top-14 left-0 flex flex-col gap-2"
              onPointerDown={(e) => e.stopPropagation()}
            >
              <button
                onClick={toggleTheme}
                title="切换主题"
                className="w-12 h-12 bg-brand-yellow border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center hover:translate-y-[-2px] transition-transform"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button
                onClick={drinkCoffee}
                title="喝咖啡"
                className="w-12 h-12 bg-brand-pink border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center hover:translate-y-[-2px] transition-transform"
              >
                <Coffee size={20} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.5 }}
          animate={{
            opacity: isHovered ? 1 : 0,
            y: isHovered ? 0 : 10,
            scale: isHovered ? 1 : 0.5
          }}
          className="absolute bottom-[92px] right-0 bg-white border-4 border-black px-4 py-2 rounded-2xl font-black text-xs whitespace-nowrap shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] pointer-events-none"
        >
          {message}
          <div className="absolute top-full right-6 border-8 border-transparent border-t-black"></div>
        </motion.div>

        <motion.div className="absolute bottom-0 right-0">
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: isHovered ? [0, -5, 5, 0] : 0
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="relative w-20 h-20 bg-brand-yellow border-4 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center justify-center gap-2 overflow-hidden"
          >
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
            <motion.div
              animate={{
                width: isHovered ? 24 : 12,
                height: isHovered ? 12 : 4,
                borderRadius: isHovered ? '0 0 12px 12px' : '2px'
              }}
              className="bg-black rounded-full"
            />
            <div className="absolute bottom-4 flex justify-between w-full px-2">
              <div className="w-3 h-1.5 bg-brand-pink/40 rounded-full blur-[1px]" />
              <div className="w-3 h-1.5 bg-brand-pink/40 rounded-full blur-[1px]" />
            </div>
          </motion.div>

          <div className="flex justify-around w-full px-4 -mt-1">
            <div className="w-4 h-3 bg-black rounded-t-lg" />
            <div className="w-4 h-3 bg-black rounded-t-lg" />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
