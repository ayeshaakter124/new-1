import { useRef } from "react";
import { motion, useInView } from "motion/react";

const brands = [
  { name: "Figma", category: "Design" },
  { name: "Webflow", category: "Development" },
  { name: "Framer", category: "Prototyping" },
  { name: "Shopify", category: "E-Commerce" },
  { name: "WordPress", category: "CMS" },
  { name: "Next.js", category: "Framework" },
  { name: "Vercel", category: "Deployment" },
  { name: "Adobe CC", category: "Creative" },
];

export default function Brands() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-20 relative overflow-hidden">
      {/* Subtle divider line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-transparent to-accent/30" />

      <div className="max-w-6xl mx-auto px-6">
        {/* Label */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center text-xs uppercase tracking-[0.3em] text-text-muted font-mono mb-12"
        >
          Tools & Platforms I Work With
        </motion.p>

        {/* Brand grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-accent/10 border border-accent/10 rounded-lg overflow-hidden">
          {brands.map((brand, i) => (
            <motion.div
              key={brand.name}
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="group relative bg-primary px-6 py-8 flex flex-col items-center gap-2 hover:bg-secondary/50 transition-colors duration-300 cursor-default"
            >
              {/* Hover accent glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-b from-accent/5 to-transparent pointer-events-none" />

              {/* Brand name */}
              <span className="font-display text-xl text-text-soft group-hover:text-accent transition-colors duration-300">
                {brand.name}
              </span>

              {/* Category tag */}
              <span className="text-[10px] uppercase tracking-widest text-text-muted font-mono">
                {brand.category}
              </span>

              {/* Bottom accent line on hover */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px w-0 group-hover:w-1/2 bg-accent transition-all duration-300" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
