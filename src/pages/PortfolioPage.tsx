import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Play, Filter, ArrowLeft, Clock, Share2 } from "lucide-react";
import { Link } from "react-router-dom";
import VideoModal from "../components/VideoModal";

// Helper to extract YouTube ID
const getYouTubeId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

// Dynamic Video Data
const videoProjects = [
  // Reels (10 items)
  { title: "Streetwear Brand Launch", category: "Reels", description: "TikTok/Reel optimized edit with heavy glitch effects and rhythmic cuts.", youtubeUrl: "https://www.youtube.com/watch?v=ScMzIvxBSi4", duration: "0:45" },
  { title: "Coffee Aesthetics", category: "Reels", description: "Relaxing atmospheric coffee preparation with asmr sound design.", youtubeUrl: "https://www.youtube.com/watch?v=ScMzIvxBSi4", duration: "0:30" },
  { title: "Urban Exploration", category: "Reels", description: "Fast-paced city walk with seamless transitions and light leaks.", youtubeUrl: "https://www.youtube.com/watch?v=ScMzIvxBSi4", duration: "0:15" },
  { title: "Workout Motivation", category: "Reels", description: "Aggressive gym edit with heavy bass and speed ramping.", youtubeUrl: "https://www.youtube.com/watch?v=ScMzIvxBSi4", duration: "0:50" },
  { title: "Travel Montage: Tokyo", category: "Reels", description: "Cinematic neon-lit tour of Tokyo streets at night.", youtubeUrl: "https://www.youtube.com/watch?v=ScMzIvxBSi4", duration: "0:25" },
  { title: "Fashion Week Recaps", category: "Reels", description: "Quick cuts of the best moments from the runway.", youtubeUrl: "https://www.youtube.com/watch?v=ScMzIvxBSi4", duration: "0:40" },
  { title: "Minimalist Design", category: "Reels", description: "Satisfying product reveal for a luxury watch brand.", youtubeUrl: "https://www.youtube.com/watch?v=ScMzIvxBSi4", duration: "0:20" },
  { title: "Chef's Special", category: "Reels", description: "Cooking highlight reel with dynamic camera movements.", youtubeUrl: "https://www.youtube.com/watch?v=ScMzIvxBSi4", duration: "0:55" },
  { title: "Skateboarding Highs", category: "Reels", description: "Lo-fi skate edit with vintage overlays and grit.", youtubeUrl: "https://www.youtube.com/watch?v=ScMzIvxBSi4", duration: "0:45" },
  { title: "Sunset Drives", category: "Reels", description: "Dreamy automotive showcase with retro vibes.", youtubeUrl: "https://www.youtube.com/watch?v=ScMzIvxBSi4", duration: "0:35" },

  // Commercial (8 items)
  { title: "Cinematic Travel Film: Bali", category: "Commercial", description: "High-end luxury travel showcase focusing on natural light.", youtubeUrl: "https://www.youtube.com/watch?v=kYJvY96p3G8", duration: "2:45" },
  { title: "Auto Brand Spotlight", category: "Commercial", description: "Precision driving commercial for a new electric vehicle.", youtubeUrl: "https://www.youtube.com/watch?v=kYJvY96p3G8", duration: "1:30" },
  { title: "Fragrance of Night", category: "Commercial", description: "Elegant perfume ad with slow motion and bokeh.", youtubeUrl: "https://www.youtube.com/watch?v=kYJvY96p3G8", duration: "0:60" },
  { title: "Tech Ecosystem", category: "Commercial", description: "Corporate product showcase for integrated software solutions.", youtubeUrl: "https://www.youtube.com/watch?v=kYJvY96p3G8", duration: "3:15" },
  { title: "Watchmaker Heritage", category: "Commercial", description: "Macro shots of clockwork for a legacy horology brand.", youtubeUrl: "https://www.youtube.com/watch?v=kYJvY96p3G8", duration: "2:00" },
  { title: "Real Estate Luxury", category: "Commercial", description: "Drone footage and interior tour of a $10M mansion.", youtubeUrl: "https://www.youtube.com/watch?v=kYJvY96p3G8", duration: "4:00" },
  { title: "Energy Drink Sprint", category: "Commercial", description: "Fast-cut sports commercial with high intensity.", youtubeUrl: "https://www.youtube.com/watch?v=kYJvY96p3G8", duration: "0:45" },
  { title: "Apparel Winter Lookbook", category: "Commercial", description: "Outdoor lifestyle shoot for a winter clothing line.", youtubeUrl: "https://www.youtube.com/watch?v=kYJvY96p3G8", duration: "1:20" },

  // YouTube (8 items)
  { title: "Tech Review: Minimal Workspace", category: "YouTube", description: "Clean tech review for a major tech channel.", youtubeUrl: "https://www.youtube.com/watch?v=F3SpxOLeq0U", duration: "10:12" },
  { title: "How to Edit Faster", category: "YouTube", description: "Tutorial video with screen recordings and tips.", youtubeUrl: "https://www.youtube.com/watch?v=F3SpxOLeq0U", duration: "15:40" },
  { title: "The State of AI 2024", category: "YouTube", description: "Explainable video essay with motion graphics.", youtubeUrl: "https://www.youtube.com/watch?v=F3SpxOLeq0U", duration: "22:00" },
  { title: "Unboxing the Future", category: "YouTube", description: "Gadget unboxing with high production value.", youtubeUrl: "https://www.youtube.com/watch?v=F3SpxOLeq0U", duration: "12:30" },
  { title: "100 Days of Code", category: "YouTube", description: "Documentary-style vlog of a developer's journey.", youtubeUrl: "https://www.youtube.com/watch?v=F3SpxOLeq0U", duration: "18:20" },
  { title: "Studio Tour V2", category: "YouTube", description: "Cinematographer's studio setup and gear tour.", youtubeUrl: "https://www.youtube.com/watch?v=F3SpxOLeq0U", duration: "14:15" },
  { title: "Photography Basics", category: "YouTube", description: "Educational series for beginner photographers.", youtubeUrl: "https://www.youtube.com/watch?v=F3SpxOLeq0U", duration: "25:00" },
  { title: "Podcast: Episode 42", category: "YouTube", description: "Multi-cam podcast production with guests.", youtubeUrl: "https://www.youtube.com/watch?v=F3SpxOLeq0U", duration: "45:00" },

  // Motion Graphics (8 items)
  { title: "Cyberpunk Glitch Intro", category: "Motion Graphics", description: "Complex motion typography and futuristic aesthetic.", youtubeUrl: "https://www.youtube.com/watch?v=Yp69mPZ6mX8", duration: "0:15" },
  { title: "Liquid Logo Reveal", category: "Motion Graphics", description: "Organic fluid simulation logo animation.", youtubeUrl: "https://www.youtube.com/watch?v=Yp69mPZ6mX8", duration: "0:08" },
  { title: "Data Visualization Set", category: "Motion Graphics", description: "Animated infographics for a financial report.", youtubeUrl: "https://www.youtube.com/watch?v=Yp69mPZ6mX8", duration: "1:30" },
  { title: "Holographic UI Elements", category: "Motion Graphics", description: "Fictional user interface elements for film.", youtubeUrl: "https://www.youtube.com/watch?v=Yp69mPZ6mX8", duration: "0:20" },
  { title: "3D Product Explainer", category: "Motion Graphics", description: "Clean 3D render of a smartphone interior.", youtubeUrl: "https://www.youtube.com/watch?v=Yp69mPZ6mX8", duration: "0:45" },
  { title: "Kinetic Typography", category: "Motion Graphics", description: "Fast-paced word animation synced to lyrics.", youtubeUrl: "https://www.youtube.com/watch?v=Yp69mPZ6mX8", duration: "0:30" },
  { title: "Abstract Particles", category: "Motion Graphics", description: "Endless loop of procedural particle systems.", youtubeUrl: "https://www.youtube.com/watch?v=Yp69mPZ6mX8", duration: "0:12" },
  { title: "Character Walk Cycle", category: "Motion Graphics", description: "Stylized 2D character animation for a startup.", youtubeUrl: "https://www.youtube.com/watch?v=Yp69mPZ6mX8", duration: "0:05" },

  // Music Video (6 items)
  { title: "Music Video: Night Visions", category: "Music Video", description: "Atmospheric color grading for an indie artist.", youtubeUrl: "https://www.youtube.com/watch?v=JGwWNGJdvx8", duration: "3:50" },
  { title: "Underground Bass", category: "Music Video", description: "High-energy club video with strobe effects.", youtubeUrl: "https://www.youtube.com/watch?v=JGwWNGJdvx8", duration: "4:20" },
  { title: "Acoustic Sessions", category: "Music Video", description: "Intimate one-shot performance in a forest.", youtubeUrl: "https://www.youtube.com/watch?v=JGwWNGJdvx8", duration: "5:10" },
  { title: "Synthwave Dreams", category: "Music Video", description: "Retro aesthetic with heavy lens flares.", youtubeUrl: "https://www.youtube.com/watch?v=JGwWNGJdvx8", duration: "3:30" },
  { title: "The Jazz Loft", category: "Music Video", description: "Classy black and white edit with film grain.", youtubeUrl: "https://www.youtube.com/watch?v=JGwWNGJdvx8", duration: "6:00" },
  { title: "Pop Anthem 2025", category: "Music Video", description: "Bright colorful production for a chart-topper.", youtubeUrl: "https://www.youtube.com/watch?v=JGwWNGJdvx8", duration: "3:15" },

  // Documentary (6 items)
  { title: "Documentary: The Artisan", category: "Documentary", description: "Story highlighting the craftsmanship of a luthier.", youtubeUrl: "https://www.youtube.com/watch?v=BvXGPhE-Tto", duration: "5:20" },
  { title: "Wildlife Chronicles", category: "Documentary", description: "Short film about local urban nature.", youtubeUrl: "https://www.youtube.com/watch?v=BvXGPhE-Tto", duration: "8:45" },
  { title: "The Codebreaker", category: "Documentary", description: "Interview-led story about digital security.", youtubeUrl: "https://www.youtube.com/watch?v=BvXGPhE-Tto", duration: "12:00" },
  { title: "Mountain Peak", category: "Documentary", description: "Personal journal of a climber's expedition.", youtubeUrl: "https://www.youtube.com/watch?v=BvXGPhE-Tto", duration: "15:30" },
  { title: "Street Cuisine", category: "Documentary", description: "Exploring the hidden gems of night markets.", youtubeUrl: "https://www.youtube.com/watch?v=BvXGPhE-Tto", duration: "10:00" },
  { title: "Forgotten Echoes", category: "Documentary", description: "Historical perspective on abandoned silos.", youtubeUrl: "https://www.youtube.com/watch?v=BvXGPhE-Tto", duration: "7:15" },
];

