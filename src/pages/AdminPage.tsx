import { useState, useEffect, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  dataStore, 
  Project, 
  ClientReview, 
  ContactMessage, 
  ProfileSettings,
  JourneyItem
} from "../lib/dataStore";
import { 
  cloudStore, 
  CloudConfig, 
  SUPABASE_SQL_SETUP 
} from "../lib/cloudStore";
import { 
  LayoutDashboard, 
  Film, 
  MessageSquare, 
  Settings, 
  Plus, 
  Edit3, 
  Trash2, 
  LogOut, 
  Search, 
  ExternalLink, 
  CheckCircle, 
  Video, 
  User, 
  ShieldCheck, 
  ArrowLeft,
  Eye,
  EyeOff,
  RefreshCw,
  Download,
  Upload,
  Mail,
  Phone,
  Play,
  Briefcase,
  Database,
  Globe,
  Copy,
  Check,
  Cloud,
  CloudOff
} from "lucide-react";

// Helper to extract YouTube ID
const getYouTubeId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export default function AdminPage() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>("");

  // Active Tab
  const [activeTab, setActiveTab] = useState<"dashboard" | "projects" | "journey" | "reviews" | "messages" | "settings">("dashboard");

  // State data from store
  const [projects, setProjects] = useState<Project[]>([]);
  const [journeyList, setJourneyList] = useState<JourneyItem[]>([]);
  const [reviews, setReviews] = useState<ClientReview[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [settings, setSettings] = useState<ProfileSettings>(dataStore.getSettings());

  // Search & Filters
  const [projectSearch, setProjectSearch] = useState("");
  const [projectCategoryFilter, setProjectCategoryFilter] = useState("All");

  // Project Modal State
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);

  // Journey Modal State
  const [isJourneyModalOpen, setIsJourneyModalOpen] = useState(false);
  const [editingJourney, setEditingJourney] = useState<Partial<JourneyItem> | null>(null);

  // Review Modal State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Partial<ClientReview> | null>(null);

  // Password Change State
  const [newPassword, setNewPassword] = useState("");
  const [passSuccessMsg, setPassSuccessMsg] = useState("");

  // Cloud Database Sync State
  const [cloudConfig, setCloudConfig] = useState<CloudConfig>(() => cloudStore.getConfig());
  const [testCloudResult, setTestCloudResult] = useState<{ success?: boolean; message: string } | null>(null);
  const [isTestingCloud, setIsTestingCloud] = useState(false);
  const [isSyncingCloud, setIsSyncingCloud] = useState(false);
  const [syncCloudMsg, setSyncCloudMsg] = useState("");
  const [copiedSql, setCopiedSql] = useState(false);

  // Check auth session
  useEffect(() => {
    const sessionAuth = sessionStorage.getItem("rh_admin_authenticated");
    if (sessionAuth === "true") {
      setIsAuthenticated(true);
    }
    loadAllData();
  }, []);

  const loadAllData = () => {
    setProjects(dataStore.getProjects());
    setJourneyList(dataStore.getJourney());
    setReviews(dataStore.getReviews());
    setMessages(dataStore.getMessages());
    setSettings(dataStore.getSettings());
  };

  // Subscribe to updates
  useEffect(() => {
    const handleUpdate = () => {
      loadAllData();
    };
    window.addEventListener("rh_data_updated", handleUpdate);
    return () => window.removeEventListener("rh_data_updated", handleUpdate);
  }, []);

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    const correctPass = dataStore.getAdminPassword() || "halima123";
    const entered = passwordInput.trim();
    if (entered === correctPass || entered.toLowerCase() === correctPass.toLowerCase()) {
      sessionStorage.setItem("rh_admin_authenticated", "true");
      setIsAuthenticated(true);
      setAuthError("");
    } else {
      setAuthError("Access Denied: Incorrect Secret Key.");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("rh_admin_authenticated");
    setIsAuthenticated(false);
  };

  // --- Project Actions ---
  const handleOpenAddProject = () => {
    setEditingProject({
      title: "",
      category: "Reels",
      description: "",
      youtubeUrl: "",
      image: "",
      duration: "0:30",
      featured: true
    });
    setIsProjectModalOpen(true);
  };

  const handleOpenEditProject = (p: Project) => {
    setEditingProject({ ...p });
    setIsProjectModalOpen(true);
  };

  const handleSaveProject = (e: FormEvent) => {
    e.preventDefault();
    if (!editingProject?.title) return;

    let img = editingProject.image;
    // Auto generate thumbnail if empty and YouTube URL provided
    if (!img && editingProject.youtubeUrl) {
      const yid = getYouTubeId(editingProject.youtubeUrl);
      if (yid) {
        img = `https://img.youtube.com/vi/${yid}/maxresdefault.jpg`;
      }
    }

    dataStore.saveProject({
      ...editingProject,
      image: img || "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=800&auto=format&fit=crop"
    });

    setIsProjectModalOpen(false);
    setEditingProject(null);
  };

  const handleDeleteProject = (id: number | string) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      dataStore.deleteProject(id);
    }
  };

  // --- Journey Actions ---
  const handleOpenAddJourney = () => {
    setEditingJourney({
      year: "Present",
      role: "",
      company: "",
      description: ""
    });
    setIsJourneyModalOpen(true);
  };

  const handleOpenEditJourney = (item: JourneyItem) => {
    setEditingJourney({ ...item });
    setIsJourneyModalOpen(true);
  };

  const handleSaveJourney = (e: FormEvent) => {
    e.preventDefault();
    if (!editingJourney?.role || !editingJourney?.company) {
      alert("Please fill in role and company name.");
      return;
    }

    dataStore.saveJourneyItem(editingJourney);
    setIsJourneyModalOpen(false);
    setEditingJourney(null);
  };

  const handleDeleteJourney = (id: number | string) => {
    if (window.confirm("Are you sure you want to delete this career milestone?")) {
      dataStore.deleteJourneyItem(id);
    }
  };

  // --- Review Actions ---
  const handleOpenAddReview = () => {
    setEditingReview({
      client: "",
      role: "Content Creator",
      content: "",
      youtubeUrl: "",
      thumbnail: "",
      rating: 5
    });
    setIsReviewModalOpen(true);
  };

  const handleOpenEditReview = (r: ClientReview) => {
    setEditingReview({ ...r });
    setIsReviewModalOpen(true);
  };

  const handleSaveReview = (e: FormEvent) => {
    e.preventDefault();
    if (!editingReview?.client) return;

    dataStore.saveReview(editingReview);
    setIsReviewModalOpen(false);
    setEditingReview(null);
  };

  const handleDeleteReview = (id: number | string) => {
    if (window.confirm("Delete this review?")) {
      dataStore.deleteReview(id);
    }
  };

  // --- Settings Actions ---
  const handleSaveSettings = (e: FormEvent) => {
    e.preventDefault();
    dataStore.saveSettings(settings);
    alert("Profile & Site Settings saved successfully!");
  };

  const handleChangePassword = (e: FormEvent) => {
    e.preventDefault();
    if (!newPassword.trim()) return;
    dataStore.setAdminPassword(newPassword.trim());
    setPassSuccessMsg("Admin Password updated successfully!");
    setNewPassword("");
    setTimeout(() => setPassSuccessMsg(""), 4000);
  };

  // --- Cloud Database Handlers ---
  const handleSaveCloudConfig = (e: FormEvent) => {
    e.preventDefault();
    cloudStore.saveConfig(cloudConfig);
    alert("Cloud Database configuration saved!");
  };

  const handleTestCloudConnection = async () => {
    const saved = cloudStore.saveConfig(cloudConfig);
    setCloudConfig(saved);
    setIsTestingCloud(true);
    setTestCloudResult(null);
    const res = await cloudStore.testConnection(saved.supabaseUrl, saved.supabaseAnonKey);
    setIsTestingCloud(false);
    setTestCloudResult(res);
  };

  const handlePushAllToCloud = async () => {
    const saved = cloudStore.saveConfig(cloudConfig);
    setCloudConfig(saved);
    setIsSyncingCloud(true);
    setSyncCloudMsg("");
    const res = await dataStore.syncAllToCloud();
    setIsSyncingCloud(false);
    setSyncCloudMsg(res.message);
    if (res.success) {
      setCloudConfig(cloudStore.getConfig());
    }
  };

  const handlePullFromCloud = async () => {
    setIsSyncingCloud(true);
    setSyncCloudMsg("");
    const ok = await dataStore.loadFromCloud();
    setIsSyncingCloud(false);
    if (ok) {
      loadAllData();
      setSyncCloudMsg("Successfully loaded fresh live data from Cloud Database! 🟢");
    } else {
      setSyncCloudMsg("Failed to load from Cloud Database. Check credentials.");
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SETUP);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  const handleExportData = () => {
    const fullData = {
      projects: dataStore.getProjects(),
      journey: dataStore.getJourney(),
      reviews: dataStore.getReviews(),
      messages: dataStore.getMessages(),
      settings: dataStore.getSettings()
    };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(fullData, null, 2))}`;
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", jsonString);
    downloadAnchor.setAttribute("download", `rehman_hridoy_portfolio_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleResetData = () => {
    if (window.confirm("CRITICAL WARNING: This will reset all projects, reviews, and settings back to their defaults. Continue?")) {
      dataStore.resetAllToDefault();
      alert("All data reset to default successfully!");
    }
  };

  // Filtered Projects for List
  const filteredProjects = projects.filter(p => {
    const matchesCat = projectCategoryFilter === "All" || p.category === projectCategoryFilter;
    const matchesSearch = p.title.toLowerCase().includes(projectSearch.toLowerCase()) ||
                          p.description.toLowerCase().includes(projectSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const unreadMessagesCount = messages.filter(m => !m.read).length;

  // --- LOGIN SCREEN ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center px-6 py-20 text-text-pure relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[150px] pointer-events-none" />

        <div className="max-w-md w-full bg-secondary/80 backdrop-blur-2xl p-8 sm:p-10 rounded-[32px] border border-accent/20 glow-md shadow-2xl relative z-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center text-primary mx-auto mb-4 glow-md">
              <ShieldCheck size={32} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-text-pure tracking-tight">
              Admin Gateway
            </h1>
            <p className="text-xs text-text-muted mt-2 tracking-widest uppercase font-bold">
              Rehman Hridoy Portfolio
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="text-[10px] font-bold text-accent uppercase tracking-[0.3em] block mb-2">
                Secret Access Key
              </label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Enter admin password..."
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full bg-primary/80 border border-white/10 rounded-xl pl-5 pr-12 py-4 focus:outline-none focus:border-accent text-text-pure placeholder:text-text-muted text-sm transition-all"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-accent transition-colors p-1"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {authError && (
              <p className="text-red-400 text-xs font-semibold bg-red-500/10 p-3 rounded-lg border border-red-500/20 text-center">
                {authError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-4 bg-accent hover:bg-accent-hover text-primary font-bold rounded-xl transition-all duration-300 glow-sm hover:glow-md uppercase tracking-widest text-xs flex items-center justify-center gap-2"
            >
              Unlock Dashboard
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <Link to="/" className="inline-flex items-center gap-2 text-xs text-text-soft hover:text-accent transition-colors">
              <ArrowLeft size={14} /> Back to Live Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // --- ADMIN DASHBOARD INTERFACE ---
  return (
    <div className="min-h-screen bg-primary text-text-pure flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-secondary/80 border-r border-white/10 p-6 flex flex-col justify-between shrink-0">
        <div>
          {/* Brand */}
          <div className="flex items-center gap-3 mb-10 pb-6 border-b border-white/10">
            <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-primary font-bold glow-sm">
              <Play size={20} fill="currentColor" />
            </div>
            <div>
              <h2 className="font-display font-bold text-sm tracking-tight">REHMAN HRIDOY</h2>
              <p className="text-[9px] text-accent font-bold uppercase tracking-widest">Admin Control</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === "dashboard"
                  ? "bg-accent text-primary glow-sm"
                  : "text-text-muted hover:text-text-pure hover:bg-white/5"
              }`}
            >
              <LayoutDashboard size={18} /> Overview
            </button>

            <button
              onClick={() => setActiveTab("projects")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all justify-between ${
                activeTab === "projects"
                  ? "bg-accent text-primary glow-sm"
                  : "text-text-muted hover:text-text-pure hover:bg-white/5"
              }`}
            >
              <span className="flex items-center gap-3">
                <Film size={18} /> Projects
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${activeTab === 'projects' ? 'bg-primary/30 text-primary' : 'bg-white/10 text-text-soft'}`}>
                {projects.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("journey")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all justify-between ${
                activeTab === "journey"
                  ? "bg-accent text-primary glow-sm"
                  : "text-text-muted hover:text-text-pure hover:bg-white/5"
              }`}
            >
              <span className="flex items-center gap-3">
                <Briefcase size={18} /> Career Journey
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${activeTab === 'journey' ? 'bg-primary/30 text-primary' : 'bg-white/10 text-text-soft'}`}>
                {journeyList.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("reviews")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all justify-between ${
                activeTab === "reviews"
                  ? "bg-accent text-primary glow-sm"
                  : "text-text-muted hover:text-text-pure hover:bg-white/5"
              }`}
            >
              <span className="flex items-center gap-3">
                <Video size={18} /> Video Reviews
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${activeTab === 'reviews' ? 'bg-primary/30 text-primary' : 'bg-white/10 text-text-soft'}`}>
                {reviews.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("messages")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all justify-between ${
                activeTab === "messages"
                  ? "bg-accent text-primary glow-sm"
                  : "text-text-muted hover:text-text-pure hover:bg-white/5"
              }`}
            >
              <span className="flex items-center gap-3">
                <MessageSquare size={18} /> Messages
              </span>
              {unreadMessagesCount > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                  {unreadMessagesCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === "settings"
                  ? "bg-accent text-primary glow-sm"
                  : "text-text-muted hover:text-text-pure hover:bg-white/5"
              }`}
            >
              <Settings size={18} /> Site Settings
            </button>
          </nav>
        </div>

        <div className="pt-6 border-t border-white/10 space-y-3">
          <Link
            to="/"
            target="_blank"
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-text-soft hover:text-accent hover:bg-white/5 transition-all"
          >
            <Eye size={16} /> View Live Website <ExternalLink size={12} className="ml-auto" />
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={16} /> Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-text-pure capitalize">
              {activeTab} Management
            </h1>
            <p className="text-xs text-text-muted mt-1">
              Control portfolio items, reviews, messages, and site configuration.
            </p>
          </div>

          {activeTab === "projects" && (
            <button
              onClick={handleOpenAddProject}
              className="px-5 py-2.5 bg-accent hover:bg-accent-hover text-primary font-bold rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 glow-sm transition-all"
            >
              <Plus size={16} /> Add New Project
            </button>
          )}

          {activeTab === "journey" && (
            <button
              onClick={handleOpenAddJourney}
              className="px-5 py-2.5 bg-accent hover:bg-accent-hover text-primary font-bold rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 glow-sm transition-all"
            >
              <Plus size={16} /> Add Career Milestone
            </button>
          )}

          {activeTab === "reviews" && (
            <button
              onClick={handleOpenAddReview}
              className="px-5 py-2.5 bg-accent hover:bg-accent-hover text-primary font-bold rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 glow-sm transition-all"
            >
              <Plus size={16} /> Add Video Review
            </button>
          )}
        </div>

        {/* --- TAB 1: DASHBOARD OVERVIEW --- */}
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-secondary/60 p-6 rounded-2xl border border-white/10 relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Total Projects</span>
                  <Film className="text-accent" size={20} />
                </div>
                <h3 className="text-3xl font-display font-bold text-text-pure">{projects.length}</h3>
                <p className="text-[10px] text-text-soft mt-2">Active in portfolio showcase</p>
              </div>

              <div className="bg-secondary/60 p-6 rounded-2xl border border-white/10 relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Video Reviews</span>
                  <Video className="text-accent" size={20} />
                </div>
                <h3 className="text-3xl font-display font-bold text-text-pure">{reviews.length}</h3>
                <p className="text-[10px] text-text-soft mt-2">Client testimonial clips</p>
              </div>

              <div className="bg-secondary/60 p-6 rounded-2xl border border-white/10 relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Client Messages</span>
                  <MessageSquare className="text-accent" size={20} />
                </div>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-3xl font-display font-bold text-text-pure">{messages.length}</h3>
                  {unreadMessagesCount > 0 && (
                    <span className="text-xs font-bold text-red-400">({unreadMessagesCount} new)</span>
                  )}
                </div>
                <p className="text-[10px] text-text-soft mt-2">Inquiries via contact form</p>
              </div>

              <div className="bg-secondary/60 p-6 rounded-2xl border border-white/10 relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Primary Email</span>
                  <Mail className="text-accent" size={20} />
                </div>
                <h3 className="text-sm font-display font-bold text-text-pure truncate">{settings.email}</h3>
                <p className="text-[10px] text-text-soft mt-2">WhatsApp: {settings.whatsapp}</p>
              </div>
            </div>

            {/* Quick Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-secondary/40 p-6 rounded-2xl border border-white/10 space-y-4">
                <h3 className="text-lg font-display font-bold text-text-pure flex items-center gap-2">
                  <Film className="text-accent" size={20} /> Quick Project Upload
                </h3>
                <p className="text-xs text-text-soft">
                  Easily add new video edits, Reels, or Commercial projects directly to your showcase.
                </p>
                <button
                  onClick={() => { setActiveTab("projects"); handleOpenAddProject(); }}
                  className="px-5 py-3 bg-accent text-primary font-bold rounded-xl text-xs uppercase tracking-wider glow-sm hover:glow-md transition-all flex items-center gap-2"
                >
                  <Plus size={16} /> Add Project Now
                </button>
              </div>

              <div className="bg-secondary/40 p-6 rounded-2xl border border-white/10 space-y-4">
                <h3 className="text-lg font-display font-bold text-text-pure flex items-center gap-2">
                  <MessageSquare className="text-accent" size={20} /> Client Inquiries
                </h3>
                <p className="text-xs text-text-soft">
                  {unreadMessagesCount > 0 
                    ? `You have ${unreadMessagesCount} unread client message(s) waiting for response.`
                    : "No unread client messages at the moment."}
                </p>
                <button
                  onClick={() => setActiveTab("messages")}
                  className="px-5 py-3 bg-white/10 hover:bg-white/20 text-text-pure font-bold rounded-xl text-xs uppercase tracking-wider transition-all flex items-center gap-2"
                >
                  <MessageSquare size={16} /> Check Inbox ({unreadMessagesCount})
                </button>
              </div>
            </div>

            {/* Recent Messages Inbox Preview */}
            <div className="bg-secondary/30 p-6 rounded-2xl border border-white/10 space-y-4">
              <h3 className="text-md font-display font-bold text-text-pure">Recent Messages</h3>
              {messages.length === 0 ? (
                <p className="text-xs text-text-muted italic">No client messages received yet.</p>
              ) : (
                <div className="space-y-3">
                  {messages.slice(0, 3).map((m) => (
                    <div key={m.id} className="p-4 bg-primary/60 rounded-xl border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-text-pure">{m.name}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-accent/10 text-accent font-bold uppercase">{m.ventureNature}</span>
                          {!m.read && <span className="w-2 h-2 rounded-full bg-red-500" />}
                        </div>
                        <p className="text-xs text-text-soft mt-1 line-clamp-1">{m.message}</p>
                      </div>
                      <button
                        onClick={() => setActiveTab("messages")}
                        className="text-xs text-accent font-bold hover:underline shrink-0"
                      >
                        View Details →
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- TAB 2: PROJECTS MANAGER --- */}
        {activeTab === "projects" && (
          <div className="space-y-6">
            {/* Controls Bar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-secondary/30 p-4 rounded-2xl border border-white/10">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                <input 
                  type="text" 
                  placeholder="Search projects..." 
                  value={projectSearch}
                  onChange={(e) => setProjectSearch(e.target.value)}
                  className="w-full bg-primary/60 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs text-text-pure focus:outline-none focus:border-accent"
                />
              </div>

              <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
                {["All", "Reels", "Commercial", "Saas Animation", "Motion Graphics", "Documentary"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setProjectCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      projectCategoryFilter === cat
                        ? "bg-accent text-primary"
                        : "bg-primary/50 text-text-muted hover:text-text-pure"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((p) => {
                const youtubeId = getYouTubeId(p.youtubeUrl);
                const thumb = p.image || (youtubeId ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg` : "");

                return (
                  <div key={p.id} className="bg-secondary/40 rounded-2xl border border-white/10 overflow-hidden flex flex-col justify-between group">
                    <div>
                      <div className="relative aspect-video bg-primary overflow-hidden">
                        <img src={thumb} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <span className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded text-[10px] font-bold text-accent uppercase">
                          {p.category}
                        </span>
                        {p.duration && (
                          <span className="absolute bottom-3 right-3 bg-black/80 px-2 py-0.5 rounded text-[10px] font-mono text-white">
                            {p.duration}
                          </span>
                        )}
                      </div>
                      <div className="p-5">
                        <h4 className="font-display font-bold text-base text-text-pure mb-1">{p.title}</h4>
                        <p className="text-xs text-text-soft line-clamp-2 leading-relaxed mb-3">{p.description}</p>
                        {p.youtubeUrl && (
                          <a 
                            href={p.youtubeUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-[11px] text-accent font-bold hover:underline"
                          >
                            <ExternalLink size={12} /> Watch Video
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="p-4 bg-primary/40 border-t border-white/5 flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEditProject(p)}
                        className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-text-pure rounded-lg text-xs font-bold flex items-center gap-1 transition-all"
                      >
                        <Edit3 size={14} /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProject(p.id)}
                        className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs font-bold flex items-center gap-1 transition-all"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredProjects.length === 0 && (
              <div className="py-16 text-center text-text-muted">
                <p>No projects match your filter criteria.</p>
              </div>
            )}
          </div>
        )}

        {/* --- TAB: CAREER JOURNEY MANAGER --- */}
        {activeTab === "journey" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-secondary/30 p-4 rounded-2xl border border-white/10">
              <div>
                <h3 className="text-sm font-display font-bold text-text-pure">Experience Timeline (The Journey)</h3>
                <p className="text-[11px] text-text-muted">Manage your current and past companies, roles, and years shown on the website.</p>
              </div>
              <button
                onClick={handleOpenAddJourney}
                className="px-4 py-2 bg-accent hover:bg-accent-hover text-primary font-bold rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 glow-sm transition-all shrink-0"
              >
                <Plus size={14} /> Add Milestone
              </button>
            </div>

            <div className="space-y-4">
              {journeyList.map((item) => (
                <div key={item.id} className="bg-secondary/40 p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-accent/30 transition-all">
                  <div className="space-y-2 max-w-3xl">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-accent/20 text-accent font-mono text-xs font-bold rounded-full">
                        {item.year}
                      </span>
                      <h3 className="text-lg font-display font-bold text-text-pure">{item.role}</h3>
                      <span className="text-text-muted text-xs font-bold uppercase tracking-wider">
                        @ {item.company}
                      </span>
                    </div>
                    <p className="text-xs text-text-soft leading-relaxed">{item.description}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    <button
                      onClick={() => handleOpenEditJourney(item)}
                      className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-text-pure rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
                    >
                      <Edit3 size={14} /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteJourney(item.id)}
                      className="px-3.5 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              ))}

              {journeyList.length === 0 && (
                <div className="py-16 text-center text-text-muted bg-secondary/20 rounded-2xl border border-white/5">
                  <p>No career milestones added yet.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- TAB 3: REVIEWS MANAGER --- */}
        {activeTab === "reviews" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.map((r) => (
                <div key={r.id} className="bg-secondary/40 p-6 rounded-2xl border border-white/10 flex flex-col justify-between">
                  <div className="flex gap-4 items-start">
                    <img src={r.thumbnail} alt={r.client} className="w-16 h-24 object-cover rounded-xl border border-white/10 shrink-0" />
                    <div>
                      <h4 className="font-display font-bold text-lg text-text-pure">{r.client}</h4>
                      <p className="text-xs text-accent uppercase tracking-wider font-bold mb-2">{r.role}</p>
                      <p className="text-xs text-text-soft line-clamp-3 italic">"{r.content}"</p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                    <a href={r.youtubeUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-accent font-bold hover:underline flex items-center gap-1">
                      <ExternalLink size={12} /> Play Review
                    </a>
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleOpenEditReview(r)} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-text-pure">
                        <Edit3 size={14} />
                      </button>
                      <button onClick={() => handleDeleteReview(r.id)} className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- TAB 4: MESSAGES INBOX --- */}
        {activeTab === "messages" && (
          <div className="space-y-6">
            <div className="space-y-4">
              {messages.map((m) => (
                <div 
                  key={m.id} 
                  className={`p-6 rounded-2xl border transition-all ${
                    m.read 
                      ? "bg-secondary/30 border-white/5" 
                      : "bg-secondary/80 border-accent/40 shadow-lg"
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <h4 className="font-display font-bold text-lg text-text-pure">{m.name}</h4>
                        <span className="text-[10px] px-3 py-1 rounded-full bg-accent/20 text-accent font-bold uppercase tracking-wider">
                          {m.ventureNature}
                        </span>
                        {!m.read && (
                          <span className="text-[9px] px-2 py-0.5 rounded bg-red-500 text-white font-bold uppercase">
                            NEW
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-text-muted mt-0.5">{m.email} • {new Date(m.createdAt).toLocaleString()}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <a 
                        href={`https://wa.me/880157735667?text=${encodeURIComponent(`Hi ${m.name}, regarding your project inquiry "${m.ventureNature}"...`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-green-600/20 text-green-400 hover:bg-green-600/30 rounded-lg text-xs font-bold flex items-center gap-1.5"
                      >
                        <Phone size={12} /> WhatsApp Reply
                      </a>
                      <a 
                        href={`mailto:${m.email}?subject=${encodeURIComponent(`Project Inquiry - Rehman Hridoy`)}`}
                        className="px-3 py-1.5 bg-accent/20 text-accent hover:bg-accent/30 rounded-lg text-xs font-bold flex items-center gap-1.5"
                      >
                        <Mail size={12} /> Email Reply
                      </a>
                      {!m.read && (
                        <button
                          onClick={() => dataStore.markMessageRead(m.id)}
                          className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-text-pure rounded-lg text-xs font-bold flex items-center gap-1"
                        >
                          <CheckCircle size={12} /> Mark Read
                        </button>
                      )}
                      <button
                        onClick={() => dataStore.deleteMessage(m.id)}
                        className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="p-4 bg-primary/60 rounded-xl border border-white/5 text-xs text-text-soft leading-relaxed whitespace-pre-wrap">
                    {m.message}
                  </div>
                </div>
              ))}

              {messages.length === 0 && (
                <div className="py-16 text-center text-text-muted bg-secondary/20 rounded-2xl border border-white/5">
                  <p className="text-sm">Inbox is completely clean! No messages received yet.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- TAB 5: SITE SETTINGS & BACKUP --- */}
        {activeTab === "settings" && (
          <div className="space-y-10 max-w-4xl">
            {/* Profile Info Form */}
            <form onSubmit={handleSaveSettings} className="bg-secondary/40 p-8 rounded-2xl border border-white/10 space-y-6">
              <h3 className="text-lg font-display font-bold text-text-pure border-b border-white/10 pb-4 flex items-center gap-2">
                <User className="text-accent" size={20} /> Contact & Profile Configuration
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-bold text-accent uppercase tracking-widest block mb-2">Display Name</label>
                  <input 
                    type="text" 
                    value={settings.name} 
                    onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                    className="w-full bg-primary/60 border border-white/10 rounded-xl px-4 py-3 text-xs text-text-pure"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-accent uppercase tracking-widest block mb-2">Professional Title</label>
                  <input 
                    type="text" 
                    value={settings.title} 
                    onChange={(e) => setSettings({ ...settings, title: e.target.value })}
                    className="w-full bg-primary/60 border border-white/10 rounded-xl px-4 py-3 text-xs text-text-pure"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-accent uppercase tracking-widest block mb-2">Direct Email Address</label>
                  <input 
                    type="email" 
                    value={settings.email} 
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    className="w-full bg-primary/60 border border-white/10 rounded-xl px-4 py-3 text-xs text-text-pure"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-accent uppercase tracking-widest block mb-2">WhatsApp Number</label>
                  <input 
                    type="text" 
                    value={settings.whatsapp} 
                    onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                    className="w-full bg-primary/60 border border-white/10 rounded-xl px-4 py-3 text-xs text-text-pure"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-accent uppercase tracking-widest block mb-2">Instagram URL</label>
                  <input 
                    type="text" 
                    value={settings.instagram} 
                    onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
                    className="w-full bg-primary/60 border border-white/10 rounded-xl px-4 py-3 text-xs text-text-pure"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-accent uppercase tracking-widest block mb-2">Facebook URL</label>
                  <input 
                    type="text" 
                    value={settings.facebook} 
                    onChange={(e) => setSettings({ ...settings, facebook: e.target.value })}
                    className="w-full bg-primary/60 border border-white/10 rounded-xl px-4 py-3 text-xs text-text-pure"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-accent uppercase tracking-widest block mb-2">Hero Tagline</label>
                <input 
                  type="text" 
                  value={settings.tagline} 
                  onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                  className="w-full bg-primary/60 border border-white/10 rounded-xl px-4 py-3 text-xs text-text-pure"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1">Years Exp.</label>
                  <input 
                    type="text" 
                    value={settings.yearsExperience} 
                    onChange={(e) => setSettings({ ...settings, yearsExperience: e.target.value })}
                    className="w-full bg-primary/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-text-pure text-center"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1">Projects Done</label>
                  <input 
                    type="text" 
                    value={settings.projectsCompleted} 
                    onChange={(e) => setSettings({ ...settings, projectsCompleted: e.target.value })}
                    className="w-full bg-primary/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-text-pure text-center"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-1">Happy Clients</label>
                  <input 
                    type="text" 
                    value={settings.happyClients} 
                    onChange={(e) => setSettings({ ...settings, happyClients: e.target.value })}
                    className="w-full bg-primary/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-text-pure text-center"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-3 bg-accent text-primary font-bold rounded-xl text-xs uppercase tracking-wider glow-sm hover:glow-md transition-all"
              >
                Save Site Settings
              </button>
            </form>

            {/* --- GLOBAL CLOUD DATABASE (SUPABASE) CARD --- */}
            <div className="bg-secondary/40 p-8 rounded-2xl border border-accent/30 space-y-6 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-accent">
                    <Database size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-display font-bold text-text-pure flex items-center gap-2">
                      Global Cloud Database Sync (Supabase)
                    </h3>
                    <p className="text-xs text-text-muted">Sync changes worldwide so all visitors on any device see your live updates in real time.</p>
                  </div>
                </div>

                <div className="shrink-0">
                  {cloudStore.isConfigured() ? (
                    <span className="px-3 py-1.5 bg-green-500/10 border border-green-500/30 text-green-400 rounded-full text-xs font-bold flex items-center gap-1.5">
                      <Cloud size={14} /> Cloud Sync Active
                    </span>
                  ) : (
                    <span className="px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 rounded-full text-xs font-bold flex items-center gap-1.5">
                      <CloudOff size={14} /> Local Storage Mode
                    </span>
                  )}
                </div>
              </div>

              {/* Cloud Config Form */}
              <form onSubmit={handleSaveCloudConfig} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-accent uppercase tracking-widest block mb-1.5">
                      Supabase Project URL
                    </label>
                    <input 
                      type="text" 
                      placeholder="https://xyzproject.supabase.co"
                      value={cloudConfig.supabaseUrl}
                      onChange={(e) => setCloudConfig({ ...cloudConfig, supabaseUrl: e.target.value.trim() })}
                      className="w-full bg-primary/60 border border-white/10 rounded-xl px-4 py-3 text-xs text-text-pure"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-accent uppercase tracking-widest block mb-1.5">
                      Supabase Anon (Public) Key
                    </label>
                    <input 
                      type="password" 
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                      value={cloudConfig.supabaseAnonKey}
                      onChange={(e) => setCloudConfig({ ...cloudConfig, supabaseAnonKey: e.target.value.trim() })}
                      className="w-full bg-primary/60 border border-white/10 rounded-xl px-4 py-3 text-xs text-text-pure"
                    />
                  </div>
                </div>

                {/* Cloud Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-accent text-primary font-bold rounded-xl text-xs uppercase tracking-wider glow-sm hover:glow-md transition-all"
                  >
                    Save Cloud Credentials
                  </button>

                  <button
                    type="button"
                    onClick={handleTestCloudConnection}
                    disabled={isTestingCloud}
                    className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-text-pure font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all"
                  >
                    <RefreshCw size={14} className={isTestingCloud ? "animate-spin" : ""} />
                    {isTestingCloud ? "Testing..." : "Test Cloud Connection"}
                  </button>

                  <button
                    type="button"
                    onClick={handlePushAllToCloud}
                    disabled={isSyncingCloud}
                    className="px-4 py-2.5 bg-green-600/20 hover:bg-green-600/30 text-green-400 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all"
                  >
                    <Upload size={14} />
                    {isSyncingCloud ? "Syncing..." : "Push All Data to Cloud DB"}
                  </button>

                  <button
                    type="button"
                    onClick={handlePullFromCloud}
                    disabled={isSyncingCloud}
                    className="px-4 py-2.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all"
                  >
                    <Download size={14} />
                    Pull Data from Cloud
                  </button>
                </div>
              </form>

              {/* Status Message Display */}
              {testCloudResult && (
                <div className={`p-4 rounded-xl text-xs font-semibold border ${
                  testCloudResult.success 
                    ? "bg-green-500/10 text-green-400 border-green-500/30" 
                    : "bg-red-500/10 text-red-400 border-red-500/30"
                }`}>
                  {testCloudResult.message}
                </div>
              )}

              {syncCloudMsg && (
                <div className="p-4 rounded-xl text-xs font-semibold bg-accent/10 text-accent border border-accent/20">
                  {syncCloudMsg}
                </div>
              )}

              {/* 2-Minute Quick Setup Guide & SQL */}
              <div className="p-5 bg-primary/60 rounded-xl border border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-text-pure">📖 2-Minute Free Supabase Setup Guide:</span>
                  <button
                    type="button"
                    onClick={handleCopySql}
                    className="px-3 py-1.5 bg-accent/20 hover:bg-accent/30 text-accent rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all"
                  >
                    {copiedSql ? <Check size={12} /> : <Copy size={12} />}
                    {copiedSql ? "SQL Copied!" : "Copy Supabase SQL Script"}
                  </button>
                </div>

                <ol className="text-xs text-text-soft space-y-1.5 list-decimal list-inside leading-relaxed">
                  <li>Go to <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-accent underline font-bold">supabase.com</a> and sign up for free (takes 1 minute).</li>
                  <li>Click <strong>New Project</strong> and enter a project name (e.g. <code>rehman-portfolio</code>).</li>
                  <li>In your Supabase dashboard, click <strong>SQL Editor</strong> on the left menu, paste the copied SQL script above, and click <strong>Run</strong>.</li>
                  <li>Go to <strong>Project Settings ➔ API</strong>, copy the <code>Project URL</code> and <code>anon public key</code>, paste them above, and click <strong>Save & Push All Data</strong>!</li>
                </ol>
              </div>
            </div>

            {/* Change Admin Password */}
            <form onSubmit={handleChangePassword} className="bg-secondary/40 p-8 rounded-2xl border border-white/10 space-y-4">
              <h3 className="text-lg font-display font-bold text-text-pure flex items-center gap-2">
                <ShieldCheck className="text-accent" size={20} /> Security & Password
              </h3>
              <p className="text-xs text-text-soft">Change the secret password required to access this admin panel.</p>

              <div className="max-w-md space-y-3">
                <input 
                  type="password" 
                  placeholder="Enter new admin password..." 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-primary/60 border border-white/10 rounded-xl px-4 py-3 text-xs text-text-pure"
                />
                {passSuccessMsg && (
                  <p className="text-xs text-green-400 font-bold bg-green-500/10 p-3 rounded-lg border border-green-500/20">{passSuccessMsg}</p>
                )}
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-text-pure font-bold rounded-xl text-xs uppercase tracking-wider"
                >
                  Update Password
                </button>
              </div>
            </form>

            {/* Backup & Reset */}
            <div className="bg-secondary/40 p-8 rounded-2xl border border-white/10 space-y-4">
              <h3 className="text-lg font-display font-bold text-text-pure flex items-center gap-2">
                <RefreshCw className="text-accent" size={20} /> Data Backup & Factory Reset
              </h3>
              <p className="text-xs text-text-soft">Download a complete JSON snapshot of your portfolio data or reset back to default setup.</p>

              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  onClick={handleExportData}
                  className="px-5 py-3 bg-accent/20 hover:bg-accent/30 text-accent font-bold rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 transition-all"
                >
                  <Download size={16} /> Download Backup Snapshot (JSON)
                </button>

                <button
                  onClick={handleResetData}
                  className="px-5 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 transition-all"
                >
                  <RefreshCw size={16} /> Factory Reset All Data
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* --- PROJECT MODAL --- */}
      {isProjectModalOpen && editingProject && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-secondary p-8 rounded-3xl border border-accent/20 max-w-lg w-full space-y-6 my-8">
            <h3 className="text-xl font-display font-bold text-text-pure">
              {editingProject.id ? "Edit Project" : "Add New Project"}
            </h3>

            <form onSubmit={handleSaveProject} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-accent uppercase tracking-wider block mb-1">Project Title</label>
                <input 
                  type="text" 
                  required 
                  value={editingProject.title || ""} 
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                  placeholder="e.g. Cinematic Realstate Video"
                  className="w-full bg-primary border border-white/10 rounded-xl px-4 py-2.5 text-xs text-text-pure"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-accent uppercase tracking-wider block mb-1">Category</label>
                  <select
                    value={editingProject.category || "Reels"}
                    onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                    className="w-full bg-primary border border-white/10 rounded-xl px-4 py-2.5 text-xs text-text-pure"
                  >
                    <option value="Reels">Reels</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Saas Animation">Saas Animation</option>
                    <option value="Motion Graphics">Motion Graphics</option>
                    <option value="Documentary">Documentary</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-accent uppercase tracking-wider block mb-1">Duration</label>
                  <input 
                    type="text" 
                    value={editingProject.duration || "0:30"} 
                    onChange={(e) => setEditingProject({ ...editingProject, duration: e.target.value })}
                    placeholder="e.g. 0:45 or 2:15"
                    className="w-full bg-primary border border-white/10 rounded-xl px-4 py-2.5 text-xs text-text-pure"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-accent uppercase tracking-wider block mb-1">YouTube Link / Embed URL</label>
                <input 
                  type="text" 
                  value={editingProject.youtubeUrl || ""} 
                  onChange={(e) => setEditingProject({ ...editingProject, youtubeUrl: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full bg-primary border border-white/10 rounded-xl px-4 py-2.5 text-xs text-text-pure"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-accent uppercase tracking-wider block mb-1">Thumbnail Image URL (Optional)</label>
                <input 
                  type="text" 
                  value={editingProject.image || ""} 
                  onChange={(e) => setEditingProject({ ...editingProject, image: e.target.value })}
                  placeholder="Leave blank to auto-use YouTube thumbnail"
                  className="w-full bg-primary border border-white/10 rounded-xl px-4 py-2.5 text-xs text-text-pure"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-accent uppercase tracking-wider block mb-1">Short Description</label>
                <textarea 
                  rows={3} 
                  value={editingProject.description || ""} 
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  placeholder="Describe key editing highlights..."
                  className="w-full bg-primary border border-white/10 rounded-xl px-4 py-2.5 text-xs text-text-pure resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsProjectModalOpen(false)}
                  className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-text-pure rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-accent text-primary font-bold rounded-xl text-xs uppercase tracking-wider"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- JOURNEY MODAL --- */}
      {isJourneyModalOpen && editingJourney && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-secondary p-8 rounded-3xl border border-accent/20 max-w-lg w-full space-y-6 my-8">
            <h3 className="text-xl font-display font-bold text-text-pure">
              {editingJourney.id ? "Edit Career Milestone" : "Add Career Milestone"}
            </h3>

            <form onSubmit={handleSaveJourney} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-accent uppercase tracking-wider block mb-1">Time / Year</label>
                  <input 
                    type="text" 
                    required 
                    value={editingJourney.year || ""} 
                    onChange={(e) => setEditingJourney({ ...editingJourney, year: e.target.value })}
                    placeholder="e.g. Present, 2025, or 2023 - 2024"
                    className="w-full bg-primary border border-white/10 rounded-xl px-4 py-2.5 text-xs text-text-pure"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-accent uppercase tracking-wider block mb-1">Company / Studio</label>
                  <input 
                    type="text" 
                    required 
                    value={editingJourney.company || ""} 
                    onChange={(e) => setEditingJourney({ ...editingJourney, company: e.target.value })}
                    placeholder="e.g. Srizonshil or D Studio"
                    className="w-full bg-primary border border-white/10 rounded-xl px-4 py-2.5 text-xs text-text-pure"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-accent uppercase tracking-wider block mb-1">Role / Designation</label>
                <input 
                  type="text" 
                  required 
                  value={editingJourney.role || ""} 
                  onChange={(e) => setEditingJourney({ ...editingJourney, role: e.target.value })}
                  placeholder="e.g. SR. VIDEO EDITOR or CREATIVE DIRECTOR"
                  className="w-full bg-primary border border-white/10 rounded-xl px-4 py-2.5 text-xs text-text-pure"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-accent uppercase tracking-wider block mb-1">Description / Responsibilities</label>
                <textarea 
                  rows={3} 
                  value={editingJourney.description || ""} 
                  onChange={(e) => setEditingJourney({ ...editingJourney, description: e.target.value })}
                  placeholder="Describe key editing highlights, campaigns, or contributions..."
                  className="w-full bg-primary border border-white/10 rounded-xl px-4 py-2.5 text-xs text-text-pure resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsJourneyModalOpen(false)}
                  className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-text-pure rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-accent text-primary font-bold rounded-xl text-xs uppercase tracking-wider"
                >
                  Save Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- REVIEW MODAL --- */}
      {isReviewModalOpen && editingReview && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-secondary p-8 rounded-3xl border border-accent/20 max-w-lg w-full space-y-6 my-8">
            <h3 className="text-xl font-display font-bold text-text-pure">
              {editingReview.id ? "Edit Video Review" : "Add Video Review"}
            </h3>

            <form onSubmit={handleSaveReview} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-accent uppercase tracking-wider block mb-1">Client Name / Brand</label>
                <input 
                  type="text" 
                  required 
                  value={editingReview.client || ""} 
                  onChange={(e) => setEditingReview({ ...editingReview, client: e.target.value })}
                  placeholder="e.g. Marcus Chen"
                  className="w-full bg-primary border border-white/10 rounded-xl px-4 py-2.5 text-xs text-text-pure"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-accent uppercase tracking-wider block mb-1">Client Role / Title</label>
                <input 
                  type="text" 
                  value={editingReview.role || ""} 
                  onChange={(e) => setEditingReview({ ...editingReview, role: e.target.value })}
                  placeholder="e.g. Head Chef or Content Creator"
                  className="w-full bg-primary border border-white/10 rounded-xl px-4 py-2.5 text-xs text-text-pure"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-accent uppercase tracking-wider block mb-1">YouTube Video Link</label>
                <input 
                  type="text" 
                  value={editingReview.youtubeUrl || ""} 
                  onChange={(e) => setEditingReview({ ...editingReview, youtubeUrl: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full bg-primary border border-white/10 rounded-xl px-4 py-2.5 text-xs text-text-pure"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-accent uppercase tracking-wider block mb-1">Thumbnail Image URL</label>
                <input 
                  type="text" 
                  value={editingReview.thumbnail || ""} 
                  onChange={(e) => setEditingReview({ ...editingReview, thumbnail: e.target.value })}
                  placeholder="Image URL..."
                  className="w-full bg-primary border border-white/10 rounded-xl px-4 py-2.5 text-xs text-text-pure"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-accent uppercase tracking-wider block mb-1">Review Quote / Content</label>
                <textarea 
                  rows={3} 
                  value={editingReview.content || ""} 
                  onChange={(e) => setEditingReview({ ...editingReview, content: e.target.value })}
                  placeholder="Client feedback excerpt..."
                  className="w-full bg-primary border border-white/10 rounded-xl px-4 py-2.5 text-xs text-text-pure resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-text-pure rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-accent text-primary font-bold rounded-xl text-xs uppercase tracking-wider"
                >
                  Save Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
