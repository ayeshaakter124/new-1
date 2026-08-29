import React, { useState } from "react";
import { Wrench, Plus, Edit3, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { cmsStore } from "../../lib/cmsStore";
import { ToolItem } from "../../lib/cmsTypes";
import { FormInput, FormToggle } from "../components/FormComponents";
import { ConfirmModal } from "../components/ConfirmModal";

interface ToolsManagerProps {
  onAddToast: (type: "success" | "error" | "warning" | "info", message: string) => void;
}

export function ToolsManager({ onAddToast }: ToolsManagerProps) {
  const [tools, setTools] = useState<ToolItem[]>(() => cmsStore.getTools());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<Partial<ToolItem> | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const handleOpenModal = (tool?: ToolItem) => {
    if (tool) {
      setEditingTool({ ...tool });
    } else {
      setEditingTool({
        name: "",
        category: "Video Editing",
        experienceLevel: "Master",
        visible: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTool?.name) {
      onAddToast("warning", "Please provide a Software / Tool Name.");
      return;
    }

    const updated = cmsStore.saveTool(editingTool);
    setTools(updated);
    setIsModalOpen(false);
    setEditingTool(null);
    onAddToast("success", "Tool saved successfully! 🛠️");
  };

  const handleDelete = () => {
    if (!deleteTargetId) return;
    const updated = cmsStore.deleteTool(deleteTargetId);
    setTools(updated);
    setDeleteTargetId(null);
    onAddToast("success", "Tool removed successfully.");
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= tools.length) return;

    const list = [...tools];
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;

    const updated = list.map((item, idx) => ({ ...item, order: idx + 1 }));
    cmsStore.set("tools", updated);
    setTools(updated);
    onAddToast("info", "Tools reordered.");
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-secondary/60 border border-white/10">
        <div>
          <h2 className="text-lg font-display font-bold text-text-pure flex items-center gap-2">
            <Wrench size={20} className="text-accent" /> Software & Production Tools
          </h2>
          <p className="text-xs text-text-soft mt-0.5">
            Manage the software platforms and editing toolkits displayed in the Tools / Brands section.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="px-5 py-3 rounded-2xl bg-accent hover:bg-accent-hover text-primary font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-accent/20 transition-all shrink-0"
        >
          <Plus size={16} /> Add Software / Tool
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {tools.map((t, idx) => (
          <div
            key={t.id}
            className="p-5 rounded-3xl bg-secondary/40 border border-white/10 hover:border-accent/30 transition-all flex flex-col justify-between gap-4 group shadow-lg"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-bold text-accent uppercase font-mono">
                  {t.category}
                </span>
                <span className={`text-[8px] px-2 py-0.5 rounded-full font-bold uppercase ${
                  t.visible ? "bg-green-500/20 text-green-400" : "bg-white/10 text-text-muted"
                }`}>
                  {t.visible ? "Visible" : "Hidden"}
                </span>
              </div>

              <h3 className="text-base font-display font-bold text-text-pure tracking-tight group-hover:text-accent transition-colors">
                {t.name}
              </h3>
              <p className="text-xs text-text-soft font-mono mt-0.5">
                {t.experienceLevel || "Professional"}
              </p>
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
                  disabled={idx === tools.length - 1}
                  onClick={() => handleMove(idx, "down")}
                  className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-text-soft disabled:opacity-30"
                >
                  <ArrowDown size={13} />
                </button>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenModal(t)}
                  className="p-1.5 rounded-lg bg-accent/20 hover:bg-accent/30 text-accent font-bold"
                >
                  <Edit3 size={14} />
                </button>
                <button
                  onClick={() => setDeleteTargetId(t.id)}
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
      {isModalOpen && editingTool && (
        <div className="fixed inset-0 z-[120] bg-primary/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-secondary p-6 sm:p-8 rounded-3xl border border-white/10 max-w-md w-full shadow-2xl space-y-6">
            <h3 className="text-lg font-display font-bold text-text-pure">
              {editingTool.id ? "Edit Software / Tool" : "Add New Software Tool"}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <FormInput
                label="Software / Tool Name"
                required
                placeholder="e.g. Adobe Premiere, CapCut Pro"
                value={editingTool.name || ""}
                onChange={(e) => setEditingTool({ ...editingTool, name: e.target.value })}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput
                  label="Category"
                  placeholder="e.g. Video Editing, VFX"
                  value={editingTool.category || "Video Editing"}
                  onChange={(e) => setEditingTool({ ...editingTool, category: e.target.value })}
                />

                <FormInput
                  label="Experience Level"
                  placeholder="Master, Expert, Advanced"
                  value={editingTool.experienceLevel || "Master"}
                  onChange={(e) => setEditingTool({ ...editingTool, experienceLevel: e.target.value })}
                />
              </div>

              <FormToggle
                label="Visible on Public Website"
                checked={editingTool.visible ?? true}
                onChange={(checked) => setEditingTool({ ...editingTool, visible: checked })}
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
                  Save Tool
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        title="Delete Software Tool"
        message="Are you sure you want to permanently delete this software tool?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
}