const categories = ["Reels", "Commercial", "YouTube", "Documentary", "Music Video", "Motion Graphics", "Ads"];

export default function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState("Reels");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVideo, setSelectedVideo] = useState<{ id: string, title: string } | null>(null);

  const filteredVideos = useMemo(() => {
    return videoProjects.filter((video) => {
      const matchesCategory = video.category === activeCategory;
      const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            video.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

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
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredVideos.map((video, idx) => {
              const youtubeId = getYouTubeId(video.youtubeUrl);
              const thumbnailUrl = youtubeId ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg` : "";
              
              return (
                <motion.div
                  key={idx}
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
                      src={thumbnailUrl} 
                      alt={video.title} 
                      className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-105 transition-all duration-700" 
                    />
                    
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center text-primary glow-lg scale-75 group-hover:scale-100 transition-transform duration-500">
                        <Play fill="currentColor" size={32} className="translate-x-1" />
                      </div>
                    </div>
                    
                    {/* Duration Badge */}
                    <div className="absolute bottom-6 right-6 px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[10px] font-bold text-white flex items-center gap-1.5 border border-white/10 group-hover:border-accent/40 transition-colors">
                      <Clock size={12} className="text-accent" />
                      {video.duration}
                    </div>

                    {/* Format Badge */}
                    <div className="absolute top-6 left-6 px-3 py-1 bg-accent rounded-lg text-[10px] font-bold text-primary tracking-widest uppercase glow-sm">
                      4K 60FPS
                    </div>
                  </div>
                  
                  <div className="px-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold tracking-[0.2em] text-accent uppercase">{video.category}</span>
                      <Share2 size={14} className="text-text-muted hover:text-text-pure transition-colors" />
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
