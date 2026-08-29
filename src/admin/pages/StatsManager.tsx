import React, { useState } from "react";
import { BarChart3, Plus, Edit3, Trash2, ArrowUp, ArrowDown, TrendingUp, Award, Film, Users, Heart, Star, Globe, CheckCircle2 } from "lucide-react";
import { cmsStore } from "../../lib/cmsStore";
import { StatItem } from "../../lib/cmsTypes";
import { FormInput, FormTextarea, FormSelect, FormToggle } from "../components/FormComponents";
import { ConfirmModal } from "../components/ConfirmModal";

interface StatsManagerProps {
  onAddToast: (type: "success" | "error" | "warning" | "info", message: string) => void;
}

const ICON_OPTIONS = [
  { label: "Award (Experience / Quality)", value: "Award" },
  { label: "Film (Projects / Videos)", value: "Film" },
  { label: "Users (Clients / Audience)", value: "Users" },
  { label: "TrendingUp (Growth / Conversion)", value: "TrendingUp" },
  { label: "Heart (Satisfaction / Rating)", value: "Heart" },
  { label: "Star (Top Rated)", value: "Star" },
  { label: "Globe (Global Reach)", value: "Globe" },
  { label: "CheckCircle2 (Verification)", value: "CheckCircle2" },
];

export function StatsManager({ onAddToast }: StatsManagerProps) {
  const [stats, setStats] = useState<StatItem[]>(() => cmsStore.getStats());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStat, setEditingStat] = useState<Partial<StatItem> | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const handleOpenModal = (stat?: StatItem) => {
    if (stat) {
      setEditingStat({ ...stat });
    } else {
      setEditingStat({
        label: "",
        value: "100+",
        detail: "",
        iconName: "TrendingUp",
        visible: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStat?.label || !editingStat?.value) {
      onAddToast("warning", "Please provide both a Label and Value.");
      return;
    }

    const updated = cmsStore.saveStat(editingStat);
    setStats(updated);
    setIsModalOpen(false);
    setEditingStat(null);
    onAddToast("success", "Statistic metric saved successfully! 📊");
  };

  const handleDelete = () => {
    if (!deleteTargetId) return;
    const updated = cmsStore.deleteStat(deleteTargetId);
    setStats(updated);
    setDeleteTargetId(null);
    onAddToast("success", "Statistic metric deleted.");
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= stats.length) return;

    const list = [...stats];
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;

    const updated = list.map((item, idx) => ({ ...item, order: idx + 1 }));
    cmsStore.set("stats", updated);
    setStats(updated);
    onAddToast("info", "Statistics reordered.");
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-secondary/60 border border-white/10">
        <div>
          <h2 className="text-lg font-display font-bold text-text-pure flex items-center gap-2">
            <BarChart3 size={20} className="text-accent" /> Key Performance Statistics & Counters
          </h2>
          <p className="text-xs text-text-soft mt-0.5">
            Configure the numerical metrics, percentages, and counters displayed in Hero, About, and Why Hire Me.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="px-5 py-3 rounded-2xl bg-accent hover:bg-accent-hover text-primary font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-accent/20 transition-all shrink-0"
        >
          <Plus size={16} /> Add Custom Statistic
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((s, idx) => (
          <div
            key={s.id}
            className="p-6 rounded-3xl bg-secondary/40 border border-white/10 hover:border-accent/30 transition-all flex flex-col justify-between gap-4 group shadow-lg"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-bold text-accent uppercase tracking-widest">
                  {s.label}
                </span>
                <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${s.visible ? "bg-green-500/20 text-green-400" : "bg-white/10 text-text-muted"}`}>
                  {s.visible ? "Visible" : "Hidden"}
                </span>
              </div>

              <h3 className="text-3xl font-display font-bold text-text-pure tracking-tight">
                {s.value}
              </h3>
              <p className="text-xs text-text-soft mt-1 leading-relaxed">
                {s.detail}
              </p>
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
                  disabled={idx === stats.length - 1}
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
      {isModalOpen && editingStat && (
        <div className="fixed inset-0 z-[120] bg-primary/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-secondary p-6 sm:p-8 rounded-3xl border border-white/10 max-w-lg w-full shadow-2xl space-y-6">
            <h3 className="text-lg font-display font-bold text-text-pure">
              {editingStat.id ? "Edit Statistic" : "Create New Statistic"}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput
                  label="Display Value"
                  required
                  placeholder="e.g. 183+, 99%, 5+ Years"
                  value={editingStat.value || ""}
                  onChange={(e) => setEditingStat({ ...editingStat, value: e.target.value })}
                />
                <FormInput
                  label="Metric Label"
                  required
                  placeholder="e.g. Projects Completed"
                  value={editingStat.label || ""}
                  onChange={(e) => setEditingStat({ ...editingStat, label: e.target.value })}
                />
              </div>

              <FormSelect
                label="Visual Icon"
                options={ICON_OPTIONS}
                value={editingStat.iconName || "TrendingUp"}
                onChange={(e) => setEditingStat({ ...editingStat, iconName: e.target.value as any })}
              />

              <FormTextarea
                label="Detail Description"
                rows={2}
                placeholder="Brief explanation shown on hover / cards..."
                value={editingStat.detail || ""}
                onChange={(e) => setEditingStat({ ...editingStat, detail: e.target.value })}
              />

              <FormToggle
                label="Visible on Public Website"
                checked={editingStat.visible ?? true}
                onChange={(checked) => setEditingStat({ ...editingStat, visible: checked })}
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
                  Save Statistic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        title="Delete Statistic"
        message="Are you sure you want to permanently delete this statistical metric?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
}
