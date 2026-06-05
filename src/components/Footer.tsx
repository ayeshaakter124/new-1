import { Play } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="py-16 border-t border-accent/10 bg-primary overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10 mb-12">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 glow-sm">
              <Play className="text-secondary fill-secondary w-5 h-5 translate-x-0.5" />
            </div>
            <span className="font-display font-medium text-xl tracking-tighter text-text-pure">
              REHMAN<span className="text-accent font-light ml-[8px]">HRIDOY</span>
            </span>
          </Link>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-8 text-[9px] font-bold text-text-muted uppercase tracking-[0.4em]">
            <Link to="/#services" className="hover:text-accent transition-all duration-300">Expertise</Link>
            <Link to="/work" className="hover:text-accent transition-all duration-300">Showcase</Link>
            <Link to="/#about" className="hover:text-accent transition-all duration-300">The Vision</Link>
            <Link to="/#contact" className="hover:text-accent transition-all duration-300">Connection</Link>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-5 pt-8 border-t border-accent/5">
          <p className="text-[8px] sm:text-[9px] text-text-muted font-bold tracking-[0.2em] uppercase text-center md:text-left">
            © 2026 REHMAN HRIDOY. <span className="text-accent">Crafting Excellence.</span>
          </p>
          <div className="flex items-center gap-5 sm:gap-6 text-[8px] sm:text-[9px] text-text-muted font-bold uppercase tracking-[0.2em]">
            <a href="#" className="hover:text-text-pure transition-all duration-300">Privacy</a>
            <a href="#" className="hover:text-text-pure transition-all duration-300">Terms</a>
          </div>
        </div>
      </div>
      
      {/* Decorative Glow */}
      <div className="absolute -bottom-24 left-1/2 -translated-x-1/2 w-[1000px] h-[300px] bg-accent/5 blur-[120px] rounded-full pointer-events-none opacity-50" />
    </footer>
  );
}
