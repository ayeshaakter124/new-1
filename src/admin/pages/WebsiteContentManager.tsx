import React, { useState, FormEvent } from "react";
import { Type, Save } from "lucide-react";
import { cmsStore } from "../../lib/cmsStore";
import { WebsiteContent } from "../../lib/cmsTypes";
import { FormInput, FormTextarea } from "../components/FormComponents";

interface WebsiteContentManagerProps {
  onAddToast: (type: "success" | "error" | "warning" | "info", message: string) => void;
}

export function WebsiteContentManager({ onAddToast }: WebsiteContentManagerProps) {
  const [content, setContent] = useState<WebsiteContent>(() => cmsStore.getContent());
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      cmsStore.saveContent(content);
      setIsSaving(false);
      onAddToast("success", "Website copy & headlines saved successfully! ✍️");
    } catch (err: any) {
      setIsSaving(false);
      onAddToast("error", `Failed to save content: ${err.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-secondary/60 border border-white/10">
        <div>
          <h2 className="text-lg font-display font-bold text-text-pure flex items-center gap-2">
            <Type size={20} className="text-accent" /> Website Copy, Headlines & Narrative Content
          </h2>
          <p className="text-xs text-text-soft mt-0.5">
            Modify all section badges, headlines, narrative paragraphs, and footer copyright copy.
          </p>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-3 rounded-2xl bg-accent hover:bg-accent-hover text-primary font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-accent/20 transition-all shrink-0"
        >
          <Save size={15} />
          <span>{isSaving ? "Saving..." : "Save Website Copy"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Hero Section Copy */}
        <div className="p-6 sm:p-8 rounded-3xl bg-secondary/40 border border-white/10 space-y-5">
          <h3 className="text-sm font-display font-bold text-accent uppercase tracking-wider border-b border-white/10 pb-3">
            Hero & Intro Section Copy
          </h3>

          <FormInput
            label="Hero Tagline Badge"
            value={content.heroTaglineBadge}
            onChange={(e) => setContent({ ...content, heroTaglineBadge: e.target.value })}
          />

          <div className="grid grid-cols-3 gap-3">
            <FormInput
              label="Line 1"
              value={content.heroHeadingLine1}
              onChange={(e) => setContent({ ...content, heroHeadingLine1: e.target.value })}
            />
            <FormInput
              label="Line 2 (Gold)"
              value={content.heroHeadingLine2}
              onChange={(e) => setContent({ ...content, heroHeadingLine2: e.target.value })}
            />
            <FormInput
              label="Line 3"
              value={content.heroHeadingLine3}
              onChange={(e) => setContent({ ...content, heroHeadingLine3: e.target.value })}
            />
          </div>

          <FormTextarea
            label="Hero Narrative Paragraph"
            rows={3}
            value={content.heroDescription}
            onChange={(e) => setContent({ ...content, heroDescription: e.target.value })}
          />

          <FormInput
            label="Social Proof Counter Text"
            value={content.heroSocialProofText}
            onChange={(e) => setContent({ ...content, heroSocialProofText: e.target.value })}
          />
        </div>

        {/* About Section Copy */}
        <div className="p-6 sm:p-8 rounded-3xl bg-secondary/40 border border-white/10 space-y-5">
          <h3 className="text-sm font-display font-bold text-accent uppercase tracking-wider border-b border-white/10 pb-3">
            About Section Copy
          </h3>

          <FormInput
            label="About Badge"
            value={content.aboutBadge}
            onChange={(e) => setContent({ ...content, aboutBadge: e.target.value })}
          />

          <FormInput
            label="About Main Headline"
            value={content.aboutHeading}
            onChange={(e) => setContent({ ...content, aboutHeading: e.target.value })}
          />

          <FormTextarea
            label="About Narrative Story"
            rows={4}
            value={content.aboutDescription}
            onChange={(e) => setContent({ ...content, aboutDescription: e.target.value })}
          />
        </div>

        {/* Portfolio & Showcase Copy */}
        <div className="p-6 sm:p-8 rounded-3xl bg-secondary/40 border border-white/10 space-y-5">
          <h3 className="text-sm font-display font-bold text-accent uppercase tracking-wider border-b border-white/10 pb-3">
            Portfolio Showcase Section Copy
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Portfolio Badge"
              value={content.portfolioBadge}
              onChange={(e) => setContent({ ...content, portfolioBadge: e.target.value })}
            />

            <FormInput
              label="Portfolio Heading"
              value={content.portfolioHeading}
              onChange={(e) => setContent({ ...content, portfolioHeading: e.target.value })}
            />
          </div>

          <FormInput
            label="Portfolio Subtitle Description"
            value={content.portfolioSubtitle}
            onChange={(e) => setContent({ ...content, portfolioSubtitle: e.target.value })}
          />
        </div>

        {/* Journey & Services Copy */}
        <div className="p-6 sm:p-8 rounded-3xl bg-secondary/40 border border-white/10 space-y-5">
          <h3 className="text-sm font-display font-bold text-accent uppercase tracking-wider border-b border-white/10 pb-3">
            Journey, Services & Footer Copy
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Journey Badge"
              value={content.journeyBadge}
              onChange={(e) => setContent({ ...content, journeyBadge: e.target.value })}
            />

            <FormInput
              label="Journey Heading"
              value={content.journeyHeading}
              onChange={(e) => setContent({ ...content, journeyHeading: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Services Badge"
              value={content.servicesBadge}
              onChange={(e) => setContent({ ...content, servicesBadge: e.target.value })}
            />

            <FormInput
              label="Services Heading"
              value={content.servicesHeading}
              onChange={(e) => setContent({ ...content, servicesHeading: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Footer Tagline"
              value={content.footerTagline}
              onChange={(e) => setContent({ ...content, footerTagline: e.target.value })}
            />

            <FormInput
              label="Footer Copyright Notice"
              value={content.footerCopyright}
              onChange={(e) => setContent({ ...content, footerCopyright: e.target.value })}
            />
          </div>
        </div>
      </div>
    </form>
  );
}
