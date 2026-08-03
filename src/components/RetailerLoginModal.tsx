import React, { useState } from "react";
import { motion } from "motion/react";
import { Lock, User, Eye, EyeOff, AlertCircle, X, ShieldAlert } from "lucide-react";

interface RetailerLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function RetailerLoginModal({
  isOpen,
  onClose,
  onSuccess,
}: RetailerLoginModalProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Mimic database authentication check with 450ms network delay simulation
    setTimeout(() => {
      // Hardcoded credentials
      if (username.trim().toLowerCase() === "admin" && password === "admin123") {
        setLoading(false);
        onSuccess();
      } else {
        setLoading(false);
        setError("Invalid credentials. Please verify your username and password.");
      }
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs"
      />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: "spring", duration: 0.4 }}
        className="relative w-full max-w-md bg-surface border border-border-subtle p-6 md:p-8 shadow-2xl flex flex-col gap-6 z-10"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-text-muted hover:text-primary hover:bg-neutral-100 transition-colors cursor-pointer"
          aria-label="Close credentials panel"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shrink-0"></span>
            <span className="text-[10px] font-mono tracking-widest uppercase text-text-muted">
              Secure Operations Portal
            </span>
          </div>
          <h2 className="font-headline-lg text-lg md:text-xl font-bold text-primary tracking-tight">
            CARTIS ENTERPRISE SIGN-IN
          </h2>
          <p className="font-body-md text-xs text-text-muted">
            Authorize your device with administrative credentials to access sales forecasts, live inventory, and model parameters.
          </p>
        </div>

        {/* Credentials Info Note */}
        <div className="bg-neutral-50 border border-neutral-200 p-3 flex gap-2.5 items-start">
          <ShieldAlert className="w-4 h-4 text-neutral-800 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-mono text-[10px] font-bold text-neutral-800 block uppercase tracking-wider">
              DEMO CREDENTIALS
            </span>
            <p className="font-mono text-[11px] text-neutral-600 leading-relaxed">
              Username: <strong className="text-black font-bold">admin</strong> <br />
              Password: <strong className="text-black font-bold">admin123</strong>
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username Field */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono uppercase tracking-wider text-text-muted font-bold block">
              Username
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400">
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                required
                disabled={loading}
                autoFocus
                placeholder="Enter enterprise username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-surface-paper border border-border-subtle pl-10 pr-4 py-2.5 text-xs text-primary placeholder:text-neutral-400 focus:outline-none focus:border-neutral-800 focus:ring-1 focus:ring-neutral-800 transition-all font-body-md"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono uppercase tracking-wider text-text-muted font-bold block">
              Password
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                required
                disabled={loading}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface-paper border border-border-subtle pl-10 pr-10 py-2.5 text-xs text-primary placeholder:text-neutral-400 focus:outline-none focus:border-neutral-800 focus:ring-1 focus:ring-neutral-800 transition-all font-body-md"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-primary p-0.5"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-900 p-3 flex gap-2 items-start text-[11px]"
            >
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 border border-border-subtle hover:bg-neutral-50 text-neutral-700 py-2.5 text-xs font-semibold cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-black text-white hover:bg-neutral-800 py-2.5 text-xs font-semibold cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Verifying...</span>
                </>
              ) : (
                <span>Authorize Access</span>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
