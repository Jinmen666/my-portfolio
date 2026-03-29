import React from 'react';
import { motion } from 'motion/react';
import { EXPERIENCES } from '../constants';
import { FileText } from 'lucide-react';

export const Experience: React.FC = () => {
  return (
    <section className="py-20 bg-black text-white px-6">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-start">
        <div>
          <h2 className="text-5xl lg:text-6xl font-bold mb-8 leading-tight">
            Take a look at my <br />
            <span className="bg-brand-purple text-white px-4 rounded-lg inline-block transform -rotate-1">past experience</span>
          </h2>
          <p className="text-gray-400 text-xl mb-12 max-w-md">
            Eu pellentesque arcu ornare velit faucibus egestas gravida sed in purus enim molestie gravida imperdiet integer.
          </p>
          <button className="brutalist-button bg-white text-black border-white hover:bg-brand-pink hover:text-white transition-colors">
            <FileText size={20} />
            See full resume
          </button>
        </div>
        
        <div className="space-y-6">
          {EXPERIENCES.map((exp, index) => (
            <motion.div
              key={exp.role}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white text-black border-4 border-black rounded-3xl p-8 shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)]"
            >
              <div className="flex justify-between items-start mb-6">
                <span className="font-bold text-gray-500">{exp.period}</span>
                <div className={`w-12 h-12 ${exp.color} rounded-full border-4 border-black flex items-center justify-center`}>
                  <exp.icon size={24} className="text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4">{exp.role}</h3>
              <p className="text-gray-600">{exp.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
