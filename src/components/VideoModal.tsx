import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Play } from "lucide-react";

interface VideoModalProps {
  videoId: string | null;
  onClose: () => void;
  title: string;
}

export default function VideoModal({ videoId, onClose, title }: VideoModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (videoId) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [videoId, onClose]);

  if (!videoId) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-2.5 sm:p-6 md:p-10 bg-primary/95 backdrop-blur-2xl"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-5xl aspect-video glass-dark rounded-2xl sm:rounded-3xl overflow-hidden glow-lg border border-white/10 shadow-2xl bg-black"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Header */}
          <div className="absolute top-0 left-0 right-0 p-3 sm:p-5 flex items-center justify-between z-20 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
            <h3 className="text-xs sm:text-lg font-display font-bold tracking-tight text-text-pure truncate max-w-[75%]">
              {title}
            </h3>
            <button 
              onClick={onClose}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full glass hover:bg-accent hover:text-primary transition-all flex items-center justify-center glow-sm active:scale-90 border border-white/15 text-white"
              aria-label="Close Video Modal"
            >
              <X size={16} className="sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Video Iframe */}
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&showinfo=0`}
            title={title}
            className="w-full h-full border-none"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />

          {/* Loading Animation (behind iframe) */}
          <div className="absolute inset-0 -z-10 bg-secondary flex items-center justify-center">
            <div className="w-10 h-10 border-3 border-accent border-t-transparent rounded-full animate-spin glow-sm" />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
