import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { 
  Save, 
  ArrowLeft, 
  User, 
  Upload, 
  Plus, 
  Trash2, 
  Rocket, 
  Briefcase, 
  Code, 
  Gamepad2,
  Tv,
  BookOpen,
  Wrench,
  Star,
  Heart,
  Ghost,
  MapPin
} from 'lucide-react';

const ADMIN_TOKEN_STORAGE_KEY = 'daily_admin_token';

const ICONS = [
  { type: 'rocket', icon: <Rocket size={18} />, label: '火箭' },
  { type: 'briefcase', icon: <Briefcase size={18} />, label: '事业' },
  { type: 'code', icon: <Code size={18} />, label: '编程' },
  { type: 'gamepad', icon: <Gamepad2 size={18} />, label: '游戏' },
  { type: 'tv', icon: <Tv size={18} />, label: '影视' },
  { type: 'book', icon: <BookOpen size={18} />, label: '阅读' },
  { type: 'wrench', icon: <Wrench size={18} />, label: '工具' },
  { type: 'star', icon: <Star size={18} />, label: '收藏' },
  { type: 'heart', icon: <Heart size={18} />, label: '喜爱' },
  { type: 'ghost', icon: <Ghost size={18} />, label: '神秘' },
  { type: 'map', icon: <MapPin size={18} />, label: '地点' },
];

