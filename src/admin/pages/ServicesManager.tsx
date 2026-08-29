import React, { useState } from "react";
import { Sparkles, Plus, Edit3, Trash2, ArrowUp, ArrowDown, CheckCircle2, Film, Play, Layers, Video } from "lucide-react";
import { cmsStore } from "../../lib/cmsStore";
import { ServiceItem } from "../../lib/cmsTypes";
import { FormInput, FormTextarea, FormSelect, FormToggle } from "../components/FormComponents";
import { ConfirmModal } from "../components/ConfirmModal";

interface ServicesManagerProps {
  onAddToast: (type: "success" | "error" | "warning" | "info", message: string) => void;
}

const ICON_OPTIONS = [
  { label: "Film (Commercials / Cinema)", value: "Film" },
  { label: "Play (Viral Reels / Shorts)", value: "Play" },
  { label: "Layers (SaaS / Motion Graphics)", value: "Layers" },
  { label: "Sparkles (Color Grading & VFX)", value: "Sparkles" },
  { label: "Video (General Production)", value: "Video" },
];

export function ServicesManager({ onAddToast }: ServicesManagerProps) {
  const [services, setServices] = useState<ServiceItem[]>(() => cmsStore.getServices());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Partial<ServiceItem> | null>(null);
  const [featureInput, setFeatureInput] = useState("");
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const handleOpenModal = (serv?: ServiceItem) => {
    if (serv) {
      setEditingService({ ...serv });
    } else {
      setEditingService({
        title: "",
        iconName: "Film",
        shortDesc: "",
        features: ["Script & Storyboarding", "Color Grading in DaVinci", "Sound Design", "4K Mastering"],
        priceText: "Custom Quote",
        ctaText: "Inquire Now",
        visible: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService?.title) {
      onAddToast("warning", "Please provide a Service Title.");
      return;
    }

    const updated = cmsStore.saveService(editingService);
    setServices(updated);
    setIsModalOpen(false);
    setEditingService(null);
    onAddToast("success", "Service saved successfully! ✨");
  };

  const handleDelete = () => {
    if (!deleteTargetId) return;
    const updated = cmsStore.deleteService(deleteTargetId);
    setServices(updated);
    setDeleteTargetId(null);
    onAddToast("success", "Service removed successfully.");
  };

  const handleAddFeature = () => {
    if (!featureInput.trim()) return;
    const current = editingService?.features || [];
    setEditingService({
      ...editingService,
      features: [...current, featureInput.trim()],
    });
    setFeatureInput("");
  };

  const handleRemoveFeature = (feature: string) => {
    const current = editingService?.features || [];
    setEditingService({
      ...editingService,
      features: current.filter(f => f !== feature),
    });
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= services.length) return;

    const list = [...services];
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;

    const updated = list.map((item, idx) => ({ ...item, order: idx + 1 }));
    cmsStore.set("services", updated);
    setServices(updated);
    onAddToast("info", "Services reordered.");
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-secondary/60 border border-white/10">
        <div>
          <h2 className="text-lg font-display font-bold text-text-pure flex items-center gap-2">
            <Sparkles size={20} className="text-accent" /> Services & Production Offerings
          </h2>
          <p className="text-xs text-text-soft mt-0.5">
            Manage your service cards, bullet point deliverables, pricing badges, and CTAs.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="px-5 py-3 rounded-2xl bg-accent hover:bg-accent-hover text-primary font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-accent/20 transition-all shrink-0"
        >
          <Plus size={16} /> Add New Service
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((s, idx) => (
          <div
            key={s.id}
            className="p-6 rounded-3xl bg-secondary/40 border border-white/10 hover:border-accent/30 transition-all flex flex-col justify-between gap-6 group shadow-lg"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center text-accent">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <h3 className="text-base font-display font-bold text-text-pure group-hover:text-accent transition-colors">
                      {s.title}
                    </h3>
                    <span className="text-[10px] text-accent font-mono">
                      {s.priceText || "Custom Quote"}
                    </span>
                  </div>
                </div>

                <span className={`text-[8px] px-2 py-0.5 rounded-full font-bold uppercase ${
                  s.visible ? "bg-green-500/20 text-green-400" : "bg-white/10 text-text-muted"
                }`}>
                  {s.visible ? "Visible" : "Hidden"}
                </span>
              </div>

              <p className="text-xs text-text-soft leading-relaxed">
                {s.shortDesc}
              </p>

              {s.features && s.features.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-white/5">
                  {s.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-text-muted">
                      <CheckCircle2 size={12} className="text-accent shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <button
                  disabled={idx === 0}
                  onClick={() => handleMove(idx, "up")}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-text-soft disabled:opacity-30"
                >
                  <ArrowUp size={14} />
                </button>
                <button
                  disabled={idx === services.length - 1}
                  onClick={() => handleMove(idx, "down")}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-text-soft disabled:opacity-30"
                >
                  <ArrowDown size={14} />
                </button>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenModal(s)}
                  className="p-2 rounded-xl bg-accent/20 hover:bg-accent/30 text-accent font-bold"
                >
                  <Edit3 size={15} />
                </button>
                <button
                  onClick={() => setDeleteTargetId(s.id)}
                  className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && editingService && (
        <div className="fixed inset-0 z-[120] bg-primary/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto custom-scrollbar animate-fadeIn">
          <div className="bg-secondary p-6 sm:p-8 rounded-3xl border border-white/10 max-w-xl w-full shadow-2xl space-y-6 my-8">
            <h3 className="text-lg font-display font-bold text-text-pure">
              {editingService.id ? "Edit Service" : "Add New Service Offering"}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput
                  label="Service Title"
                  required
                  placeholder="e.g. Viral Reels & Shorts"
                  value={editingService.title || ""}
                  onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                />

                <FormSelect
                  label="Icon Style"
                  options={ICON_OPTIONS}
                  value={editingService.iconName || "Film"}
                  onChange={(e) => setEditingService({ ...editingService, iconName: e.target.value as any })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput
                  label="Pricing Text (Optional)"
                  placeholder="e.g. Custom Quote, Monthly Package"
                  value={editingService.priceText || ""}
                  onChange={(e) => setEditingService({ ...editingService, priceText: e.target.value })}
                />

                <FormInput
                  label="CTA Button Text"
                  placeholder="e.g. Inquire Now, Book Session"
                  value={editingService.ctaText || "Inquire Now"}
                  onChange={(e) => setEditingService({ ...editingService, ctaText: e.target.value })}
                />
              </div>

              <FormTextarea
                label="Short Description"
                rows={2}
                placeholder="Core benefit for brands..."
                value={editingService.shortDesc || ""}
                onChange={(e) => setEditingService({ ...editingService, shortDesc: e.target.value })}
              />

              {/* Feature Bullet Points */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-accent uppercase tracking-wider block">
                  Included Deliverables / Features
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. 4K Mastering, Fast 24-48h Delivery..."
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddFeature();
                      }
                    }}
                    className="flex-1 bg-primary/70 border border-white/10 focus:border-accent rounded-xl px-4 py-2.5 text-xs text-text-pure focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="px-4 py-2.5 rounded-xl bg-accent text-primary font-bold text-xs uppercase"
                  >
                    Add
                  </button>
                </div>

                <div className="space-y-1.5 pt-1">
                  {(editingService.features || []).map((f) => (
                    <div
                      key={f}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-primary/60 border border-white/5 text-xs text-text-soft"
                    >
                      <span className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-accent" /> {f}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(f)}
                        className="text-text-muted hover:text-red-400 p-1"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <FormToggle
                label="Visible on Website"
                checked={editingService.visible ?? true}
                onChange={(checked) => setEditingService({ ...editingService, visible: checked })}
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
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        title="Delete Service"
        message="Are you sure you want to permanently delete this service offering?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
}
