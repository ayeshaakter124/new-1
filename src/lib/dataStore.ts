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

const DEFAULT_PROJECTS: Project[] = [
  {
    id: 1,
    title: "Real Estate Commercial",
    category: "Commercial",
    description: "Cinematic real estate showcase for high-end luxury properties.",
    image: "https://i.postimg.cc/CLhKLMLm/video-captu.png",
    youtubeUrl: "https://www.youtube.com/embed/fKsmQyZc9QE?si=6wwK2edJFOEFsn1n",
    duration: "2:15",
    featured: true
  },
  {
    id: 2,
    title: "Laptop Review Reel",
    category: "Reels",
    description: "High-retention tech review with dynamic cuts and sound design.",
    image: "https://i.postimg.cc/vZMXF08T/video-capture-t0009-54seg-3118.png",
    youtubeUrl: "https://www.youtube.com/embed/YMvdoeu4CIs?rel=0",
    duration: "0:50",
    featured: true
  },
  {
    id: 3,
    title: "Google Lens Concept",
    category: "Saas Animation",
    description: "Clean SaaS motion graphics and UI showcase for tech products.",
    image: "https://i.postimg.cc/ydSwHbGG/2v-WH764AUE8-HD.jpg",
    youtubeUrl: "https://www.youtube.com/embed/2vWH764AUE8?rel=0",
    duration: "1:30",
    featured: true
  },
  {
    id: 4,
    title: "Bangladesh Growth Infographic",
    category: "Motion Graphics",
    description: "Dynamic corporate motion graphics and statistical visualization for Renata Ltd.",
    image: "https://i.postimg.cc/L6m0C5mD/dc-TUgs-XTc-QI-HD.jpg",
    youtubeUrl: "https://www.youtube.com/embed/dcTUgsXTcQI?rel=0",
    duration: "1:15",
    featured: true
  },
  {
    id: 5,
    title: "Colmi Watch Review",
    category: "Reels",
    description: "High-energy smartwatch product showcase and feature breakdown.",
    image: "https://i.postimg.cc/MpbHWcyZ/video-capture-t0001-11seg-2351.png",
    youtubeUrl: "https://www.youtube.com/embed/HVlWqPzX9eA?rel=0",
    duration: "0:45",
    featured: true
  },
  {
    id: 6,
    title: "Cyberpunk Glitch Edit",
    category: "Motion Graphics",
    description: "Complex glitch effects and futuristic typography.",
    image: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=800&auto=format&fit=crop",
    youtubeUrl: "https://www.youtube.com/watch?v=BvXGPhE-Tto",
    duration: "0:30",
    featured: true
  },
  {
    id: 7,
    title: "Fashion & Clothing Ad",
    category: "Reels",
    description: "High-fashion viral apparel reel with fast pacing and rhythm.",
    image: "https://i.postimg.cc/HxL2gcPt/video-capture-t0008-54seg-9456.png",
    youtubeUrl: "https://www.youtube.com/embed/r4FmQWtIgQM?rel=0",
    duration: "0:40",
    featured: true
  },
  {
    id: 8,
    title: "Cosmetic Commercial Ad",
    category: "Reels",
    description: "Luxury cosmetic brand promo featuring sleek color grading.",
    image: "https://i.postimg.cc/SR67L6XS/video-capture-t0042-74seg-2887.png",
    youtubeUrl: "https://www.youtube.com/embed/8nDc0bLlMz8?rel=0",
    duration: "0:35",
    featured: true
  },
  {
    id: 9,
    title: "Podcast Hook (Mindset)",
    category: "Commercial",
    description: "Viral podcast hook edit engineered for maximum audience retention.",
    image: "https://i.postimg.cc/CLh1fT25/maxresdefault.jpg",
    youtubeUrl: "https://www.youtube.com/embed/0cbrRER0xzg?si=Icr4sAryqEgsa9Hp",
    duration: "1:00",
    featured: true
  },
  {
    id: 10,
    title: "Podcast Hook (Psychology)",
    category: "Commercial",
    description: "Engaging podcast short with dynamic captions and B-roll inserts.",
    image: "https://i.postimg.cc/rFVmtXPb/maxresdefault-(1).jpg",
    youtubeUrl: "https://www.youtube.com/embed/u2rpS7niDXw?si=53IG2DnTF6ZIXIVv",
    duration: "1:20",
    featured: true
  },
  {
    id: 11,
    title: "Documentary: The Artisan",
    category: "Documentary",
    description: "Story highlighting the craftsmanship of a luthier.",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop",
    youtubeUrl: "https://www.youtube.com/watch?v=BvXGPhE-Tto",
    duration: "5:20",
    featured: false
  }
];

