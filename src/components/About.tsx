import React from 'react';
import { motion } from 'motion/react';
import { supabase } from '../lib/supabaseClient';
import { 
  User, 
  BookOpen, 
  Tv, 
  Wrench, 
  MapPin, 
  Calendar,
  Rocket,
  Code,
  Briefcase,
  Gamepad2,
  ChevronRight,
  Send,
  Star,
  Zap,
  ArrowRight,
  MoveRight,
  Circle,
  Square,
  Triangle,
  Plus,
  X,
  Heart,
  Cloud,
  Smile,
  Ghost
} from 'lucide-react';

const ICON_MAP: Record<string, React.ReactNode> = {
  rocket: <Rocket />,
  briefcase: <Briefcase />,
  code: <Code />,
  gamepad: <Gamepad2 />,
  tv: <Tv />,
  book: <BookOpen />,
  wrench: <Wrench />,
  star: <Star />,
  heart: <Heart />,
  ghost: <Ghost />,
  map: <MapPin />,
};

const FloatingDecoration: React.FC<{ 
  children: React.ReactNode, 
  className?: string, 
  animate?: any,
  transition?: any
}> = ({ children, className, animate, transition }) => (
  <motion.div 
    className={`absolute pointer-events-none select-none ${className}`}
    animate={animate || { 
      y: [0, -10, 0], 
      rotate: [0, 5, -5, 0],
      scale: [1, 1.05, 0.95, 1]
    }}
    transition={transition || { 
      duration: 5 + Math.random() * 5, 
      repeat: Infinity, 
      ease: "easeInOut" 
    }}
  >
    {children}
  </motion.div>
);

