import React from 'react';
import { motion } from 'motion/react';
import { User, Award, CheckCircle2 } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <section className="pt-48 pb-20 px-6 max-w-7xl mx-auto">
      <div className="grid gap-20 items-center mb-32">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="mx-auto text-center flex flex-col items-center max-w-3xl"
        >
          <h2 className="text-5xl lg:text-6xl font-bold mb-8 leading-[1.15] tracking-[-0.01em] tracking-tighter flex flex-wrap justify-center gap-y-4">
            <span className="flex items-center">
              {['我', '是'].map((char, i) => (
                <motion.span
                  key={`about-title-1-${i}`}
                  initial={{ opacity: 0, y: 20, rotate: -10 }}
                  animate={{ opacity: 1, y: 0, rotate: i % 2 === 0 ? -5 : 5 }}
                  transition={{ delay: i * 0.1 }}
                  className="inline-block hover:scale-110 transition-transform cursor-default"
                >
                  {char}
                </motion.span>
              ))}
            </span>

            <span className="flex items-center mx-4">
              {['谁', '？'].map((char, i) => (
                <motion.span
                  key={`about-title-2-${i}`}
                  initial={{ opacity: 0, scale: 0.5, rotate: 20 }}
                  animate={{ opacity: 1, scale: 1, rotate: i % 2 === 0 ? 3 : -3 }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    delay: 0.2 + i * 0.1
                  }}
                  className="relative inline-block px-4 py-2 mx-1 text-white hover:-translate-y-2 transition-transform cursor-default"
                >
                  <span className="relative z-10">{char}</span>
                  <span className={`absolute inset-0 ${i === 0 ? 'bg-brand-pink' : 'bg-brand-blue'} transform ${i % 2 === 0 ? '-rotate-3' : 'rotate-3'} rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}></span>
                </motion.span>
              ))}
            </span>
          </h2>
          <div className="space-y-4 mb-12 text-gray-600 text-xl font-medium italic">
            <p>“我是一个人，我既不是他，也不是她，俺就是俺。”</p>
            <p>“不知道说什么，先这样说。”</p>
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
