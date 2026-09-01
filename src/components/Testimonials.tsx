import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Star, Quote, Play } from "lucide-react";
import VideoModal from "./VideoModal";
import { cmsStore } from "../lib/cmsStore";
import { TestimonialItem, WebsiteContent } from "../lib/cmsTypes";

// Helper to extract YouTube ID
const getYouTubeId = (url: string) => {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|shorts\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : null;
};

export default function Testimonials() {
  const [selectedVideo, setSelectedVideo] = useState<{ id: string, title: string } | null>(null);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(() => 
    cmsStore.getTestimonials().filter(t => t.visible !== false)
  );
  const [content, setContent] = useState<WebsiteContent>(() => cmsStore.getContent());

  useEffect(() => {
    const handleUpdate = () => {
      setTestimonials(cmsStore.getTestimonials().filter(t => t.visible !== false));
      setContent(cmsStore.getContent());
    };
    window.addEventListener("cms_data_updated", handleUpdate);
    return () => {
      window.removeEventListener("cms_data_updated", handleUpdate);
    };
  }, []);

  if (testimonials.length === 0) return null;

  const videoReviews = testimonials.filter(t => Boolean(t.youtubeUrl && t.youtubeUrl.trim() !== ""));
  const writtenReviews = testimonials.filter(t => !t.youtubeUrl || t.youtubeUrl.trim() === "" || t.text);

  return (
    <section id="testimonials" className="py-16 sm:py-24 bg-primary relative overflow-hidden">
      {/* Background Glowers */}
      <div className="absolute bottom-0 right-0 w-[240px] sm:w-[400px] h-[240px] sm:h-[400px] bg-accent/5 rounded-full blur-[50px] sm:blur-[70px] pointer-events-none" />
      <div className="absolute top-0 left-0 w-[200px] sm:w-[350px] h-[200px] sm:h-[350px] bg-panel/10 rounded-full blur-[50px] sm:blur-[70px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-accent font-bold tracking-[0.3em] text-[9px] sm:text-[10px] mb-2 uppercase font-mono"
          >
            {content.testimonialsBadge || "Voices of Impact"}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-2xl sm:text-3xl md:text-5xl font-display font-bold text-text-pure tracking-tight leading-tight max-w-3xl mx-auto"
          >
            {content.testimonialsHeading || "Client Reviews & Endorsements"}
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0, width: 0 }}
            whileInView={{ opacity: 1, width: 80 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="h-[1px] bg-gradient-to-r from-transparent via-accent/50 to-transparent mx-auto mt-4 sm:mt-6"
          />
        </div>

        {/* Video Reviews Showcase (if available) */}
        {videoReviews.length > 0 && (
          <div className="mb-12 sm:mb-16">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {videoReviews.map((review, index) => (
                <motion.div
                  key={review.id || review.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="group active:scale-[0.98] transition-all"
                >
                  <div className="relative">
                    {/* Video Card */}
                    <div 
                      className="relative aspect-[9/16] rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer group/video border border-white/10 glass-dark glow-sm hover:glow-md transition-all duration-500 shadow-lg"
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
                        className="w-full h-full object-cover grayscale brightness-90 sm:grayscale sm:opacity-60 group-hover/video:grayscale-0 group-hover/video:opacity-100 group-hover/video:scale-105 transition-all duration-700" 
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop";
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 sm:bg-transparent">
                        <div className="w-10 h-10 sm:w-13 sm:h-13 bg-accent/95 rounded-full flex items-center justify-center text-primary backdrop-blur-sm scale-95 group-hover/video:scale-110 transition-transform duration-300 shadow-lg shadow-accent/30">
                          <Play fill="currentColor" size={15} className="translate-x-0.5 sm:w-4 sm:h-4" />
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-transparent to-transparent pointer-events-none" />
                    </div>
                    
                    {/* Video Review Info */}
                    <div className="mt-3 text-center px-1">
                      <h4 className="text-text-pure font-display font-bold text-sm sm:text-base tracking-tight mb-0.5 group-hover:text-accent transition-colors truncate">
                        {review.name}
                      </h4>
                      <p className="text-text-muted text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.15em] group-hover:text-text-soft transition-colors font-mono truncate">
                        {review.role} {review.company && `• ${review.company}`}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Written 5-Star Reviews Grid */}
        {writtenReviews.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {writtenReviews.map((t, i) => (
              <motion.div
                key={t.id || t.name}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -5 }}
                className="glass p-5 sm:p-7 rounded-3xl relative border border-accent/10 hover:border-accent/30 transition-all duration-500 glow-sm group h-full flex flex-col justify-between bg-secondary/40"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex gap-1">
                      {[...Array(t.rating || 5)].map((_, rIdx) => (
                        <Star key={rIdx} size={13} className="fill-accent text-accent" />
                      ))}
                    </div>
                    <span className="text-[9px] font-mono font-bold text-accent px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20">
                      Verified Client
                    </span>
                  </div>
                  
                  <div className="mb-6 relative">
                    <Quote className="absolute -top-3 -left-3 text-accent/10 w-10 h-10 pointer-events-none" />
                    <p className="text-text-pure italic text-xs sm:text-sm font-display leading-[1.6] font-light relative z-10 tracking-tight">
                      "{t.text}"
                    </p>
                  </div>
                </div>

                <div className="mt-auto flex items-center gap-3 pt-4 border-t border-white/5">
                  <div className="w-10 h-10 rounded-xl overflow-hidden border border-accent/20 grayscale brightness-90 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-500 shrink-0">
                    <img
                      src={t.image}
                      alt={t.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop";
                      }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-display font-bold text-text-pure tracking-tight truncate">
                      {t.name}
                    </h4>
                    <p className="text-text-muted text-[8px] sm:text-[9px] font-bold uppercase tracking-wider font-mono truncate">
                      {t.role} {t.company && `• ${t.company}`}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

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
