import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ARTICLES, TESTIMONIALS } from '../constants';
import { ArrowRight, PenTool, ChevronDown, ChevronUp } from 'lucide-react';

export const ArticlesAndTestimonials: React.FC = () => {
  const [showAll, setShowAll] = useState(false);
  const displayedArticles = showAll ? ARTICLES : ARTICLES.slice(0, 3);
  const featuredArticle = displayedArticles[0];
  const listArticles = displayedArticles.slice(1);

  return (
    <section className="pt-48 pb-20 px-6 max-w-7xl mx-auto">
      {/* Articles */}
      <div>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <h2 className="text-4xl lg:text-5xl font-bold leading-tight tracking-tight">文章与资讯</h2>
          <button 
            onClick={() => setShowAll(!showAll)}
            className="brutalist-button brutalist-button-secondary"
          >
            {showAll ? <ChevronUp size={20} /> : <PenTool size={20} />}
            {showAll ? 'Show less' : 'Browse all articles'}
          </button>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Featured Article */}
          <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="brutalist-card p-6 flex flex-col"
          >
            <div className="relative mb-6 border-4 border-black rounded-2xl overflow-hidden aspect-video">
              <img
                src={featuredArticle.image}
                alt={featuredArticle.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="absolute top-4 right-4 bg-black text-white text-xs font-bold px-3 py-1 rounded-full">
                {featuredArticle.category}
              </span>
            </div>
            <h3 className="text-2xl font-bold mb-6 flex-grow">{featuredArticle.title}</h3>
            <div className="flex items-center gap-4 pt-6 border-t-2 border-gray-100">
              <div className="w-10 h-10 rounded-full border-2 border-black overflow-hidden">
                <img src="https://picsum.photos/seed/author/100/100" alt={featuredArticle.author} />
              </div>
              <div>
                <p className="font-bold text-sm">{featuredArticle.author}</p>
                <p className="text-gray-500 text-xs">{featuredArticle.date}</p>
              </div>
            </div>
          </motion.div>
          
          {/* Article List */}
          <div className="space-y-8">
            <AnimatePresence mode="popLayout">
              {listArticles.map((article, index) => (
                <motion.div
                  key={article.title}
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="brutalist-card p-6 flex gap-6 items-center"
                >
                  <div className="w-1/3 aspect-square border-4 border-black rounded-xl overflow-hidden bg-gray-100 hidden sm:block">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-grow">
                    <span className="bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded-full mb-3 inline-block">
                      {article.category}
                    </span>
                    <h3 className="text-xl font-bold mb-4 leading-tight">{article.title}</h3>
                    <p className="text-gray-500 text-sm">
                      Lorem ipsum dolor sit amet dolor consectetur adipiscing elit ectus
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};
