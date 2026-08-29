import React from "react";
import {
  Menu,
  ExternalLink,
  Cloud,
  CloudOff,
  RefreshCw,
  Search,
  UserCheck
} from "lucide-react";
import { AdminTab } from "./AdminSidebar";

interface AdminTopbarProps {
  activeTab: AdminTab;
  onOpenSidebar: () => void;
  isCloudConnected: boolean;
  isSyncing: boolean;
  onQuickSync: () => void;
  onOpenSearch: () => void;
}

const TAB_TITLES: Record<AdminTab, { title: string; subtitle: string }> = {
  dashboard: { title: "Executive Dashboard", subtitle: "Overview of all CMS metrics, recent inquiries, and quick actions" },
  profile: { title: "Profile & Hero Configuration", subtitle: "Manage your display name, alternative job titles, bio, photo, and CTA" },
  experience: { title: "Career Experience Timeline", subtitle: "Manage work milestones, present and past company positions" },
  projects: { title: "Portfolio Projects Manager", subtitle: "Create, edit, reorder, categorize, and publish video projects" },
  videos: { title: "Dedicated Video Showcase", subtitle: "Manage high-retention video streams, 4K badges, and YouTube/Vimeo embeds" },
  clients: { title: "Clients & Trusted Brands", subtitle: "Manage client logos, testimonials count, and brand associations" },
  stats: { title: "Key Performance Statistics", subtitle: "Customize numerical counters, conversion metrics, and visual badges" },
  skills: { title: "Core Skills & Proficiency", subtitle: "Manage technical editing skills, icons, category tags, and glow colors" },
  tools: { title: "Software & Production Tools", subtitle: "Manage creative tools (Premiere, DaVinci, After Effects, CapCut, etc.)" },
  services: { title: "Services & Offerings", subtitle: "Manage creative service cards, feature lists, pricing, and custom CTAs" },
  testimonials: { title: "Client Testimonials & Video Reviews", subtitle: "Manage client review quotes, photos, video links, and ratings" },
  social: { title: "Social Media Links", subtitle: "Manage social network URLs, brand icons, and footer display links" },
  contact: { title: "Contact Information & Inquiry Inbox", subtitle: "Manage direct contact methods, WhatsApp chat, and visitor submissions" },
  content: { title: "Website Copy & Narrative Text", subtitle: "Customize all section headlines, badges, subtitles, and footer notices" },
  media: { title: "Media Library", subtitle: "Browse, upload, preview, and copy URLs for image and video assets" },
  sections: { title: "Section Architecture & Visibility", subtitle: "Toggle section visibility (ON/OFF) and rearrange display order" },
  seo: { title: "SEO, Meta Tags & Social Share", subtitle: "Manage website title, search engine meta descriptions, keywords, and OG preview" },
  settings: { title: "System Settings & Cloud Database", subtitle: "Admin security, password configuration, Supabase Cloud sync, and backups" },
};

export function AdminTopbar({
  activeTab,
  onOpenSidebar,
  isCloudConnected,
  isSyncing,
  onQuickSync,
  onOpenSearch,
}: AdminTopbarProps) {
  const current = TAB_TITLES[activeTab] || { title: "Admin Management", subtitle: "Configure portfolio settings" };

  return (
    <header className="sticky top-0 z-30 bg-secondary/80 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex items-center justify-between gap-4">
      {/* Left Title & Mobile Toggle */}
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenSidebar}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-text-pure lg:hidden transition-colors"
        >
          <Menu size={20} />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-display font-bold text-text-pure tracking-tight">
            {current.title}
          </h1>
          <p className="text-[11px] text-text-muted hidden md:block">
            {current.subtitle}
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Search Launcher */}
        <button
          onClick={onOpenSearch}
          className="px-3.5 py-2 rounded-xl bg-primary/60 border border-white/10 hover:border-accent/40 text-text-muted hover:text-text-pure text-xs flex items-center gap-2 transition-all hidden sm:flex"
        >
          <Search size={14} />
          <span>Quick Find...</span>
          <kbd className="text-[9px] bg-white/10 px-1.5 py-0.5 rounded font-mono text-text-muted">⌘K</kbd>
        </button>

        {/* Cloud Status Pill */}
        <div className="flex items-center gap-2">
          {isCloudConnected ? (
            <button
              onClick={onQuickSync}
              disabled={isSyncing}
              title="Click to sync data with Supabase Cloud"
              className="px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-[11px] font-bold flex items-center gap-1.5 hover:bg-green-500/20 transition-all"
            >
              <Cloud size={13} />
              <span className="hidden sm:inline">Cloud Active</span>
              <RefreshCw size={11} className={isSyncing ? "animate-spin ml-1" : "ml-1"} />
            </button>
          ) : (
            <span className="px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-bold flex items-center gap-1.5">
              <CloudOff size={13} />
              <span className="hidden sm:inline">Local Mode</span>
            </span>
          )}
        </div>

        {/* Live Site Link */}
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="p-2 sm:px-3.5 sm:py-2 rounded-xl bg-accent text-primary font-bold text-xs flex items-center gap-1.5 hover:bg-accent-hover transition-all shadow-md shadow-accent/15"
        >
          <ExternalLink size={14} />
          <span className="hidden sm:inline">Live Site</span>
        </a>
      </div>
    </header>
  );
}
