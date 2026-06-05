import { motion } from "motion/react";

const journeyData = [
  {
    year: "2025 – Present",
    role: "CREATIVE DIRECTOR",
    company: "ELITE VISION STUDIOS",
    description: "Defining the future of luxury cinematic storytelling for global fashion and tech brands, overseeing high-end visual campaigns from concept to final delivery.",
  },
  {
    year: "2024 – 2025",
    role: "SR. VIDEO EDITOR",
    company: "VELOCITY MEDIA",
    description: "Crafting high-octane visual experiences and viral commercial content for digital-first audiences, focusing on rhythmic precision and narrative impact.",
  },
  {
    year: "2023 – 2024",
    role: "MOTION DESIGNER",
    company: "LUMINA ART LAB",
    description: "Pioneering experimental visual languages through motion design and digital art installations, collaborating with international artists on immersive projects.",
  },
];

export default function Journey() {
  return (
    <section id="journey" className="py-24 bg-primary relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-panel/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="mb-20">
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-accent font-bold tracking-[0.4em] text-[10px] mb-3 uppercase"
          >
            The Evolution
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-display font-medium text-text-pure tracking-tighter"
          >
            THE <span className="bg-gradient-to-r from-text-pure via-text-pure to-accent/60 bg-clip-text text-transparent italic">JOURNEY</span>
          </motion.h2>
        </div>

        <div className="relative">
          {/* Vertical Line */}
          <motion.div 
            initial={{ height: 0 }}
            whileInView={{ height: "100%" }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute left-[16px] md:left-[12%] top-0 w-[1px] bg-gradient-to-b from-accent/40 via-accent/10 to-transparent -translate-x-1/2"
          />

          <div className="space-y-20">
            {journeyData.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative flex flex-col md:flex-row items-start group"
              >
                {/* Year - Desktop */}
                <div className="hidden md:flex md:w-[12%] justify-end pr-8 pt-1">
                  <span className="text-text-pure font-mono font-medium text-[10px] tracking-widest opacity-30 group-hover:opacity-100 transition-opacity">
                    {item.year.split(' – ')[0]}
                  </span>
                </div>

                {/* Connector Point */}
                <div className="absolute left-[16px] md:left-[12%] top-0 md:top-2 w-2 h-2 bg-primary border border-accent/40 rounded-full -translate-x-1/2 z-20 group-hover:bg-accent group-hover:border-accent transition-all duration-500" />

                {/* Content Side */}
                <div className="w-full md:w-[88%] pl-10 md:pl-12">
                  <div className="flex flex-col">
                    <span className="text-accent text-[9px] font-bold font-mono tracking-widest md:hidden mb-1 opacity-50">
                      {item.year}
                    </span>
                    <h3 className="text-xl md:text-2xl font-display font-bold text-text-pure tracking-tight mb-1 group-hover:text-accent transition-colors duration-500 underline-offset-8 decoration-accent/30 hover:underline">
                      {item.role}
                    </h3>
                    <p className="text-text-muted text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] mb-4">
                      {item.company}
                    </p>
                    <p className="text-text-soft text-sm md:text-base font-light leading-relaxed max-w-2xl opacity-70 group-hover:opacity-100 transition-opacity">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
