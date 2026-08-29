import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Play, ChevronRight, Star, Users, Award, Sparkles } from "lucide-react";
import heroPortrait from "../assets/images/user_hero_portrait.jpg";
import { cmsStore } from "../lib/cmsStore";
import { ProfileHeroData, WebsiteContent, StatItem } from "../lib/cmsTypes";

export default function Hero() {
  const [profile, setProfile] = useState<ProfileHeroData>(() => cmsStore.getProfile());
  const [content, setContent] = useState<WebsiteContent>(() => cmsStore.getContent());
  const [stats, setStats] = useState<StatItem[]>(() => cmsStore.getStats());

  useEffect(() => {
    const handleUpdate = () => {
      setProfile(cmsStore.getProfile());
      setContent(cmsStore.getContent());
      setStats(cmsStore.getStats());
    };
    window.addEventListener("cms_data_updated", handleUpdate);
    window.addEventListener("rh_data_updated", handleUpdate);
    return () => {
      window.removeEventListener("cms_data_updated", handleUpdate);
      window.removeEventListener("rh_data_updated", handleUpdate);
    };
  }, []);

  const yearsExp = stats.find(s => s.label.toLowerCase().includes("year"))?.value || "2+";
  const projectsCount = stats.find(s => s.label.toLowerCase().includes("project"))?.value || "183+";
  const happyClientsCount = stats.find(s => s.label.toLowerCase().includes("client"))?.value || "47+";

  const displayPortrait = profile.portraitUrl && profile.portraitUrl.trim() !== "" 
    ? profile.portraitUrl 
    : heroPortrait;

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-24 pb-12 overflow-hidden bg-primary">
      {/* Ambient Burgundy Glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-panel/10 rounded-full blur-[150px] pointer-events-none" />
      {/* Background Gold Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[180px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Availability & Title Tag */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="px-3.5 py-1.5 rounded-full bg-accent/15 border border-accent/30 text-accent text-[9px] sm:text-[10px] font-bold tracking-[0.2em] uppercase font-mono">
              {profile.primaryTitle || content.heroTaglineBadge}
            </span>

            {profile.availableForWork && (
              <span className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-[9px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> Available for Projects
              </span>
            )}
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-medium leading-[0.9] sm:leading-[0.85] mb-6 sm:mb-8 tracking-tighter text-text-pure">
            {content.heroHeadingLine1 || "Creative"}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-text-pure via-text-pure to-accent font-light">
              {content.heroHeadingLine2 || "Visuals"}
            </span> <br />
            {content.heroHeadingLine3 || "for Modern Brands"}
          </h1>
          
          <p className="text-xs sm:text-base md:text-lg text-text-soft mb-8 sm:mb-12 max-w-xl leading-relaxed font-light">
            {profile.shortBio || content.heroDescription}
          </p>
          
          <div className="flex flex-wrap gap-3 sm:gap-4">
            <Link
              to={profile.ctaPrimaryUrl || "/#contact"}
              className="group relative bg-accent hover:bg-accent-hover text-primary font-bold px-6 py-3.5 md:px-8 md:py-4 rounded-full transition-all duration-300 flex items-center gap-2 overflow-hidden glow-md"
            >
              <span className="z-10 uppercase tracking-widest text-[9px] md:text-[10px]">
                {profile.ctaPrimaryText || "Hire Me Now"}
              </span>
              <ChevronRight className="z-10 w-3.5 h-3.5 md:w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to={profile.ctaSecondaryUrl || "/work"}
              className="glass hover:bg-white/10 text-text-pure font-bold px-6 py-3.5 md:px-8 md:py-4 rounded-full transition-all duration-300 flex items-center gap-2 border border-accent/20"
            >
              <span className="uppercase tracking-widest text-[9px] md:text-[10px]">
                {profile.ctaSecondaryText || "View My Work"}
              </span>
              <Play className="w-3 h-3 md:w-3.5 md:h-3.5 fill-text-pure" />
            </Link>
          </div>
          
          {/* Social Proof */}
          <div className="mt-12 flex items-center gap-6">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-primary overflow-hidden bg-secondary">
                  <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="Client" />
                </div>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1 text-accent mb-0.5">
                {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={14} fill="currentColor" />)}
              </div>
              <p className="text-xs text-text-muted font-medium tracking-wide uppercase">
                {content.heroSocialProofText || `TRUSTED BY ${happyClientsCount} GLOBAL CLIENTS`}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          {/* Main Hero Image Container */}
          <div className="relative aspect-[4/5] max-w-md mx-auto">
            {/* Ambient Backlight Glows */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-accent/20 via-panel/20 to-transparent blur-3xl rounded-[48px] z-0 pointer-events-none" />
            <div className="absolute inset-0 bg-secondary/80 rounded-[36px] sm:rounded-[44px] z-0 border border-accent/20 shadow-2xl" />

            {/* Inner Image Frame */}
            <div className="relative z-10 w-full h-full rounded-[36px] sm:rounded-[44px] overflow-hidden border border-white/10 glass-dark bg-secondary/90 flex items-center justify-center">
              <img 
                 src={displayPortrait} 
                 alt={profile.name || "Rehman Hridoy"} 
                 className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105 select-none" 
                 onError={(e) => {
                   (e.target as HTMLImageElement).src = heroPortrait;
                 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent pointer-events-none" />
            </div>
            
            {/* Floating Stats */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-4 sm:-right-8 top-1/4 z-20 glass p-3 sm:p-4 rounded-2xl glow-lg border border-white/20 hidden sm:block"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                  <Award size={20} />
                </div>
                <div>
                  <p className="text-xs text-text-soft font-medium">Experience</p>
                  <p className="text-lg font-bold text-text-pure uppercase">{yearsExp} YEARS</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -left-4 sm:-left-8 bottom-1/4 z-20 glass p-3 sm:p-4 rounded-2xl glow-lg border border-white/20 hidden sm:block"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                  <Users size={20} />
                </div>
                <div>
                  <p className="text-xs text-text-soft font-medium">Projects</p>
                  <p className="text-lg font-bold text-text-pure uppercase">{projectsCount} COMPLETED</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
      
      {/* Floating Particles/Light Effects */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        {[1, 2, 3, 4, 5].map((i) => (
          <motion.div
            key={i}
            animate={{ 
              y: [0, -100, 0],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{ 
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
            className="absolute bg-accent w-1 h-1 rounded-full"
            style={{ 
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          />
        ))}
      </div>
    </section>
  );
}
