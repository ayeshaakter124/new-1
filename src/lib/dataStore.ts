/**
 * DataStore Adapter Proxy
 * Connects seamlessly to cmsStore to ensure 100% backward compatibility.
 */

import { cmsStore } from "./cmsStore";
import { cloudStore } from "./cloudStore";

export interface Project {
  id: number | string;
  title: string;
  category: "Reels" | "Commercial" | "Saas Animation" | "Motion Graphics" | "Documentary" | string;
  description: string;
  image: string;
  youtubeUrl: string;
  duration?: string;
  featured?: boolean;
}

export interface ClientReview {
  id: number | string;
  client: string;
  role: string;
  content: string;
  thumbnail: string;
  youtubeUrl: string;
  rating?: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  ventureNature: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface ProfileSettings {
  name: string;
  title: string;
  tagline: string;
  email: string;
  whatsapp: string;
  instagram: string;
  facebook: string;
  linkedin: string;
  yearsExperience: string;
  projectsCompleted: string;
  happyClients: string;
}

export interface JourneyItem {
  id: number | string;
  year: string;
  role: string;
  company: string;
  description: string;
}

export const dataStore = {
  getProjects(): Project[] {
    return cmsStore.getProjects().map(p => ({
      id: p.id,
      title: p.title,
      category: p.category,
      description: p.description,
      image: p.thumbnail,
      youtubeUrl: p.youtubeUrl,
      duration: p.duration,
      featured: p.featured,
    }));
  },

  getJourney(): JourneyItem[] {
    return cmsStore.getExperiences().map(e => ({
      id: e.id,
      year: e.year,
      role: e.role,
      company: e.company,
      description: e.description,
    }));
  },

  getReviews(): ClientReview[] {
    return cmsStore.getTestimonials().map(t => ({
      id: t.id,
      client: t.name,
      role: t.role,
      content: t.text,
      thumbnail: t.image,
      youtubeUrl: t.youtubeUrl || "",
      rating: t.rating,
    }));
  },

  getMessages(): ContactMessage[] {
    return cmsStore.getMessages();
  },

  addMessage(msg: { name: string; email: string; ventureNature: string; message: string }): ContactMessage {
    return cmsStore.addMessage(msg);
  },

  markMessageRead(id: string) {
    return cmsStore.markMessageRead(id);
  },

  deleteMessage(id: string) {
    return cmsStore.deleteMessage(id);
  },

  getSettings(): ProfileSettings {
    const p = cmsStore.getProfile();
    const stats = cmsStore.getStats();
    const soc = cmsStore.getSocialLinks();

    const getSoc = (plat: string) => soc.find(s => s.platform.toLowerCase().includes(plat))?.url || "";
    const getStat = (name: string, fallback: string) => stats.find(s => s.label.toLowerCase().includes(name))?.value || fallback;

    return {
      name: p.name,
      title: p.primaryTitle,
      tagline: p.headline,
      email: p.email,
      whatsapp: p.whatsapp,
      instagram: getSoc("instagram"),
      facebook: getSoc("facebook"),
      linkedin: getSoc("linkedin"),
      yearsExperience: getStat("year", "2+"),
      projectsCompleted: getStat("project", "183+"),
      happyClients: getStat("client", "47+"),
    };
  },

  saveSettings(settings: Partial<ProfileSettings>) {
    if (settings.name || settings.title || settings.tagline || settings.email || settings.whatsapp) {
      cmsStore.saveProfile({
        name: settings.name,
        primaryTitle: settings.title,
        headline: settings.tagline,
        email: settings.email,
        whatsapp: settings.whatsapp,
      });
    }
    return this.getSettings();
  },

  saveProject(p: Partial<Project> & { id?: string | number }) {
    cmsStore.saveProject({
      id: p.id ? String(p.id) : undefined,
      title: p.title,
      category: p.category,
      description: p.description,
      thumbnail: p.image,
      youtubeUrl: p.youtubeUrl,
      duration: p.duration,
      featured: p.featured,
    });
    return this.getProjects();
  },

  deleteProject(id: string | number) {
    cmsStore.deleteProject(String(id));
    return this.getProjects();
  },

  saveJourneyItem(item: Partial<JourneyItem> & { id?: string | number }) {
    cmsStore.saveExperience({
      id: item.id ? String(item.id) : undefined,
      year: item.year,
      role: item.role,
      company: item.company,
      description: item.description,
    });
    return this.getJourney();
  },

  deleteJourneyItem(id: string | number) {
    cmsStore.deleteExperience(String(id));
    return this.getJourney();
  },

  saveReview(r: Partial<ClientReview> & { id?: string | number }) {
    cmsStore.saveTestimonial({
      id: r.id ? String(r.id) : undefined,
      name: r.client,
      role: r.role,
      text: r.content,
      image: r.thumbnail,
      youtubeUrl: r.youtubeUrl,
      rating: r.rating,
    });
    return this.getReviews();
  },

  deleteReview(id: string | number) {
    cmsStore.deleteTestimonial(String(id));
    return this.getReviews();
  },

  async loadFromCloud() {
    return cmsStore.loadFromCloud();
  },

  async syncAllToCloud() {
    return cmsStore.syncAllToCloud();
  },

  resetAllToDefault() {
    cmsStore.resetAllToDefault();
  }
};
