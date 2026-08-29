import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Play, ArrowLeft, Clock, Share2 } from "lucide-react";
import { Link } from "react-router-dom";
import VideoModal from "../components/VideoModal";
import { dataStore, Project } from "../lib/dataStore";

// Helper to extract YouTube ID
const getYouTubeId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

const categories = ["Reels", "Commercial", "Saas Animation", "Documentary", "Motion Graphics"];

export default function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState("Reels");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVideo, setSelectedVideo] = useState<{ id: string, title: string } | null>(null);
  const [videoProjects, setVideoProjects] = useState<Project[]>(() => dataStore.getProjects());

  useEffect(() => {
    const handleUpdate = () => {
      setVideoProjects(dataStore.getProjects());
    };
    window.addEventListener("rh_data_updated", handleUpdate);
    return () => window.removeEventListener("rh_data_updated", handleUpdate);
  }, []);

  const filteredVideos = useMemo(() => {
    return videoProjects.filter((video) => {
      const matchesCategory = video.category === activeCategory;
      const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            video.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery, videoProjects]);

  return (
    <div className="min-h-screen bg-primary pt-32 pb-24 text-text-pure">
      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col gap-8 mb-16">
          <div className="flex items-center gap-4">
            <Link 
              to="/" 
              className="w-12 h-12 glass rounded-full flex items-center justify-center text-text-muted hover:text-accent transition-all group border-white/10"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            </Link>
            <span className="text-xs font-bold tracking-[0.4em] text-accent uppercase">Work Showcase</span>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight max-w-2xl text-text-pure">
              Cinematic <span className="text-accent italic">Masterpieces</span> & Visual Stories
            </h1>
            
            {/* Search */}
            <div className="relative group min-w-[300px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Search projects..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-secondary/50 border border-white/10 rounded-2xl pl-12 pr-6 py-4 focus:outline-none focus:border-accent/40 focus:bg-secondary transition-all glass-dark text-text-pure placeholder:text-text-muted"
              />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border ${
                activeCategory === cat 
                  ? "bg-accent text-primary border-accent glow-sm" 
                  : "bg-white/5 text-text-muted border-white/5 hover:border-white/20 hover:bg-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <motion.div 
          layout
          className={`grid gap-8 ${
            activeCategory === 'Reels' 
              ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' 
              : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          }`}
        >
          <AnimatePresence mode="popLayout">
            {filteredVideos.map((video, idx) => {
              const youtubeId = getYouTubeId(video.youtubeUrl);
              const ytFallback = youtubeId ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg` : "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=800&auto=format&fit=crop";
              const displayImage = video.image || ytFallback;
              
              return (
                <motion.div
                  key={video.id || idx}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  className="group cursor-pointer"
                  onClick={() => youtubeId && setSelectedVideo({ id: youtubeId, title: video.title })}
                >
                  <div className={`relative rounded-[32px] overflow-hidden mb-6 border border-white/10 glass-dark glow-sm group-hover:glow-md transition-all duration-500 ${video.category === 'Reels' ? 'aspect-[9/16]' : 'aspect-video'}`}>
                    <img 
                      src={displayImage} 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = ytFallback;
                      }}
                      alt={video.title} 
                      className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-105 transition-all duration-700" 
                    />
                    
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-accent rounded-full flex items-center justify-center text-primary glow-lg scale-75 group-hover:scale-100 transition-transform duration-500">
                        <Play fill="currentColor" size={28} className="translate-x-1 sm:w-8 sm:h-8" />
                      </div>
                    </div>
                    
                    {/* Duration Badge */}
                    <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[10px] font-bold text-white flex items-center gap-1.5 border border-white/10 group-hover:border-accent/40 transition-colors">
                      <Clock size={12} className="text-accent" />
                      {video.duration || "0:30"}
                    </div>

                    {/* Format Badge */}
                    <div className="absolute top-4 left-4 sm:top-6 sm:left-6 px-3 py-1 bg-accent rounded-lg text-[9px] sm:text-[10px] font-bold text-primary tracking-widest uppercase glow-sm">
                      4K 60FPS
                    </div>
                  </div>
                  
                  <div className="px-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold tracking-[0.2em] text-accent uppercase">{video.category}</span>
                      <Share2 
                        size={14} 
                        className="text-text-muted hover:text-text-pure transition-colors cursor-pointer" 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (navigator.share) {
                            navigator.share({ title: video.title, url: window.location.href });
                          } else {
                            navigator.clipboard.writeText(video.youtubeUrl || window.location.href);
                            alert("Video link copied to clipboard!");
                          }
                        }}
                      />
                    </div>
                    <h3 className="text-xl font-display font-bold mb-2 text-text-pure group-hover:text-accent transition-colors">{video.title}</h3>
                    <p className="text-sm text-text-soft line-clamp-2 leading-relaxed">{video.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredVideos.length === 0 && (
          <div className="py-24 text-center">
            <p className="text-xl text-text-muted font-display italic">No cinematic projects found for this search.</p>
            <button 
              onClick={() => { setActiveCategory("Reels"); setSearchQuery(""); }}
              className="mt-6 text-accent font-bold hover:underline glow-sm"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Video Modal */}
      <VideoModal 
        videoId={selectedVideo?.id || null} 
        onClose={() => setSelectedVideo(null)} 
        title={selectedVideo?.title || ""}
      />
    </div>
  );
}
