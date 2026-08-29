import React, { useState } from "react";
import { MessageSquareQuote, Plus, Edit3, Trash2, Star, Play, ArrowUp, ArrowDown } from "lucide-react";
import { cmsStore } from "../../lib/cmsStore";
import { TestimonialItem } from "../../lib/cmsTypes";
import { FormInput, FormTextarea, FormSelect, FormToggle, ImagePreviewInput } from "../components/FormComponents";
import { ConfirmModal } from "../components/ConfirmModal";

interface TestimonialsManagerProps {
  onAddToast: (type: "success" | "error" | "warning" | "info", message: string) => void;
}

export function TestimonialsManager({ onAddToast }: TestimonialsManagerProps) {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(() => cmsStore.getTestimonials());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<TestimonialItem> | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const handleOpenModal = (t?: TestimonialItem) => {
    if (t) {
      setEditingItem({ ...t });
    } else {
      setEditingItem({
        name: "",
        role: "Content Creator",
        company: "",
        text: "",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
        youtubeUrl: "",
        rating: 5,
        featured: true,
        visible: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.name || !editingItem?.text) {
      onAddToast("warning", "Please provide Client Name and Review Text.");
      return;
    }

    const updated = cmsStore.saveTestimonial(editingItem);
    setTestimonials(updated);
    setIsModalOpen(false);
    setEditingItem(null);
    onAddToast("success", "Client review saved successfully! ⭐");
  };

  const handleDelete = () => {
    if (!deleteTargetId) return;
    const updated = cmsStore.deleteTestimonial(deleteTargetId);
    setTestimonials(updated);
    setDeleteTargetId(null);
    onAddToast("success", "Testimonial removed successfully.");
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= testimonials.length) return;

    const list = [...testimonials];
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;

    const updated = list.map((item, idx) => ({ ...item, order: idx + 1 }));
    cmsStore.set("testimonials", updated);
    setTestimonials(updated);
    onAddToast("info", "Testimonials reordered.");
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-secondary/60 border border-white/10">
        <div>
          <h2 className="text-lg font-display font-bold text-text-pure flex items-center gap-2">
            <MessageSquareQuote size={20} className="text-accent" /> Client Testimonials & Video Reviews
          </h2>
          <p className="text-xs text-text-soft mt-0.5">
            Manage written endorsements and video testimonials displayed in the Testimonials & Services sections.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="px-5 py-3 rounded-2xl bg-accent hover:bg-accent-hover text-primary font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-accent/20 transition-all shrink-0"
        >
          <Plus size={16} /> Add Testimonial / Review
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((t, idx) => (
          <div
            key={t.id}
            className="p-6 rounded-3xl bg-secondary/40 border border-white/10 hover:border-accent/30 transition-all flex flex-col justify-between gap-6 group shadow-lg"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden bg-primary/80 border border-white/10 shrink-0">
                    <img
                      src={t.image}
                      alt={t.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop";
                      }}
                    />
                  </div>

                  <div>
                    <h3 className="text-base font-display font-bold text-text-pure group-hover:text-accent transition-colors">
                      {t.name}
                    </h3>
                    <p className="text-[10px] text-accent uppercase font-bold tracking-wider">
                      {t.role} {t.company && `• ${t.company}`}
                    </p>
                  </div>
                </div>

                <span className={`text-[8px] px-2 py-0.5 rounded-full font-bold uppercase ${
                  t.visible ? "bg-green-500/20 text-green-400" : "bg-white/10 text-text-muted"
                }`}>
                  {t.visible ? "Visible" : "Hidden"}
                </span>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 text-accent">
                {Array.from({ length: t.rating || 5 }).map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </div>

              <p className="text-xs text-text-soft leading-relaxed italic line-clamp-3">
                "{t.text}"
              </p>

              {t.youtubeUrl && (
                <div className="p-2.5 rounded-xl bg-primary/60 border border-white/5 flex items-center gap-2 text-xs text-accent font-semibold">
                  <Play size={14} className="shrink-0" />
                  <span className="truncate">Video Review Linked</span>
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
                  disabled={idx === testimonials.length - 1}
                  onClick={() => handleMove(idx, "down")}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-text-soft disabled:opacity-30"
                >
                  <ArrowDown size={14} />
                </button>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenModal(t)}
                  className="p-2 rounded-xl bg-accent/20 hover:bg-accent/30 text-accent font-bold"
                >
                  <Edit3 size={15} />
                </button>
                <button
                  onClick={() => setDeleteTargetId(t.id)}
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
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-[120] bg-primary/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto custom-scrollbar animate-fadeIn">
          <div className="bg-secondary p-6 sm:p-8 rounded-3xl border border-white/10 max-w-lg w-full shadow-2xl space-y-6 my-8">
            <h3 className="text-lg font-display font-bold text-text-pure">
              {editingItem.id ? "Edit Testimonial" : "Add Client Testimonial"}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput
                  label="Client Name"
                  required
                  placeholder="e.g. Marcus Chen, Elena Rodriguez"
                  value={editingItem.name || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                />

                <FormInput
                  label="Professional Role / Title"
                  required
                  placeholder="e.g. CEO, Travel Vlogger, Head Chef"
                  value={editingItem.role || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, role: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput
                  label="Company / Brand"
                  placeholder="e.g. Nexa Digital, TechNexus"
                  value={editingItem.company || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, company: e.target.value })}
                />

                <FormSelect
                  label="Rating (Stars)"
                  options={[
                    { label: "5 Stars (★★★★★)", value: 5 },
                    { label: "4 Stars (★★★★☆)", value: 4 },
                    { label: "3 Stars (★★★☆☆)", value: 3 },
                  ]}
                  value={editingItem.rating || 5}
                  onChange={(e) => setEditingItem({ ...editingItem, rating: Number(e.target.value) })}
                />
              </div>

              <ImagePreviewInput
                label="Client Avatar / Thumbnail Photo"
                value={editingItem.image || ""}
                onChange={(url) => setEditingItem({ ...editingItem, image: url })}
                aspect="square"
              />

              <FormInput
                label="Video Review Link (Optional YouTube/Vimeo)"
                placeholder="https://www.youtube.com/watch?v=..."
                value={editingItem.youtubeUrl || ""}
                onChange={(e) => setEditingItem({ ...editingItem, youtubeUrl: e.target.value })}
              />

              <FormTextarea
                label="Review Testimonial Text"
                required
                rows={3}
                placeholder="What did the client say about your editing speed, retention, and visual quality?"
                value={editingItem.text || ""}
                onChange={(e) => setEditingItem({ ...editingItem, text: e.target.value })}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <FormToggle
                  label="Featured Review"
                  checked={editingItem.featured ?? true}
                  onChange={(checked) => setEditingItem({ ...editingItem, featured: checked })}
                />
                <FormToggle
                  label="Visible on Website"
                  checked={editingItem.visible ?? true}
                  onChange={(checked) => setEditingItem({ ...editingItem, visible: checked })}
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
                  Save Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        title="Delete Testimonial"
        message="Are you sure you want to permanently delete this client testimonial?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
}
