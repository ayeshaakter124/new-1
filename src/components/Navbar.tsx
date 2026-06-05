import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Play } from "lucide-react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/#services" },
  { name: "Work", href: "/work" },
  { name: "About", href: "/#about" },
  { name: "Contact", href: "/#contact" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "py-4" : "py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div
          className={`flex items-center justify-between p-4 rounded-3xl transition-all duration-300 ${
            isScrolled ? "glass-dark shadow-2xl border-accent/20" : "bg-transparent"
          }`}
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-accent rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 glow-sm">
              <Play className="text-secondary fill-secondary w-4 h-4 sm:w-5 sm:h-5 translate-x-0.5" />
            </div>
            <span className="font-display font-medium text-lg sm:text-xl tracking-tighter text-text-pure">
              REHMAN<span className="text-accent font-light ml-1 sm:ml-[8px]">HRIDOY</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`text-[9px] font-bold uppercase tracking-[0.4em] transition-all relative group ${
                  location.pathname === link.href ? "text-accent" : "text-text-muted hover:text-accent"
                }`}
              >
                {link.name}
                <span className={`absolute -bottom-2 left-0 h-[1px] bg-accent transition-all duration-500 ${
                  location.pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                }`} />
              </Link>
            ))}
            <Link 
              to="/#contact"
              className="bg-accent hover:bg-accent-hover text-primary font-bold px-6 py-2.5 rounded-full text-[10px] uppercase tracking-widest transition-all duration-300 glow-sm hover:glow-md scale-100 hover:scale-105 active:scale-95"
            >
              Get In Touch
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden w-12 h-12 glass rounded-xl flex items-center justify-center text-accent"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 md:hidden pt-24 px-6 bg-primary/95 backdrop-blur-2xl"
          >
            <div className="flex flex-col gap-8 mt-12">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-4xl font-display font-bold text-text-pure hover:text-accent transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              <div className="h-px bg-white/5 my-4" />
              <Link
                to="/#contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full bg-accent text-primary font-bold py-6 rounded-2xl text-center text-xl glow-md"
              >
                GET IN TOUCH
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
