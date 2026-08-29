import { useState, useEffect } from "react";
import { motion } from "motion/react";
import aboutPortrait from "../assets/images/user_about_portrait.jpg";
import { cmsStore } from "../lib/cmsStore";
import { ProfileHeroData, SkillItem, WebsiteContent, StatItem } from "../lib/cmsTypes";

export default function About() {
  const [profile, setProfile] = useState<ProfileHeroData>(() => cmsStore.getProfile());
  const [content, setContent] = useState<WebsiteContent>(() => cmsStore.getContent());
  const [skills, setSkills] = useState<SkillItem[]>(() => cmsStore.getSkills().filter(s => s.visible));
  const [stats, setStats] = useState<StatItem[]>(() => cmsStore.getStats());

  useEffect(() => {
    const handleUpdate = () => {
      setProfile(cmsStore.getProfile());
      setContent(cmsStore.getContent());
      setSkills(cmsStore.getSkills().filter(s => s.visible));
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
    : aboutPortrait;

  return (
    <section id="about" className="py-20 md:py-32 relative overflow-hidden bg-primary">
      {/* Background Glower */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-panel/5 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative max-w-sm mx-auto lg:max-w-none"
          >
            <div className="absolute inset-0 bg-accent/20 blur-[100px] rounded-full z-0 opacity-10" />
            <div className="relative z-10 aspect-[4/5] rounded-[2rem] overflow-hidden border border-white/10 glass-dark bg-secondary/80 glow-lg group">
              <img 
                src={displayPortrait}
                alt={`${profile.name} - Creative Director`} 
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105 select-none" 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = aboutPortrait;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent pointer-events-none" />
            </div>
            
            {/* Experience Tag */}
            <div className="absolute -bottom-3 -right-3 sm:-bottom-6 sm:-right-6 glass p-3 sm:p-6 rounded-[16px] sm:rounded-[32px] z-20 border border-accent/20 glow-md text-center sm:text-left">
              <p className="text-xl sm:text-4xl font-display font-bold text-accent tracking-tighter leading-none">{yearsExp}</p>
              <p className="text-[7px] sm:text-[9px] font-bold text-text-soft uppercase tracking-[0.3em] leading-tight mt-1">Years Of<br className="hidden sm:block" />Experience</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col justify-center"
          >
            <p className="text-accent font-bold tracking-[0.4em] text-[9px] mb-4 uppercase">
              {content.aboutBadge || "The Creative Narrative"}
            </p>
            <h2 className="text-2xl md:text-5xl font-display font-medium mb-4 sm:mb-6 text-text-pure tracking-tighter leading-[1.1]">
              {content.aboutHeading || "Mastering the Cinematic Art of Storytelling"}
            </h2>
            <p className="text-xs md:text-lg text-text-soft mb-6 sm:mb-10 leading-relaxed font-light">
              {profile.fullBio || content.aboutDescription}
            </p>
            
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {skills.map((skill, i) => (
                <motion.div
                  key={skill.id || skill.name}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -5 }}
                  className="glass p-3 sm:p-5 rounded-[12px] sm:rounded-[20px] flex flex-col items-center justify-center gap-2 group transition-all duration-500 border border-white/5 hover:border-accent/30 relative overflow-hidden"
                >
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-xl pointer-events-none" 
                    style={{ backgroundColor: skill.glowColor || "rgba(163, 133, 96, 0.3)" }}
                  />
                  <div 
                    className="w-5 h-5 sm:w-8 sm:h-8 bg-text-muted group-hover:bg-accent transition-all duration-500 relative z-10" 
                    style={{
                      maskImage: `url(${skill.logo})`,
                      WebkitMaskImage: `url(${skill.logo})`,
                      maskSize: 'contain',
                      WebkitMaskSize: 'contain',
                      maskRepeat: 'no-repeat',
                      WebkitMaskRepeat: 'no-repeat',
                      maskPosition: 'center',
                      WebkitMaskPosition: 'center'
                    }}
                  />
                  <span className="text-[7px] sm:text-[9px] font-bold text-text-muted group-hover:text-text-pure uppercase tracking-widest relative z-10 transition-colors text-center">{skill.name}</span>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 sm:mt-10 flex flex-wrap gap-8 sm:gap-10">
              <div>
                <p className="text-xl sm:text-2xl font-display font-bold text-text-pure tracking-tighter text-glow">{projectsCount}</p>
                <p className="text-[8px] sm:text-[9px] text-text-muted uppercase font-bold tracking-[0.3em] mt-1">Projects Done</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-display font-bold text-text-pure tracking-tighter text-glow">{happyClientsCount}</p>
                <p className="text-[8px] sm:text-[9px] text-text-muted uppercase font-bold tracking-[0.3em] mt-1">Happy Clients</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
