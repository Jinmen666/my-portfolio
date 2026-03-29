import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Heart, MessageCircle, Share2, Plus, Upload, X, Star, Coffee, Music, Sun, Cloud } from 'lucide-react';

interface Comment {
  id: number;
  text: string;
  author: string;
  timestamp: string;
}

interface Post {
  id: number;
  image: string;
  caption: string;
  color: string;
  likes: number;
  comments: number;
  liked?: boolean;
  commentsList?: Comment[];
}

export const DailyLife: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [newCommentText, setNewCommentText] = useState('');
  const [newCaption, setNewCaption] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [showShareToast, setShowShareToast] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const commentsEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when comments change
  React.useEffect(() => {
    if (isCommentModalOpen && commentsEndRef.current) {
      commentsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedPost?.commentsList, isCommentModalOpen]);

  const handleShare = async (post: Post) => {
    const shareData = {
      title: 'Check out this moment!',
      text: post.caption,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setShowShareToast(true);
        setTimeout(() => setShowShareToast(false), 2000);
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const handleLike = (postId: number) => {
    setPosts(prevPosts => prevPosts.map(post => {
      if (post.id === postId) {
        const isLiked = !post.liked;
        return {
          ...post,
          liked: isLiked,
          likes: isLiked ? post.likes + 1 : post.likes - 1
        };
      }
      return post;
    }));
  };

  const openCommentModal = (post: Post) => {
    setSelectedPost(post);
    setIsCommentModalOpen(true);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !selectedPost) return;

    const newComment: Comment = {
      id: Date.now(),
      text: newCommentText,
      author: "You",
      timestamp: "Just now"
    };

    setPosts(prevPosts => prevPosts.map(post => {
      if (post.id === selectedPost.id) {
        const updatedCommentsList = [...(post.commentsList || []), newComment];
        return {
          ...post,
          comments: updatedCommentsList.length,
          commentsList: updatedCommentsList
        };
      }
      return post;
    }));

    setNewCommentText('');
    // Update selected post to show new comment immediately
    setSelectedPost(prev => prev ? {
      ...prev,
      comments: (prev.commentsList?.length || 0) + 1,
      commentsList: [...(prev.commentsList || []), newComment]
    } : null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewImage) return;

    const colors = ['bg-brand-yellow', 'bg-brand-blue', 'bg-brand-pink', 'bg-brand-purple', 'bg-white'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newPost: Post = {
      id: Date.now(),
      image: previewImage,
      caption: newCaption || 'New moment shared! ✨',
      color: randomColor,
      likes: 0,
      comments: 0,
      liked: false,
      commentsList: []
    };

    setPosts([newPost, ...posts]);
    setIsModalOpen(false);
    setNewCaption('');
    setPreviewImage(null);
  };

  return (
    <section className="pt-48 pb-20 px-6 max-w-7xl mx-auto relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-20 left-10 opacity-20 -rotate-12 pointer-events-none hidden lg:block">
        <Sun size={120} className="text-brand-yellow animate-spin-slow" />
      </div>
      <div className="absolute top-60 right-20 opacity-20 rotate-12 pointer-events-none hidden lg:block">
        <Cloud size={100} className="text-brand-blue" />
      </div>
      <div className="absolute bottom-20 left-20 opacity-10 rotate-6 pointer-events-none hidden lg:block">
        <Music size={80} className="text-brand-purple" />
      </div>
      <div className="absolute bottom-40 right-10 opacity-10 -rotate-12 pointer-events-none hidden lg:block">
        <Coffee size={90} className="text-brand-pink" />
      </div>

      <div className="text-center mb-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="inline-block mb-4 p-4 bg-white border-4 border-black rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
        >
          <Camera size={40} className="text-brand-pink" />
        </motion.div>
        <h2 className="text-5xl lg:text-7xl font-bold mb-8 tracking-tighter flex flex-wrap justify-center gap-y-4">
          <div className="flex items-center">
            {['我', '的'].map((char, i) => (
              <motion.span
                key={`title-1-${i}`}
                initial={{ opacity: 0, y: 20, rotate: -10 }}
                animate={{ opacity: 1, y: 0, rotate: i % 2 === 0 ? -5 : 5 }}
                transition={{ delay: i * 0.1 }}
                className="inline-block hover:scale-110 transition-transform cursor-default"
              >
                {char}
              </motion.span>
            ))}
          </div>

          <div className="flex items-center mx-4">
            {['日', '常'].map((char, i) => (
              <motion.span
                key={`title-2-${i}`}
                initial={{ opacity: 0, scale: 0.5, rotate: 20 }}
                animate={{ opacity: 1, scale: 1, rotate: i % 2 === 0 ? 3 : -3 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 260, 
                  damping: 20,
                  delay: 0.2 + i * 0.1 
                }}
                className={`relative inline-block px-4 py-2 mx-1 text-white hover:-translate-y-2 transition-transform cursor-default`}
              >
                <span className="relative z-10">{char}</span>
                <span className={`absolute inset-0 ${i === 0 ? 'bg-brand-pink' : 'bg-brand-blue'} transform ${i % 2 === 0 ? '-rotate-3' : 'rotate-3'} rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}></span>
              </motion.span>
            ))}
          </div>

          <div className="flex items-center">
            {['碎', '碎', '念'].map((char, i) => (
              <motion.span
                key={`title-3-${i}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className={`inline-block mx-1 hover:text-brand-pink transition-colors cursor-default ${i === 1 ? 'translate-y-2' : ''}`}
              >
                {char}
              </motion.span>
            ))}
          </div>
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-xl mb-8 font-medium italic">
          “生活本没有意义，直到你开始赋予它意义。” ✨
        </p>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="brutalist-button brutalist-button-primary inline-flex items-center gap-2 group hover:scale-105 transition-transform"
        >
          <div className="bg-white text-black p-1 rounded-full group-hover:rotate-90 transition-transform">
            <Plus size={20} strokeWidth={3} />
          </div>
          分享此时此刻
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 relative z-10">
        <AnimatePresence mode="wait">
          {posts.length > 0 ? (
            posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ 
                  scale: 1.02,
                  y: -8,
                  x: -8,
                  boxShadow: "20px 20px 0px 0px rgba(0,0,0,1)"
                }}
                viewport={{ once: true }}
                transition={{ 
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                  delay: index * 0.05 
                }}
                className={`brutalist-card p-6 ${post.color} flex flex-col h-full relative group/card`}
              >
                {/* Tape Effect */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-24 h-8 bg-white/40 backdrop-blur-sm border-2 border-black/10 -rotate-2 z-20 pointer-events-none group-hover/card:bg-white/60 transition-colors" />
                
                <div 
                  onClick={() => setZoomedImage(post.image)}
                  className="border-[6px] border-black rounded-[24px] overflow-hidden aspect-square mb-6 bg-gray-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-zoom-in group/img relative"
                >
                  <img
                    src={post.image}
                    alt={post.caption}
                    className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-700 ease-out"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/10 transition-colors duration-300" />
                </div>
                <div className="flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <p className="font-black text-xl leading-tight group-hover/card:text-brand-pink transition-colors">{post.caption}</p>
                    <div className="shrink-0 w-10 h-10 bg-white border-4 border-black rounded-full flex items-center justify-center -rotate-12 group-hover/card:rotate-12 transition-transform">
                      <Star size={18} className="text-brand-yellow fill-brand-yellow" />
                    </div>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-6 border-t-[4px] border-black">
                    <div className="flex items-center gap-6">
                      <button 
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center gap-2 transition-all hover:scale-125 ${post.liked ? 'text-brand-pink' : 'hover:text-brand-pink'}`}
                      >
                        <Heart size={24} fill={post.liked ? "currentColor" : "none"} strokeWidth={2.5} /> 
                        <span className="text-base font-black">{post.likes}</span>
                      </button>
                      <button 
                        onClick={() => openCommentModal(post)}
                        className="flex items-center gap-2 hover:text-brand-blue hover:scale-125 transition-all"
                      >
                        <MessageCircle size={24} strokeWidth={2.5} /> 
                        <span className="text-base font-black">{post.comments}</span>
                      </button>
                    </div>
                    <button 
                      onClick={() => handleShare(post)}
                      className="hover:text-brand-purple hover:scale-125 transition-all p-2 bg-white/50 rounded-full border-2 border-transparent hover:border-black"
                    >
                      <Share2 size={24} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div 
              key="empty-state"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="col-span-full flex flex-col items-center justify-center py-32 bg-gray-50 border-4 border-dashed border-black rounded-[40px] relative overflow-hidden"
            >
              <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, black 2px, transparent 2px)', backgroundSize: '24px 24px' }} />
              <div className="relative z-10 text-center">
                <div className="w-24 h-24 bg-white border-4 border-black rounded-3xl flex items-center justify-center mb-8 mx-auto rotate-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <Camera size={48} className="text-gray-300" />
                </div>
                <p className="text-3xl font-black mb-4">还没有分享过瞬间哦</p>
                <p className="text-gray-500 mb-10 max-w-sm mx-auto font-medium">快来记录生活中的点点滴滴，让这里热闹起来吧！✨</p>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="brutalist-button brutalist-button-primary text-xl px-10 py-5 hover:rotate-2 transition-transform"
                >
                  发布我的第一条动态
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Zoom Modal */}
      <AnimatePresence>
        {zoomedImage && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-12">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setZoomedImage(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md cursor-zoom-out"
            />
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-5xl w-full h-full flex items-center justify-center pointer-events-none"
            >
              <img 
                src={zoomedImage} 
                className="max-w-full max-h-full object-contain border-4 border-white shadow-2xl pointer-events-auto" 
                alt="Zoomed" 
              />
              <button 
                onClick={() => setZoomedImage(null)}
                className="absolute top-4 right-4 p-3 bg-white border-2 border-black rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:translate-x-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all pointer-events-auto"
              >
                <X size={24} />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Share Toast */}
      <AnimatePresence>
        {showShareToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] bg-black text-white px-6 py-3 rounded-full font-bold shadow-xl flex items-center gap-2 border-2 border-white/20"
          >
            <Share2 size={18} />
            Link copied to clipboard!
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Comment Modal */}
      <AnimatePresence>
        {isCommentModalOpen && selectedPost && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCommentModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-white border-4 border-black rounded-[32px] overflow-hidden shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row max-h-[90vh]"
            >
                <button 
                  onClick={() => handleShare(selectedPost)}
                  className="absolute top-4 right-16 z-10 p-2 bg-white border-2 border-black rounded-full hover:bg-gray-100 transition-colors"
                >
                  <Share2 size={20} />
                </button>
                <button 
                  onClick={() => setIsCommentModalOpen(false)}
                  className="absolute top-4 right-4 z-10 p-2 bg-white border-2 border-black rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X size={20} />
                </button>

              <div 
                onClick={() => setZoomedImage(selectedPost.image)}
                className="w-full md:w-1/2 bg-gray-100 border-b-4 md:border-b-0 md:border-r-4 border-black cursor-zoom-in group/modal-img overflow-hidden"
              >
                <img 
                  src={selectedPost.image} 
                  className="w-full h-full object-cover group-hover/modal-img:scale-105 transition-transform duration-500" 
                  alt={selectedPost.caption} 
                />
              </div>

              <div className="w-full md:w-1/2 p-6 flex flex-col h-full overflow-hidden">
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-brand-yellow border-2 border-black rounded-full" />
                    <span className="font-black">You</span>
                  </div>
                  <p className="font-bold">{selectedPost.caption}</p>
                </div>

                <div className="flex-1 overflow-y-auto mb-6 space-y-4 pr-2 scroll-smooth">
                  {selectedPost.commentsList && selectedPost.commentsList.length > 0 ? (
                    <>
                      {selectedPost.commentsList.map(comment => (
                        <motion.div 
                          key={comment.id} 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ type: "spring", stiffness: 300, damping: 25 }}
                          className="flex gap-3"
                        >
                          <div className="w-8 h-8 bg-gray-200 border-2 border-black rounded-full flex-shrink-0" />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-black text-sm">{comment.author}</span>
                              <span className="text-[10px] text-gray-500">{comment.timestamp}</span>
                            </div>
                            <p className="text-sm font-medium">{comment.text}</p>
                          </div>
                        </motion.div>
                      ))}
                      <div ref={commentsEndRef} />
                    </>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 py-12">
                      <MessageCircle size={48} className="mb-2 opacity-20" />
                      <p className="font-bold">No comments yet</p>
                      <p className="text-sm">Be the first to share your thoughts!</p>
                    </div>
                  )}
                </div>

                <form onSubmit={handleAddComment} className="mt-auto pt-4 border-t-2 border-black/10">
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      placeholder="Add a comment..."
                      className="flex-1 p-3 border-2 border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue/30 font-bold text-sm"
                    />
                    <button 
                      type="submit"
                      disabled={!newCommentText.trim()}
                      className="bg-brand-blue text-white p-3 border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:translate-x-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-[0px] active:translate-x-[0px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Post
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* Upload Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-white border-4 border-black rounded-[32px] p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} />
              </button>

              <h3 className="text-3xl font-black mb-6">Share a Moment</h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-4 border-dashed border-black rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors ${previewImage ? 'bg-gray-50' : 'hover:bg-gray-50'}`}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  
                  {previewImage ? (
                    <div className="relative w-full aspect-square rounded-xl overflow-hidden border-2 border-black">
                      <img src={previewImage} className="w-full h-full object-cover" alt="Preview" />
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewImage(null);
                        }}
                        className="absolute top-2 right-2 p-1 bg-white border-2 border-black rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-brand-yellow border-4 border-black rounded-full flex items-center justify-center mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <Upload size={24} />
                      </div>
                      <p className="font-bold text-lg">Click to upload image</p>
                      <p className="text-gray-500 text-sm">PNG, JPG up to 10MB</p>
                    </>
                  )}
                </div>

                <div>
                  <label className="block font-bold mb-2">Caption</label>
                  <textarea 
                    value={newCaption}
                    onChange={(e) => setNewCaption(e.target.value)}
                    placeholder="What's on your mind?"
                    className="w-full p-4 border-4 border-black rounded-xl focus:outline-none focus:ring-4 focus:ring-brand-yellow/30 resize-none h-24"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={!previewImage}
                  className={`w-full brutalist-button brutalist-button-primary text-xl py-4 ${!previewImage ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Post Moment
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      <div className="mt-16 flex justify-center">
        <a 
          href="https://instagram.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="brutalist-button brutalist-button-primary inline-flex items-center gap-2"
        >
          <Camera size={20} />
          Follow on Instagram
        </a>
      </div>
    </section>
  );
};
