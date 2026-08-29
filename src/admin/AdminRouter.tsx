import React, { useState, useEffect } from "react";
import { authStore } from "../lib/authStore";
import { AdminTab } from "./components/AdminSidebar";
import { AdminLayout } from "./components/AdminLayout";
import { ToastMessage, ToastType } from "./components/Toast";
import { AdminLoginPage } from "./pages/AdminLoginPage";
import { DashboardOverview } from "./pages/DashboardOverview";
import { ProfileHeroManager } from "./pages/ProfileHeroManager";
import { ExperienceManager } from "./pages/ExperienceManager";
import { ProjectManager } from "./pages/ProjectManager";
import { VideoManager } from "./pages/VideoManager";
import { ClientManager } from "./pages/ClientManager";
import { StatsManager } from "./pages/StatsManager";
import { SkillsManager } from "./pages/SkillsManager";
import { ToolsManager } from "./pages/ToolsManager";
import { ServicesManager } from "./pages/ServicesManager";
import { TestimonialsManager } from "./pages/TestimonialsManager";
import { SocialLinksManager } from "./pages/SocialLinksManager";
import { ContactInfoManager } from "./pages/ContactInfoManager";
import { WebsiteContentManager } from "./pages/WebsiteContentManager";
import { MediaLibraryPage } from "./pages/MediaLibraryPage";
import { SectionManager } from "./pages/SectionManager";
import { SeoManager } from "./pages/SeoManager";
import { SettingsManager } from "./pages/SettingsManager";

export default function AdminRouter() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => authStore.isAuthenticated());
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    document.title = "Admin CMS Studio | Rehman Hridoy";
  }, []);

  const handleAddToast = (type: ToastType, message: string) => {
    const newToast: ToastMessage = {
      id: `toast_${Date.now()}_${Math.random()}`,
      type,
      message,
    };
    setToasts((prev) => [...prev, newToast]);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleLogout = () => {
    authStore.logout();
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <AdminLoginPage onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  const renderActivePage = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardOverview onNavigateTab={setActiveTab} onAddToast={handleAddToast} />;
      case "profile":
        return <ProfileHeroManager onAddToast={handleAddToast} />;
      case "experience":
        return <ExperienceManager onAddToast={handleAddToast} />;
      case "projects":
        return <ProjectManager onAddToast={handleAddToast} />;
      case "videos":
        return <VideoManager onAddToast={handleAddToast} />;
      case "clients":
        return <ClientManager onAddToast={handleAddToast} />;
      case "stats":
        return <StatsManager onAddToast={handleAddToast} />;
      case "skills":
        return <SkillsManager onAddToast={handleAddToast} />;
      case "tools":
        return <ToolsManager onAddToast={handleAddToast} />;
      case "services":
        return <ServicesManager onAddToast={handleAddToast} />;
      case "testimonials":
        return <TestimonialsManager onAddToast={handleAddToast} />;
      case "social":
        return <SocialLinksManager onAddToast={handleAddToast} />;
      case "contact":
        return <ContactInfoManager onAddToast={handleAddToast} />;
      case "content":
        return <WebsiteContentManager onAddToast={handleAddToast} />;
      case "media":
        return <MediaLibraryPage onAddToast={handleAddToast} />;
      case "sections":
        return <SectionManager onAddToast={handleAddToast} />;
      case "seo":
        return <SeoManager onAddToast={handleAddToast} />;
      case "settings":
        return <SettingsManager onAddToast={handleAddToast} />;
      default:
        return <DashboardOverview onNavigateTab={setActiveTab} onAddToast={handleAddToast} />;
    }
  };

  return (
    <AdminLayout
      activeTab={activeTab}
      onSelectTab={setActiveTab}
      toasts={toasts}
      onDismissToast={handleDismissToast}
      onAddToast={handleAddToast}
      onLogout={handleLogout}
    >
      {renderActivePage()}
    </AdminLayout>
  );
}
