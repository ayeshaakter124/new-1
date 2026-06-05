import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Play, ChevronRight, Star, Users, Award } from "lucide-react";

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-primary">
      {/* Ambient Burgundy Glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-panel/10 rounded-full blur-[150px] pointer-events-none" />
      {/* Background Gold Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[180px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-display font-medium leading-[0.9] sm:leading-[0.85] mb-6 sm:mb-8 tracking-tighter text-text-pure">
            Creative <span className="text-transparent bg-clip-text bg-gradient-to-r from-text-pure via-text-pure to-accent font-light">Visuals</span> <br />
            for Modern <br />
            Brands
          </h1>
          
          <p className="text-xs sm:text-base md:text-lg text-text-soft mb-8 sm:mb-12 max-w-xl leading-relaxed font-light">
            I transform complex concepts into clean and compelling visuals, which make brands more engaging and credible. My visual content is designed to capture attention, build trust, and give your brand a special status.
          </p>
          
          <div className="flex flex-wrap gap-3 sm:gap-4">
            <Link to="/#contact" className="group relative bg-accent hover:bg-accent-hover text-primary font-bold px-5 py-3 md:px-8 md:py-4 rounded-full transition-all duration-300 flex items-center gap-2 overflow-hidden glow-md">
              <span className="z-10 uppercase tracking-widest text-[9px] md:text-[10px]">Hire Me Now</span>
              <ChevronRight className="z-10 w-3.5 h-3.5 md:w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/work" className="glass hover:bg-white/10 text-text-pure font-bold px-5 py-3 md:px-8 md:py-4 rounded-full transition-all duration-300 flex items-center gap-2 border border-accent/20">
              <span className="uppercase tracking-widest text-[9px] md:text-[10px]">View My Work</span>
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
              <p className="text-xs text-text-muted font-medium tracking-wide">
                TRUSTED BY 183+ GLOBAL CLIENTS
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative"
        >
          {/* Main Hero Image Container */}
          <div className="relative aspect-[4/5] max-w-md mx-auto">
            <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent z-10" />
            <div className="absolute -inset-4 bg-accent/10 blur-3xl rounded-full z-0 animate-pulse" />
            <div className="relative z-10 w-full h-full rounded-[40px] overflow-hidden border border-white/10 glass-dark">
              {/* Using a placeholder since image generation failed */}
              <div className="w-full h-full bg-secondary flex items-center justify-center p-8 text-center">
                 <img 
                    src="https://images.unsplash.com/photo-1542204172-3c13994a5077?q=80&w=1000&auto=format&fit=crop" 
                    alt="Rehman Hridoy" 
                    className="w-full h-full object-cover grayscale brightness-75 hover:grayscale-0 hover:brightness-100 transition-all duration-700" 
                 />
              </div>
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
                  <p className="text-lg font-bold text-text-pure">3+ YEARS</p>
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
                  <p className="text-lg font-bold text-text-pure">250+ COMPLETED</p>
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
