import React, { useState } from "react";
import {
  Settings,
  Lock,
  Cloud,
  RefreshCw,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Eye,
  EyeOff,
  Database,
  Save,
  Check
} from "lucide-react";
import { authStore } from "../../lib/authStore";
import { cloudStore, SUPABASE_SQL_SETUP } from "../../lib/cloudStore";
import { cmsStore } from "../../lib/cmsStore";
import { FormInput, FormToggle } from "../components/FormComponents";
import { ConfirmModal } from "../components/ConfirmModal";

interface SettingsManagerProps {
  onAddToast: (type: "success" | "error" | "warning" | "info", message: string) => void;
}

export function SettingsManager({ onAddToast }: SettingsManagerProps) {
  // Password state
  const [currentUsername, setCurrentUsername] = useState(() => authStore.getStoredUsername());
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Cloud state
  const [cloudConfig, setCloudConfig] = useState(() => cloudStore.getConfig());
  const [isTestingCloud, setIsTestingCloud] = useState(false);
  const [isPushingCloud, setIsPushingCloud] = useState(false);
  const [isPullingCloud, setIsPullingCloud] = useState(false);
  const [cloudTestResult, setCloudTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isSqlCopied, setIsSqlCopied] = useState(false);

  // Backup & Reset state
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [importJsonText, setImportJsonText] = useState("");
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Handle Password Update
  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword.trim()) {
      onAddToast("warning", "Please enter a new password.");
      return;
    }
    if (newPassword.length < 4) {
      onAddToast("warning", "Password must be at least 4 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      onAddToast("error", "Passwords do not match.");
      return;
    }

    try {
      authStore.setStoredPassword(newPassword);
      authStore.setStoredUsername(currentUsername);
      setNewPassword("");
      setConfirmPassword("");
      onAddToast("success", "Admin login credentials updated successfully! 🔒");
    } catch (err: any) {
      onAddToast("error", err.message);
    }
  };

  // Handle Cloud Config Save
  const handleSaveCloudConfig = (e: React.FormEvent) => {
    e.preventDefault();
    cloudStore.saveConfig(cloudConfig);
    onAddToast("success", "Supabase Cloud Database settings saved! ☁️");
  };

  // Test Cloud Connection
  const handleTestCloud = async () => {
    setIsTestingCloud(true);
    setCloudTestResult(null);
    cloudStore.saveConfig(cloudConfig);

    const res = await cloudStore.testConnection(cloudConfig.supabaseUrl, cloudConfig.supabaseAnonKey);
    setIsTestingCloud(false);
    setCloudTestResult(res);

    if (res.success) {
      onAddToast("success", res.message);
    } else {
      onAddToast("error", res.message);
    }
  };

  // Push All Local to Cloud
  const handlePushAll = async () => {
    setIsPushingCloud(true);
    const res = await cmsStore.syncAllToCloud();
    setIsPushingCloud(false);
    if (res.success) {
      onAddToast("success", res.message);
    } else {
      onAddToast("error", res.message);
    }
  };

  // Pull All Remote from Cloud
  const handlePullAll = async () => {
    setIsPullingCloud(true);
    const success = await cmsStore.loadFromCloud();
    setIsPullingCloud(false);
    if (success) {
      onAddToast("success", "All data successfully reloaded from Cloud Database! 🔄");
    } else {
      onAddToast("error", "Failed to fetch data from Cloud Database.");
    }
  };

  // Copy SQL Schema
  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SETUP);
    setIsSqlCopied(true);
    onAddToast("info", "Supabase SQL setup script copied to clipboard!");
    setTimeout(() => setIsSqlCopied(false), 2500);
  };

  // Export JSON Snapshot
  const handleExportJson = () => {
    const json = cmsStore.exportFullSnapshot();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rehman_hridoy_cms_backup_${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    onAddToast("success", "Complete CMS JSON snapshot downloaded! 📦");
  };

  // Import JSON Snapshot
  const handleImportJson = () => {
    if (!importJsonText.trim()) {
      onAddToast("warning", "Please paste valid JSON backup data.");
      return;
    }
    const ok = cmsStore.importSnapshot(importJsonText);
    if (ok) {
      setIsImportModalOpen(false);
      setImportJsonText("");
      onAddToast("success", "CMS data restored from JSON backup! 🚀");
    } else {
      onAddToast("error", "Invalid JSON data. Please check backup formatting.");
    }
  };

  // Factory Reset
  const handleResetFactory = () => {
    cmsStore.resetAllToDefault();
    setIsResetConfirmOpen(false);
    onAddToast("success", "All CMS data reset to default factory baseline.");
    setTimeout(() => window.location.reload(), 800);
  };

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-secondary/60 border border-white/10">
        <h2 className="text-lg font-display font-bold text-text-pure flex items-center gap-2">
          <Settings size={20} className="text-accent" /> System Settings & Cloud Database
        </h2>
        <p className="text-xs text-text-soft mt-0.5">
          Manage Admin credentials, Supabase Cloud Database synchronization, data backups, and restoration.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Supabase Global Cloud Database Sync */}
        <div className="p-6 sm:p-8 rounded-3xl bg-secondary/40 border border-white/10 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-sm font-display font-bold text-text-pure flex items-center gap-2">
              <Cloud size={18} className="text-accent" /> Supabase Cloud Database
            </h3>
            <span className="text-[9px] px-2.5 py-0.5 rounded-full bg-accent/20 text-accent font-bold uppercase">
              Global Persistence
            </span>
          </div>

          <form onSubmit={handleSaveCloudConfig} className="space-y-4">
            <FormInput
              label="Supabase Project URL"
              placeholder="https://xyzcompany.supabase.co"
              value={cloudConfig.supabaseUrl}
              onChange={(e) => setCloudConfig({ ...cloudConfig, supabaseUrl: e.target.value })}
            />

            <FormInput
              label="Supabase Anon / Public Key"
              type="password"
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
              value={cloudConfig.supabaseAnonKey}
              onChange={(e) => setCloudConfig({ ...cloudConfig, supabaseAnonKey: e.target.value })}
            />

            <FormToggle
              label="Automatic Background Cloud Sync"
              description="Automatically push all CMS edits to Supabase in real-time"
              checked={cloudConfig.autoSync}
              onChange={(checked) => setCloudConfig({ ...cloudConfig, autoSync: checked })}
            />

            <div className="flex flex-wrap gap-2 pt-2">
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-accent text-primary font-bold text-xs uppercase tracking-wider flex items-center gap-1.5"
              >
                <Save size={14} /> Save Config
              </button>

              <button
                type="button"
                onClick={handleTestCloud}
                disabled={isTestingCloud}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-text-pure font-bold text-xs uppercase flex items-center gap-1.5 transition-all"
              >
                <RefreshCw size={14} className={isTestingCloud ? "animate-spin" : ""} />
                <span>{isTestingCloud ? "Testing..." : "Test Connection"}</span>
              </button>

              <button
                type="button"
                onClick={handlePushAll}
                disabled={isPushingCloud}
                className="px-4 py-2.5 rounded-xl bg-green-500/20 hover:bg-green-500/30 text-green-400 font-bold text-xs uppercase flex items-center gap-1.5 transition-all"
              >
                <Upload size={14} />
                <span>{isPushingCloud ? "Pushing..." : "Push All to Cloud"}</span>
              </button>

              <button
                type="button"
                onClick={handlePullAll}
                disabled={isPullingCloud}
                className="px-4 py-2.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-400 font-bold text-xs uppercase flex items-center gap-1.5 transition-all"
              >
                <Download size={14} />
                <span>{isPullingCloud ? "Pulling..." : "Pull from Cloud"}</span>
              </button>
            </div>
          </form>

          {/* Test Status Message */}
          {cloudTestResult && (
            <div
              className={`p-4 rounded-2xl border text-xs font-semibold leading-relaxed animate-fadeIn ${
                cloudTestResult.success
                  ? "bg-green-500/10 border-green-500/30 text-green-300"
                  : "bg-red-500/10 border-red-500/30 text-red-300"
              }`}
            >
              {cloudTestResult.message}
            </div>
          )}

          {/* SQL Schema Copy Card */}
          <div className="p-4 rounded-2xl bg-primary/60 border border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-accent uppercase font-mono">
                Supabase SQL Setup Code
              </span>
              <button
                onClick={handleCopySql}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-accent hover:text-primary transition-all text-[10px] font-bold flex items-center gap-1"
              >
                {isSqlCopied ? <Check size={12} /> : <Copy size={12} />}
                <span>{isSqlCopied ? "Copied" : "Copy SQL"}</span>
              </button>
            </div>
            <pre className="text-[10px] text-text-muted font-mono overflow-x-auto p-2 bg-black/40 rounded-xl leading-relaxed">
              {SUPABASE_SQL_SETUP.slice(0, 160)}...
            </pre>
          </div>
        </div>

        {/* Security & Password Manager */}
        <div className="p-6 sm:p-8 rounded-3xl bg-secondary/40 border border-white/10 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-sm font-display font-bold text-text-pure flex items-center gap-2">
              <Lock size={18} className="text-accent" /> Admin Access & Credentials
            </h3>
            <span className="text-[9px] px-2.5 py-0.5 rounded-full bg-accent/20 text-accent font-bold uppercase">
              Protected
            </span>
          </div>

          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <FormInput
              label="Admin Username / Login Identifier"
              required
              value={currentUsername}
              onChange={(e) => setCurrentUsername(e.target.value)}
            />

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-accent uppercase tracking-wider block">
                New Password / Secret Key
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password (min 4 characters)..."
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-primary/70 border border-white/10 focus:border-accent rounded-xl px-4 py-3 text-xs text-text-pure focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-accent"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <FormInput
              label="Confirm New Password"
              type="password"
              placeholder="Confirm new password..."
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-accent hover:bg-accent-hover text-primary font-bold text-xs uppercase tracking-wider shadow-lg shadow-accent/20 transition-all flex items-center gap-2"
            >
              <Lock size={14} /> Update Credentials
            </button>
          </form>

          {/* Backup & Factory Reset */}
          <div className="pt-6 border-t border-white/10 space-y-4">
            <h4 className="text-xs font-bold text-accent uppercase tracking-wider">
              Backup & Maintenance
            </h4>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleExportJson}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-text-pure flex items-center gap-2 transition-all border border-white/5"
              >
                <Download size={14} /> Export Backup (.JSON)
              </button>

              <button
                type="button"
                onClick={() => setIsImportModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-text-pure flex items-center gap-2 transition-all border border-white/5"
              >
                <Upload size={14} /> Import Backup
              </button>

              <button
                type="button"
                onClick={() => setIsResetConfirmOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-xs font-bold text-red-400 flex items-center gap-2 transition-all border border-red-500/20"
              >
                <AlertTriangle size={14} /> Reset to Defaults
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Import Backup Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-[120] bg-primary/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-secondary p-6 sm:p-8 rounded-3xl border border-white/10 max-w-lg w-full shadow-2xl space-y-6">
            <h3 className="text-lg font-display font-bold text-text-pure">
              Import CMS Backup Snapshot
            </h3>
            <p className="text-xs text-text-soft">
              Paste the JSON snapshot text previously exported from this CMS Studio.
            </p>

            <textarea
              rows={6}
              placeholder='Paste JSON here (e.g. {"profile": {...}})...'
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              className="w-full bg-primary/80 border border-white/10 focus:border-accent rounded-xl p-4 text-xs font-mono text-text-pure focus:outline-none"
            />

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-text-soft"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleImportJson}
                className="px-6 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-primary text-xs font-bold uppercase tracking-wider"
              >
                Restore Snapshot
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Factory Reset Confirmation */}
      <ConfirmModal
        isOpen={isResetConfirmOpen}
        title="Factory Reset All CMS Data"
        message="Are you sure you want to reset all portfolio projects, journey timeline items, and configurations to default? This cannot be undone."
        confirmText="Reset Everything"
        onConfirm={handleResetFactory}
        onCancel={() => setIsResetConfirmOpen(false)}
      />
    </div>
  );
}
