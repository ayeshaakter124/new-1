import React from "react";
import {
  LayoutDashboard,
  User,
  Briefcase,
  Film,
  Video,
  Building2,
  BarChart3,
  Award,
  Wrench,
  Sparkles,
  MessageSquareQuote,
  Share2,
  Mail,
  Type,
  Image as ImageIcon,
  Sliders,
  Search,
  Settings,
  X,
  ExternalLink,
  LogOut
} from "lucide-react";

export type AdminTab =
  | "dashboard"
  | "profile"
  | "experience"
  | "projects"
  | "videos"
  | "clients"
  | "stats"
  | "skills"
  | "tools"
  | "services"
  | "testimonials"
  | "social"
  | "contact"
  | "content"
  | "media"
  | "sections"
  | "seo"
  | "settings";

interface AdminSidebarProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  isOpen: boolean;
  onClose: () => void;
  unreadMessagesCount: number;
  onLogout: () => void;
}

interface NavItem {
  id: AdminTab;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  badge?: number | string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

export function AdminSidebar({
  activeTab,
  onSelectTab,
  isOpen,
  onClose,
  unreadMessagesCount,
  onLogout,
}: AdminSidebarProps) {
  const groups: NavGroup[] = [
    {
      title: "Overview",
      items: [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      ],
    },
    {
      title: "Identity & Journey",
      items: [
        { id: "profile", label: "Profile & Hero", icon: User },
        { id: "experience", label: "Career Journey", icon: Briefcase },
      ],
    },
    {
      title: "Content & Showcase",
      items: [
        { id: "projects", label: "Projects CMS", icon: Film },
        { id: "videos", label: "Video Showcase", icon: Video },
        { id: "clients", label: "Clients & Brands", icon: Building2 },
        { id: "services", label: "Services", icon: Sparkles },
      ],
    },
    {
      title: "Skills, Stats & Reviews",
      items: [
        { id: "stats", label: "Key Statistics", icon: BarChart3 },
        { id: "skills", label: "Core Skills", icon: Award },
        { id: "tools", label: "Software & Tools", icon: Wrench },
        { id: "testimonials", label: "Testimonials", icon: MessageSquareQuote },
      ],
    },
    {
      title: "Communications",
      items: [
        { id: "social", label: "Social Links", icon: Share2 },
        { 
          id: "contact", 
          label: "Contact & Inbox", 
          icon: Mail, 
          badge: unreadMessagesCount > 0 ? `${unreadMessagesCount} new` : undefined 
        },
      ],
    },
    {
      title: "Site Architecture & SEO",
      items: [
        { id: "content", label: "Website Copy", icon: Type },
        { id: "media", label: "Media Library", icon: ImageIcon },
        { id: "sections", label: "Section Manager", icon: Sliders },
        { id: "seo", label: "SEO & Social Meta", icon: Search },
        { id: "settings", label: "System & Cloud DB", icon: Settings },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-primary/80 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-secondary/95 border-r border-white/10 flex flex-col justify-between transition-transform duration-300 ease-in-out backdrop-blur-2xl lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-accent flex items-center justify-center text-primary font-bold shadow-lg shadow-accent/20">
              <Film size={20} />
            </div>
            <div>
              <h2 className="font-display font-bold text-sm text-text-pure tracking-tight">
                Rehman Hridoy
              </h2>
              <span className="text-[9px] font-bold text-accent uppercase tracking-widest block">
                CMS Studio v2.0
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-text-muted hover:text-text-pure hover:bg-white/5 lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Navigation List */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 custom-scrollbar">
          {groups.map((group) => (
            <div key={group.title} className="space-y-1.5">
              <p className="px-3 text-[9px] font-bold uppercase tracking-[0.25em] text-text-muted/60">
                {group.title}
              </p>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectTab(item.id);
                      onClose();
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                      isActive
                        ? "bg-accent text-primary font-bold shadow-md shadow-accent/15"
                        : "text-text-soft hover:text-text-pure hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={16} className={isActive ? "text-primary" : "text-text-muted"} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          isActive
                            ? "bg-primary text-accent"
                            : "bg-red-500 text-white animate-pulse"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium text-text-soft hover:text-accent hover:bg-white/5 transition-all"
          >
            <span className="flex items-center gap-2">
              <ExternalLink size={14} /> View Live Website
            </span>
            <span className="text-[10px] text-text-muted font-mono">↗</span>
          </a>

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
