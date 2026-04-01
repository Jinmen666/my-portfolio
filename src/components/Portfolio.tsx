import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../lib/supabaseClient';
import { Globe, ArrowUpRight, LayoutGrid } from 'lucide-react';

type Project = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  project_url: string;
  color: string;
  created_at: string;
};

export const Portfolio: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setProjects(data || []);
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="pt-48 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
      <div className="mb-20">
        <h2 className="text-5xl lg:text-8xl font-black mb-8 leading-tight tracking-tighter flex flex-wrap items-center gap-y-4">
          <span className="flex items-center">
            {['产', '品', '展', '示'].map((char, i) => (
              <motion.span
                key={`portfolio-title-${i}`}
                initial={{ opacity: 0, y: 20, rotate: -10 }}
                whileInView={{ opacity: 1, y: 0, rotate: i % 2 === 0 ? -5 : 5 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="inline-block hover:scale-110 transition-transform cursor-default"
              >
                {char}
              </motion.span>
            ))}
          </span>
          <span className="flex items-center ml-4">
            {'PORTFOLIO'.split('').map((char, i) => (
              <motion.span
                key={`portfolio-en-${i}`}
                initial={{ opacity: 0, scale: 0.5, rotate: 20 }}
                whileInView={{ opacity: 1, scale: 1, rotate: i % 2 === 0 ? 3 : -3 }}
                viewport={{ once: true }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: 0.4 + i * 0.1
                }}
                className="relative inline-block px-4 py-2 mx-1 text-white hover:-translate-y-2 transition-transform cursor-default text-3xl md:text-4xl"
              >
                <span className="relative z-10">{char}</span>
                <span className={`absolute inset-0 bg-brand-pink transform ${i % 2 === 0 ? '-rotate-3' : 'rotate-3'} rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}></span>
              </motion.span>
            ))}
          </span>
        </h2>
        <motion.div 
          initial={{ width: 0 }}
          whileInView={{ width: '12rem' }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.8, ease: "circOut" }}
          className="h-4 bg-brand-pink border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative"
        >
          <div className="absolute -right-2 -top-2 w-4 h-4 bg-white border-2 border-black rounded-full animate-bounce"></div>
        </motion.div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {[1, 2, 3].map(i => (
            <div key={i} className="brutalist-card p-6 bg-white animate-pulse">
              <div className="aspect-video bg-gray-200 border-4 border-black rounded-2xl mb-6"></div>
              <div className="h-8 bg-gray-200 border-2 border-black rounded-lg mb-4 w-3/4"></div>
              <div className="h-4 bg-gray-200 border-2 border-black rounded-lg mb-2"></div>
              <div className="h-4 bg-gray-200 border-2 border-black rounded-lg w-1/2"></div>
            </div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="brutalist-card p-12 text-center bg-white">
          <p className="text-2xl font-black italic">这里暂时还没有作品，正在努力搬砖中...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`brutalist-card p-6 ${project.color} group hover:translate-y-[-8px] hover:translate-x-[4px] transition-all`}
            >
              <div className="relative aspect-video border-[6px] border-black rounded-[32px] overflow-hidden mb-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all">
                <img 
                  src={project.image_url} 
                  alt={project.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <div className="w-16 h-16 bg-white border-4 border-black rounded-full flex items-center justify-center rotate-[-10deg] group-hover:rotate-0 transition-transform">
                      <LayoutGrid size={32} />
                   </div>
                </div>
              </div>
              
              <h3 className="text-3xl font-black mb-4 leading-none tracking-tighter">{project.title}</h3>
              <p className="text-gray-800 font-bold mb-8 line-clamp-2 text-lg leading-snug">
                {project.description}
              </p>
              
              {project.project_url && (
                <a 
                  href={project.project_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="brutalist-button brutalist-button-primary w-full justify-center text-xl py-4"
                >
                  <span>查看演示 / DEMO</span>
                  <ArrowUpRight size={24} />
                </a>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
};
