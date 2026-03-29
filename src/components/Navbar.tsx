import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'motion/react';
import { Mail } from 'lucide-react';
import { NAV_ITEMS } from '../constants';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (id: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();
  const lastScrollY = useRef(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = lastScrollY.current;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
    lastScrollY.current = latest;
  });

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <motion.nav 
      variants={{
        visible: { y: 0, opacity: 1 },
        hidden: { y: -100, opacity: 0 },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="fixed top-8 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl"
    >
      <div className="bg-white border-4 border-black rounded-full px-8 py-3 flex items-center justify-between shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => handleNavClick('home')}
            className="w-8 h-8 border-4 border-black rounded-full flex items-center justify-center font-bold text-xl hover:bg-brand-yellow transition-colors"
          >
            O
          </button>
        </div>
        
        <ul className="flex items-center justify-center flex-1 px-4">
          {NAV_ITEMS.map((item) => (
            <li key={item.id} className="flex-1 flex justify-center">
              <button
                onClick={() => handleNavClick(item.id)}
                className={`relative font-bold text-base tracking-wide transition-all px-6 py-2 rounded-xl uppercase ${
                  activeTab === item.id 
                    ? 'text-white bg-black shadow-[4px_4px_0px_0px_rgba(255,107,129,1)]' 
                    : 'text-black hover:bg-gray-100'
                }`}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        <button className="bg-black text-white p-2 rounded-lg hover:bg-brand-pink transition-colors">
          <Mail size={20} />
        </button>
      </div>
    </motion.nav>
  );
};
