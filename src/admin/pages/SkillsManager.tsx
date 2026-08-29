import React, { useState } from "react";
import { Award, Plus, Edit3, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { cmsStore } from "../../lib/cmsStore";
import { SkillItem } from "../../lib/cmsTypes";
import { FormInput, FormSelect, FormToggle, ImagePreviewInput } from "../components/FormComponents";
import { ConfirmModal } from "../components/ConfirmModal";

interface SkillsManagerProps {
  onAddToast: (type: "success" | "error" | "warning" | "info", message: string) => void;
}

const CATEGORIES = [
  { label: "Video Editing", value: "Editing" },
  { label: "Motion Graphics", value: "Motion" },
  { label: "Graphic Design", value: "Design" },
  { label: "Color Grading", value: "Color" },
  { label: "3D & VFX", value: "3D" },
];

export function SkillsManager({ onAddToast }: SkillsManagerProps) {
  const [skills, setSkills] = useState<SkillItem[]>(() => cmsStore.getSkills());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Partial<SkillItem> | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const handleOpenModal = (skill?: SkillItem) => {
    if (skill) {
      setEditingSkill({ ...skill });
    } else {
      setEditingSkill({
        name: "",
        logo: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/adobepremierepro.svg",
        category: "Editing",
        level: 90,
        glowColor: "rgba(163, 133, 96, 0.4)",
        visible: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill?.name) {
      onAddToast("warning", "Please provide a Skill Name.");
      return;
    }

    const updated = cmsStore.saveSkill(editingSkill);
    setSkills(updated);
    setIsModalOpen(false);
    setEditingSkill(null);
    onAddToast("success", "Skill saved successfully! 🏆");
  };

  const handleDelete = () => {
    if (!deleteTargetId) return;
    const updated = cmsStore.deleteSkill(deleteTargetId);
    setSkills(updated);
    setDeleteTargetId(null);
    onAddToast("success", "Skill removed successfully.");
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= skills.length) return;

    const list = [...skills];
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;

    const updated = list.map((item, idx) => ({ ...item, order: idx + 1 }));
    cmsStore.set("skills", updated);
    setSkills(updated);
    onAddToast("info", "Skills reordered.");
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-secondary/60 border border-white/10">
        <div>
          <h2 className="text-lg font-display font-bold text-text-pure flex items-center gap-2">
            <Award size={20} className="text-accent" /> Core Skills & Technical Proficiencies
          </h2>
          <p className="text-xs text-text-soft mt-0.5">
            Manage the skill cards, glowing badges, and brand icons displayed in the About section.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="px-5 py-3 rounded-2xl bg-accent hover:bg-accent-hover text-primary font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-accent/20 transition-all shrink-0"
        >
          <Plus size={16} /> Add New Skill
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.map((s, idx) => (
          <div
            key={s.id}
            className="p-6 rounded-3xl bg-secondary/40 border border-white/10 hover:border-accent/30 transition-all flex items-center justify-between gap-4 group shadow-lg"
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-14 h-14 rounded-2xl bg-primary/80 border border-white/10 flex items-center justify-center p-3 shrink-0 group-hover:scale-105 transition-transform">
                <img
                  src={s.logo}
                  alt={s.name}
                  className="w-full h-full object-contain filter invert opacity-80 group-hover:opacity-100 transition-opacity"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/adobepremierepro.svg";
                  }}
                />
              </div>

              <div className="min-w-0">
                <h3 className="text-base font-display font-bold text-text-pure truncate group-hover:text-accent transition-colors">
                  {s.name}
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-accent/15 text-accent font-mono uppercase">
                  {s.category}
                </span>
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
                disabled={idx === skills.length - 1}
                onClick={() => handleMove(idx, "down")}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-text-soft disabled:opacity-30"
              >
                <ArrowDown size={14} />
              </button>
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
        ))}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && editingSkill && (
        <div className="fixed inset-0 z-[120] bg-primary/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-secondary p-6 sm:p-8 rounded-3xl border border-white/10 max-w-lg w-full shadow-2xl space-y-6">
            <h3 className="text-lg font-display font-bold text-text-pure">
              {editingSkill.id ? "Edit Skill" : "Add New Skill"}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <FormInput
                label="Skill Name"
                required
                placeholder="e.g. Premiere Pro, DaVinci Resolve"
                value={editingSkill.name || ""}
                onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
              />

              <ImagePreviewInput
                label="Brand / Tech Icon URL"
                value={editingSkill.logo || ""}
                onChange={(url) => setEditingSkill({ ...editingSkill, logo: url })}
                aspect="square"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormSelect
                  label="Category"
                  options={CATEGORIES}
                  value={editingSkill.category || "Editing"}
                  onChange={(e) => setEditingSkill({ ...editingSkill, category: e.target.value as any })}
                />

                <FormInput
                  label="Glow Tint (RGBA)"
                  placeholder="rgba(163, 133, 96, 0.4)"
                  value={editingSkill.glowColor || "rgba(163, 133, 96, 0.4)"}
                  onChange={(e) => setEditingSkill({ ...editingSkill, glowColor: e.target.value })}
                />
              </div>

              <FormToggle
                label="Visible on Website"
                checked={editingSkill.visible ?? true}
                onChange={(checked) => setEditingSkill({ ...editingSkill, visible: checked })}
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
                  Save Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        title="Delete Skill"
        message="Are you sure you want to permanently delete this skill?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
}