export const AdminProfile: React.FC = () => {
  const [savedToken, setSavedToken] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [profile, setProfile] = useState({
    name: '西门',
    major: '电气工程及其自动化',
    job: 'toB 软件产品经理',
    bio: '',
    intro_title: 'Welcome to',
    intro_name: '西门的个界!',
    id_no: 'XM-20000508-OVO',
    statement: '每一个大多数人看起||',
    recent_reading: '《纳瓦尔宝典》',
    recent_watching: '整太线失事视频',
    recent_interest: 'AI 编程',
    avatar_url: ''
  });

  const [experiences, setExperiences] = useState<any[]>([]);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState('');

  useEffect(() => {
    const token = localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY) || '';
    setSavedToken(token);
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const { data: pData } = await supabase.from('profile').select('*').maybeSingle();
      if (pData) {
        setProfile(pData);
        setAvatarPreview(pData.avatar_url);
      }

      const { data: eData } = await supabase.from('experiences').select('*').order('sort_order', { ascending: true });
      if (eData) setExperiences(eData);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const fileToDataUrl = (f: File) => new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(f);
  });

  const saveProfile = async () => {
    setIsSubmitting(true);
    try {
      let avatarData = null;
      if (avatarFile) {
        const dataUrl = await fileToDataUrl(avatarFile);
        avatarData = { fileName: avatarFile.name, dataUrl };
      }

      const res = await fetch('/api/admin/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: savedToken, profile, avatarFile: avatarData })
      });
      
      const result = await res.json();
      if (res.ok) {
        alert('✅ 个人资料保存成功！');
        loadData(); // 重新加载一次确保数据已同步
      } else {
        alert('❌ 保存失败：' + (result.error || '未知错误'));
      }
    } catch (e: any) {
      alert('❌ 网络请求出错：' + e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addExperience = () => {
    setExperiences([...experiences, { 
      date: '2026.04', 
      title: '未命名的冒险', 
      description: '点击这里编辑你的主线或支线任务...', 
      type: 'side', 
      icon_type: 'rocket',
      sort_order: experiences.length 
    }]);
  };

  const saveExperience = async (exp: any) => {
    await fetch('/api/admin/experiences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: savedToken, experience: exp })
    });
    loadData();
  };

  const deleteExperience = async (id: string) => {
    if (!id.includes('-')) { // Temporary local ID
      setExperiences(experiences.filter(e => e.id !== id));
      return;
    }
    await fetch('/api/admin/experiences', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: savedToken, id })
    });
    loadData();
  };

  if (isLoading) return <div className="p-20 text-center font-black text-2xl">数据加载中...</div>;

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-12">
        <button onClick={() => window.location.href = '/admin/hub'} className="brutalist-button brutalist-button-secondary">
          <ArrowLeft size={18} />
          管理中心
        </button>
        <h1 className="text-4xl font-black italic flex items-center gap-3">
          <User size={32} />
          个人资料编辑
        </h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Left: ID Card & Basic Info */}
        <div className="lg:col-span-2 space-y-10">
          <div className="brutalist-card bg-white p-8">
            <h2 className="text-2xl font-black mb-6 border-b-4 border-black pb-2">1. 身份卡片 (ID CARD)</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="block font-black text-sm uppercase">头像上传</label>
                <div 
                  onClick={() => document.getElementById('avatar-input')?.click()}
                  className="w-32 h-32 border-4 border-dashed border-black rounded-3xl flex items-center justify-center cursor-pointer bg-gray-50 overflow-hidden"
                >
                  {avatarPreview ? <img src={avatarPreview} className="w-full h-full object-cover" /> : <Upload />}
                  <input id="avatar-input" type="file" className="hidden" onChange={handleAvatarChange} />
                </div>
                <div>
                  <label className="block font-black text-sm uppercase mb-1">姓名</label>
                  <input value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} className="w-full p-3 border-4 border-black rounded-xl font-bold" />
                </div>
                <div>
                  <label className="block font-black text-sm uppercase mb-1">专业</label>
                  <input value={profile.major} onChange={e => setProfile({...profile, major: e.target.value})} className="w-full p-3 border-4 border-black rounded-xl font-bold" />
                </div>
                <div>
                  <label className="block font-black text-sm uppercase mb-1">个人详细介绍</label>
                  <textarea 
                    value={profile.bio} 
                    onChange={e => setProfile({...profile, bio: e.target.value})} 
                    placeholder="在这里写下多段自我介绍，按回车换行..."
                    className="w-full p-3 border-4 border-black rounded-xl font-bold h-32 resize-none" 
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block font-black text-sm uppercase mb-1">职位</label>
                  <input value={profile.job} onChange={e => setProfile({...profile, job: e.target.value})} className="w-full p-3 border-4 border-black rounded-xl font-bold" />
                </div>
                <div>
                  <label className="block font-black text-sm uppercase mb-1">ID 编号</label>
                  <input value={profile.id_no} onChange={e => setProfile({...profile, id_no: e.target.value})} className="w-full p-3 border-4 border-black rounded-xl font-bold" />
                </div>
                <div>
                  <label className="block font-black text-sm uppercase mb-1">欢迎语 (标题)</label>
                  <input value={profile.intro_title} onChange={e => setProfile({...profile, intro_title: e.target.value})} className="w-full p-3 border-4 border-black rounded-xl font-bold" />
                </div>
                <div>
                  <label className="block font-black text-sm uppercase mb-1">欢迎语 (名字)</label>
                  <input value={profile.intro_name} onChange={e => setProfile({...profile, intro_name: e.target.value})} className="w-full p-3 border-4 border-black rounded-xl font-bold" />
                </div>
              </div>
            </div>
          </div>

          <div className="brutalist-card bg-brand-yellow/20 p-8">
            <h2 className="text-2xl font-black mb-6 border-b-4 border-black pb-2">2. 态度与动态</h2>
            <div className="space-y-6">
              <div>
                <label className="block font-black text-sm uppercase mb-1">态度宣言 (STATEMENT)</label>
                <input value={profile.statement} onChange={e => setProfile({...profile, statement: e.target.value})} className="w-full p-4 border-4 border-black rounded-xl font-black text-xl" />
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block font-black text-sm uppercase mb-1">最近在读</label>
                  <input value={profile.recent_reading} onChange={e => setProfile({...profile, recent_reading: e.target.value})} className="w-full p-3 border-4 border-black rounded-xl font-bold" />
                </div>
                <div>
                  <label className="block font-black text-sm uppercase mb-1">最近狂刷</label>
                  <input value={profile.recent_watching} onChange={e => setProfile({...profile, recent_watching: e.target.value})} className="w-full p-3 border-4 border-black rounded-xl font-bold" />
                </div>
                <div>
                  <label className="block font-black text-sm uppercase mb-1">最近感兴趣</label>
                  <input value={profile.recent_interest} onChange={e => setProfile({...profile, recent_interest: e.target.value})} className="w-full p-3 border-4 border-black rounded-xl font-bold" />
                </div>
              </div>
            </div>
          </div>

          <button 
            onClick={saveProfile} 
            disabled={isSubmitting}
            className="brutalist-button brutalist-button-primary w-full py-6 text-2xl justify-center"
          >
            {isSubmitting ? '正在同步到数据库...' : '保存所有基础资料'}
            <Save size={24} />
          </button>
        </div>

        {/* Right: Timeline / Experiences */}
        <div className="space-y-8">
          <div className="brutalist-card bg-brand-blue/10 p-8">
            <div className="flex items-center justify-between mb-6 border-b-4 border-black pb-2">
              <h2 className="text-2xl font-black">3. 游戏进度</h2>
              <button onClick={addExperience} className="p-2 bg-black text-white rounded-full hover:scale-110 transition-transform">
                <Plus size={20} />
              </button>
            </div>
            
            <div className="space-y-6 max-h-[800px] overflow-y-auto pr-2">
              {experiences.map((exp, idx) => (
                <div key={exp.id || idx} className="p-4 border-4 border-black rounded-2xl bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-3">
                  <div className="flex justify-between gap-2">
                    <input value={exp.date} onChange={e => {
                      const newExps = [...experiences];
                      newExps[idx].date = e.target.value;
                      setExperiences(newExps);
                    }} className="w-24 p-1 border-2 border-black rounded font-black text-xs" />
                    <select value={exp.type} onChange={e => {
                      const newExps = [...experiences];
                      newExps[idx].type = e.target.value;
                      setExperiences(newExps);
                    }} className="p-1 border-2 border-black rounded font-black text-xs">
                      <option value="main">主线任务</option>
                      <option value="side">支线任务</option>
                    </select>
                  </div>
                  <input value={exp.title} onChange={e => {
                    const newExps = [...experiences];
                    newExps[idx].title = e.target.value;
                    setExperiences(newExps);
                  }} className="w-full p-2 border-2 border-black rounded font-black" placeholder="任务标题" />
                  <textarea value={exp.description} onChange={e => {
                    const newExps = [...experiences];
                    newExps[idx].description = e.target.value;
                    setExperiences(newExps);
                  }} className="w-full p-2 border-2 border-black rounded font-bold text-sm h-16 resize-none" placeholder="描述" />
                  
                  <div className="space-y-2">
                    <label className="block font-black text-[10px] uppercase opacity-40 leading-none">任务图标选择</label>
                    <div className="flex flex-wrap gap-2">
                      {ICONS.map(i => (
                        <div key={i.type} className="relative group/tooltip">
                          <button 
                            onClick={() => {
                              const newExps = [...experiences];
                              newExps[idx].icon_type = i.type;
                              setExperiences(newExps);
                            }}
                            className={`w-8 h-8 flex items-center justify-center border-2 border-black rounded-lg transition-all active:translate-x-0.5 active:translate-y-0.5 ${exp.icon_type === i.type ? 'bg-brand-yellow shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-white hover:bg-gray-100'}`}
                          >
                            {i.icon}
                          </button>
                          
                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-[10px] font-black rounded border border-white opacity-0 group-hover/tooltip:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-30">
                            {i.label}
                            {/* Arrow */}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-3 pt-2 border-t-2 border-black/5">
                    <button onClick={() => deleteExperience(exp.id)} className="flex items-center gap-1 px-3 py-1 bg-red-400 border-2 border-black rounded-lg font-black text-[10px] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5"><Trash2 size={12} /> 删除</button>
                    <button onClick={() => saveExperience(exp)} className="flex items-center gap-1 px-3 py-1 bg-brand-green border-2 border-black rounded-lg font-black text-[10px] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5"><Save size={12} /> 同步此项</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
