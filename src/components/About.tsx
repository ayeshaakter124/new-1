import { motion } from "motion/react";

const SKILLS = [
  { 
    name: "Premiere Pro", 
    logo: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/adobepremierepro.svg",
    glow: "rgba(163, 133, 96, 0.4)"
  },
  { 
    name: "After Effects", 
    logo: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/adobeaftereffects.svg",
    glow: "rgba(163, 133, 96, 0.3)"
  },
  { 
    name: "Photoshop", 
    logo: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/adobephotoshop.svg",
    glow: "rgba(163, 133, 96, 0.2)"
  },
  { 
    name: "DaVinci Resolve", 
    logo: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/davinciresolve.svg",
    glow: "rgba(163, 133, 96, 0.4)"
  },
  { 
    name: "Cinema 4D", 
    logo: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/cinema4d.svg",
    glow: "rgba(163, 133, 96, 0.2)"
  },
  { 
    name: "Figma", 
    logo: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/figma.svg",
    glow: "rgba(163, 133, 96, 0.3)"
  },
];

export default function About() {
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
            <div className="relative z-10 aspect-[4/5] rounded-[2rem] overflow-hidden border border-white/5 glass-dark glow-lg group">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop" 
                alt="Mehedi - Creative Director" 
                className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent opacity-80" />
            </div>
            
            {/* Experience Tag */}
            <div className="absolute -bottom-3 -right-3 sm:-bottom-6 sm:-right-6 glass p-3 sm:p-6 rounded-[16px] sm:rounded-[32px] z-20 border border-accent/20 glow-md text-center sm:text-left">
              <p className="text-xl sm:text-4xl font-display font-bold text-accent tracking-tighter leading-none">3+</p>
              <p className="text-[7px] sm:text-[9px] font-bold text-text-soft uppercase tracking-[0.3em] leading-tight mt-1">Years Of<br className="hidden sm:block" />Experience</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col justify-center"
          >
            <p className="text-accent font-bold tracking-[0.4em] text-[9px] mb-4 uppercase">The Creative Narrative</p>
            <h2 className="text-2xl md:text-5xl font-display font-medium mb-4 sm:mb-6 text-text-pure tracking-tighter leading-[1.1]">
              Mastering the <span className="text-accent font-light">Cinematic</span> <br />Art of Storytelling
            </h2>
            <p className="text-xs md:text-lg text-text-soft mb-6 sm:mb-10 leading-relaxed font-light">
              Based in the pulse of the digital design landscape, I’ve spent the last decade distilling complex narratives into visual poetry. 
              My journey is anchored in film aesthetics, evolving into a professional mission to help brands and creators define their visual legacy.
            </p>
            
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {SKILLS.map((skill, i) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="glass p-3 sm:p-5 rounded-[12px] sm:rounded-[20px] flex flex-col items-center justify-center gap-2 group transition-all duration-500 border border-white/5 hover:border-accent/30 relative overflow-hidden"
                >
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-xl pointer-events-none" 
                    style={{ backgroundColor: skill.glow }}
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
                <p className="text-xl sm:text-2xl font-display font-bold text-text-pure tracking-tighter text-glow">250+</p>
                <p className="text-[8px] sm:text-[9px] text-text-muted uppercase font-bold tracking-[0.3em] mt-1">Projects Done</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-display font-bold text-text-pure tracking-tighter text-glow">183+</p>
                <p className="text-[8px] sm:text-[9px] text-text-muted uppercase font-bold tracking-[0.3em] mt-1">Happy Clients</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
