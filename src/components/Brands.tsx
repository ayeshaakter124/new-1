import { motion } from "motion/react";

/**
 * TRADING PARTNER & ELITE BRANDS CONFIG
 * To update this section:
 * 1. Add/Remove items in the 'brands' array below.
 * 2. For SVG logos: provide the JSX component.
 * 3. For Image logos: provide the URL string.
 * 4. Everything else (layout, scaling, effects) is handled automatically.
 */

/**
 * ELITE BRANDS REPOSITORY
 * Centralized data system for easy scaling.
 * Supports: JSX SVGs or Image URL Strings.
 */
const brands = [
  {
    name: "OPPO",
    logo: (
      <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-full h-full p-2">
        <title>OPPO</title>
        <path d="M2.85 12.786h-.001C1.639 12.774.858 12.2.858 11.321s.781-1.452 1.99-1.465c1.21.013 1.992.588 1.992 1.465s-.782 1.453-1.99 1.465zm.034-3.638h-.073C1.156 9.175 0 10.068 0 11.32s1.156 2.147 2.811 2.174h.073c1.655-.027 2.811-.921 2.811-2.174S4.54 9.175 2.885 9.148zm18.27 3.638c-1.21-.012-1.992-.587-1.992-1.465s.782-1.452 1.991-1.465c1.21.013 1.991.588 1.991 1.465s-.781 1.453-1.99 1.465zm.035-3.638h-.073c-1.655.027-2.811.92-2.811 2.173s1.156 2.147 2.81 2.174h.074C22.844 13.468 24 12.574 24 11.32s-1.156-2.146-2.811-2.173zm-6.126 3.638c-1.21-.012-1.99-.587-1.99-1.465s.78-1.452 1.99-1.465c1.21.013 1.991.588 1.991 1.465s-.781 1.453-1.99 1.465zm.036-3.638h-.073c-.789.013-1.464.222-1.955.574v-.37h-.857v5.5h.857v-1.931c.49.351 1.166.56 1.954.574h.074c1.655-.027 2.81-.921 2.81-2.174s-1.155-2.146-2.81-2.173zm-6.144 3.638c-1.21-.012-1.99-.587-1.99-1.465s.78-1.452 1.99-1.465c1.21.013 1.991.588 1.991 1.465s-.781 1.453-1.99 1.465zm.037-3.638H8.92c-.789.013-1.464.222-1.955.574v-.37h-.856v5.5h.856v-1.931c.491.351 1.166.56 1.955.574a3.728 3.728 0 0 0 .073 0c1.655-.027 2.811-.921 2.811-2.174s-1.156-2.146-2.81-2.173z"/>
      </svg>
    ),
  },
  {
    name: "bKash",
    logo: "https://i.ibb.co.com/1YhsvVx2/bkash.png",
  },
  {
    name: "Infinix",
    logo: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full p-2">
        <path d="M4 4h16v2H4V4zm0 14h16v2H4v-2zM4 9h16v6H4V9z" />
      </svg>
    ),
  },
  {
    name: "Apple Gadgets",
    logo: "https://upload.wikimedia.org/wikipedia/commons/7/7f/Infinix_logo.svg",
  },
  {
    name: "Elite Production",
    logo: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full p-2">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
      </svg>
    ),
  },
  {
    name: "Studio X",
    logo: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full p-2">
        <path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 16H4c-.55 0-1-.45-1-1V6c0-.55.45-1 1-1h16c.55 0 1 .45 1 1v12c0 .55-.45 1-1 1z" />
      </svg>
    ),
  }
];

export default function Brands() {
  return (
    <section className="py-24 relative overflow-hidden bg-primary">
      {/* Dynamic Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-accent/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-accent/20 blur-[120px] rounded-full" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "circOut" }}
          className="text-center mb-16"
        >
          <motion.p 
            initial={{ opacity: 0, letterSpacing: "0.2em" }}
            whileInView={{ opacity: 1, letterSpacing: "0.6em" }}
            viewport={{ once: true }}
            className="text-[9px] text-accent uppercase font-black mb-4"
          >
            Trusted Worldwide
          </motion.p>
          <h2 className="text-3xl md:text-5xl font-display font-medium text-text-pure tracking-tighter leading-none">
            Recognized by <span className="italic font-light opacity-80 text-accent underline decoration-accent/20 underline-offset-4">Elite Brands</span>
          </h2>
        </motion.div>

        {/* Dynamic Logo Grid - Auto Adapts to Any Count */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 max-w-7xl mx-auto">
          {brands.map((brand, index) => (
            <motion.div
              key={brand.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ 
                delay: index * 0.05,
                duration: 0.6,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ y: -6 }}
              className="group relative h-20 w-[calc(50%-8px)] md:h-36 md:w-auto flex items-center justify-center bg-white/[0.01] backdrop-blur-3xl rounded-[16px] md:rounded-[24px] border border-white/[0.04] hover:border-accent/40 hover:bg-white/[0.03] transition-all duration-700 overflow-hidden"
            >
              {/* Luxury Shimmer Effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-[1.5s] ease-in-out bg-gradient-to-r from-transparent via-white/[0.03] to-transparent pointer-events-none" />
              
              <div className="relative w-14 h-14 md:w-24 md:h-24 flex items-center justify-center transition-all duration-700 grayscale opacity-30 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 drop-shadow-[0_0_25px_transparent] group-hover:drop-shadow-[0_0_15px_rgba(var(--color-accent-rgb),0.1)]">
                {typeof brand.logo === 'string' ? (
                  <img 
                    src={brand.logo} 
                    alt={brand.name} 
                    className="max-w-full max-h-full object-contain filter brightness-0 invert"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        const fallbackText = document.createElement('span');
                        fallbackText.className = 'text-[7px] md:text-[9px] font-bold tracking-widest text-text-muted uppercase text-center block';
                        fallbackText.innerText = brand.name;
                        parent.appendChild(fallbackText);
                      }
                    }}
                  />
                ) : (
                  <div className="w-full h-full text-text-pure transition-colors duration-500">
                    {brand.logo}
                  </div>
                )}
              </div>
              
              {/* Premium Floating Label */}
              <div className="absolute inset-0 flex items-end justify-center pb-2 md:pb-5 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none">
                <span className="text-[7px] md:text-[9px] font-black tracking-[0.4em] uppercase text-accent transition-all duration-700 translate-y-3 group-hover:translate-y-0">
                  {brand.name}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Section Dividers */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />
    </section>
  );
}