const DEFAULT_REVIEWS: ClientReview[] = [
  {
    id: 1,
    client: "Cozy",
    role: "Head Chef",
    content: "Review video of an Italian restaurant Head Chef.",
    thumbnail: "https://i.postimg.cc/t4mYjS24/video-capture-t0006-51seg-3115.png",
    youtubeUrl: "https://www.youtube.com/embed/1YlvpCCTWls?rel=0",
    rating: 5
  },
  {
    id: 2,
    client: "Marcus Chen",
    role: "Content Creator",
    content: "My retention rates skyrocketed after we started working on my Reels. Fast, reliable, and incredibly creative.",
    thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
    youtubeUrl: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
    rating: 5
  },
  {
    id: 3,
    client: "Elena Rodriguez",
    role: "Marketing Director",
    content: "A master of storytelling. Our commercial looked like a high-budget Hollywood production. Incredible work!",
    thumbnail: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400&auto=format&fit=crop",
    youtubeUrl: "https://www.youtube.com/watch?v=F3SpxOLeq0U",
    rating: 5
  },
  {
    id: 4,
    client: "David Wilson",
    role: "Founder, Peak Performance",
    content: "The level of professionalism and artistic direction is unmatched. Our brand engagement has doubled since we updated our content.",
    thumbnail: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",
    youtubeUrl: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
    rating: 5
  }
];

const DEFAULT_MESSAGES: ContactMessage[] = [
  {
    id: "msg_1",
    name: "Alex Vance",
    email: "alex@vancemedia.co",
    ventureNature: "Commercial Masterpiece",
    message: "Hey Rehman! We are launching a new tech gadget and need a 60-second high energy commercial ad. Loved your podcast hook edits!",
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    read: false
  }
];

const DEFAULT_SETTINGS: ProfileSettings = {
  name: "Rehman Hridoy",
  title: "SR. VIDEO EDITOR & CREATIVE DIRECTOR",
  tagline: "Crafting High-Octane Visual Experiences",
  email: "reehmanhridoy@gmail.com",
  whatsapp: "+880157735667",
  instagram: "https://www.instagram.com/rehman_hridoy/",
  facebook: "https://www.facebook.com/HRlD0Y",
  linkedin: "https://linkedin.com/in/rehmanhridoy",
  yearsExperience: "2+",
  projectsCompleted: "183+",
  happyClients: "47+"
};

const DEFAULT_JOURNEY: JourneyItem[] = [
  {
    id: 1,
    year: "Present",
    role: "SR. VIDEO EDITOR",
    company: "Srizonshil",
    description: "Crafting high-octane visual experiences and viral commercial content for digital-first audiences, focusing on rhythmic precision and narrative impact.",
  },
  {
    id: 2,
    year: "2025",
    role: "CREATIVE DIRECTOR",
    company: "D Studio",
    description: "Defining the future of luxury cinematic storytelling for global fashion and tech brands, overseeing high-end visual campaigns from concept to final delivery.",
  },
  {
    id: 3,
    year: "2024",
    role: "MOTION DESIGNER",
    company: "LUMINA ART LAB",
    description: "Pioneering experimental visual languages through motion design and digital art installations, collaborating with international artists on immersive projects.",
  },
];

const STORAGE_KEYS = {
  PROJECTS: "rh_portfolio_projects_v1",
  REVIEWS: "rh_portfolio_reviews_v1",
  MESSAGES: "rh_portfolio_messages_v1",
  SETTINGS: "rh_portfolio_settings_v1",
  JOURNEY: "rh_portfolio_journey_v1",
  ADMIN_PASS: "rh_portfolio_admin_pass_v1",
};

const notifyUpdate = () => {
  window.dispatchEvent(new Event("rh_data_updated"));
};

