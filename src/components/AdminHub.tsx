import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  LayoutGrid, 
  FileText, 
  Camera, 
  Settings, 
  LogOut, 
  ArrowLeft,
  ChevronRight,
  User,
  ExternalLink
} from 'lucide-react';

const ADMIN_TOKEN_STORAGE_KEY = 'daily_admin_token';

type AdminMenuItem = {
  title: string;
  desc: string;
  icon: React.ReactNode;
  path: string;
  color: string;
  disabled?: boolean;
};

export const AdminHub: React.FC = () => {
  const [token, setToken] = useState('');
  const [savedToken, setSavedToken] = useState<string>('');
  
  useEffect(() => {
    const existing = localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY) || '';
    setSavedToken(existing);
  }, []);

  const saveToken = () => {
    const v = token.trim();
    if (!v) return;
    setSavedToken(v);
    localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, v);
    setToken('');
  };

  const clearToken = () => {
    if (!confirm('确定要退出管理模式吗？')) return;
    setSavedToken('');
    localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
  };

  const menuItems: AdminMenuItem[] = [
    {
      title: '日常管理',
      desc: '发布、删除您的生活瞬间与摄影动态。',
      icon: <Camera size={32} />,
      path: '/admin',
      color: 'bg-brand-yellow',
    },
    {
      title: '文章管理',
      desc: '撰写技术博客、心情随笔或深度长文。',
      icon: <FileText size={32} />,
      path: '/admin/articles',
      color: 'bg-brand-blue',
    },
    {
      title: '项目管理',
      desc: '展示您的练习成果、开源作品或个人产品。',
      icon: <LayoutGrid size={32} />,
      path: '/admin/projects',
      color: 'bg-brand-pink',
    },
    {
      title: '个人资料管理',
      desc: '修改您的名字、头像及“关于我”的信息。',
      icon: <User size={32} />,
      path: '/admin/profile',
      color: 'bg-brand-purple',
    },
  ];

  if (!savedToken) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-white">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md brutalist-card p-10 bg-brand-yellow"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-white border-4 border-black rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <Settings size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-black italic">站长登入</h1>
              <p className="font-bold text-black/60">ADMIN PORTAL</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block font-black mb-2 text-lg italic">请输入通行证令牌 / TOKEN</label>
              <input
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="••••••••••••"
                className="w-full p-4 border-4 border-black rounded-xl font-bold text-xl focus:outline-none focus:ring-8 focus:ring-black/10"
              />
            </div>
            
            <button 
              onClick={saveToken}
              className="brutalist-button brutalist-button-primary w-full py-5 text-2xl justify-center"
            >
              验证身份
            </button>
            
            <button 
              onClick={() => window.location.href = '/'}
              className="flex items-center justify-center gap-2 w-full font-bold text-black/60 hover:text-black transition-colors"
            >
              <ArrowLeft size={18} />
              返回前台
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div>
          <h1 className="text-6xl font-black italic tracking-tighter mb-4 flex items-center gap-4">
            站长控制中心
            <span className="text-2xl bg-black text-white px-4 py-1 rounded-full not-italic tracking-normal">HUB</span>
          </h1>
          <p className="text-2xl font-bold text-gray-500">欢迎回来，指挥官。请选择您要管理的内容：</p>
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={() => window.location.href = '/'}
            className="brutalist-button brutalist-button-secondary py-3 px-6"
          >
            <ExternalLink size={20} />
            预览网站
          </button>
          <button 
            onClick={clearToken}
            className="brutalist-button bg-red-500 text-white border-black hover:bg-red-600 py-3 px-6 flex items-center gap-2"
          >
            <LogOut size={20} />
            退出
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {menuItems.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => !item.disabled && (window.location.href = item.path)}
            className={`brutalist-card p-8 ${item.color} ${item.disabled ? 'opacity-50 grayscale cursor-not-allowed' : 'cursor-pointer hover:translate-x-2 hover:-translate-y-2 transition-all group shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]'}`}
          >
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 bg-white border-4 border-black rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:rotate-6 transition-transform">
                {item.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-3xl font-black italic">{item.title}</h3>
                  {!item.disabled && <ChevronRight size={32} className="group-hover:translate-x-2 transition-transform" />}
                </div>
                <p className="text-lg font-bold text-black/70 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-20 p-8 border-4 border-dashed border-black/20 rounded-[40px] text-center">
        <p className="text-gray-400 font-bold italic">
          系统状态：一切正常 | 数据库已连接 | 正在为您保驾护航
        </p>
      </div>
    </div>
  );
};
