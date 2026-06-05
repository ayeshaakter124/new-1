import { motion, AnimatePresence } from "motion/react";
import { X, Play, Maximize2 } from "lucide-react";

interface VideoModalProps {
  videoId: string | null;
  onClose: () => void;
  title: string;
}

export default function VideoModal({ videoId, onClose, title }: VideoModalProps) {
  if (!videoId) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 bg-primary/95 backdrop-blur-2xl"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-6xl aspect-video glass-dark rounded-3xl overflow-hidden glow-lg border border-white/10"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between z-10 bg-gradient-to-b from-black/80 to-transparent">
            <h3 className="text-xl font-display font-bold tracking-tight text-text-pure">{title}</h3>
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-full glass hover:bg-accent hover:text-primary transition-all flex items-center justify-center glow-sm hover:glow-md"
            >
              <X size={20} />
            </button>
          </div>

          {/* Iframe */}
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&showinfo=0`}
            title={title}
            className="w-full h-full border-none"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />

          {/* Loading Overlay (hidden after load) */}
          <div className="absolute inset-0 -z-10 bg-secondary flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin glow-sm" />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
