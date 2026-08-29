import { useState, useEffect, FormEvent } from "react";
import { motion } from "motion/react";
import { Mail, Send, ChevronRight, CheckCircle2, MessageCircle } from "lucide-react";
import { cmsStore } from "../lib/cmsStore";
import { ContactInfo, SocialLinkItem, WebsiteContent } from "../lib/cmsTypes";

const WhatsAppIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className} 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.438 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.396.015 12.03c0 2.12.554 4.189 1.604 6.04L0 24l6.103-1.6c1.78.97 3.79 1.481 5.84 1.482h.005c6.634 0 12.032-5.396 12.035-12.03a11.85 11.85 0 00-3.528-8.503z"/>
  </svg>
);

export default function Contact() {
  const [contactInfo, setContactInfo] = useState<ContactInfo>(() => cmsStore.getContactInfo());
  const [socialLinks, setSocialLinks] = useState<SocialLinkItem[]>(() => 
    cmsStore.getSocialLinks().filter(s => s.visible)
  );
  const [content, setContent] = useState<WebsiteContent>(() => cmsStore.getContent());

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    ventureNature: "Commercial Masterpiece",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [lastSubmission, setLastSubmission] = useState<typeof formData | null>(null);

  useEffect(() => {
    const handleUpdate = () => {
      setContactInfo(cmsStore.getContactInfo());
      setSocialLinks(cmsStore.getSocialLinks().filter(s => s.visible));
      setContent(cmsStore.getContent());
    };
    window.addEventListener("cms_data_updated", handleUpdate);
    window.addEventListener("rh_data_updated", handleUpdate);
    return () => {
      window.removeEventListener("cms_data_updated", handleUpdate);
      window.removeEventListener("rh_data_updated", handleUpdate);
    };
  }, []);

  const cleanWhatsApp = (contactInfo.whatsapp || "880157735667").replace(/[^0-9]/g, "");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    cmsStore.addMessage(formData);
    setLastSubmission({ ...formData });
    setSubmitted(true);
    setFormData({
      name: "",
      email: "",
      ventureNature: "Commercial Masterpiece",
      message: ""
    });

    setTimeout(() => {
      setSubmitted(false);
    }, 10000);
  };

  return (
    <section id="contact" className="py-20 relative overflow-hidden bg-primary">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-panel/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-[200px] bg-gradient-to-t from-accent/5 to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-accent font-bold tracking-[0.4em] text-[9px] mb-6 uppercase font-mono">
              {contactInfo.subheading || content.contactBadge || "The Final Frontier"}
            </p>
            <h2 className="text-2xl md:text-5xl lg:text-6xl font-display font-medium mb-6 sm:mb-10 leading-[1] text-text-pure tracking-tighter">
              {contactInfo.heading || content.contactHeading || "Let's Compose Your Masterpiece"}
            </h2>
            <p className="text-xs md:text-lg text-text-soft mb-6 sm:mb-10 max-w-md leading-relaxed font-light">
              {contactInfo.description || content.contactDescription}
            </p>
            
            <div className="space-y-4 sm:space-y-6">
              <a 
                href={`https://wa.me/${cleanWhatsApp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 sm:gap-6 group"
              >
                <div className="w-10 h-10 sm:w-14 sm:h-14 bg-secondary rounded-[12px] sm:rounded-[16px] flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-primary transition-all duration-500 border border-accent/10 group-hover:scale-110 shadow-xl flex-shrink-0">
                  <WhatsAppIcon size={18} className="sm:w-6 sm:h-6" />
                </div>
                <div>
                  <p className="text-[7px] sm:text-[9px] text-text-muted uppercase font-bold tracking-[0.3em] mb-1 font-mono">Direct Instant Chat</p>
                  <p className="text-base sm:text-xl font-display font-bold text-text-pure tracking-tight group-hover:text-accent transition-colors duration-300 relative inline-block">
                    WhatsApp Me ({contactInfo.whatsapp || "+880157735667"})
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300"></span>
                  </p>
                </div>
              </a>

              <a 
                href={`mailto:${contactInfo.email || "reehmanhridoy@gmail.com"}`}
                className="flex items-center gap-3 sm:gap-6 group"
              >
                <div className="w-10 h-10 sm:w-14 sm:h-14 bg-secondary rounded-[12px] sm:rounded-[16px] flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-primary transition-all duration-500 border border-accent/10 group-hover:scale-110 shadow-xl flex-shrink-0">
                  <Mail size={18} className="sm:w-6 sm:h-6" />
                </div>
                <div>
                  <p className="text-[7px] sm:text-[9px] text-text-muted uppercase font-bold tracking-[0.3em] mb-1 font-mono">Direct Correspondence</p>
                  <p className="text-base sm:text-xl font-display font-bold text-text-pure tracking-tight group-hover:text-accent transition-colors duration-300 relative inline-block truncate max-w-[280px] sm:max-w-none">
                    {contactInfo.email || "reehmanhridoy@gmail.com"}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300"></span>
                  </p>
                </div>
              </a>
            </div>
            
            <div className="mt-8 sm:mt-12 flex items-center gap-3 sm:gap-4">
              {socialLinks.map((platform) => (
                <a 
                  key={platform.id || platform.platform} 
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 sm:w-12 sm:h-12 glass rounded-xl sm:rounded-2xl flex items-center justify-center group relative overflow-hidden transition-all duration-500 border border-white/5 hover:border-accent/40 hover:glow-md cursor-pointer"
                >
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-xl pointer-events-none" 
                    style={{ backgroundColor: platform.glowColor || "rgba(163, 133, 96, 0.4)" }}
                  />
                  <div 
                    className="w-5 h-5 sm:w-6 sm:h-6 bg-text-soft group-hover:bg-accent transition-all duration-500 relative z-10" 
                    style={{
                      maskImage: `url(${platform.logo})`,
                      WebkitMaskImage: `url(${platform.logo})`,
                      maskSize: 'contain',
                      WebkitMaskSize: 'contain',
                      maskRepeat: 'no-repeat',
                      WebkitMaskRepeat: 'no-repeat',
                      maskPosition: 'center',
                      WebkitMaskPosition: 'center'
                    }}
                  />
                </a>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass p-5 md:p-8 rounded-[20px] md:rounded-[32px] border border-accent/10 glow-sm hover:glow-md transition-all duration-500 bg-secondary/20"
          >
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 text-left">
              {submitted && (
                <div className="p-4 bg-accent/20 border border-accent/40 rounded-xl space-y-3 animate-fadeIn">
                  <div className="flex items-center gap-3 text-accent text-xs font-bold">
                    <CheckCircle2 size={18} className="shrink-0" />
                    <span>Your inquiry has been submitted!</span>
                  </div>
                  {lastSubmission && (
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-accent/20">
                      <a
                        href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(`Hi Rehman! My name is ${lastSubmission.name} (${lastSubmission.email}). I'm reaching out regarding ${lastSubmission.ventureNature}: ${lastSubmission.message}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-accent text-primary text-[10px] font-bold rounded-lg flex items-center gap-1.5 hover:bg-accent-hover transition-all"
                      >
                        <MessageCircle size={12} /> Send via WhatsApp
                      </a>
                      <a
                        href={`mailto:${contactInfo.email || "reehmanhridoy@gmail.com"}?subject=${encodeURIComponent(`Project Inquiry: ${lastSubmission.ventureNature} from ${lastSubmission.name}`)}&body=${encodeURIComponent(`Name: ${lastSubmission.name}\nEmail: ${lastSubmission.email}\nProject Type: ${lastSubmission.ventureNature}\n\nMessage:\n${lastSubmission.message}`)}`}
                        className="px-3 py-1.5 bg-white/10 text-text-pure text-[10px] font-bold rounded-lg flex items-center gap-1.5 hover:bg-white/20 transition-all border border-white/10"
                      >
                        <Mail size={12} /> Send via Email App
                      </a>
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <label className="text-[7px] sm:text-[9px] font-bold text-text-muted uppercase tracking-[0.3em] ml-2 font-mono">Identity</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Signature Name" 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-primary/50 border border-accent/10 rounded-lg sm:rounded-xl px-4 py-3 sm:px-6 sm:py-4 focus:outline-none focus:border-accent/60 focus:bg-primary/80 transition-all text-text-pure placeholder:text-text-muted/50 font-light text-[12px] sm:text-[13px]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[7px] sm:text-[9px] font-bold text-text-muted uppercase tracking-[0.3em] ml-2 font-mono">Correspondence</label>
                  <input 
                    type="email" 
                    required
                    placeholder="Email Address" 
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-primary/50 border border-accent/10 rounded-lg sm:rounded-xl px-4 py-3 sm:px-6 sm:py-4 focus:outline-none focus:border-accent/60 focus:bg-primary/80 transition-all text-text-pure placeholder:text-text-muted/50 font-light text-[12px] sm:text-[13px]"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[7px] sm:text-[9px] font-bold text-text-muted uppercase tracking-[0.3em] ml-2 font-mono">Venture Nature</label>
                <div className="relative group">
                  <select 
                    value={formData.ventureNature}
                    onChange={(e) => setFormData({ ...formData, ventureNature: e.target.value })}
                    className="w-full bg-primary/50 border border-accent/10 rounded-lg sm:rounded-xl px-4 py-3 sm:px-6 sm:py-4 focus:outline-none focus:border-accent/60 focus:bg-primary/80 transition-all appearance-none cursor-pointer text-text-pure font-light text-[12px] sm:text-[13px]"
                  >
                    <option className="bg-primary text-text-pure">Commercial Masterpiece</option>
                    <option className="bg-primary text-text-pure">Viral Reels & Shorts</option>
                    <option className="bg-primary text-text-pure">Motion Graphics & SaaS</option>
                    <option className="bg-primary text-text-pure">Exclusive Campaign</option>
                    <option className="bg-primary text-text-pure">Bespoke Inquiry</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-accent">
                    <ChevronRight className="rotate-90 w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[7px] sm:text-[9px] font-bold text-text-muted uppercase tracking-[0.3em] ml-2 font-mono">Creative Intent</label>
                <textarea 
                  rows={3}
                  required
                  placeholder="Elucidate your vision..." 
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-primary/50 border border-accent/10 rounded-lg sm:rounded-xl px-4 py-3 sm:px-6 sm:py-4 focus:outline-none focus:border-accent/60 focus:bg-primary/80 transition-all resize-none text-text-pure placeholder:text-text-muted/50 font-light text-[12px] sm:text-[13px]"
                />
              </div>
              
              <button type="submit" className="w-full py-3.5 sm:py-5 bg-accent hover:bg-accent-hover text-primary font-bold rounded-full transition-all duration-500 flex items-center justify-center gap-2 sm:gap-3 glow-sm hover:glow-md shadow-2xl hover:-translate-y-1 uppercase tracking-[0.3em] text-[8px] sm:text-[10px]">
                {contactInfo.ctaText || "Inaugurate Project"} <Send size={14} className="group-hover:translate-x-1 transition-transform sm:w-4 sm:h-4" />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
