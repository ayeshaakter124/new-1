import React, { useState } from "react";
import { Mail, Phone, MessageSquare, Trash2, CheckCircle2, Save, ExternalLink, Send } from "lucide-react";
import { cmsStore } from "../../lib/cmsStore";
import { ContactInfo, ContactMessage } from "../../lib/cmsTypes";
import { FormInput, FormTextarea } from "../components/FormComponents";
import { ConfirmModal } from "../components/ConfirmModal";

interface ContactInfoManagerProps {
  onAddToast: (type: "success" | "error" | "warning" | "info", message: string) => void;
}

export function ContactInfoManager({ onAddToast }: ContactInfoManagerProps) {
  const [contactInfo, setContactInfo] = useState<ContactInfo>(() => cmsStore.getContactInfo());
  const [messages, setMessages] = useState<ContactMessage[]>(() => cmsStore.getMessages());
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveContactInfo = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      cmsStore.saveContactInfo(contactInfo);
      setIsSaving(false);
      onAddToast("success", "Contact information saved successfully! 📬");
    } catch (err: any) {
      setIsSaving(false);
      onAddToast("error", `Failed to save: ${err.message}`);
    }
  };

  const handleMarkRead = (id: string) => {
    const updated = cmsStore.markMessageRead(id);
    setMessages(updated);
    onAddToast("info", "Inquiry marked as read.");
  };

  const handleDeleteMessage = () => {
    if (!deleteTargetId) return;
    const updated = cmsStore.deleteMessage(deleteTargetId);
    setMessages(updated);
    setDeleteTargetId(null);
    onAddToast("success", "Inquiry deleted from inbox.");
  };

  const cleanWhatsApp = (contactInfo.whatsapp || "880157735667").replace(/[^0-9]/g, "");

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* Contact Settings Card */}
      <form onSubmit={handleSaveContactInfo} className="p-6 sm:p-8 rounded-3xl bg-secondary/60 border border-white/10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h2 className="text-lg font-display font-bold text-text-pure flex items-center gap-2">
              <Mail size={20} className="text-accent" /> Direct Contact Channels & Details
            </h2>
            <p className="text-xs text-text-soft mt-0.5">
              Configure your direct email address, WhatsApp number, and contact section headings.
            </p>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 rounded-2xl bg-accent hover:bg-accent-hover text-primary font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-accent/20 transition-all shrink-0"
          >
            <Save size={15} />
            <span>{isSaving ? "Saving..." : "Save Contact Info"}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <FormInput
            label="Direct Email"
            type="email"
            required
            value={contactInfo.email}
            onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
          />

          <FormInput
            label="WhatsApp Number (with country code)"
            required
            value={contactInfo.whatsapp}
            onChange={(e) => setContactInfo({ ...contactInfo, whatsapp: e.target.value })}
          />

          <FormInput
            label="Phone Number"
            value={contactInfo.phone}
            onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FormInput
            label="Section Subheading Badge"
            value={contactInfo.subheading}
            onChange={(e) => setContactInfo({ ...contactInfo, subheading: e.target.value })}
          />

          <FormInput
            label="Section Main Heading"
            value={contactInfo.heading}
            onChange={(e) => setContactInfo({ ...contactInfo, heading: e.target.value })}
          />
        </div>

        <FormTextarea
          label="Contact Narrative Intro"
          rows={2}
          value={contactInfo.description}
          onChange={(e) => setContactInfo({ ...contactInfo, description: e.target.value })}
        />
      </form>

      {/* Inquiry Inbox Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-display font-bold text-text-pure flex items-center gap-2">
              <MessageSquare size={20} className="text-accent" /> Client Inquiry Inbox ({messages.length})
            </h3>
            <p className="text-xs text-text-soft mt-0.5">
              Messages submitted through the public website contact form.
            </p>
          </div>

          <span className="text-xs px-3 py-1 rounded-full bg-accent/15 text-accent font-bold font-mono">
            {messages.filter(m => !m.read).length} Unread
          </span>
        </div>

        <div className="space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`p-6 rounded-3xl border transition-all space-y-4 ${
                m.read
                  ? "bg-secondary/40 border-white/5"
                  : "bg-secondary border-accent/40 shadow-xl"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h4 className="font-display font-bold text-base text-text-pure">{m.name}</h4>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-accent/20 text-accent font-bold uppercase">
                      {m.ventureNature}
                    </span>
                    {!m.read && (
                      <span className="text-[9px] px-2 py-0.5 rounded bg-red-500 text-white font-bold uppercase">
                        NEW
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-text-muted mt-1 font-mono">
                    {m.email} • {new Date(m.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(`Hi ${m.name}, regarding your inquiry "${m.ventureNature}"...`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-green-600/20 hover:bg-green-600/30 text-green-400 text-xs font-bold flex items-center gap-1.5 transition-all"
                  >
                    <Send size={13} /> WhatsApp Reply
                  </a>

                  <a
                    href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.ventureNature} - Rehman Hridoy`)}`}
                    className="px-3 py-1.5 rounded-xl bg-accent/20 hover:bg-accent/30 text-accent text-xs font-bold flex items-center gap-1.5 transition-all"
                  >
                    <Mail size={13} /> Email Reply
                  </a>

                  {!m.read && (
                    <button
                      onClick={() => handleMarkRead(m.id)}
                      className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-text-soft"
                      title="Mark as Read"
                    >
                      <CheckCircle2 size={16} />
                    </button>
                  )}

                  <button
                    onClick={() => setDeleteTargetId(m.id)}
                    className="p-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400"
                    title="Delete Message"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-primary/60 border border-white/5 text-xs text-text-soft leading-relaxed whitespace-pre-wrap font-light">
                {m.message}
              </div>
            </div>
          ))}

          {messages.length === 0 && (
            <div className="py-20 text-center text-text-muted bg-secondary/20 rounded-3xl border border-white/5 space-y-2">
              <Mail size={32} className="mx-auto text-text-muted/40" />
              <p className="text-sm font-medium">Inbox is clean. No inquiries received yet.</p>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        title="Delete Inquiry"
        message="Are you sure you want to permanently delete this message from your inbox?"
        onConfirm={handleDeleteMessage}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
}
