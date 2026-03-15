"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SocialLink = ({ href, label, icon, color }) => {
  if (!href) return null;
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      whileHover={{ scale: 1.04, y: -1 }}
      whileTap={{ scale: 0.96 }}
      className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] hover:border-white/20 transition-all text-sm text-white/50 hover:text-white/90"
    >
      <span style={{ color }}>{icon}</span>
      <span className="font-mono text-xs tracking-wide">{label}</span>
    </motion.a>
  );
};

const LinkedInSVG = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const GitHubSVG = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
  </svg>
);

const TwitterSVG = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
  </svg>
);

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export default function TeamModal({ member, onClose }) {
  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Escape key to close
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <AnimatePresence>
      {member && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-40 modal-backdrop"
            style={{ background: "rgba(8,8,16,0.85)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal panel */}
          <motion.div
            key="modal"
            role="dialog"
            aria-modal="true"
            aria-label={`${member.name} profile`}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-full max-w-lg rounded-3xl overflow-hidden border-gradient"
              style={{ background: "#0d0d1a" }}
              initial={{ opacity: 0, scale: 0.94, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top gradient band */}
              <div
                className="absolute top-0 left-0 right-0 h-40 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(139,92,246,0.12) 0%, transparent 100%)",
                }}
              />

              {/* Close button */}
              <motion.button
                onClick={onClose}
                className="absolute top-5 right-5 z-10 w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Close modal"
              >
                <CloseIcon />
              </motion.button>

              {/* Content */}
              <div className="relative p-7 md:p-9">
                {/* Header: photo + name */}
                <div className="flex items-start gap-5 mb-7">
                  <motion.div
                    className="relative flex-shrink-0"
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1, duration: 0.4, ease: "easeOut" }}
                  >
                    {/* Glow ring */}
                    <div
                      className="absolute -inset-1 rounded-2xl blur-xl opacity-50"
                      style={{
                        background:
                          "radial-gradient(circle, rgba(139,92,246,0.5), rgba(249,115,22,0.3))",
                      }}
                    />
                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden border border-white/10">
                      <img
                        src={member.photo_url}
                        alt={member.name}
                        className="w-full h-full object-cover"
                        style={{ background: "#1a1a2e" }}
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15, duration: 0.4 }}
                    className="pt-1"
                  >
                    <h2
                      className="text-2xl font-black text-white leading-tight mb-1"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {member.name}
                    </h2>
                    <p className="text-xs font-mono tracking-widest uppercase text-aurora-orange/70">
                      {member.role}
                    </p>
                  </motion.div>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-white/5 mb-6" />

                {/* Full bio */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                >
                  <p className="text-xs font-mono uppercase tracking-widest text-white/20 mb-3">
                    About
                  </p>
                  <p className="text-sm text-white/60 leading-relaxed">
                    {member.bio}
                  </p>
                </motion.div>

                {/* Social links */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.28, duration: 0.4 }}
                  className="mt-7"
                >
                  <p className="text-xs font-mono uppercase tracking-widest text-white/20 mb-3">
                    Connect
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <SocialLink
                      href={member.linkedin_url}
                      label="LinkedIn"
                      icon={<LinkedInSVG />}
                      color="rgba(10,102,194,0.9)"
                    />
                    <SocialLink
                      href={member.github_url}
                      label="GitHub"
                      icon={<GitHubSVG />}
                      color="rgba(255,255,255,0.7)"
                    />
                    <SocialLink
                      href={member.twitter_url}
                      label="Twitter / X"
                      icon={<TwitterSVG />}
                      color="rgba(29,161,242,0.9)"
                    />
                  </div>
                </motion.div>

                {/* Bottom decorative line */}
                <motion.div
                  className="mt-8 h-px w-full"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(139,92,246,0.3), rgba(249,115,22,0.2), transparent)",
                  }}
                  initial={{ scaleX: 0, originX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.35, duration: 0.5, ease: "easeOut" }}
                />
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
