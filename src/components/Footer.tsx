import React from 'react';
import { motion } from 'motion/react';
import { Mail } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="bg-black text-white pt-12 pb-6 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Motivation Banner */}
        <div className="relative -top-8 mb-8">
          <div className="bg-brand-yellow border-2 border-black rounded-[24px] p-4 lg:p-6 flex items-center justify-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
            <motion.h2 
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              className="text-[clamp(1rem,3vw,2rem)] font-black text-black text-center leading-none tracking-tighter italic uppercase transform -rotate-1"
            >
              为我们美好的生活奋斗！！！
            </motion.h2>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <div className="flex flex-col">
            <h4 className="text-[clamp(1.5rem,4vw,1.875rem)] lg:text-3xl font-bold leading-tight mb-8">
              让我们<br />
              携手创造非凡的成就。
            </h4>
            <p className="text-[clamp(1rem,2vw,1.25rem)] font-medium text-gray-400">
              一定会成为一个伟大的伟人！
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <h4 className="text-xl font-bold mb-8">工具</h4>
            <ul className="space-y-4 text-gray-400">
              <li>
                <button 
                  onClick={() => { setActiveTab('home'); window.scrollTo(0, 0); }} 
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  首页
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveTab('about'); window.scrollTo(0, 0); }} 
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  关于我
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveTab('daily'); window.scrollTo(0, 0); }} 
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  日常
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveTab('articles'); window.scrollTo(0, 0); }} 
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  文章
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveTab('works'); window.scrollTo(0, 0); }} 
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  产品
                </button>
              </li>
            </ul>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <h4 className="text-xl font-bold mb-8">联系我</h4>
            <ul className="space-y-4 text-gray-400 flex flex-col items-center">
              <li className="flex items-center gap-3">
                <Mail size={18} /> dewd55778@gmail.com
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-12 border-t border-gray-800 text-center text-gray-500 text-sm">
          <p>Made by Nikhil - Powered by VO</p>
        </div>
      </div>
    </footer>
  );
};
