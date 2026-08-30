import React, { useState, FormEvent } from "react";
import { User, Save, Plus, X, Sparkles, CheckCircle2 } from "lucide-react";
import { FormInput, FormTextarea, FormToggle, ImagePreviewInput } from "../components/FormComponents";
import { cmsStore } from "../../lib/cmsStore";
import { ProfileHeroData } from "../../lib/cmsTypes";

interface ProfileHeroManagerProps {
  onAddToast: (type: "success" | "error" | "warning" | "info", message: string) => void;
}

export function ProfileHeroManager({ onAddToast }: ProfileHeroManagerProps) {
  const [profile, setProfile] = useState<ProfileHeroData>(() => cmsStore.getProfile());
  const [altTitleInput, setAltTitleInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleAddAltTitle = () => {
    if (!altTitleInput.trim()) return;
    if (profile.alternativeTitles.includes(altTitleInput.trim())) return;
    setProfile({
      ...profile,
      alternativeTitles: [...profile.alternativeTitles, altTitleInput.trim()],
    });
    setAltTitleInput("");
  };

  const handleRemoveAltTitle = (titleToRemove: string) => {
    setProfile({
      ...profile,
      alternativeTitles: profile.alternativeTitles.filter(t => t !== titleToRemove),
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      cmsStore.saveProfile(profile);
      setIsSaving(false);
      onAddToast("success", "Profile & Hero configurations saved successfully! 🚀");
    } catch (err: any) {
      setIsSaving(false);
      onAddToast("error", `Failed to save profile: ${err.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-fadeIn">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-secondary/60 border border-white/10">
        <div>
          <h2 className="text-lg font-display font-bold text-text-pure flex items-center gap-2">
            <User size={20} className="text-accent" /> Profile, Hero & Personal Branding
          </h2>
          <p className="text-xs text-text-soft mt-0.5">
            Configure your professional titles, narrative copy, imagery, and contact channels.
          </p>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-3 rounded-2xl bg-accent hover:bg-accent-hover text-primary font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-accent/20 transition-all shrink-0 disabled:opacity-50"
        >
          <Save size={16} />
          <span>{isSaving ? "Saving..." : "Save Changes"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Portrait Image & Status */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-secondary/40 border border-white/10 space-y-6">
            <h3 className="text-sm font-display font-bold text-text-pure">
              Portrait & Availability
            </h3>

            <ImagePreviewInput
              label="Hero Portrait Photo URL"
              value={profile.portraitUrl}
              onChange={(url) => setProfile({ ...profile, portraitUrl: url })}
              aspect="portrait"
            />

            <ImagePreviewInput
              label="About Section Portrait Photo URL (Optional)"
              value={profile.aboutPortraitUrl || ""}
              onChange={(url) => setProfile({ ...profile, aboutPortraitUrl: url })}
              aspect="portrait"
            />

            <FormToggle
              label="Available for Work"
              description="Displays green badge and accepts direct client bookings"
              checked={profile.availableForWork}
              onChange={(checked) => setProfile({ ...profile, availableForWork: checked })}
            />

            <FormInput
              label="Resume / CV File Link"
              placeholder="https://drive.google.com/... or /resume.pdf"
              value={profile.resumeUrl || ""}
              onChange={(e) => setProfile({ ...profile, resumeUrl: e.target.value })}
            />

            <FormInput
              label="Location"
              placeholder="Dhaka, Bangladesh"
              value={profile.location}
              onChange={(e) => setProfile({ ...profile, location: e.target.value })}
            />
          </div>
        </div>

        {/* Middle & Right Column: Core Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Identity & Headings */}
          <div className="p-6 rounded-3xl bg-secondary/40 border border-white/10 space-y-5">
            <h3 className="text-sm font-display font-bold text-text-pure">
              Identity & Hero Headings
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormInput
                label="Full Display Name"
                required
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />

              <FormInput
                label="Primary Professional Title"
                required
                value={profile.primaryTitle}
                onChange={(e) => setProfile({ ...profile, primaryTitle: e.target.value })}
              />
            </div>

            {/* Alternative Titles Tag Manager */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-accent uppercase tracking-wider block">
                Alternative Job Titles (Rotates in Hero / Meta)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Motion Designer, Creative Editor..."
                  value={altTitleInput}
                  onChange={(e) => setAltTitleInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddAltTitle();
                    }
                  }}
                  className="flex-1 bg-primary/70 border border-white/10 focus:border-accent rounded-xl px-4 py-2.5 text-xs text-text-pure focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddAltTitle}
                  className="px-4 py-2.5 rounded-xl bg-accent text-primary font-bold text-xs uppercase"
                >
                  <Plus size={14} />
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {profile.alternativeTitles.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/15 border border-accent/30 text-accent text-xs font-semibold"
                  >
                    {t}
                    <button
                      type="button"
                      onClick={() => handleRemoveAltTitle(t)}
                      className="hover:text-red-400 p-0.5"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormInput
                label="Hero Main Headline"
                value={profile.headline}
                onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
              />

              <FormInput
                label="Hero Subheadline"
                value={profile.subheadline}
                onChange={(e) => setProfile({ ...profile, subheadline: e.target.value })}
              />
            </div>

            <FormTextarea
              label="Short Hero Introduction"
              rows={3}
              value={profile.shortBio}
              onChange={(e) => setProfile({ ...profile, shortBio: e.target.value })}
            />

            <FormTextarea
              label="Full Story / Bio (About Section)"
              rows={4}
              value={profile.fullBio}
              onChange={(e) => setProfile({ ...profile, fullBio: e.target.value })}
            />
          </div>

          {/* CTA Buttons & Direct Channels */}
          <div className="p-6 rounded-3xl bg-secondary/40 border border-white/10 space-y-5">
            <h3 className="text-sm font-display font-bold text-text-pure">
              Call-To-Action (CTA) Buttons & Direct Channels
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormInput
                label="Primary Button Text"
                value={profile.ctaPrimaryText}
                onChange={(e) => setProfile({ ...profile, ctaPrimaryText: e.target.value })}
              />
              <FormInput
                label="Primary Button URL"
                value={profile.ctaPrimaryUrl}
                onChange={(e) => setProfile({ ...profile, ctaPrimaryUrl: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormInput
                label="Secondary Button Text"
                value={profile.ctaSecondaryText}
                onChange={(e) => setProfile({ ...profile, ctaSecondaryText: e.target.value })}
              />
              <FormInput
                label="Secondary Button URL"
                value={profile.ctaSecondaryUrl}
                onChange={(e) => setProfile({ ...profile, ctaSecondaryUrl: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <FormInput
                label="Email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              />
              <FormInput
                label="WhatsApp"
                value={profile.whatsapp}
                onChange={(e) => setProfile({ ...profile, whatsapp: e.target.value })}
              />
              <FormInput
                label="Phone"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
