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
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLiking, setIsLiking] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setArticles(data || []);
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

  const handleArticleClick = (article: Article) => {
    setSelectedArticle(article);
    fetchComments(article.id);
  };

  const handleLike = async (e: React.MouseEvent, article: Article) => {
    e.stopPropagation();
    if (isLiking) return;
    setIsLiking(true);
    try {
      const { data, error } = await supabase
        .from('articles')
        .update({ likes_count: article.likes_count + 1 })
        .eq('id', article.id)
        .select()
        .single();
      
      if (error) throw error;
      
      setArticles(prev => prev.map(a => a.id === article.id ? data : a));
      if (selectedArticle?.id === article.id) {
        setSelectedArticle(data);
      }
    } catch (err) {
      console.error('Error liking article:', err);
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
    } catch (err) {
      console.error('Error posting comment:', err);
    } finally {
      setIsCommenting(false);
    }
  };

  const handleShare = (e: React.MouseEvent, article: Article) => {
    e.stopPropagation();
    const url = window.location.href;
    navigator.clipboard.writeText(`${url}?article=${article.id}`);
    alert('链接已复制到剪贴板！');
  };

  return (
    <section className="pt-48 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
      <div className="mb-16">
        <h2 className="text-5xl lg:text-6xl font-black mb-4 tracking-tighter">文章专栏</h2>
        <div className="w-24 h-4 bg-brand-yellow border-4 border-black"></div>
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
              onClick={() => handleArticleClick(article)}
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
                    onClick={(e) => handleLike(e, article)}
                    className="flex items-center gap-1 font-black hover:text-brand-pink transition-colors"
                  >
                    <Heart size={20} fill={article.likes_count > 0 ? "currentColor" : "none"} />
                    <span>{article.likes_count}</span>
                  </button>
                  <div className="flex items-center gap-1 font-black">
                    <MessageCircle size={20} />
                    <span>评论</span>
                  </div>
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

      {/* Article Detail Popup */}
      <AnimatePresence>
        {selectedArticle && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedArticle(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            <motion.div
              layoutId={`article-${selectedArticle.id}`}
              className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto brutalist-card ${selectedArticle.color} p-0 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]`}
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedArticle(null)}
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
                
                <div className="prose prose-xl max-w-none font-bold text-gray-800 leading-relaxed mb-16 whitespace-pre-wrap">
                  {selectedArticle.content}
                </div>

                {/* Interaction Footer */}
                <div className="flex flex-wrap items-center justify-between gap-6 py-8 border-y-4 border-black mb-16">
                  <div className="flex items-center gap-8">
                    <button 
                      onClick={(e) => handleLike(e, selectedArticle)}
                      className="flex items-center gap-3 text-2xl font-black hover:text-brand-pink transition-colors group"
                    >
                      <Heart 
                        size={32} 
                        fill={selectedArticle.likes_count > 0 ? "currentColor" : "none"}
                        className="group-hover:scale-125 transition-transform"
                      />
                      <span>{selectedArticle.likes_count} 次点赞</span>
                    </button>
                    <div className="flex items-center gap-3 text-2xl font-black">
                      <MessageCircle size={32} />
                      <span>{comments.length} 条评论</span>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => handleShare(e, selectedArticle)}
                    className="brutalist-button brutalist-button-primary py-3 px-8 text-xl"
                  >
                    <Share2 size={24} />
                    分享文章
                  </button>
                </div>

                {/* Comments Section */}
                <div className="space-y-12">
                  <h3 className="text-3xl font-black italic">评论区 / COMMENTS</h3>
                  
                  {/* Comment Input */}
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

                  {/* Comment List */}
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
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
