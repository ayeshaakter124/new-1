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
    <section id="why-hire" className="py-20 bg-primary relative overflow-hidden">
      {/* Background Glower */}
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-panel/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-accent font-bold tracking-[0.4em] text-[10px] mb-3 uppercase">
              {content.whyHireBadge || "Distinctive Advantages"}
            </p>
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6 leading-tight text-text-pure tracking-tighter">
              {content.whyHireHeading || "I Don’t Just Edit, I Build Experiences"}
            </h2>
            <div className="space-y-6">
              {pillars.map((item, i) => (
                <div key={i} className="flex gap-4 items-start group">
                  <div className="w-1 h-12 bg-accent rounded-full shrink-0 glow-sm group-hover:h-14 transition-all duration-500" />
                  <div>
                    <h4 className="text-lg font-display font-bold mb-1.5 text-text-pure tracking-tight">{item.title}</h4>
                    <p className="text-text-soft text-[13px] font-light leading-relaxed">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <Link 
              to="/#contact" 
              className="inline-flex items-center mt-10 px-8 py-4 bg-accent hover:bg-accent-hover text-primary font-bold rounded-full transition-all group glow-md hover:glow-lg hover:scale-105 active:scale-95 uppercase tracking-widest text-[10px]"
            >
              Direct Contact <span className="inline-block group-hover:translate-x-2 transition-transform ml-2">→</span>
            </Link>
          </motion.div>

          <div className="grid grid-cols-2 gap-4 md:gap-5">
            {displayStats.map((stat) => {
              const Icon = ICON_MAP[stat.iconName] || TrendingUp;
              return (
                <motion.div
                  key={stat.id || stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileHover={{ y: -5 }}
                  className="glass p-5 md:p-8 rounded-[20px] md:rounded-[32px] group relative overflow-hidden glow-sm hover:glow-md active:scale-95 transition-all duration-500 border border-white/5 hover:border-accent/30"
                >
                  <div className="absolute top-0 right-0 w-16 h-16 bg-panel/10 rounded-full -mr-5 -mt-5 blur-xl group-hover:bg-panel/20 transition-all duration-500" />
                  <Icon className="text-accent mb-3 group-hover:scale-110 transition-transform" size={20} />
                  <h3 className="text-xl md:text-4xl font-display font-bold mb-0.5 text-text-pure tracking-tighter">{stat.value}</h3>
                  <p className="text-[8px] sm:text-[9px] font-bold text-text-soft mb-1 sm:mb-2 uppercase tracking-widest">{stat.label}</p>
                  <p className="text-[8px] sm:text-[9px] text-text-muted uppercase tracking-[0.2em] font-medium leading-[1.4] sm:leading-relaxed">{stat.detail}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
