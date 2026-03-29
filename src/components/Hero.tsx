import React from 'react';
import { motion } from 'motion/react';
import { Mail, FolderOpen, User } from 'lucide-react';

interface HeroProps {
  onAboutClick?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onAboutClick }) => {
  return (
    <section className="pt-48 pb-20 px-6 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-6xl lg:text-8xl font-bold leading-tight mb-8">
          我是谁？
        </h1>
        
        <div className="font-bold italic text-[20px] text-[#644a65] mb-10 max-w-xl font-[Georgia] flex flex-col gap-2">
          <p>我是一个人，我既不是他，也不是她，俺就是俺。☆*: .｡. o(≧▽≦)o .｡.:*☆</p>
          <p>不知道说什么，先这样说😎😎😎</p>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={onAboutClick}
            className="brutalist-button brutalist-button-primary"
          >
            <User size={20} />
            关于我的信息
          </button>
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: 1, 
          scale: 1
        }}
        whileHover={{ 
          scale: 1.05, 
          rotate: -2,
          y: [0, -8, 0],
          transition: { 
            y: {
              repeat: Infinity,
              duration: 2,
              ease: "easeInOut"
            },
            type: "spring", 
            stiffness: 300, 
            damping: 10 
          }
        }}
        transition={{ 
          opacity: { duration: 0.6, delay: 0.2 },
          scale: { duration: 0.6, delay: 0.2 }
        }}
        className="relative cursor-pointer group"
      >
        <div className="brutalist-card bg-brand-yellow p-4 aspect-video flex items-end justify-center overflow-hidden transition-all group-hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
          <img
            src="/hero-sheep.jpg.png"
            alt="羊村伙伴"
            className="w-full h-full object-cover rounded-2xl border-4 border-black transition-transform group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
        </div>
      </motion.div>
    </section>
  );
};
