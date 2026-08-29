import React, { useState } from "react";
import { Image as ImageIcon, Plus, Copy, Trash2, ExternalLink, Check, Search } from "lucide-react";
import { cmsStore } from "../../lib/cmsStore";
import { MediaItem } from "../../lib/cmsTypes";
import { FormInput, FormSelect, ImagePreviewInput } from "../components/FormComponents";
import { ConfirmModal } from "../components/ConfirmModal";

interface MediaLibraryPageProps {
  onAddToast: (type: "success" | "error" | "warning" | "info", message: string) => void;
}

export function MediaLibraryPage({ onAddToast }: MediaLibraryPageProps) {
  const [media, setMedia] = useState<MediaItem[]>(() => cmsStore.getMedia());
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMedia, setNewMedia] = useState<Partial<MediaItem>>({
    title: "",
    url: "",
    type: "image",
    category: "General",
  });
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedia.title || !newMedia.url) {
      onAddToast("warning", "Please provide Media Title and URL.");
      return;
    }

    const updated = cmsStore.saveMedia(newMedia);
    setMedia(updated);
    setIsModalOpen(false);
    setNewMedia({ title: "", url: "", type: "image", category: "General" });
    onAddToast("success", "Media asset added to library! 🖼️");
  };

  const handleCopyUrl = (item: MediaItem) => {
    navigator.clipboard.writeText(item.url);
    setCopiedId(item.id);
    onAddToast("info", "Asset URL copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = () => {
    if (!deleteTargetId) return;
    const updated = cmsStore.deleteMedia(deleteTargetId);
    setMedia(updated);
    setDeleteTargetId(null);
    onAddToast("success", "Media asset removed.");
  };

  const filteredMedia = media.filter(m =>
    m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (m.category && m.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-secondary/60 border border-white/10">
        <div>
          <h2 className="text-lg font-display font-bold text-text-pure flex items-center gap-2">
            <ImageIcon size={20} className="text-accent" /> Media Library
          </h2>
          <p className="text-xs text-text-soft mt-0.5">
            Store and organize high-res image assets, thumbnails, and portfolio video links.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-3 rounded-2xl bg-accent hover:bg-accent-hover text-primary font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-accent/20 transition-all shrink-0"
        >
          <Plus size={16} /> Add Media Asset
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          placeholder="Search media assets..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-secondary/40 border border-white/10 focus:border-accent rounded-xl pl-10 pr-4 py-2.5 text-xs text-text-pure focus:outline-none"
        />
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredMedia.map((item) => (
          <div
            key={item.id}
            className="rounded-3xl bg-secondary/40 border border-white/10 hover:border-accent/30 transition-all overflow-hidden flex flex-col justify-between group shadow-lg"
          >
            <div className="relative aspect-video bg-primary/80 overflow-hidden">
              <img
                src={item.url}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=800&auto=format&fit=crop";
                }}
              />

              <div className="absolute top-2.5 left-2.5">
                <span className="px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[9px] font-bold text-accent uppercase font-mono">
                  {item.category || "General"}
                </span>
              </div>
            </div>

            <div className="p-4 space-y-3">
              <h3 className="text-xs font-display font-bold text-text-pure truncate group-hover:text-accent transition-colors">
                {item.title}
              </h3>

              <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/5">
                <button
                  onClick={() => handleCopyUrl(item)}
                  className="flex-1 py-1.5 px-3 rounded-xl bg-white/5 hover:bg-accent hover:text-primary transition-all text-xs font-semibold flex items-center justify-center gap-1.5"
                >
                  {copiedId === item.id ? <Check size={13} /> : <Copy size={13} />}
                  <span>{copiedId === item.id ? "Copied" : "Copy URL"}</span>
                </button>

                <button
                  onClick={() => setDeleteTargetId(item.id)}
                  className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400"
                  title="Delete Asset"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredMedia.length === 0 && (
        <div className="py-20 text-center text-text-muted bg-secondary/20 rounded-3xl border border-white/5 space-y-2">
          <ImageIcon size={32} className="mx-auto text-text-muted/40" />
          <p className="text-sm font-medium">No media assets found.</p>
        </div>
      )}

      {/* Add Media Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[120] bg-primary/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-secondary p-6 sm:p-8 rounded-3xl border border-white/10 max-w-lg w-full shadow-2xl space-y-6">
            <h3 className="text-lg font-display font-bold text-text-pure">
              Add New Media Asset
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <FormInput
                label="Asset Title / Caption"
                required
                placeholder="e.g. Commercial Hero Thumbnail"
                value={newMedia.title || ""}
                onChange={(e) => setNewMedia({ ...newMedia, title: e.target.value })}
              />

              <ImagePreviewInput
                label="Image / Media URL"
                value={newMedia.url || ""}
                onChange={(url) => setNewMedia({ ...newMedia, url })}
                aspect="video"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput
                  label="Category Tag"
                  placeholder="e.g. Thumbnails, Portraits, Logos"
                  value={newMedia.category || ""}
                  onChange={(e) => setNewMedia({ ...newMedia, category: e.target.value })}
                />

                <FormSelect
                  label="Media Type"
                  options={[
                    { label: "Image Asset", value: "image" },
                    { label: "Video Asset", value: "video" },
                    { label: "Document", value: "document" },
                  ]}
                  value={newMedia.type || "image"}
                  onChange={(e) => setNewMedia({ ...newMedia, type: e.target.value as any })}
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
                  className="px-6 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-primary text-xs font-bold uppercase tracking-wider"
                >
                  Save Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        title="Delete Media Asset"
        message="Are you sure you want to permanently delete this media asset?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
}
