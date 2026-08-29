import React, { useState } from "react";
import { Share2, Plus, Edit3, Trash2, ArrowUp, ArrowDown, ExternalLink } from "lucide-react";
import { cmsStore } from "../../lib/cmsStore";
import { SocialLinkItem } from "../../lib/cmsTypes";
import { FormInput, FormToggle, ImagePreviewInput } from "../components/FormComponents";
import { ConfirmModal } from "../components/ConfirmModal";

interface SocialLinksManagerProps {
  onAddToast: (type: "success" | "error" | "warning" | "info", message: string) => void;
}

export function SocialLinksManager({ onAddToast }: SocialLinksManagerProps) {
  const [links, setLinks] = useState<SocialLinkItem[]>(() => cmsStore.getSocialLinks());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<Partial<SocialLinkItem> | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const handleOpenModal = (link?: SocialLinkItem) => {
    if (link) {
      setEditingLink({ ...link });
    } else {
      setEditingLink({
        platform: "",
        url: "https://",
        logo: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/instagram.svg",
        glowColor: "rgba(163, 133, 96, 0.3)",
        visible: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLink?.platform || !editingLink?.url) {
      onAddToast("warning", "Please provide Platform Name and URL.");
      return;
    }

    const updated = cmsStore.saveSocialLink(editingLink);
    setLinks(updated);
    setIsModalOpen(false);
    setEditingLink(null);
    onAddToast("success", "Social link saved successfully! 🌐");
  };

  const handleDelete = () => {
    if (!deleteTargetId) return;
    const updated = cmsStore.deleteSocialLink(deleteTargetId);
    setLinks(updated);
    setDeleteTargetId(null);
    onAddToast("success", "Social link removed.");
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= links.length) return;

    const list = [...links];
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;

    const updated = list.map((item, idx) => ({ ...item, order: idx + 1 }));
    cmsStore.set("socialLinks", updated);
    setLinks(updated);
    onAddToast("info", "Social links reordered.");
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-secondary/60 border border-white/10">
        <div>
          <h2 className="text-lg font-display font-bold text-text-pure flex items-center gap-2">
            <Share2 size={20} className="text-accent" /> Social Media Channels & Links
          </h2>
          <p className="text-xs text-text-soft mt-0.5">
            Manage your social connection icons in the Contact and Footer areas.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="px-5 py-3 rounded-2xl bg-accent hover:bg-accent-hover text-primary font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-accent/20 transition-all shrink-0"
        >
          <Plus size={16} /> Add Social Link
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {links.map((link, idx) => (
          <div
            key={link.id}
            className="p-5 rounded-3xl bg-secondary/40 border border-white/10 hover:border-accent/30 transition-all flex flex-col justify-between gap-4 group shadow-lg"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="w-10 h-10 rounded-xl bg-primary/80 border border-white/10 flex items-center justify-center p-2.5">
                  <img
                    src={link.logo}
                    alt={link.platform}
                    className="w-full h-full object-contain filter invert opacity-80 group-hover:opacity-100 transition-opacity"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/globe.svg";
                    }}
                  />
                </div>

                <span className={`text-[8px] px-2 py-0.5 rounded-full font-bold uppercase ${
                  link.visible ? "bg-green-500/20 text-green-400" : "bg-white/10 text-text-muted"
                }`}>
                  {link.visible ? "Visible" : "Hidden"}
                </span>
              </div>

              <div>
                <h3 className="text-base font-display font-bold text-text-pure group-hover:text-accent transition-colors">
                  {link.platform}
                </h3>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-text-soft hover:text-accent font-mono truncate block flex items-center gap-1 mt-0.5"
                >
                  <span className="truncate">{link.url}</span>
                  <ExternalLink size={10} className="shrink-0" />
                </a>
              </div>
            </div>

            <div className="pt-3 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <button
                  disabled={idx === 0}
                  onClick={() => handleMove(idx, "up")}
                  className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-text-soft disabled:opacity-30"
                >
                  <ArrowUp size={13} />
                </button>
                <button
                  disabled={idx === links.length - 1}
                  onClick={() => handleMove(idx, "down")}
                  className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-text-soft disabled:opacity-30"
                >
                  <ArrowDown size={13} />
                </button>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenModal(link)}
                  className="p-1.5 rounded-lg bg-accent/20 hover:bg-accent/30 text-accent font-bold"
                >
                  <Edit3 size={14} />
                </button>
                <button
                  onClick={() => setDeleteTargetId(link.id)}
                  className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && editingLink && (
        <div className="fixed inset-0 z-[120] bg-primary/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-secondary p-6 sm:p-8 rounded-3xl border border-white/10 max-w-md w-full shadow-2xl space-y-6">
            <h3 className="text-lg font-display font-bold text-text-pure">
              {editingLink.id ? "Edit Social Link" : "Add Social Platform"}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <FormInput
                label="Platform Name"
                required
                placeholder="e.g. Instagram, LinkedIn, Behance"
                value={editingLink.platform || ""}
                onChange={(e) => setEditingLink({ ...editingLink, platform: e.target.value })}
              />

              <FormInput
                label="Profile / Destination URL"
                required
                placeholder="https://instagram.com/..."
                value={editingLink.url || ""}
                onChange={(e) => setEditingLink({ ...editingLink, url: e.target.value })}
              />

              <ImagePreviewInput
                label="Platform SVG Icon URL"
                value={editingLink.logo || ""}
                onChange={(url) => setEditingLink({ ...editingLink, logo: url })}
                aspect="square"
              />

              <FormToggle
                label="Visible on Public Website"
                checked={editingLink.visible ?? true}
                onChange={(checked) => setEditingLink({ ...editingLink, visible: checked })}
              />

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
                  Save Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        title="Delete Social Link"
        message="Are you sure you want to permanently delete this social link?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
}
