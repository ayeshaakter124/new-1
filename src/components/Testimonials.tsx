import { motion } from "motion/react";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Alex Rivera",
    role: "Tech Influencer",
    text: "Rehman Hridoy transformed my channel. My retention rates jumped by 40% in just one month of working together. The attention to detail is second to none.",
    image: "https://i.pravatar.cc/150?img=33",
  },
  {
    name: "Sarah Chen",
    role: "CEO, Nexa Digital",
    text: "The commercial ads produced for our launch were cinematic masterpieces. They perfectly captured our brand essence and drove record-breaking conversions.",
    image: "https://i.pravatar.cc/150?img=44",
  },
  {
    name: "Marcus Thorne",
    role: "Travel Vlogger",
    text: "I've worked with many editors, but none have the creative eye that this studio has. The flow and sound design are always impeccable.",
    image: "https://i.pravatar.cc/150?img=55",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20 bg-primary relative overflow-hidden">
      {/* Background Glower */}
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-panel/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-accent font-bold tracking-[0.4em] text-[9px] mb-3 uppercase">Elite Endorsements</p>
            <h2 className="text-2xl md:text-5xl font-display font-medium text-text-pure tracking-tighter leading-[1.1]">
              Testimonials of <span className="text-accent font-light">Excellence</span>
            </h2>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className="glass p-5 sm:p-8 rounded-[20px] sm:rounded-[32px] relative border border-accent/10 hover:border-accent/40 transition-all duration-500 glow-sm group h-full flex flex-col"
            >
              <div className="flex gap-1 mb-3 sm:mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={10} className="fill-accent text-accent sm:w-3 sm:h-3" />
                ))}
              </div>
              
              <div className="mb-4 sm:mb-6 relative flex-grow">
                <Quote className="absolute -top-3 -left-3 sm:-top-6 sm:-left-6 text-accent/10 w-10 h-10 sm:w-16 sm:h-16 pointer-events-none" />
                <p className="text-text-pure italic text-[13px] sm:text-lg font-display leading-[1.6] font-light relative z-10 tracking-tight">
                  "{t.text}"
                </p>
              </div>

              <div className="mt-auto flex items-center gap-3 pt-3 sm:pt-6 border-t border-accent/5">
                <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-2xl overflow-hidden border border-accent/20 grayscale brightness-90 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700">
                  <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-[13px] sm:text-base font-display font-bold text-text-pure tracking-tight">{t.name}</h4>
                  <p className="text-accent text-[7px] sm:text-[9px] font-bold uppercase tracking-widest">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
