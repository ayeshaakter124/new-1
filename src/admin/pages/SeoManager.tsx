import React, { useState, FormEvent } from "react";
import { Search, Save, Globe, Share2, Sparkles, Plus, X } from "lucide-react";
import { cmsStore } from "../../lib/cmsStore";
import { SeoSettings } from "../../lib/cmsTypes";
import { FormInput, FormTextarea, ImagePreviewInput } from "../components/FormComponents";

interface SeoManagerProps {
  onAddToast: (type: "success" | "error" | "warning" | "info", message: string) => void;
}

export function SeoManager({ onAddToast }: SeoManagerProps) {
  const [seo, setSeo] = useState<SeoSettings>(() => cmsStore.getSeo());
  const [keywordInput, setKeywordInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleAddKeyword = () => {
    if (!keywordInput.trim()) return;
    const current = seo.keywords || [];
    if (current.includes(keywordInput.trim())) return;
    setSeo({
      ...seo,
      keywords: [...current, keywordInput.trim()],
    });
    setKeywordInput("");
  };

  const handleRemoveKeyword = (kw: string) => {
    const current = seo.keywords || [];
    setSeo({
      ...seo,
      keywords: current.filter(k => k !== kw),
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      cmsStore.saveSeo(seo);
      // Also update active document title dynamically
      if (seo.siteTitle) {
        document.title = seo.siteTitle;
      }
      setIsSaving(false);
      onAddToast("success", "SEO & Social Meta configuration saved! 🚀");
    } catch (err: any) {
      setIsSaving(false);
      onAddToast("error", `Failed to save SEO: ${err.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-secondary/60 border border-white/10">
        <div>
          <h2 className="text-lg font-display font-bold text-text-pure flex items-center gap-2">
            <Search size={20} className="text-accent" /> Search Engine Optimization (SEO) & Social Meta
          </h2>
          <p className="text-xs text-text-soft mt-0.5">
            Control how your portfolio appears on Google Search, WhatsApp previews, Twitter, and LinkedIn shares.
          </p>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-3 rounded-2xl bg-accent hover:bg-accent-hover text-primary font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-accent/20 transition-all shrink-0"
        >
          <Save size={15} />
          <span>{isSaving ? "Saving..." : "Save SEO Settings"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Inputs */}
        <div className="p-6 sm:p-8 rounded-3xl bg-secondary/40 border border-white/10 space-y-5">
          <h3 className="text-sm font-display font-bold text-text-pure">
            Search Engine Metadata
          </h3>

          <FormInput
            label="Website Meta Title"
            required
            placeholder="e.g. Rehman Hridoy | Sr. Video Editor & Creative Director"
            value={seo.siteTitle}
            onChange={(e) => setSeo({ ...seo, siteTitle: e.target.value })}
          />

          <FormTextarea
            label="Meta Description (Max ~160 chars recommended)"
            rows={3}
            value={seo.metaDescription}
            onChange={(e) => setSeo({ ...seo, metaDescription: e.target.value })}
          />

          <ImagePreviewInput
            label="Social Share OpenGraph (OG) Image URL"
            value={seo.ogImage}
            onChange={(url) => setSeo({ ...seo, ogImage: url })}
            aspect="video"
          />

          {/* Keywords Manager */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-accent uppercase tracking-wider block">
              SEO Keywords & Tags
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Video Editor, Motion Graphics, Reels Editor..."
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddKeyword();
                  }
                }}
                className="flex-1 bg-primary/70 border border-white/10 focus:border-accent rounded-xl px-4 py-2.5 text-xs text-text-pure focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddKeyword}
                className="px-4 py-2.5 rounded-xl bg-accent text-primary font-bold text-xs uppercase"
              >
                <Plus size={14} />
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {(seo.keywords || []).map((k) => (
                <span
                  key={k}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/15 border border-accent/30 text-accent text-xs font-semibold"
                >
                  {k}
                  <button
                    type="button"
                    onClick={() => handleRemoveKeyword(k)}
                    className="hover:text-red-400 p-0.5"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Live Preview Simulator */}
        <div className="space-y-6">
          {/* Google Search Simulator */}
          <div className="p-6 rounded-3xl bg-secondary/40 border border-white/10 space-y-4">
            <h3 className="text-xs font-bold text-accent uppercase tracking-wider flex items-center gap-2">
              <Globe size={15} /> Google Search Live Preview
            </h3>

            <div className="p-5 rounded-2xl bg-[#202124] text-left space-y-1.5 border border-white/5 font-sans">
              <div className="text-[11px] text-[#bdc1c6] flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-full bg-accent/30 inline-block" />
                <span>rehmanhridoy.vercel.app</span>
              </div>
              <h4 className="text-base text-[#8ab4f8] font-normal hover:underline cursor-pointer line-clamp-1">
                {seo.siteTitle || "Rehman Hridoy | Video Editor"}
              </h4>
              <p className="text-xs text-[#bdc1c6] line-clamp-2 leading-relaxed">
                {seo.metaDescription || "Professional Video Editor & Creative Director specializing in commercial ads..."}
              </p>
            </div>
          </div>

          {/* Social Card Preview */}
          <div className="p-6 rounded-3xl bg-secondary/40 border border-white/10 space-y-4">
            <h3 className="text-xs font-bold text-accent uppercase tracking-wider flex items-center gap-2">
              <Share2 size={15} /> Social Card Share Preview (FB / WhatsApp / LinkedIn)
            </h3>

            <div className="rounded-2xl bg-primary/80 border border-white/10 overflow-hidden shadow-xl">
              <div className="aspect-video bg-black/60 overflow-hidden relative">
                <img
                  src={seo.ogImage}
                  alt="OG Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=800&auto=format&fit=crop";
                  }}
                />
              </div>
              <div className="p-4 space-y-1 bg-secondary/90 border-t border-white/10">
                <p className="text-[10px] text-text-muted uppercase tracking-wider font-mono">
                  REHMANHRIDOY.VERCEL.APP
                </p>
                <h4 className="text-sm font-bold text-text-pure line-clamp-1">
                  {seo.siteTitle}
                </h4>
                <p className="text-xs text-text-soft line-clamp-2">
                  {seo.metaDescription}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
