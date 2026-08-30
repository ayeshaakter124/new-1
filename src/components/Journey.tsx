import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { cmsStore } from "../lib/cmsStore";
import { ExperienceItem, WebsiteContent } from "../lib/cmsTypes";

export default function Journey() {
  const [journeyData, setJourneyData] = useState<ExperienceItem[]>(() => cmsStore.getExperiences());
  const [content, setContent] = useState<WebsiteContent>(() => cmsStore.getContent());

  useEffect(() => {
    const handleUpdate = () => {
      setJourneyData(cmsStore.getExperiences());
      setContent(cmsStore.getContent());
    };
    window.addEventListener("cms_data_updated", handleUpdate);
    window.addEventListener("rh_data_updated", handleUpdate);
    return () => {
      window.removeEventListener("cms_data_updated", handleUpdate);
      window.removeEventListener("rh_data_updated", handleUpdate);
    };
  }, []);

  return (
    <section id="journey" className="py-16 sm:py-24 bg-primary relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-accent/5 rounded-full blur-[90px] sm:blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-panel/5 rounded-full blur-[80px] sm:blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="mb-10 sm:mb-16">
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-accent font-bold tracking-[0.4em] text-[9px] sm:text-[10px] mb-2 sm:mb-3 uppercase font-mono"
          >
            {content.journeyBadge || "The Evolution"}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-2xl sm:text-4xl md:text-5xl font-display font-medium text-text-pure tracking-tighter leading-tight"
          >
            {content.journeyHeading || "THE JOURNEY"}
          </motion.h2>
        </div>

        <div className="relative">
          {/* Vertical Timeline Guideline */}
          <motion.div 
            initial={{ height: 0 }}
            whileInView={{ height: "100%" }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute left-[12px] sm:left-[16px] md:left-[12%] top-0 w-[1px] bg-gradient-to-b from-accent/40 via-accent/15 to-transparent -translate-x-1/2"
          />

          <div className="space-y-10 sm:space-y-16">
            {journeyData.map((item, index) => (
              <motion.div
                key={item.id || index}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="relative flex flex-col md:flex-row items-start group"
              >
                {/* Year - Desktop */}
                <div className="hidden md:flex md:w-[12%] justify-end pr-8 pt-1">
                  <span className="text-text-pure font-mono font-medium text-[10px] tracking-widest opacity-40 group-hover:opacity-100 transition-opacity">
                    {item.year.split(' – ')[0]}
                  </span>
                </div>

                {/* Connector Point */}
                <div className="absolute left-[12px] sm:left-[16px] md:left-[12%] top-1.5 md:top-2 w-2.5 h-2.5 bg-primary border-2 border-accent rounded-full -translate-x-1/2 z-20 group-hover:bg-accent transition-all duration-300 shadow-md shadow-accent/20" />

                {/* Content Side */}
                <div className="w-full md:w-[88%] pl-8 sm:pl-10 md:pl-12">
                  <div className="flex flex-col">
                    {/* Mobile Year Badge */}
                    <span className="px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-[8px] font-bold font-mono tracking-wider w-fit mb-1.5 md:hidden">
                      {item.year}
                    </span>
                    <h3 className="text-base sm:text-xl md:text-2xl font-display font-bold text-text-pure tracking-tight mb-1 group-hover:text-accent transition-colors">
                      {item.role}
                    </h3>
                    <p className="text-text-muted text-[9px] sm:text-[11px] font-bold uppercase tracking-[0.2em] mb-2 sm:mb-4 font-mono">
                      {item.company}
                    </p>
                    <p className="text-text-soft text-xs sm:text-sm md:text-base font-light leading-relaxed max-w-2xl opacity-80 group-hover:opacity-100 transition-opacity">
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
