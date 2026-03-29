import React from 'react';
import { motion } from 'motion/react';
import { FolderOpen, PenTool, Camera } from 'lucide-react';

interface ServicesProps {
  onTabClick?: (id: string) => void;
}

export const Services: React.FC<ServicesProps> = ({ onTabClick }) => {
  const sections = [
    {
      id: 'daily',
      title: '日常',
      description: '记录羊村伙伴的日常点滴与练习瞬间。',
      icon: <Camera size={40} />,
      color: 'bg-brand-yellow',
      delay: 0.1
    },
    {
      id: 'articles',
      title: '文章',
      description: '分享我的技术心得、摸鱼技巧与生活感悟。',
      icon: <PenTool size={40} />,
      color: 'bg-brand-blue',
      delay: 0.2
    },
    {
      id: 'works',
      title: '产品展示',
      description: '展示我过去两年半的练习成果与项目作品。',
      icon: <FolderOpen size={40} />,
      color: 'bg-brand-pink',
      delay: 0.3
    }
  ];

  return (
    <section className="py-20 px-6 max-w-5xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl lg:text-6xl font-bold mb-4 tracking-tight">
          实用的 <span className="bg-brand-pink text-white px-4 rounded-lg inline-block transform -rotate-1">小程序</span>
        </h2>
        <div className="h-2 w-32 bg-brand-pink mx-auto rounded-full mt-4"></div>
      </div>
      <div className="flex flex-col gap-12">
        {sections.map((section) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, x: section.id === 'articles' ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: section.delay, type: "spring", stiffness: 100 }}
            onClick={() => onTabClick?.(section.id)}
            className={`brutalist-card p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 cursor-pointer group hover:translate-x-2 transition-transform ${section.color}`}
          >
            <div className="w-24 h-24 shrink-0 bg-white border-4 border-black rounded-2xl flex items-center justify-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all group-hover:rotate-3">
              {section.icon}
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-6">
                {section.title.split('').map((char, i) => (
                  <span 
                    key={i} 
                    className={`text-4xl font-black px-3 py-1 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white transform ${i % 2 === 0 ? '-rotate-3' : 'rotate-3'} group-hover:rotate-0 transition-transform`}
                  >
                    {char}
                  </span>
                ))}
              </div>
              <p className="text-black/80 text-xl leading-relaxed max-w-2xl">
                {section.description}
              </p>
            </div>
            <div className="shrink-0 font-bold text-lg uppercase tracking-widest border-4 border-black px-6 py-3 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[8px_8px_0px_0px_rgba(255,107,129,1)] transition-all">
              立即进入
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
