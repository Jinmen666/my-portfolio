import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Trash2, Upload, ArrowLeft, Lock, Plus, LayoutGrid, Globe } from 'lucide-react';

type AdminProject = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  image_path: string;
  project_url: string;
  color: string;
  created_at: string;
};

const ADMIN_TOKEN_STORAGE_KEY = 'daily_admin_token';

export const AdminProjects: React.FC = () => {
  const [token, setToken] = useState('');
  const [savedToken, setSavedToken] = useState<string>('');
  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectUrl, setProjectUrl] = useState('');
  const [color, setColor] = useState('bg-white');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = useMemo(() => Boolean(savedToken && title && file && !isSubmitting), [savedToken, title, file, isSubmitting]);

  const loadProjects = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: selectError } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      if (selectError) throw selectError;
      setProjects((data || []) as AdminProject[]);
    } catch (e: any) {
      setError(e?.message || '加载失败');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const existing = localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY) || '';
    setSavedToken(existing);
    loadProjects();
  }, []);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  const saveToken = () => {
    const v = token.trim();
    setSavedToken(v);
    localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, v);
    setToken('');
  };

  const clearToken = () => {
    setSavedToken('');
    localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
  };

  const fileToDataUrl = (f: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('读取文件失败'));
    reader.readAsDataURL(f);
  });

  const createProject = async () => {
    if (!file) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const dataUrl = await fileToDataUrl(file);
      const res = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: savedToken,
          title,
          description,
          projectUrl,
          color,
          fileName: file.name,
          dataUrl
        })
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json?.error || '发布失败');
      }
      setTitle('');
      setDescription('');
      setProjectUrl('');
      setColor('bg-white');
      setFile(null);
      await loadProjects();
    } catch (e: any) {
      setError(e?.message || '发布失败');
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteProject = async (projectId: string) => {
    if (!confirm('确定要删除这个项目吗？')) return;
    setError(null);
    try {
      const res = await fetch('/api/admin/projects', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: savedToken, projectId })
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json?.error || '删除失败');
      }
      setProjects(prev => prev.filter(p => p.id !== projectId));
    } catch (e: any) {
      setError(e?.message || '删除失败');
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-10">
        <button
          type="button"
          onClick={() => {
            window.location.href = '/admin/hub';
          }}
          className="brutalist-button brutalist-button-secondary"
        >
          <ArrowLeft size={18} />
          管理中心
        </button>
        <div className="font-black text-2xl flex items-center gap-2">
          <LayoutGrid size={20} />
          项目管理
        </div>
      </div>

      <div className="brutalist-card p-8 mb-10 bg-white">
        <div className="font-black text-xl mb-4">管理员令牌</div>
        {savedToken ? (
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="text-gray-700 font-medium break-all">
              已保存（不显示内容）
            </div>
            <button type="button" onClick={clearToken} className="brutalist-button brutalist-button-secondary">
              清除令牌
            </button>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-3">
            <input
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="输入管理员令牌"
              className="flex-1 p-3 border-4 border-black rounded-xl focus:outline-none focus:ring-4 focus:ring-brand-yellow/30 font-bold"
              type="password"
            />
            <button type="button" onClick={saveToken} className="brutalist-button brutalist-button-primary">
              保存
            </button>
          </div>
        )}
      </div>

      <div className="brutalist-card p-8 mb-10 bg-brand-pink/20">
        <div className="font-black text-xl mb-6 flex items-center gap-2">
          <Plus size={18} />
          发布新项目
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="font-black mb-2">项目预览图</div>
            <div
              onClick={() => document.getElementById('project-upload')?.click()}
              className="border-4 border-dashed border-black rounded-2xl p-6 cursor-pointer bg-white/80 hover:bg-white transition-colors"
            >
              <input
                id="project-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0] || null;
                  setFile(f);
                }}
              />
              {previewUrl ? (
                <div className="aspect-video rounded-xl overflow-hidden border-4 border-black">
                  <img src={previewUrl} className="w-full h-full object-cover" alt="preview" />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10">
                  <div className="w-16 h-16 bg-white border-4 border-black rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-4">
                    <Upload size={24} />
                  </div>
                  <div className="font-black text-lg">点击选择图片</div>
                  <div className="text-gray-600 font-medium">PNG / JPG</div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div>
              <div className="font-black mb-2">标题</div>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="项目名称"
                className="w-full p-4 border-4 border-black rounded-xl focus:outline-none focus:ring-4 focus:ring-brand-pink/30"
              />
            </div>
            <div>
              <div className="font-black mb-2">描述</div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="简单介绍一下项目…"
                className="w-full p-4 border-4 border-black rounded-xl focus:outline-none focus:ring-4 focus:ring-brand-pink/30 resize-none h-20"
              />
            </div>
            <div>
              <div className="font-black mb-2">项目链接 (可选)</div>
              <input
                value={projectUrl}
                onChange={(e) => setProjectUrl(e.target.value)}
                placeholder="https://..."
                className="w-full p-4 border-4 border-black rounded-xl focus:outline-none focus:ring-4 focus:ring-brand-pink/30"
              />
            </div>
            <div>
              <div className="font-black mb-2">卡片颜色</div>
              <select
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full p-3 border-4 border-black rounded-xl font-bold bg-white"
              >
                <option value="bg-white">白</option>
                <option value="bg-brand-yellow">黄</option>
                <option value="bg-brand-blue">蓝</option>
                <option value="bg-brand-pink">粉</option>
                <option value="bg-brand-purple">紫</option>
              </select>
            </div>
            <button
              type="button"
              disabled={!canSubmit}
              onClick={createProject}
              className={`brutalist-button brutalist-button-primary text-xl justify-center py-4 ${!canSubmit ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? '发布中…' : '发布项目'}
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="font-black text-2xl">已有项目</div>
        <button type="button" onClick={() => void loadProjects()} className="brutalist-button brutalist-button-secondary">
          刷新
        </button>
      </div>

      {error && (
        <div className="brutalist-card p-6 mb-8 bg-white">
          <div className="font-black text-lg mb-1">发生了点问题</div>
          <div className="text-gray-700 font-medium break-words">{error}</div>
        </div>
      )}

      {isLoading ? (
        <div className="brutalist-card p-10 bg-white">
          <div className="font-black text-xl">加载中…</div>
        </div>
      ) : projects.length === 0 ? (
        <div className="brutalist-card p-10 bg-white">
          <div className="font-black text-xl">还没有项目</div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((p) => (
            <div key={p.id} className={`brutalist-card p-6 ${p.color} relative`}>
              <div className="border-[6px] border-black rounded-[24px] overflow-hidden aspect-video mb-5 bg-gray-100">
                <img src={p.image_url} alt={p.title} className="w-full h-full object-cover" />
              </div>
              <div className="font-black text-xl mb-2">{p.title}</div>
              <div className="text-gray-700 font-medium mb-4 line-clamp-2">{p.description}</div>
              <div className="flex flex-col gap-3">
                {p.project_url && (
                  <a 
                    href={p.project_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="brutalist-button brutalist-button-primary w-full justify-center"
                  >
                    <Globe size={18} />
                    查看演示
                  </a>
                )}
                <button
                  type="button"
                  disabled={!savedToken}
                  onClick={() => void deleteProject(p.id)}
                  className={`brutalist-button brutalist-button-secondary w-full justify-center ${!savedToken ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Trash2 size={18} />
                  删除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
