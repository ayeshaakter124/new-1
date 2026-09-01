import React, { useState, FormEvent } from "react";
import { ShieldCheck, Eye, EyeOff, Lock, User, ArrowLeft } from "lucide-react";
import { authStore } from "../../lib/authStore";

interface AdminLoginPageProps {
  onLoginSuccess: () => void;
}

export function AdminLoginPage({ onLoginSuccess }: AdminLoginPageProps) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setErrorMsg("Please enter your secret password.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    setTimeout(() => {
      const res = authStore.login(identifier || "admin", password);
      setIsLoading(false);

      if (res.success) {
        onLoginSuccess();
      } else {
        setErrorMsg(res.error || "Access Denied: Incorrect secret key.");
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-6 py-12 text-text-pure relative overflow-hidden">
      {/* Ambient Burgundy/Gold Backlights */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-accent/10 rounded-full blur-[60px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[250px] sm:w-[350px] h-[250px] sm:h-[350px] bg-panel/10 rounded-full blur-[50px] pointer-events-none" />

      <div className="max-w-md w-full bg-secondary/80 backdrop-blur-2xl p-8 sm:p-10 rounded-[36px] border border-accent/20 shadow-2xl relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center text-primary mx-auto mb-4 shadow-xl shadow-accent/20">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-text-pure tracking-tight">
            CMS Studio Gateway
          </h1>
          <p className="text-xs text-text-muted mt-1.5 tracking-widest uppercase font-bold">
            Rehman Hridoy • Restricted Access
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username / Email */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-accent uppercase tracking-[0.2em] block">
              Username or Email
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="admin or email..."
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full bg-primary/80 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:border-accent text-text-pure placeholder:text-text-muted/40 text-xs transition-all"
              />
              <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-accent uppercase tracking-[0.2em] block">
              Secret Key / Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter admin password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-primary/80 border border-white/10 rounded-xl pl-11 pr-12 py-3.5 focus:outline-none focus:border-accent text-text-pure placeholder:text-text-muted/40 text-xs transition-all"
                autoFocus
              />
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-accent transition-colors p-1"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-semibold text-center animate-fadeIn">
              {errorMsg}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-accent hover:bg-accent-hover text-primary font-bold rounded-xl transition-all duration-300 uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-lg shadow-accent/20 disabled:opacity-50"
          >
            {isLoading ? "Authenticating..." : "Unlock Studio Dashboard"}
          </button>
        </form>

        {/* Back Link */}
        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-xs text-text-soft hover:text-accent transition-colors"
          >
            <ArrowLeft size={14} /> Back to Live Portfolio
          </a>
        </div>
      </div>
    </div>
  );
}
