import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { CheckCircle2, TrendingUp, Globe, Heart, Award, Film, Users, Star } from "lucide-react";
import { cmsStore } from "../lib/cmsStore";
import { StatItem, WebsiteContent } from "../lib/cmsTypes";

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  TrendingUp,
  CheckCircle2,
  Globe,
  Heart,
  Award,
  Film,
  Users,
  Star,
};

export default function WhyHireMe() {
  const [stats, setStats] = useState<StatItem[]>(() => cmsStore.getStats().filter(s => s.visible));
  const [content, setContent] = useState<WebsiteContent>(() => cmsStore.getContent());

  useEffect(() => {
    const handleUpdate = () => {
      setStats(cmsStore.getStats().filter(s => s.visible));
      setContent(cmsStore.getContent());
    };
    window.addEventListener("cms_data_updated", handleUpdate);
    window.addEventListener("rh_data_updated", handleUpdate);
    return () => {
      window.removeEventListener("cms_data_updated", handleUpdate);
      window.removeEventListener("rh_data_updated", handleUpdate);
    };
  }, []);

  const displayStats = stats.slice(0, 4);
  const pillars = content.whyHirePillars || [
    { title: "Story-Driven Editing", text: "Every frame is chosen to reinforce your brand's unique narrative and mission." },
    { title: "High-Retention Techniques", text: "I use data-backed editing patterns to keep viewers watching from start to finish." },
    { title: "Technical Excellence", text: "Mastery of Premiere Pro, After Effects, and DaVinci Resolve for top-tier results." }
  ];

  return (
    <section id="why-hire" className="py-16 sm:py-24 bg-primary relative overflow-hidden">
      {/* Background Glower */}
      <div className="absolute top-1/2 right-0 w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] bg-panel/10 rounded-full blur-[90px] sm:blur-[100px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-left"
          >
            <p className="text-accent font-bold tracking-[0.35em] text-[10px] sm:text-xs mb-2 sm:mb-3 uppercase font-mono">
              {content.whyHireBadge || "Distinctive Advantages"}
            </p>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-display font-bold mb-5 sm:mb-8 leading-[1.12] text-text-pure tracking-[-0.02em]">
              {content.whyHireHeading || "I Don’t Just Edit, I Build Experiences"}
            </h2>
            <div className="space-y-4 sm:space-y-6">
              {pillars.map((item, i) => (
                <div key={i} className="flex gap-3.5 sm:gap-4 items-start group">
                  <div className="w-1 h-10 sm:h-12 bg-accent rounded-full shrink-0 glow-sm group-hover:h-14 transition-all duration-300 mt-1" />
                  <div>
                    <h3 className="text-base sm:text-lg font-display font-bold mb-1 text-text-pure tracking-tight">{item.title}</h3>
                    <p className="text-text-soft text-xs sm:text-sm font-normal leading-relaxed">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <Link 
              to="/#contact" 
              className="inline-flex items-center mt-6 sm:mt-10 px-6 py-3 sm:px-8 sm:py-4 bg-accent hover:bg-accent-hover text-primary font-mono font-bold rounded-full transition-all group glow-md hover:glow-lg active:scale-95 uppercase tracking-wider text-[9px] sm:text-[10px] shadow-lg shadow-accent/20"
            >
              Direct Contact <span className="inline-block group-hover:translate-x-1 transition-transform ml-2">→</span>
            </Link>
          </motion.div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-5 mt-4 lg:mt-0">
            {displayStats.map((stat) => {
              const Icon = ICON_MAP[stat.iconName] || TrendingUp;
              return (
                <motion.div
                  key={stat.id || stat.label}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="glass p-4 sm:p-5 md:p-8 rounded-[18px] sm:rounded-[24px] md:rounded-[32px] group relative overflow-hidden glow-sm hover:glow-md active:scale-95 transition-all duration-300 border border-white/5 hover:border-accent/30"
                >
                  <div className="absolute top-0 right-0 w-12 sm:w-16 h-12 sm:h-16 bg-panel/10 rounded-full -mr-3 -mt-3 blur-xl group-hover:bg-panel/20 transition-all duration-300" />
                  <Icon className="text-accent mb-2 sm:mb-3 group-hover:scale-110 transition-transform" size={18} />
                  <h3 className="text-xl sm:text-3xl md:text-4xl font-mono font-extrabold mb-0.5 text-text-pure tracking-tight">{stat.value}</h3>
                  <p className="text-[8px] sm:text-[10px] font-bold text-accent mb-1 uppercase tracking-wider font-mono">{stat.label}</p>
                  <p className="text-[8px] sm:text-[10px] text-text-muted font-normal leading-relaxed line-clamp-2">{stat.detail}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
