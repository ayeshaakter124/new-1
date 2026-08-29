import React, { useState } from "react";
import { Building2, Plus, Edit3, Trash2, Globe, ExternalLink, ArrowUp, ArrowDown } from "lucide-react";
import { cmsStore } from "../../lib/cmsStore";
import { ClientBrand } from "../../lib/cmsTypes";
import { FormInput, FormTextarea, FormToggle, ImagePreviewInput } from "../components/FormComponents";
import { ConfirmModal } from "../components/ConfirmModal";

interface ClientManagerProps {
  onAddToast: (type: "success" | "error" | "warning" | "info", message: string) => void;
}

export function ClientManager({ onAddToast }: ClientManagerProps) {
  const [clients, setClients] = useState<ClientBrand[]>(() => cmsStore.getClients());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Partial<ClientBrand> | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const handleOpenModal = (client?: ClientBrand) => {
    if (client) {
      setEditingClient({ ...client });
    } else {
      setEditingClient({
        name: "",
        logo: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/apple.svg",
        website: "",
        description: "",
        projectCount: "10+ Videos",
        featured: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClient?.name) {
      onAddToast("warning", "Please provide a Client / Brand Name.");
      return;
    }

    const updated = cmsStore.saveClient(editingClient);
    setClients(updated);
    setIsModalOpen(false);
    setEditingClient(null);
    onAddToast("success", "Client brand saved successfully! 🏢");
  };

  const handleDelete = () => {
    if (!deleteTargetId) return;
    const updated = cmsStore.deleteClient(deleteTargetId);
    setClients(updated);
    setDeleteTargetId(null);
    onAddToast("success", "Client brand removed successfully.");
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= clients.length) return;

    const list = [...clients];
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;

    const updated = list.map((item, idx) => ({ ...item, order: idx + 1 }));
    cmsStore.set("clients", updated);
    setClients(updated);
    onAddToast("info", "Client list reordered.");
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-secondary/60 border border-white/10">
        <div>
          <h2 className="text-lg font-display font-bold text-text-pure flex items-center gap-2">
            <Building2 size={20} className="text-accent" /> Clients & Trusted Brands
          </h2>
          <p className="text-xs text-text-soft mt-0.5">
            Manage partner logos, brand links, and project counts displayed across the website.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="px-5 py-3 rounded-2xl bg-accent hover:bg-accent-hover text-primary font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-accent/20 transition-all shrink-0"
        >
          <Plus size={16} /> Add Client / Brand
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((c, idx) => (
          <div
            key={c.id}
            className="p-6 rounded-3xl bg-secondary/40 border border-white/10 hover:border-accent/30 transition-all flex items-center justify-between gap-4 group shadow-lg"
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-14 h-14 rounded-2xl bg-primary/80 border border-white/10 flex items-center justify-center p-3 shrink-0 group-hover:scale-105 transition-transform">
                <img
                  src={c.logo}
                  alt={c.name}
                  className="w-full h-full object-contain filter invert opacity-80 group-hover:opacity-100 transition-opacity"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/apple.svg";
                  }}
                />
              </div>

              <div className="min-w-0">
                <h3 className="text-base font-display font-bold text-text-pure truncate group-hover:text-accent transition-colors">
                  {c.name}
                </h3>
                <p className="text-xs text-text-muted font-mono truncate">
                  {c.projectCount || "Partner Brand"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                disabled={idx === 0}
                onClick={() => handleMove(idx, "up")}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-text-soft disabled:opacity-30"
              >
                <ArrowUp size={14} />
              </button>
              <button
                disabled={idx === clients.length - 1}
                onClick={() => handleMove(idx, "down")}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-text-soft disabled:opacity-30"
              >
                <ArrowDown size={14} />
              </button>
              <button
                onClick={() => handleOpenModal(c)}
                className="p-2 rounded-xl bg-accent/20 hover:bg-accent/30 text-accent font-bold"
              >
                <Edit3 size={15} />
              </button>
              <button
                onClick={() => setDeleteTargetId(c.id)}
                className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && editingClient && (
        <div className="fixed inset-0 z-[120] bg-primary/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-secondary p-6 sm:p-8 rounded-3xl border border-white/10 max-w-lg w-full shadow-2xl space-y-6">
            <h3 className="text-lg font-display font-bold text-text-pure">
              {editingClient.id ? "Edit Client Brand" : "Add Client Brand"}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <FormInput
                label="Client / Company Name"
                required
                placeholder="e.g. Renata Ltd., D Studio"
                value={editingClient.name || ""}
                onChange={(e) => setEditingClient({ ...editingClient, name: e.target.value })}
              />

              <ImagePreviewInput
                label="Brand Logo URL (SVG or PNG)"
                value={editingClient.logo || ""}
                onChange={(url) => setEditingClient({ ...editingClient, logo: url })}
                aspect="square"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput
                  label="Project Count Badge"
                  placeholder="e.g. 25+ Campaigns, 18+ Videos"
                  value={editingClient.projectCount || ""}
                  onChange={(e) => setEditingClient({ ...editingClient, projectCount: e.target.value })}
                />

                <FormInput
                  label="Website URL"
                  placeholder="https://..."
                  value={editingClient.website || ""}
                  onChange={(e) => setEditingClient({ ...editingClient, website: e.target.value })}
                />
              </div>

              <FormTextarea
                label="Short Description"
                rows={2}
                placeholder="Industry, client background..."
                value={editingClient.description || ""}
                onChange={(e) => setEditingClient({ ...editingClient, description: e.target.value })}
              />

              <FormToggle
                label="Featured Client Brand"
                description="Highlight in client marquee and testimonials"
                checked={editingClient.featured ?? true}
                onChange={(checked) => setEditingClient({ ...editingClient, featured: checked })}
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
                  Save Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        title="Delete Client Brand"
        message="Are you sure you want to permanently delete this client brand?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
}
