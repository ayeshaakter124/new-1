import { useState } from "react";
import { motion } from "motion/react";
import { Play } from "lucide-react";
import VideoModal from "./VideoModal";

// Helper to extract YouTube ID
const getYouTubeId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

const reviews = [
  {
    client: "Sarah Jenkins",
    role: "CEO, TechVision",
    content: "The cinematic edit completely transformed our brand story. The pacing and color grading were exceptional.",
    thumbnail: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop",
    youtubeUrl: "https://www.youtube.com/watch?v=kYJvY96p3G8",
    rating: 5
  },
  {
    client: "Marcus Chen",
    role: "Content Creator",
    content: "My retention rates skyrocketed after we started working on my Reels. Fast, reliable, and incredibly creative.",
    thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
    youtubeUrl: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
    rating: 5
  },
  {
    client: "Elena Rodriguez",
    role: "Marketing Director",
    content: "A master of storytelling. Our commercial looked like a high-budget Hollywood production. Incredible work!",
    thumbnail: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400&auto=format&fit=crop",
    youtubeUrl: "https://www.youtube.com/watch?v=F3SpxOLeq0U",
    rating: 5
  },
  {
    client: "David Wilson",
    role: "Founder, Peak Performance",
    content: "The level of professionalism and artistic direction is unmatched. Our brand engagement has doubled since we updated our content.",
    thumbnail: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",
    youtubeUrl: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
    rating: 5
  },
];

export default function Services() {
  const [selectedVideo, setSelectedVideo] = useState<{ id: string, title: string } | null>(null);

  return (
    <section id="services" className="py-24 bg-primary relative overflow-hidden">
      {/* Background Glower */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-panel/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16 sm:mb-24">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-accent font-bold tracking-[0.4em] text-[10px] sm:text-xs mb-4 uppercase"
          >
            Voices of Impact
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-6xl font-display font-medium text-text-pure tracking-tighter"
          >
            Client <span className="text-accent font-light italic">Video Reviews</span>
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0, width: 0 }}
            whileInView={{ opacity: 1, width: 100 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="h-[1px] bg-gradient-to-r from-transparent via-accent/50 to-transparent mx-auto mt-8 max-w-xs"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 sm:gap-12">
          {reviews.map((review, index) => (
            <motion.div
              key={review.client}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="group"
            >
              <div className="relative">
                {/* Video Container */}
                <div 
                  className="relative aspect-[9/16] rounded-[32px] overflow-hidden cursor-pointer group/video border border-white/5 glass-dark glow-sm hover:glow-md transition-all duration-700"
                  onClick={() => {
                    const id = getYouTubeId(review.youtubeUrl);
                    if (id) setSelectedVideo({ id, title: review.client });
                  }}
                >
                  <img 
                    src={review.thumbnail} 
                    alt={review.client} 
                    className="w-full h-full object-cover grayscale opacity-40 group-hover/video:grayscale-0 group-hover/video:opacity-100 group-hover/video:scale-105 transition-all duration-700" 
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 bg-accent/90 rounded-full flex items-center justify-center text-primary backdrop-blur-sm scale-90 group-hover/video:scale-110 transition-transform duration-500">
                      <Play fill="currentColor" size={20} className="translate-x-0.5" />
                    </div>
                  </div>
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent pointer-events-none" />
                </div>
                
                {/* Client Footer Info */}
                <div className="mt-6 text-center">
                  <h4 className="text-text-pure font-display font-bold text-lg tracking-tight mb-1 group-hover:text-accent transition-colors">
                    {review.client}
                  </h4>
                  <p className="text-text-muted text-[10px] font-bold uppercase tracking-[0.2em] group-hover:text-text-soft transition-colors">
                    {review.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Video Modal */}
        <VideoModal 
          videoId={selectedVideo?.id || null} 
          onClose={() => setSelectedVideo(null)} 
          title={`Review by ${selectedVideo?.title || ""}`}
        />
      </div>
    </section>
  );
}