export const About: React.FC = () => {
  const [profile, setProfile] = React.useState<any>(null);
  const [experiences, setExperiences] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      const { data: pData } = await supabase.from('profile').select('*').maybeSingle();
      const { data: eData } = await supabase.from('experiences').select('*').order('sort_order', { ascending: true });
      
      if (pData) setProfile(pData);
      if (eData) setExperiences(eData);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  if (isLoading) return <div className="pt-48 pb-20 text-center font-black text-2xl animate-pulse">正在加载数据...</div>;

  // Fallback and merging logic
  const defaults = {
    intro_title: 'Welcome to',
    intro_name: '我的世界',
    name: '简约',
    major: '计算机应用工程',
    job: '摆烂的学生',
    bio: '俺出生在山东菏泽曹县的一个小村子长大。曹县这个县前几年有个梗（山东菏泽曹县牛B666我的宝贝😁😁）\n\n我是一只高精力死宅，对出去游山玩水无感，但脑子里 idea 疯狂溢出。现实中轻微社恐，但在网络上结交了一群素未谋面的电子好友！\n\n目前是一名计算机应用工程专业的学生，平时除了学习就是在探索数字世界的奥秘。',
    statement: '在平庸的生活里，也要打捞起那些发光的瞬间 ✨',
    recent_reading: '《纳瓦尔宝典》',
    recent_watching: '整太线失事视频',
    recent_interest: 'AI 编程',
    avatar_url: 'https://picsum.photos/seed/id/200/200'
  };

  const d = profile ? {
    intro_title: profile.intro_title || defaults.intro_title,
    intro_name: profile.intro_name || defaults.intro_name,
    name: profile.name || defaults.name,
    major: profile.major || defaults.major,
    job: profile.job || defaults.job,
    statement: profile.statement || defaults.statement,
    recent_reading: profile.recent_reading || defaults.recent_reading,
    recent_watching: profile.recent_watching || defaults.recent_watching,
    recent_interest: profile.recent_interest || defaults.recent_interest,
    avatar_url: profile.avatar_url || defaults.avatar_url,
    bio: profile.bio || defaults.bio,
  } : defaults;

  const mainMissions = experiences.length > 0 ? experiences.filter(e => e.type === 'main') : [
    { date: '2025.09', title: '主线任务点', desc: '在管理后台编辑此处', icon_type: 'rocket' }
  ];

  const sideQuests = experiences.length > 0 ? experiences.filter(e => e.type === 'side') : [
    { date: '2026.01', title: '支线任务点', desc: '在管理后台编辑此处', icon_type: 'code' }
  ];

  return (
    <section className="pt-48 pb-20 px-6 max-w-7xl mx-auto space-y-32 overflow-hidden bg-[#FFFBF0] bg-[radial-gradient(#FFD54F_1.5px,transparent_1.5px)] [background-size:40px_40px] relative">
      {/* Global Background Decorations */}
      <FloatingDecoration className="top-20 right-[10%] text-brand-yellow/20" animate={{ rotate: [0, 360] }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }}>
        <Star size={60} fill="currentColor" />
      </FloatingDecoration>
      <FloatingDecoration className="top-[40%] left-[5%] text-brand-blue/20" animate={{ y: [0, 50, 0] }}>
        <Circle size={40} fill="currentColor" />
      </FloatingDecoration>
      <FloatingDecoration className="bottom-[20%] right-[5%] text-brand-pink/20" animate={{ x: [0, -30, 0] }}>
        <Triangle size={50} fill="currentColor" className="rotate-12" />
      </FloatingDecoration>
      <FloatingDecoration className="top-[60%] right-[15%] text-brand-purple/20">
        <Plus size={40} strokeWidth={4} />
      </FloatingDecoration>
      <FloatingDecoration className="bottom-[40%] left-[10%] text-brand-green/20" animate={{ scale: [1, 1.5, 1] }}>
        <X size={40} strokeWidth={4} />
      </FloatingDecoration>
      
      {/* 1. ID Card Section */}
      <div className="grid lg:grid-cols-2 gap-10 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <motion.div 
            whileHover={{ x: 10, rotate: 1 }}
            className="inline-block cursor-default"
          >
            <h2 className="text-4xl font-black mb-2">{d.intro_title}</h2>
            <div className="relative min-h-[80px] flex items-center">
              <span className="text-6xl md:text-8xl font-black bg-brand-blue text-white px-6 py-2 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] inline-block transform -rotate-1">
                {d.intro_name}
              </span>
            </div>
          </motion.div>
          
          <div className="space-y-6 text-xl font-bold text-gray-800 leading-relaxed max-w-xl">
            {d.bio.split('\n').map((para: string, i: number) => para ? (
              <p key={i}>{para}</p>
            ) : <br key={i} />)}
            <p className="italic text-gray-500">欢迎来到我的世界！</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, rotate: 5, scale: 0.9 }}
          whileInView={{ opacity: 1, rotate: 2, scale: 1 }}
          viewport={{ once: true }}
          className="relative max-w-md mx-auto lg:ml-auto"
        >
          {/* ID CARD UI */}
          <div className="brutalist-card bg-[#FDF6E3] p-0 overflow-hidden shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] border-[6px] border-black rounded-[40px]">
            <div className="bg-brand-green p-6 border-b-[6px] border-black flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black">ID CARD</h3>
                <p className="text-xs font-bold uppercase tracking-widest opacity-60">SHANGHAI JIAOTONG UNIVERSITY</p>
              </div>
              <div className="w-12 h-12 bg-brand-pink rounded-full border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <span className="text-xl">😊</span>
              </div>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="flex gap-6 items-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-32 h-32 bg-brand-pink border-4 border-black rounded-3xl overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                    <img src={d.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                  </div>
                  <div className="bg-white border-2 border-black px-3 py-1 rounded-full flex items-center gap-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <MapPin size={14} className="text-brand-pink" />
                    <span className="text-xs font-black">山东</span>
                  </div>
                </div>
                <div className="space-y-4 flex-1">
                  <div className="bg-brand-yellow p-3 border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] min-h-[60px]">
                    <p className="text-[10px] font-black uppercase opacity-40 leading-none mb-1">NAME</p>
                    <p className="text-xl font-black">{d.name}</p>
                  </div>
                  <div className="bg-brand-blue/20 p-3 border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] min-h-[60px]">
                    <p className="text-[10px] font-black uppercase opacity-40 leading-none mb-1">MAJOR</p>
                    <p className="text-sm font-black">{d.major}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-brand-purple/20 p-4 border-4 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] min-h-[70px]">
                <p className="text-[10px] font-black uppercase opacity-40 leading-none mb-1">JOB</p>
                <p className="text-lg font-black italic">{d.job}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 2. Statement Section */}
      <div className="text-center space-y-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="relative inline-block mx-auto"
        >
          <div className="absolute -top-4 -left-4 bg-white border-2 border-black px-2 py-0.5 font-black text-[10px] z-10">STATEMENT</div>
          <motion.div 
            animate={{ 
              scale: [1, 1.05, 1],
              rotate: [1, 0.5, 1, 1.5, 1] 
            }}
            transition={{ 
              duration: 5, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="bg-brand-yellow text-2xl md:text-4xl font-black px-12 py-6 border-4 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transform rotate-1 min-w-[200px]"
          >
            {d.statement}
          </motion.div>
        </motion.div>
        
        <div className="space-y-4 max-w-2xl mx-auto">
          <p className="text-xl font-black">我正在朝着自己喜欢的方向前进！</p>
          <p className="text-lg font-bold text-gray-500 italic">不知道 3年 5年 10年后的我会成为什么样的人，过上什么样的生活呢？</p>
        </div>
      </div>

      {/* 3. Recent Updates Section */}
      <div className="relative py-24 px-10 bg-brand-blue/5 backdrop-blur-sm rounded-[60px] border-[6px] border-black shadow-[20px_20px_0px_0px_rgba(0,0,0,0.1)] overflow-hidden">
        {/* Decorative elements - Doodle background */}
        <FloatingDecoration className="top-10 left-10 text-brand-blue/10" animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
          <Star size={120} fill="currentColor" strokeWidth={0.5} />
        </FloatingDecoration>
        <FloatingDecoration className="bottom-10 right-10 text-brand-pink/10" animate={{ scale: [1, 1.2, 1] }}>
          <Zap size={150} fill="currentColor" strokeWidth={0.5} />
        </FloatingDecoration>
        <FloatingDecoration className="top-1/2 left-20 -translate-y-1/2 text-brand-yellow/10" animate={{ x: [-20, 20, -20] }}>
          <Heart size={80} fill="currentColor" strokeWidth={0.5} />
        </FloatingDecoration>
        <FloatingDecoration className="top-20 right-40 text-brand-purple/10" animate={{ rotate: [0, 15, 0] }}>
          <Cloud size={100} fill="currentColor" strokeWidth={0.5} />
        </FloatingDecoration>
        <FloatingDecoration className="bottom-20 left-1/4 text-brand-green/10" animate={{ rotate: [0, -15, 0], y: [0, 20, 0] }}>
          <Smile size={60} fill="currentColor" strokeWidth={0.5} />
        </FloatingDecoration>
        
        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
          style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
        </div>
        
        <div className="relative z-10 space-y-16">
          <div className="flex items-center gap-4">
             <motion.div 
               whileHover={{ scale: 1.05, rotate: 1 }}
               className="bg-brand-pink text-3xl font-black px-10 py-4 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform -rotate-2 cursor-default"
             >
               近日生活 | RECENT UPDATES
             </motion.div>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {[
              { title: '最近在读', content: d.recent_reading, icon: <BookOpen />, shadow: 'shadow-brand-blue', iconColor: 'text-brand-blue' },
              { title: '最近狂刷', content: d.recent_watching, icon: <Tv />, shadow: 'shadow-brand-pink', iconColor: 'text-brand-pink' },
              { title: '最近感兴趣', content: d.recent_interest, icon: <Wrench />, shadow: 'shadow-brand-green', iconColor: 'text-brand-green' },
            ].map((item, i) => (
              <React.Fragment key={item.title}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`brutalist-card bg-white p-8 flex flex-col items-start text-left group border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] ${item.shadow.replace('shadow-', 'hover:shadow-')} transition-all relative`}
                >
                  {/* Card Corner Accents */}
                  <div className={`absolute -top-2 -right-2 w-6 h-6 ${item.shadow.replace('shadow-', 'bg-')} border-2 border-black rounded-full z-20`}></div>
                  
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-12 h-12 bg-white border-4 border-black rounded-xl flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:rotate-12 transition-transform ${item.iconColor}`}>
                      {React.cloneElement(item.icon as React.ReactElement, { size: 24, strokeWidth: 3 })}
                    </div>
                    <h4 className="text-xl font-black uppercase tracking-tighter">{item.title}</h4>
                  </div>
                  
                  <div className="w-full">
                    <p className="text-2xl font-black italic mb-2">{item.content}</p>
                    <div className={`h-1.5 w-2/3 ${item.shadow.replace('shadow-', 'bg-')} border-2 border-black rounded-full`}></div>
                  </div>
                </motion.div>
                
                {/* Connecting Arrows (Desktop only) */}
                {i < 2 && (
                  <div className="hidden md:flex absolute items-center justify-center z-0" style={{ left: `${(i + 1) * 33.33 - 5}%`, top: '40%', width: '10%' }}>
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-black/20"
                    >
                      <MoveRight size={40} strokeWidth={3} />
                    </motion.div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Game Progress Section (Timeline) */}
      <div className="space-y-16">
        <div className="text-center">
           <h3 className="text-3xl font-black inline-flex items-center gap-2">
             地球Online <span className="bg-brand-pink text-white px-3 py-1 rounded-md transform -rotate-1">开放游戏进度</span>
           </h3>
        </div>

        <div className="relative max-w-4xl mx-auto bg-white border-4 border-black rounded-[40px] p-8 md:p-16 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px]">
          {/* Game Decorations */}
          <FloatingDecoration className="-top-10 -right-10 text-brand-blue" animate={{ rotate: [0, 10, -10, 0] }}>
            <Gamepad2 size={60} className="transform rotate-12" />
          </FloatingDecoration>
          <FloatingDecoration className="-bottom-10 -left-10 text-brand-pink" animate={{ y: [0, -20, 0] }}>
            <Ghost size={50} />
          </FloatingDecoration>
          
          {/* Central Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-black/10 transform -translate-x-1/2 hidden md:block border-l-4 border-dotted border-black"></div>
          
          <div className="space-y-12 relative">
            {/* Timeline Items */}
            <div className="grid md:grid-cols-2 gap-x-20 gap-y-12">
              {/* Left Side (Main Missions) */}
              <div className="space-y-12">
                <div className="flex justify-end mb-8">
                  <span className="bg-white border-4 border-black px-4 py-1 font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">主线任务</span>
                </div>
                
                {mainMissions.map((exp: any, idx: number) => (
                  <TimelineItem 
                    key={idx}
                    date={exp.date} 
                    title={exp.title} 
                    desc={exp.description || exp.desc} 
                    icon={ICON_MAP[exp.icon_type] || <Rocket />} 
                    side="left"
                    color="bg-brand-blue/10"
                  />
                ))}
              </div>

              {/* Right Side (Side Quests) */}
              <div className="space-y-12 md:pt-20">
                <div className="flex justify-start mb-8">
                  <span className="bg-white border-4 border-black px-4 py-1 font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">支线任务</span>
                </div>
                
                {sideQuests.map((exp: any, idx: number) => (
                  <TimelineItem 
                    key={idx}
                    date={exp.date} 
                    title={exp.title} 
                    desc={exp.description || exp.desc} 
                    icon={ICON_MAP[exp.icon_type] || <Rocket />} 
                    side="right"
                    color="bg-brand-green/10"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};

const TimelineItem: React.FC<{ 
  date: string, 
  title: string, 
  desc: string, 
  icon: React.ReactNode, 
  side: 'left' | 'right',
  color: string
}> = ({ date, title, desc, icon, side, color }) => (
  <motion.div 
    initial={{ opacity: 0, x: side === 'left' ? -20 : 20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    className={`relative brutalist-card ${color} p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] group hover:translate-y-[-4px] transition-transform`}
  >
    <div className="flex items-center gap-4 mb-2">
      <div className="bg-white border-2 border-black rounded px-2 py-0.5 text-[10px] font-black">{date}</div>
      <div className="flex-1 h-[2px] bg-black/10"></div>
    </div>
    <div className="flex gap-4 items-start">
      <div className="w-10 h-10 shrink-0 bg-white border-2 border-black rounded-xl flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
        {icon}
      </div>
      <div>
        <h5 className="font-black text-lg leading-tight">{title}</h5>
        <p className="text-sm font-bold text-gray-500">{desc}</p>
      </div>
    </div>
    
    {/* Connector Dot */}
    <div className={`absolute top-1/2 w-4 h-4 bg-black border-2 border-white rounded-full hidden md:block shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]
      ${side === 'left' ? '-right-[54px]' : '-left-[54px]'} transform -translate-y-1/2`}>
    </div>
  </motion.div>
);