export const dataStore = {
  // Projects
  getProjects(): Project[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      return saved ? JSON.parse(saved) : DEFAULT_PROJECTS;
    } catch {
      return DEFAULT_PROJECTS;
    }
  },
  saveProject(project: Partial<Project> & { id?: number | string }): Project[] {
    const projects = this.getProjects();
    if (project.id) {
      const idx = projects.findIndex(p => p.id === project.id);
      if (idx !== -1) {
        projects[idx] = { ...projects[idx], ...project };
      } else {
        projects.unshift(project as Project);
      }
    } else {
      const newProj: Project = {
        id: Date.now(),
        title: project.title || "Untitled Project",
        category: project.category || "Reels",
        description: project.description || "",
        image: project.image || "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=800&auto=format&fit=crop",
        youtubeUrl: project.youtubeUrl || "",
        duration: project.duration || "0:30",
        featured: project.featured ?? true
      };
      projects.unshift(newProj);
    }
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    notifyUpdate();
    cloudStore.syncKey("projects", projects);
    return projects;
  },
  deleteProject(id: number | string): Project[] {
    const projects = this.getProjects().filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    notifyUpdate();
    cloudStore.syncKey("projects", projects);
    return projects;
  },

  // Journey / Career Experience
  getJourney(): JourneyItem[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.JOURNEY);
      return saved ? JSON.parse(saved) : DEFAULT_JOURNEY;
    } catch {
      return DEFAULT_JOURNEY;
    }
  },
  saveJourneyItem(item: Partial<JourneyItem> & { id?: number | string }): JourneyItem[] {
    const list = this.getJourney();
    if (item.id) {
      const idx = list.findIndex(j => j.id === item.id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...item } as JourneyItem;
      } else {
        list.push(item as JourneyItem);
      }
    } else {
      const newItem: JourneyItem = {
        id: Date.now(),
        year: item.year || "Present",
        role: item.role || "Role Title",
        company: item.company || "Company Name",
        description: item.description || ""
      };
      list.unshift(newItem);
    }
    localStorage.setItem(STORAGE_KEYS.JOURNEY, JSON.stringify(list));
    notifyUpdate();
    cloudStore.syncKey("journey", list);
    return list;
  },
  deleteJourneyItem(id: number | string): JourneyItem[] {
    const list = this.getJourney().filter(j => j.id !== id);
    localStorage.setItem(STORAGE_KEYS.JOURNEY, JSON.stringify(list));
    notifyUpdate();
    cloudStore.syncKey("journey", list);
    return list;
  },

  // Reviews
  getReviews(): ClientReview[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      return saved ? JSON.parse(saved) : DEFAULT_REVIEWS;
    } catch {
      return DEFAULT_REVIEWS;
    }
  },
  saveReview(review: Partial<ClientReview> & { id?: number | string }): ClientReview[] {
    const reviews = this.getReviews();
    if (review.id) {
      const idx = reviews.findIndex(r => r.id === review.id);
      if (idx !== -1) {
        reviews[idx] = { ...reviews[idx], ...review };
      } else {
        reviews.unshift(review as ClientReview);
      }
    } else {
      const newRev: ClientReview = {
        id: Date.now(),
        client: review.client || "Client",
        role: review.role || "Client",
        content: review.content || "",
        thumbnail: review.thumbnail || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
        youtubeUrl: review.youtubeUrl || "",
        rating: review.rating || 5
      };
      reviews.unshift(newRev);
    }
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
    notifyUpdate();
    cloudStore.syncKey("reviews", reviews);
    return reviews;
  },
  deleteReview(id: number | string): ClientReview[] {
    const reviews = this.getReviews().filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
    notifyUpdate();
    cloudStore.syncKey("reviews", reviews);
    return reviews;
  },

  // Messages
  getMessages(): ContactMessage[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MESSAGES);
      return saved ? JSON.parse(saved) : DEFAULT_MESSAGES;
    } catch {
      return DEFAULT_MESSAGES;
    }
  },
  addMessage(msg: { name: string; email: string; ventureNature: string; message: string }): ContactMessage {
    const messages = this.getMessages();
    const newMsg: ContactMessage = {
      id: `msg_${Date.now()}`,
      ...msg,
      createdAt: new Date().toISOString(),
      read: false
    };
    messages.unshift(newMsg);
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
    notifyUpdate();
    cloudStore.syncKey("messages", messages);
    return newMsg;
  },
  markMessageRead(id: string): ContactMessage[] {
    const messages = this.getMessages().map(m => m.id === id ? { ...m, read: true } : m);
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
    notifyUpdate();
    cloudStore.syncKey("messages", messages);
    return messages;
  },
  deleteMessage(id: string): ContactMessage[] {
    const messages = this.getMessages().filter(m => m.id !== id);
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
    notifyUpdate();
    cloudStore.syncKey("messages", messages);
    return messages;
  },

  // Settings
  getSettings(): ProfileSettings {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  },
  saveSettings(settings: Partial<ProfileSettings>): ProfileSettings {
    const current = this.getSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    notifyUpdate();
    cloudStore.syncKey("settings", updated);
    return updated;
  },

  // Cloud Load & Full Sync
  async loadFromCloud(): Promise<boolean> {
    const bundle = await cloudStore.fetchAllRemote();
    if (!bundle) return false;
    if (bundle.projects && Array.isArray(bundle.projects)) {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(bundle.projects));
    }
    if (bundle.journey && Array.isArray(bundle.journey)) {
      localStorage.setItem(STORAGE_KEYS.JOURNEY, JSON.stringify(bundle.journey));
    }
    if (bundle.reviews && Array.isArray(bundle.reviews)) {
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(bundle.reviews));
    }
    if (bundle.messages && Array.isArray(bundle.messages)) {
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(bundle.messages));
    }
    if (bundle.settings && typeof bundle.settings === "object") {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(bundle.settings));
    }
    notifyUpdate();
    return true;
  },

  async syncAllToCloud() {
    return cloudStore.pushAllLocal({
      projects: this.getProjects(),
      journey: this.getJourney(),
      reviews: this.getReviews(),
      messages: this.getMessages(),
      settings: this.getSettings(),
    });
  },

  // Password
  getAdminPassword(): string {
    return localStorage.getItem(STORAGE_KEYS.ADMIN_PASS) || "halima123";
  },
  setAdminPassword(pass: string): void {
    localStorage.setItem(STORAGE_KEYS.ADMIN_PASS, pass);
  },

  // Reset
  resetAllToDefault(): void {
    localStorage.removeItem(STORAGE_KEYS.PROJECTS);
    localStorage.removeItem(STORAGE_KEYS.REVIEWS);
    localStorage.removeItem(STORAGE_KEYS.JOURNEY);
    localStorage.removeItem(STORAGE_KEYS.MESSAGES);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.ADMIN_PASS);
    notifyUpdate();
  }
};
