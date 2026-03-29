import React from 'react';
import { motion } from 'motion/react';
import { User, Award, CheckCircle2 } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <section className="pt-48 pb-20 px-6 max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-20 items-center mb-32">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="brutalist-card bg-brand-pink p-4 aspect-video flex items-center justify-center overflow-hidden rounded-3xl border-8">
            <img
              src="/about-me.png.png"
              alt="关于我"
              className="w-full h-full object-cover rounded-2xl border-4 border-black"
              referrerPolicy="no-referrer"
            />
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl lg:text-6xl font-bold mb-8 leading-[1.15] tracking-[-0.01em]">
            我是 <span className="bg-brand-pink text-white px-4 rounded-lg inline-block transform -rotate-1">谁？</span>🧐
          </h2>
          <div className="space-y-6 mb-12">
            <p className="font-bold italic text-[20px] text-[#644a65] font-[Georgia] leading-relaxed">
              我是一个人，我既不是他，也不是她，俺就是俺。☆*: .｡. o(≧▽≦)o .｡.:*☆
            </p>
            <p className="font-bold italic text-[20px] text-[#644a65] font-[Georgia] leading-relaxed">
              不知道说什么，先这样说😎😎😎
            </p>
          </div>
          
          <button className="brutalist-button brutalist-button-primary">
            <User size={20} />
            More about me
          </button>
        </motion.div>
      </div>
    </section>
  );
};
