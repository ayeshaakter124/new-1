import React, { useState } from "react";
import {
  Film,
  Plus,
  Edit3,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  Star,
  Search,
  ExternalLink,
  Play,
  CheckCircle2
} from "lucide-react";
import { cmsStore } from "../../lib/cmsStore";
import { ProjectItem } from "../../lib/cmsTypes";
import { FormInput, FormTextarea, FormSelect, FormToggle, ImagePreviewInput } from "../components/FormComponents";
import { ConfirmModal } from "../components/ConfirmModal";

interface ProjectManagerProps {
  onAddToast: (type: "success" | "error" | "warning" | "info", message: string) => void;
}

const CATEGORY_OPTIONS = [
  { label: "Reels / Shorts (9:16)", value: "Reels" },
  { label: "Commercial Ads (16:9)", value: "Commercial" },
  { label: "SaaS & UI Animation", value: "Saas Animation" },
  { label: "Motion Graphics", value: "Motion Graphics" },
  { label: "Documentary Film", value: "Documentary" },
];

export function ProjectManager({ onAddToast }: ProjectManagerProps) {
  const [projects, setProjects] = useState<ProjectItem[]>(() => cmsStore.getProjects());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Partial<ProjectItem> | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [softwareTagInput, setSoftwareTagInput] = useState("");

  const handleOpenModal = (project?: ProjectItem) => {
    if (project) {
      setEditingProject({ ...project });
    } else {
      setEditingProject({
        title: "",
        category: "Reels",
        thumbnail: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=800&auto=format&fit=crop",
        youtubeUrl: "",
        description: "",
        duration: "0:30",
        softwareUsed: ["Premiere Pro", "After Effects"],
        featured: true,
        published: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject?.title || !editingProject?.youtubeUrl) {
      onAddToast("warning", "Please provide a Project Title and Video URL.");
      return;
    }

    const updated = cmsStore.saveProject(editingProject);
    setProjects(updated);
    setIsModalOpen(false);
    setEditingProject(null);
    onAddToast("success", "Project saved successfully! 🚀");
  };

  const handleDelete = () => {
    if (!deleteTargetId) return;
    const updated = cmsStore.deleteProject(deleteTargetId);
    setProjects(updated);
    setDeleteTargetId(null);
    onAddToast("success", "Project deleted successfully.");
  };

  const handleDuplicate = (project: ProjectItem) => {
    const duplicated: Partial<ProjectItem> = {
      ...project,
      id: undefined,
      title: `${project.title} (Copy)`,
      slug: `${project.slug}-copy`,
    };
    const updated = cmsStore.saveProject(duplicated);
    setProjects(updated);
    onAddToast("success", "Project duplicated successfully! 📋");
  };

  const handleTogglePublish = (project: ProjectItem) => {
    const updated = cmsStore.saveProject({
      ...project,
      published: !project.published,
    });
    setProjects(updated);
    onAddToast("info", `Project marked as ${!project.published ? "Published" : "Draft"}.`);
  };

  const handleToggleFeatured = (project: ProjectItem) => {
    const updated = cmsStore.saveProject({
      ...project,
      featured: !project.featured,
    });
    setProjects(updated);
    onAddToast("info", `Project featured status updated.`);
  };

  const handleAddSoftwareTag = () => {
    if (!softwareTagInput.trim()) return;
    const current = editingProject?.softwareUsed || [];
    if (current.includes(softwareTagInput.trim())) return;
    setEditingProject({
      ...editingProject,
      softwareUsed: [...current, softwareTagInput.trim()],
    });
    setSoftwareTagInput("");
  };

  const handleRemoveSoftwareTag = (tag: string) => {
    const current = editingProject?.softwareUsed || [];
    setEditingProject({
      ...editingProject,
      softwareUsed: current.filter(t => t !== tag),
    });
  };

  const filteredProjects = projects.filter((p) => {
    const matchCat = selectedCategory === "All" || p.category === selectedCategory;
    const matchSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-secondary/60 border border-white/10">
        <div>
          <h2 className="text-lg font-display font-bold text-text-pure flex items-center gap-2">
            <Film size={20} className="text-accent" /> Portfolio Projects Management
          </h2>
          <p className="text-xs text-text-soft mt-0.5">
            Total Projects: {projects.length} • Published: {projects.filter(p => p.published).length}
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="px-5 py-3 rounded-2xl bg-accent hover:bg-accent-hover text-primary font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-accent/20 transition-all shrink-0"
        >
          <Plus size={16} /> Add New Project
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-secondary/40 p-4 rounded-2xl border border-white/10">
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-primary/60 border border-white/10 focus:border-accent rounded-xl pl-10 pr-4 py-2.5 text-xs text-text-pure focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {["All", "Reels", "Commercial", "Saas Animation", "Motion Graphics", "Documentary"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? "bg-accent text-primary"
                  : "bg-white/5 hover:bg-white/10 text-text-soft"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((p) => (
          <div
            key={p.id}
            className="rounded-3xl bg-secondary/40 border border-white/10 hover:border-accent/30 transition-all overflow-hidden flex flex-col group shadow-lg"
          >
            {/* Thumbnail Header */}
            <div className={`relative w-full ${p.category === "Reels" ? "aspect-[9/16]" : "aspect-video"} bg-primary/80 overflow-hidden`}>
              <img
                src={p.thumbnail}
                alt={p.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=800&auto=format&fit=crop";
                }}
              />

              {/* Status Badges */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5">
                <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-bold text-accent uppercase tracking-wider border border-white/10">
                  {p.category}
                </span>
                {p.featured && (
                  <span className="p-1 rounded-full bg-accent text-primary" title="Featured Project">
                    <Star size={12} fill="currentColor" />
                  </span>
                )}
              </div>

              <div className="absolute top-3 right-3">
                <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase ${
                  p.published ? "bg-green-500/80 text-white" : "bg-amber-500/80 text-primary"
                }`}>
                  {p.published ? "Published" : "Draft"}
                </span>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-1.5">
                <h3 className="text-base font-display font-bold text-text-pure line-clamp-1 group-hover:text-accent transition-colors">
                  {p.title}
                </h3>
                <p className="text-xs text-text-soft line-clamp-2 leading-relaxed">
                  {p.description}
                </p>

                {p.softwareUsed && p.softwareUsed.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {p.softwareUsed.map((s) => (
                      <span key={s} className="text-[9px] px-2 py-0.5 rounded bg-white/5 text-text-muted font-mono">
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Card Actions */}
              <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleTogglePublish(p)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-text-soft"
                    title={p.published ? "Unpublish (Make Draft)" : "Publish"}
                  >
                    {p.published ? <Eye size={15} /> : <EyeOff size={15} />}
                  </button>
                  <button
                    onClick={() => handleToggleFeatured(p)}
                    className={`p-2 rounded-xl hover:bg-white/10 ${p.featured ? "text-accent bg-accent/15" : "text-text-muted bg-white/5"}`}
                    title="Toggle Featured"
                  >
                    <Star size={15} fill={p.featured ? "currentColor" : "none"} />
                  </button>
                  <button
                    onClick={() => handleDuplicate(p)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-text-soft"
                    title="Duplicate Project"
                  >
                    <Copy size={15} />
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenModal(p)}
                    className="p-2 rounded-xl bg-accent/20 hover:bg-accent/30 text-accent font-bold"
                    title="Edit Project"
                  >
                    <Edit3 size={15} />
                  </button>
                  <button
                    onClick={() => setDeleteTargetId(p.id)}
                    className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400"
                    title="Delete Project"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="py-20 text-center text-text-muted bg-secondary/20 rounded-3xl border border-white/5 space-y-3">
          <Film size={36} className="mx-auto text-text-muted/40" />
          <p className="text-sm font-medium">No projects match the current filter.</p>
        </div>
      )}

      {/* Add / Edit Project Modal */}
      {isModalOpen && editingProject && (
        <div className="fixed inset-0 z-[120] bg-primary/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto custom-scrollbar animate-fadeIn">
          <div className="bg-secondary p-6 sm:p-8 rounded-3xl border border-white/10 max-w-2xl w-full shadow-2xl space-y-6 my-8">
            <h3 className="text-lg font-display font-bold text-text-pure">
              {editingProject.id ? "Edit Portfolio Project" : "Create New Portfolio Project"}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput
                  label="Project Title"
                  required
                  placeholder="e.g. Luxury Real Estate Commercial"
                  value={editingProject.title || ""}
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                />

                <FormSelect
                  label="Category"
                  options={CATEGORY_OPTIONS}
                  value={editingProject.category || "Reels"}
                  onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value as any })}
                />
              </div>

              <ImagePreviewInput
                label="Thumbnail URL"
                value={editingProject.thumbnail || ""}
                onChange={(url) => setEditingProject({ ...editingProject, thumbnail: url })}
                aspect={editingProject.category === "Reels" ? "reel" : "video"}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput
                  label="Video Stream URL (YouTube/Vimeo/Direct)"
                  required
                  placeholder="https://www.youtube.com/watch?v=... or embed URL"
                  value={editingProject.youtubeUrl || ""}
                  onChange={(e) => setEditingProject({ ...editingProject, youtubeUrl: e.target.value })}
                />

                <FormInput
                  label="Duration Badge"
                  placeholder="e.g. 0:30, 2:15"
                  value={editingProject.duration || ""}
                  onChange={(e) => setEditingProject({ ...editingProject, duration: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput
                  label="Client Name"
                  placeholder="e.g. TechVibe Global"
                  value={editingProject.clientName || ""}
                  onChange={(e) => setEditingProject({ ...editingProject, clientName: e.target.value })}
                />

                <FormInput
                  label="Your Role on Project"
                  placeholder="e.g. Lead Video Editor & Colorist"
                  value={editingProject.role || ""}
                  onChange={(e) => setEditingProject({ ...editingProject, role: e.target.value })}
                />
              </div>

              <FormTextarea
                label="Project Narrative & Technical Overview"
                rows={3}
                placeholder="Explain the video concept, rhythm, sound design, hooks, and retention engineering..."
                value={editingProject.description || ""}
                onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
              />

              {/* Software Tags Manager */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-accent uppercase tracking-wider block">
                  Software Used Tags
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Premiere Pro, DaVinci Resolve, After Effects..."
                    value={softwareTagInput}
                    onChange={(e) => setSoftwareTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddSoftwareTag();
                      }
                    }}
                    className="flex-1 bg-primary/70 border border-white/10 focus:border-accent rounded-xl px-4 py-2.5 text-xs text-text-pure focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddSoftwareTag}
                    className="px-4 py-2.5 rounded-xl bg-accent text-primary font-bold text-xs uppercase"
                  >
                    Add Tag
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(editingProject.softwareUsed || []).map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/15 border border-accent/30 text-accent text-xs font-semibold"
                    >
                      {t}
                      <button
                        type="button"
                        onClick={() => handleRemoveSoftwareTag(t)}
                        className="hover:text-red-400 p-0.5"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <FormToggle
                  label="Published to Live Site"
                  description="When turned OFF, this project will only be visible in Admin as a draft"
                  checked={editingProject.published ?? true}
                  onChange={(checked) => setEditingProject({ ...editingProject, published: checked })}
                />

                <FormToggle
                  label="Featured Project"
                  description="Displays gold star and prioritizes on homepage"
                  checked={editingProject.featured ?? true}
                  onChange={(checked) => setEditingProject({ ...editingProject, featured: checked })}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-6 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-text-soft"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-primary text-xs font-bold uppercase tracking-wider shadow-lg shadow-accent/20"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        title="Delete Portfolio Project"
        message="Are you sure you want to permanently delete this project? This will remove it from all public showcase galleries."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
}
