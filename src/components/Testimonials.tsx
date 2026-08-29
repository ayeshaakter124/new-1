import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Star, Quote, Play } from "lucide-react";
import { cmsStore } from "../lib/cmsStore";
import { TestimonialItem, WebsiteContent } from "../lib/cmsTypes";

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(() => 
    cmsStore.getTestimonials().filter(t => t.visible)
  );
  const [content, setContent] = useState<WebsiteContent>(() => cmsStore.getContent());

  useEffect(() => {
    const handleUpdate = () => {
      setTestimonials(cmsStore.getTestimonials().filter(t => t.visible));
      setContent(cmsStore.getContent());
    };
    window.addEventListener("cms_data_updated", handleUpdate);
    window.addEventListener("rh_data_updated", handleUpdate);
    return () => {
      window.removeEventListener("cms_data_updated", handleUpdate);
      window.removeEventListener("rh_data_updated", handleUpdate);
    };
  }, []);

  if (testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="py-24 bg-primary relative overflow-hidden">
      {/* Background Glower */}
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-panel/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-accent font-bold tracking-[0.4em] text-[9px] mb-3 uppercase">
              {content.testimonialsBadge || "Elite Endorsements"}
            </p>
            <h2 className="text-2xl md:text-5xl font-display font-medium text-text-pure tracking-tighter leading-[1.1]">
              {content.testimonialsHeading || "Testimonials of Excellence"}
            </h2>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id || t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className="glass p-5 sm:p-8 rounded-[20px] sm:rounded-[32px] relative border border-accent/10 hover:border-accent/40 transition-all duration-500 glow-sm group h-full flex flex-col justify-between"
            >
              <div>
                <div className="flex gap-1 mb-3 sm:mb-6">
                  {[...Array(t.rating || 5)].map((_, i) => (
                    <Star key={i} size={11} className="fill-accent text-accent sm:w-3.5 sm:h-3.5" />
                  ))}
                </div>
                
                <div className="mb-4 sm:mb-6 relative">
                  <Quote className="absolute -top-3 -left-3 sm:-top-6 sm:-left-6 text-accent/10 w-10 h-10 sm:w-16 sm:h-16 pointer-events-none" />
                  <p className="text-text-pure italic text-[13px] sm:text-base font-display leading-[1.6] font-light relative z-10 tracking-tight">
                    "{t.text}"
                  </p>
                </div>
              </div>

              <div className="mt-auto flex items-center gap-3 pt-4 sm:pt-6 border-t border-accent/10">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl overflow-hidden border border-accent/20 grayscale brightness-90 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700 shrink-0">
                  <img
                    src={t.image}
                    alt={t.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop";
                    }}
                  />
                </div>
                <div>
                  <h4 className="text-[13px] sm:text-base font-display font-bold text-text-pure tracking-tight">
                    {t.name}
                  </h4>
                  <p className="text-accent text-[8px] sm:text-[9px] font-bold uppercase tracking-widest font-mono">
                    {t.role} {t.company && `• ${t.company}`}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
