import React from 'react';
import { motion } from 'motion/react';
import { Star, Zap, Heart, Sparkles } from 'lucide-react';

export const Marquee: React.FC = () => {
  const items = [
    { text: 'CREATIVE DESIGN', icon: <Zap size={24} /> },
    { text: 'USER EXPERIENCE', icon: <Heart size={24} /> },
    { text: 'PRODUCT STRATEGY', icon: <Star size={24} /> },
    { text: 'DIGITAL INNOVATION', icon: <Sparkles size={24} /> },
  ];

  return (
    <div className="overflow-hidden bg-brand-yellow py-2 border-y-2 border-black">
      <motion.div
        animate={{ x: [0, -1000] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 25,
            ease: "linear",
          },
        }}
        className="flex whitespace-nowrap gap-8 items-center"
      >
        {[...Array(10)].map((_, i) => (
          <React.Fragment key={i}>
            {items.map((item, index) => (
              <div key={`${i}-${index}`} className="flex items-center gap-3 text-black font-black text-lg tracking-tighter">
                {item.icon}
                <span>{item.text}</span>
              </div>
            ))}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
};
