import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Play } from "lucide-react";
import VideoModal from "./VideoModal";
import { cmsStore } from "../lib/cmsStore";
import { TestimonialItem, WebsiteContent } from "../lib/cmsTypes";

// Helper to extract YouTube ID
const getYouTubeId = (url: string) => {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|shorts\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : null;
};

export default function Services() {
  const [selectedVideo, setSelectedVideo] = useState<{ id: string, title: string } | null>(null);
  const [reviewsList, setReviewsList] = useState<TestimonialItem[]>(() => 
    cmsStore.getTestimonials().filter(t => t.visible && (t.youtubeUrl || t.image))
  );
  const [content, setContent] = useState<WebsiteContent>(() => cmsStore.getContent());

  useEffect(() => {
    const handleUpdate = () => {
      setReviewsList(cmsStore.getTestimonials().filter(t => t.visible && (t.youtubeUrl || t.image)));
      setContent(cmsStore.getContent());
    };
    window.addEventListener("cms_data_updated", handleUpdate);
    window.addEventListener("rh_data_updated", handleUpdate);
    return () => {
      window.removeEventListener("cms_data_updated", handleUpdate);
      window.removeEventListener("rh_data_updated", handleUpdate);
    };
  }, []);

  if (reviewsList.length === 0) return null;

  return (
    <section id="services" className="py-16 sm:py-24 bg-primary relative overflow-hidden">
      {/* Background Glowers */}
      <div className="absolute bottom-0 right-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-accent/5 rounded-full blur-[90px] sm:blur-[120px] pointer-events-none" />
      <div className="absolute top-0 left-0 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-panel/10 rounded-full blur-[80px] sm:blur-[100px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-10 sm:mb-20">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-accent font-bold tracking-[0.3em] text-[9px] sm:text-[10px] mb-1.5 sm:mb-2 uppercase font-mono"
          >
            {content.servicesBadge || "Voices of Impact"}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-text-pure tracking-tight leading-tight"
          >
            {content.servicesHeading || "Client Video Reviews"}
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0, width: 0 }}
            whileInView={{ opacity: 1, width: 80 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="h-[1px] bg-gradient-to-r from-transparent via-accent/50 to-transparent mx-auto mt-4 sm:mt-8 max-w-xs"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8 lg:gap-10">
          {reviewsList.map((review, index) => (
            <motion.div
              key={review.id || review.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group active:scale-[0.98] transition-all"
            >
              <div className="relative">
                {/* Video Container */}
                <div 
                  className="relative aspect-[9/16] rounded-[20px] sm:rounded-[32px] overflow-hidden cursor-pointer group/video border border-white/10 glass-dark glow-sm hover:glow-md transition-all duration-500 shadow-lg"
                  onClick={() => {
                    const id = getYouTubeId(review.youtubeUrl || "");
                    if (id) setSelectedVideo({ id, title: review.name });
                  }}
                >
                  <img 
                    src={review.image} 
                    alt={review.name} 
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover grayscale brightness-90 sm:grayscale sm:opacity-40 group-hover/video:grayscale-0 group-hover/video:opacity-100 group-hover/video:scale-105 transition-all duration-700" 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop";
                    }}
                  />
                  {review.youtubeUrl && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 sm:bg-transparent">
                      <div className="w-10 h-10 sm:w-14 sm:h-14 bg-accent/95 rounded-full flex items-center justify-center text-primary backdrop-blur-sm scale-95 group-hover/video:scale-110 transition-transform duration-300 shadow-lg shadow-accent/30">
                        <Play fill="currentColor" size={15} className="translate-x-0.5 sm:w-5 sm:h-5" />
                      </div>
                    </div>
                  )}
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent pointer-events-none" />
                </div>
                
                {/* Client Footer Info */}
                <div className="mt-3 sm:mt-5 text-center px-1">
                  <h4 className="text-text-pure font-display font-bold text-sm sm:text-lg tracking-tight mb-0.5 group-hover:text-accent transition-colors truncate">
                    {review.name}
                  </h4>
                  <p className="text-text-muted text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] group-hover:text-text-soft transition-colors font-mono truncate">
                    {review.role} {review.company && `• ${review.company}`}
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
