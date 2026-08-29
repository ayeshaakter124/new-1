import { AlertTriangle } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
  isDangerous = true,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-primary/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-secondary p-6 sm:p-8 rounded-3xl border border-white/10 max-w-md w-full shadow-2xl space-y-6">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${isDangerous ? "bg-red-500/20 text-red-400" : "bg-accent/20 text-accent"}`}>
            <AlertTriangle size={24} />
          </div>
          <div>
            <h3 className="text-lg font-display font-bold text-text-pure">{title}</h3>
            <p className="text-xs text-text-soft mt-1 leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-text-soft hover:text-text-pure text-xs font-bold transition-all"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all uppercase tracking-wider ${
              isDangerous 
                ? "bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/20" 
                : "bg-accent hover:bg-accent-hover text-primary font-bold"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
