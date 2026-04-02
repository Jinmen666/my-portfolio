import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../lib/supabaseClient';
import { 
  MessageCircle, 
  Heart, 
  Share2, 
  X, 
  Send,
  Calendar,
  User,
  ArrowRight
} from 'lucide-react';

type Article = {
  id: string;
  title: string;
  summary: string;
  content: string;
  cover_url: string;
  color: string;
  likes_count: number;
  created_at: string;
};

type Comment = {
  id: string;
  text: string;
  created_at: string;
};

export const ArticlesAndTestimonials: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [activePanel, setActivePanel] = useState<'content' | 'comments'>('content');
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLiking, setIsLiking] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const [likedIds, setLikedIds] = useState<Set<string>>(() => new Set<string>());
  const [toast, setToast] = useState<string>('');
  const pendingArticleIdRef = React.useRef<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('liked_article_ids');
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setLikedIds(new Set(parsed.filter(v => typeof v === 'string') as string[]));
        }
      }
    } catch {
      setLikedIds(new Set<string>());
    }

    pendingArticleIdRef.current = new URLSearchParams(window.location.search).get('article');
    fetchArticles();
  }, []);

  useEffect(() => {
    if (!selectedArticle) {
      document.body.classList.remove('overflow-hidden');
      return;
    }
    document.body.classList.add('overflow-hidden');
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [selectedArticle]);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(''), 2000);
    return () => window.clearTimeout(t);
  }, [toast]);

  const setLikedIdsPersist = (next: Set<string>) => {
    setLikedIds(next);
    localStorage.setItem('liked_article_ids', JSON.stringify(Array.from(next)));
  };

  const getShareUrl = (articleId: string) => {
    const url = new URL(window.location.origin);
    url.searchParams.set('tab', 'articles');
    url.searchParams.set('article', articleId);
    return url.toString();
  };

  const fetchArticles = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      const list = (data || []) as Article[];
      setArticles(list);

      const toOpen = pendingArticleIdRef.current;
      if (toOpen) {
        const found = list.find(a => a.id === toOpen);
        if (found) {
          handleArticleOpen(found, 'content');
        }
        pendingArticleIdRef.current = null;
      }
    } catch (err) {
      console.error('Error fetching articles:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchComments = async (articleId: string) => {
    try {
      const { data, error } = await supabase
        .from('article_comments')
        .select('*')
        .eq('article_id', articleId)
        .order('created_at', { ascending: true });
      if (error) throw error;
      setComments(data || []);
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };

  const handleArticleOpen = (article: Article, panel: 'content' | 'comments' = 'content') => {
    setSelectedArticle(article);
    setActivePanel(panel);
    fetchComments(article.id);
    const url = new URL(window.location.href);
    url.searchParams.set('tab', 'articles');
    url.searchParams.set('article', article.id);
    window.history.replaceState({}, '', url.toString());
  };

  const handleArticleClose = () => {
    setSelectedArticle(null);
    setComments([]);
    setNewComment('');
    const url = new URL(window.location.href);
    url.searchParams.delete('article');
    window.history.replaceState({}, '', url.toString());
  };

  const toggleLike = async (e: React.MouseEvent, article: Article) => {
    e.stopPropagation();
    if (isLiking) return;
    setIsLiking(true);
    try {
      const wasLiked = likedIds.has(article.id);
      const delta = wasLiked ? -1 : 1;
      const nextCount = Math.max(0, (article.likes_count || 0) + delta);

      const nextLiked = new Set<string>(likedIds);
      if (wasLiked) nextLiked.delete(article.id);
      else nextLiked.add(article.id);
      setLikedIdsPersist(nextLiked);

      const optimistic: Article = { ...article, likes_count: nextCount };
      setArticles(prev => prev.map(a => a.id === article.id ? optimistic : a));
      if (selectedArticle?.id === article.id) setSelectedArticle(optimistic);

      const { data, error } = await supabase
        .from('articles')
        .update({ likes_count: nextCount })
        .eq('id', article.id)
        .select()
        .single();
      
      if (error) throw error;
      
      setArticles(prev => prev.map(a => a.id === article.id ? data : a));
      if (selectedArticle?.id === article.id) {
        setSelectedArticle(data);
      }
      setToast(wasLiked ? '已取消点赞' : '已点赞');
    } catch (err) {
      console.error('Error liking article:', err);
      setToast('点赞失败');
    } finally {
      setIsLiking(false);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedArticle || !newComment.trim() || isCommenting) return;
    setIsCommenting(true);
    try {
      const { data, error } = await supabase
        .from('article_comments')
        .insert({
          article_id: selectedArticle.id,
          user_id: '00000000-0000-0000-0000-000000000000', // Anonymous or guest
          text: newComment.trim()
        })
        .select()
        .single();
      
      if (error) throw error;
      setComments(prev => [...prev, data]);
      setNewComment('');
      setToast('评论已发布');
    } catch (err) {
      console.error('Error posting comment:', err);
      setToast('评论失败');
    } finally {
      setIsCommenting(false);
    }
  };

  const handleShare = async (e: React.MouseEvent, article: Article) => {
    e.stopPropagation();
    const shareUrl = getShareUrl(article.id);
    try {
      await navigator.clipboard.writeText(shareUrl);
      setToast('链接已复制');
    } catch {
      window.prompt('复制这段链接分享：', shareUrl);
    }
  };

  return (
    <section className="pt-48 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
      <div className="mb-20">
        <h2 className="text-5xl lg:text-8xl font-black mb-8 leading-tight tracking-tighter flex flex-wrap items-center gap-y-4">
          <span className="flex items-center">
            {['文', '章', '专', '栏'].map((char, i) => (
              <motion.span
                key={`article-title-${i}`}
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
            {'BLOG'.split('').map((char, i) => (
              <motion.span
                key={`article-en-${i}`}
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
                <span className={`absolute inset-0 bg-brand-yellow transform ${i % 2 === 0 ? '-rotate-3' : 'rotate-3'} rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}></span>
              </motion.span>
            ))}
          </span>
        </h2>
        <motion.div 
          initial={{ width: 0 }}
          whileInView={{ width: '8rem' }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.8, ease: "circOut" }}
          className="h-4 bg-brand-yellow border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative"
        >
          <div className="absolute -right-2 -top-2 w-4 h-4 bg-white border-2 border-black rounded-full animate-bounce"></div>
        </motion.div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="brutalist-card p-6 bg-white animate-pulse">
              <div className="aspect-video bg-gray-200 border-4 border-black rounded-2xl mb-6"></div>
              <div className="h-8 bg-gray-200 border-2 border-black rounded-lg mb-4 w-3/4"></div>
              <div className="h-4 bg-gray-200 border-2 border-black rounded-lg mb-2"></div>
              <div className="h-4 bg-gray-200 border-2 border-black rounded-lg w-1/2"></div>
            </div>
          ))}
        </div>
      ) : articles.length === 0 ? (
        <div className="brutalist-card p-12 text-center bg-white">
          <p className="text-2xl font-black">暂无文章，敬请期待！</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <motion.div
              key={article.id}
              layoutId={`article-${article.id}`}
              onClick={() => handleArticleOpen(article, 'content')}
              className={`brutalist-card p-6 ${article.color} cursor-pointer hover:translate-y-[-4px] transition-transform group`}
            >
              <div className="aspect-video border-4 border-black rounded-2xl overflow-hidden mb-6 bg-gray-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <img 
                  src={article.cover_url} 
                  alt={article.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="text-2xl font-black mb-3 line-clamp-2 leading-tight">{article.title}</h3>
              <p className="text-gray-700 font-bold mb-6 line-clamp-2 text-sm">{article.summary}</p>
              
              <div className="flex items-center justify-between pt-6 border-t-4 border-black/10 mt-auto">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={(e) => toggleLike(e, article)}
                    className="flex items-center gap-1 font-black hover:text-brand-pink transition-colors"
                  >
                    <Heart size={20} fill={likedIds.has(article.id) ? "currentColor" : "none"} />
                    <span>{article.likes_count}</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleArticleOpen(article, 'comments');
                    }}
                    className="flex items-center gap-1 font-black hover:text-brand-blue transition-colors"
                  >
                    <MessageCircle size={20} />
                    <span>评论</span>
                  </button>
                </div>
                <button 
                  onClick={(e) => handleShare(e, article)}
                  className="p-2 hover:bg-black/5 rounded-full transition-colors border-2 border-transparent hover:border-black"
                >
                  <Share2 size={20} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {!!toast && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            className="fixed bottom-28 left-1/2 -translate-x-1/2 z-[120] bg-black text-white border-2 border-white px-4 py-2 rounded-full font-black text-sm"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Article Detail Popup */}
      <AnimatePresence>
        {selectedArticle && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleArticleClose}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            <motion.div
              layoutId={`article-${selectedArticle.id}`}
              className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto brutalist-card ${selectedArticle.color} p-0 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]`}
            >
              <button 
                onClick={handleArticleClose}
                className="absolute top-6 right-6 z-10 w-12 h-12 bg-white border-4 border-black rounded-full flex items-center justify-center hover:bg-brand-yellow transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
              >
                <X size={24} />
              </button>

              <div className="p-8 md:p-12">
                <div className="aspect-video w-full border-4 border-black rounded-[32px] overflow-hidden mb-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <img src={selectedArticle.cover_url} alt={selectedArticle.title} className="w-full h-full object-cover" />
                </div>

                <div className="flex flex-wrap items-center gap-6 mb-6 font-black text-sm uppercase">
                  <div className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-black rounded-full">
                    <Calendar size={16} />
                    {new Date(selectedArticle.created_at).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-black rounded-full">
                    <User size={16} />
                    管理员
                  </div>
                </div>

                <h2 className="text-4xl md:text-6xl font-black mb-8 leading-none tracking-tighter">{selectedArticle.title}</h2>

                <div className="flex items-center gap-3 mb-10">
                  <button
                    onClick={() => setActivePanel('content')}
                    className={`px-5 py-2 border-4 border-black rounded-full font-black transition-colors ${activePanel === 'content' ? 'bg-black text-white' : 'bg-white hover:bg-brand-yellow'}`}
                  >
                    正文
                  </button>
                  <button
                    onClick={() => setActivePanel('comments')}
                    className={`px-5 py-2 border-4 border-black rounded-full font-black transition-colors ${activePanel === 'comments' ? 'bg-black text-white' : 'bg-white hover:bg-brand-yellow'}`}
                  >
                    评论（{comments.length}）
                  </button>
                </div>

                {activePanel === 'content' ? (
                  <div className="prose prose-xl max-w-none font-bold text-gray-800 leading-relaxed mb-16 whitespace-pre-wrap">
                    {selectedArticle.content}
                  </div>
                ) : null}

                {/* Interaction Footer */}
                <div className="flex flex-wrap items-center justify-between gap-6 py-8 border-y-4 border-black mb-16">
                  <div className="flex items-center gap-8">
                    <button 
                      onClick={(e) => toggleLike(e, selectedArticle)}
                      className="flex items-center gap-3 text-2xl font-black hover:text-brand-pink transition-colors group"
                    >
                      <Heart 
                        size={32} 
                        fill={likedIds.has(selectedArticle.id) ? "currentColor" : "none"}
                        className="group-hover:scale-125 transition-transform"
                      />
                      <span>{selectedArticle.likes_count} 次点赞</span>
                    </button>
                    <button
                      onClick={() => setActivePanel('comments')}
                      className="flex items-center gap-3 text-2xl font-black hover:text-brand-blue transition-colors"
                    >
                      <MessageCircle size={32} />
                      <span>{comments.length} 条评论</span>
                    </button>
                  </div>
                  <button 
                    onClick={(e) => handleShare(e, selectedArticle)}
                    className="brutalist-button brutalist-button-primary py-3 px-8 text-xl"
                  >
                    <Share2 size={24} />
                    分享文章
                  </button>
                </div>

                {activePanel === 'comments' ? (
                  <div className="space-y-12">
                    <h3 className="text-3xl font-black italic">评论区 / COMMENTS</h3>
                    
                    <form onSubmit={handleCommentSubmit} className="flex flex-col gap-4">
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="说点什么吧…"
                        className="w-full p-6 border-4 border-black rounded-2xl font-bold text-lg focus:outline-none focus:ring-8 focus:ring-brand-yellow/20 min-h-[120px] resize-none"
                      />
                      <button 
                        type="submit"
                        disabled={isCommenting || !newComment.trim()}
                        className="brutalist-button brutalist-button-primary self-end py-4 px-10 text-xl disabled:opacity-50"
                      >
                        {isCommenting ? '发送中...' : '发布评论'}
                        <Send size={20} />
                      </button>
                    </form>

                    <div className="space-y-6">
                      {comments.length === 0 ? (
                        <div className="p-8 border-4 border-dashed border-black rounded-2xl text-center font-bold text-gray-500 bg-white/50">
                          还没有评论，快来抢沙发吧！
                        </div>
                      ) : (
                        comments.map((comment) => (
                          <div key={comment.id} className="brutalist-card bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full border-2 border-black bg-brand-yellow"></div>
                                <span className="font-black">访客</span>
                              </div>
                              <span className="text-xs font-bold text-gray-500">
                                {new Date(comment.created_at).toLocaleString()}
                              </span>
                            </div>
                            <p className="font-bold text-gray-800 leading-relaxed">{comment.text}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ) : null}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
