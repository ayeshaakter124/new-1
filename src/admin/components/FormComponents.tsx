import React, { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from "react";
import { HelpCircle } from "lucide-react";

interface FormFieldProps {
  label: string;
  hint?: string;
  required?: boolean;
  error?: string;
  className?: string;
}

export function FormInput({
  label,
  hint,
  required,
  error,
  className = "",
  ...props
}: FormFieldProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-bold text-accent uppercase tracking-wider block">
          {label} {required && <span className="text-red-400">*</span>}
        </label>
        {hint && (
          <span className="text-[10px] text-text-muted flex items-center gap-1">
            <HelpCircle size={10} /> {hint}
          </span>
        )}
      </div>
      <input
        {...props}
        className={`w-full bg-primary/70 border ${
          error ? "border-red-500/50" : "border-white/10 focus:border-accent"
        } rounded-xl px-4 py-3 text-xs text-text-pure placeholder:text-text-muted/40 focus:outline-none transition-all`}
      />
      {error && <p className="text-[10px] text-red-400 font-semibold">{error}</p>}
    </div>
  );
}

export function FormTextarea({
  label,
  hint,
  required,
  error,
  className = "",
  rows = 3,
  ...props
}: FormFieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-bold text-accent uppercase tracking-wider block">
          {label} {required && <span className="text-red-400">*</span>}
        </label>
        {hint && (
          <span className="text-[10px] text-text-muted flex items-center gap-1">
            <HelpCircle size={10} /> {hint}
          </span>
        )}
      </div>
      <textarea
        rows={rows}
        {...props}
        className={`w-full bg-primary/70 border ${
          error ? "border-red-500/50" : "border-white/10 focus:border-accent"
        } rounded-xl px-4 py-3 text-xs text-text-pure placeholder:text-text-muted/40 focus:outline-none transition-all resize-y`}
      />
      {error && <p className="text-[10px] text-red-400 font-semibold">{error}</p>}
    </div>
  );
}

export function FormSelect({
  label,
  hint,
  required,
  error,
  options,
  className = "",
  ...props
}: FormFieldProps & SelectHTMLAttributes<HTMLSelectElement> & { options: Array<{ label: string; value: string | number }> }) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-bold text-accent uppercase tracking-wider block">
          {label} {required && <span className="text-red-400">*</span>}
        </label>
        {hint && (
          <span className="text-[10px] text-text-muted flex items-center gap-1">
            <HelpCircle size={10} /> {hint}
          </span>
        )}
      </div>
      <select
        {...props}
        className={`w-full bg-primary/70 border ${
          error ? "border-red-500/50" : "border-white/10 focus:border-accent"
        } rounded-xl px-4 py-3 text-xs text-text-pure focus:outline-none transition-all cursor-pointer`}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-secondary text-text-pure">
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-[10px] text-red-400 font-semibold">{error}</p>}
    </div>
  );
}

export function FormToggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between p-4 bg-primary/40 rounded-2xl border border-white/5 gap-4">
      <div>
        <p className="text-xs font-bold text-text-pure">{label}</p>
        {description && <p className="text-[10px] text-text-muted mt-0.5">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-1 shrink-0 ${
          checked ? "bg-accent" : "bg-white/10"
        }`}
      >
        <span
          className={`w-4 h-4 rounded-full bg-primary transition-transform duration-200 transform ${
            checked ? "translate-x-6 bg-primary" : "translate-x-0 bg-white/70"
          }`}
        />
      </button>
    </div>
  );
}

export function ImagePreviewInput({
  label,
  value,
  onChange,
  aspect = "video",
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  aspect?: "square" | "video" | "reel" | "portrait";
}) {
  const aspectClasses = {
    square: "aspect-square",
    video: "aspect-video",
    reel: "aspect-[9/16]",
    portrait: "aspect-[4/5]",
  };

  return (
    <div className="space-y-3">
      <label className="text-[11px] font-bold text-accent uppercase tracking-wider block">
        {label}
      </label>
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        {value && (
          <div className={`w-28 sm:w-36 ${aspectClasses[aspect]} rounded-2xl overflow-hidden border border-white/10 bg-primary/80 shrink-0 relative group`}>
            <img 
              src={value} 
              alt="Preview" 
              className="w-full h-full object-cover" 
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=800&auto=format&fit=crop";
              }}
            />
          </div>
        )}
        <div className="flex-1 w-full space-y-2">
          <input
            type="text"
            placeholder="Paste image URL (https://...)"
            value={value}
            onChange={(e) => onChange(e.target.value.trim())}
            className="w-full bg-primary/70 border border-white/10 focus:border-accent rounded-xl px-4 py-3 text-xs text-text-pure placeholder:text-text-muted/40 focus:outline-none transition-all"
          />
          <p className="text-[10px] text-text-muted leading-relaxed">
            Support: Direct image links from ImgBB, PostImages, Cloudinary, Unsplash, or local assets.
          </p>
        </div>
      </div>
    </div>
  );
}
