import React, { useState } from "react";
import { Briefcase, Plus, Edit3, Trash2, ArrowUp, ArrowDown, Building2, Calendar } from "lucide-react";
import { cmsStore } from "../../lib/cmsStore";
import { ExperienceItem } from "../../lib/cmsTypes";
import { FormInput, FormTextarea, FormToggle } from "../components/FormComponents";
import { ConfirmModal } from "../components/ConfirmModal";

interface ExperienceManagerProps {
  onAddToast: (type: "success" | "error" | "warning" | "info", message: string) => void;
}

export function ExperienceManager({ onAddToast }: ExperienceManagerProps) {
  const [experiences, setExperiences] = useState<ExperienceItem[]>(() => cmsStore.getExperiences());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<ExperienceItem> | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const handleOpenModal = (item?: ExperienceItem) => {
    if (item) {
      setEditingItem({ ...item });
    } else {
      setEditingItem({
        year: "Present",
        role: "",
        company: "",
        description: "",
        currentlyWorking: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.role || !editingItem?.company) {
      onAddToast("warning", "Please provide both Role Title and Company Name.");
      return;
    }

    const updated = cmsStore.saveExperience(editingItem);
    setExperiences(updated);
    setIsModalOpen(false);
    setEditingItem(null);
    onAddToast("success", "Career milestone saved successfully! 🚀");
  };

  const handleDelete = () => {
    if (!deleteTargetId) return;
    const updated = cmsStore.deleteExperience(deleteTargetId);
    setExperiences(updated);
    setDeleteTargetId(null);
    onAddToast("success", "Career milestone removed successfully.");
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= experiences.length) return;

    const list = [...experiences];
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;

    const updated = list.map((item, idx) => ({ ...item, order: idx + 1 }));
    cmsStore.set("experiences", updated);
    setExperiences(updated);
    onAddToast("info", "Milestones reordered.");
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-secondary/60 border border-white/10">
        <div>
          <h2 className="text-lg font-display font-bold text-text-pure flex items-center gap-2">
            <Briefcase size={20} className="text-accent" /> Career Journey & Work Milestones
          </h2>
          <p className="text-xs text-text-soft mt-0.5">
            Manage your past and current professional roles displayed on the timeline.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="px-5 py-3 rounded-2xl bg-accent hover:bg-accent-hover text-primary font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-accent/20 transition-all shrink-0"
        >
          <Plus size={16} /> Add New Milestone
        </button>
      </div>

      {/* Timeline List */}
      <div className="space-y-4">
        {experiences.map((exp, idx) => (
          <div
            key={exp.id}
            className="p-6 rounded-3xl bg-secondary/40 border border-white/10 hover:border-accent/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-accent/15 border border-accent/20 flex items-center justify-center text-accent font-mono font-bold text-xs shrink-0">
                {idx + 1}
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h3 className="text-base font-display font-bold text-text-pure">
                    {exp.role}
                  </h3>
                  <span className="text-xs font-bold text-accent font-mono">
                    @{exp.company}
                  </span>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-white/10 text-text-soft font-mono uppercase">
                    {exp.year}
                  </span>
                </div>

                <p className="text-xs text-text-soft leading-relaxed max-w-2xl">
                  {exp.description}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
              <button
                disabled={idx === 0}
                onClick={() => handleMove(idx, "up")}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-text-soft hover:text-text-pure disabled:opacity-30"
                title="Move Up"
              >
                <ArrowUp size={16} />
              </button>
              <button
                disabled={idx === experiences.length - 1}
                onClick={() => handleMove(idx, "down")}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-text-soft hover:text-text-pure disabled:opacity-30"
                title="Move Down"
              >
                <ArrowDown size={16} />
              </button>
              <button
                onClick={() => handleOpenModal(exp)}
                className="p-2 rounded-xl bg-accent/20 hover:bg-accent/30 text-accent"
                title="Edit Milestone"
              >
                <Edit3 size={16} />
              </button>
              <button
                onClick={() => setDeleteTargetId(exp.id)}
                className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400"
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}

        {experiences.length === 0 && (
          <div className="py-16 text-center text-text-muted bg-secondary/20 rounded-3xl border border-white/5 space-y-3">
            <Briefcase size={32} className="mx-auto text-text-muted/40" />
            <p className="text-sm font-medium">No career experiences added yet.</p>
            <button
              onClick={() => handleOpenModal()}
              className="text-xs text-accent font-bold hover:underline"
            >
              + Create First Career Milestone
            </button>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-[120] bg-primary/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-secondary p-6 sm:p-8 rounded-3xl border border-white/10 max-w-lg w-full shadow-2xl space-y-6">
            <h3 className="text-base font-display font-bold text-text-pure">
              {editingItem.id ? "Edit Career Milestone" : "Add Career Milestone"}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput
                  label="Role / Title"
                  required
                  placeholder="e.g. Senior Video Editor"
                  value={editingItem.role || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, role: e.target.value })}
                />
                <FormInput
                  label="Company Name"
                  required
                  placeholder="e.g. D Studio"
                  value={editingItem.company || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, company: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput
                  label="Timeline Period"
                  required
                  placeholder="e.g. Present, 2025, 2024"
                  value={editingItem.year || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, year: e.target.value })}
                />
                <FormInput
                  label="Employment Type"
                  placeholder="Full-time, Contract, etc."
                  value={editingItem.employmentType || "Full-time"}
                  onChange={(e) => setEditingItem({ ...editingItem, employmentType: e.target.value as any })}
                />
              </div>

              <FormTextarea
                label="Role Narrative & Impact"
                rows={3}
                placeholder="Key achievements, campaigns produced, technical responsibilities..."
                value={editingItem.description || ""}
                onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
              />

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-text-soft"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-primary text-xs font-bold uppercase tracking-wider"
                >
                  Save Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        title="Delete Career Milestone"
        message="Are you sure you want to permanently remove this career milestone from your timeline?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
}
