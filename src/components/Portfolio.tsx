import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import { Play, ArrowRight } from "lucide-react";
import VideoModal from "./VideoModal";

// Helper to extract YouTube ID
const getYouTubeId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

const categories = ["Reels", "Commercial", "YouTube", "Motion Graphics"];

const projects = [
  {
    id: 1,
    title: "Urban Pulse",
    category: "Commercial",
    description: "Cinematic commercial for a high-end fashion brand.",
    image: "https://images.unsplash.com/photo-1536240478700-b869070f9279?q=80&w=800&auto=format&fit=crop",
    youtubeUrl: "https://www.youtube.com/watch?v=kYJvY96p3G8",
  },
  {
    id: 2,
    title: "Coffee Dreams",
    category: "Reels",
    description: "Viral lifestyle reel with 1.2M+ views.",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=800&auto=format&fit=crop",
    youtubeUrl: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
  },
  {
    id: 3,
    title: "Tech Unboxing",
    category: "YouTube",
    description: "Clean tech review for a major influencer.",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop",
    youtubeUrl: "https://www.youtube.com/watch?v=F3SpxOLeq0U",
  },
  {
    id: 4,
    title: "Abstract Flow",
    category: "Motion Graphics",
    description: "Dynamic intro animation for a digital agency.",
    image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800&auto=format&fit=crop",
    youtubeUrl: "https://www.youtube.com/watch?v=Yp69mPZ6mX8",
  },
  {
    id: 5,
    title: "Mountain Escape",
    category: "Reels",
    description: "Travel montage with seamless speed ramping.",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop",
    youtubeUrl: "https://www.youtube.com/watch?v=JGwWNGJdvx8",
  },
  {
    id: 6,
    title: "Cyberpunk Glitch Edit",
    category: "Motion Graphics",
    description: "Complex glitch effects and futuristic typography.",
    image: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=800&auto=format&fit=crop",
    youtubeUrl: "https://www.youtube.com/watch?v=BvXGPhE-Tto",
  },
  {
    id: 7,
    title: "Neon City",
    category: "Reels",
    description: "Vibrant nightlife showcase with custom sound design.",
    image: "https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=800&auto=format&fit=crop",
    youtubeUrl: "https://www.youtube.com/watch?v=Yp69mPZ6mX8",
  },
  {
    id: 8,
    title: "Minimalist Loft",
    category: "Reels",
    description: "Interior design walkthrough with elegant transitions.",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=800&auto=format&fit=crop",
    youtubeUrl: "https://www.youtube.com/watch?v=JGwWNGJdvx8",
  },
];

export default function Portfolio() {
  const [activeTab, setActiveTab] = useState("Reels");
  const [selectedVideo, setSelectedVideo] = useState<{ id: string, title: string } | null>(null);

  const filteredProjects = projects.filter(p => p.category === activeTab);

  return (
    <section id="portfolio" className="py-20 md:py-24 bg-primary relative overflow-hidden">
      {/* Background Glower */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-panel/5 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-16 gap-6 sm:gap-8">
          <div>
            <p className="text-accent font-bold tracking-[0.4em] text-[9px] sm:text-xs mb-3 sm:mb-4 uppercase">Selected Masterpieces</p>
            <h2 className="text-2xl md:text-5xl font-display font-medium text-text-pure tracking-tighter leading-tight">Cinematic <span className="text-accent font-light">Showcase</span></h2>
          </div>
          
          <div className="flex flex-wrap gap-1.5 sm:gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-3 py-1.5 sm:px-6 sm:py-2 rounded-full text-[8px] sm:text-xs font-bold uppercase tracking-widest transition-all duration-300 border ${
                  activeTab === cat 
                    ? "bg-accent text-primary border-accent glow-sm" 
                    : "bg-secondary text-text-muted border-white/5 hover:border-accent/40"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <motion.div 
          layout
          className={`grid gap-8 md:gap-10 ${
            activeTab === 'Reels' 
              ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' 
              : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          }`}
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className={`group relative rounded-[24px] sm:rounded-[48px] overflow-hidden bg-secondary cursor-pointer glow-sm hover:glow-md transition-all duration-700 border border-accent/10 ${project.category === 'Reels' ? 'aspect-[9/16]' : 'aspect-video'}`}
                onClick={() => {
                  const id = getYouTubeId(project.youtubeUrl);
                  if (id) setSelectedVideo({ id, title: project.title });
                }}
              >
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-4 sm:p-10 flex flex-col justify-end">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-accent text-[8px] sm:text-[10px] font-bold tracking-[0.3em] uppercase mb-1 sm:mb-2">{project.category}</p>
                      <h3 className="text-base md:text-xl font-display font-medium mb-1 sm:mb-2 text-text-pure tracking-tight">{project.title}</h3>
                      <p className="text-text-soft text-[10px] md:text-xs font-light leading-relaxed line-clamp-2">{project.description}</p>
                    </div>
                    
                    <div className="w-8 h-8 md:w-12 md:h-12 bg-accent rounded-full flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500 glow-lg shadow-2xl shrink-0 ml-2">
                      <Play fill="currentColor" size={14} className="translate-x-0.5 md:w-5 md:h-5" />
                    </div>
                  </div>
                </div>
                
                {/* Visual Accent */}
                <div className="absolute top-3 right-3 sm:top-6 sm:right-6 px-2.5 py-1 sm:px-4 sm:py-2 rounded-full glass text-[7px] sm:text-[10px] font-bold tracking-widest uppercase opacity-80 z-20 border-accent/20">
                  4K Excellence
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* View All Button */}
        <div className="mt-12 sm:mt-20 text-center">
          <Link 
            to="/work" 
            className="inline-flex items-center gap-4 px-8 py-3.5 md:px-10 md:py-4 glass border border-accent/20 hover:border-accent/60 rounded-full group transition-all duration-300 glow-sm hover:glow-md uppercase tracking-widest text-[9px] md:text-[10px] font-bold"
          >
            <span className="text-text-pure">View All Work</span>
            <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-accent group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>

        {/* Video Modal */}
        <VideoModal 
          videoId={selectedVideo?.id || null} 
          onClose={() => setSelectedVideo(null)} 
          title={selectedVideo?.title || ""}
        />
      </div>
    </section>
  );
}
