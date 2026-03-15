"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PhotoUpload from "./PhotoUpload";

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const FIELD_STYLE = {
  width: "100%",
  padding: "9px 13px",
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,.07)",
  background: "rgba(255,255,255,.04)",
  color: "#e8e8f0",
  fontSize: 13,
  fontFamily: "'Segoe UI', sans-serif",
  outline: "none",
  transition: "border-color .2s, background .2s",
};

const LABEL_STYLE = {
  display: "block",
  fontFamily: "monospace",
  fontSize: 10,
  letterSpacing: ".12em",
  textTransform: "uppercase",
  color: "#555566",
  marginBottom: 7,
};

function Field({ label, required, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={LABEL_STYLE}>
        {label}{required && <span style={{ color: "rgba(139,92,246,.8)", marginLeft: 4 }}>*</span>}
      </label>
      {children}
    </div>
  );
}

export default function AddEditModal({ member, onClose, onSave }) {
  const isEdit = !!member;

  const [form, setForm] = useState({
    name: "",
    role: "",
    bio: "",
    photo_url: "",
    linkedin_url: "",
    github_url: "",
    twitter_url: "",
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  // Pre-fill when editing
  useEffect(() => {
    if (member) {
      setForm({
        name: member.name || "",
        role: member.role || "",
        bio: member.bio || "",
        photo_url: member.photo_url || "",
        linkedin_url: member.linkedin_url || "",
        github_url: member.github_url || "",
        twitter_url: member.twitter_url || "",
      });
    }
  }, [member]);

  // Escape key
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const set = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.role.trim()) e.role = "Role is required";
    if (!form.bio.trim()) e.bio = "Bio is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = {
        ...form,
        photo_url:
          form.photo_url ||
          `https://i.pravatar.cc/300?img=${Math.floor(Math.random() * 70) + 1}`,
        linkedin_url: form.linkedin_url || null,
        github_url: form.github_url || null,
        twitter_url: form.twitter_url || null,
      };
      await onSave(payload);
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = (key) => ({
    ...FIELD_STYLE,
    borderColor: errors[key] ? "rgba(250,80,80,.5)" : "rgba(255,255,255,.07)",
  });

  const focusStyle = (e) => {
    e.target.style.borderColor = "rgba(139,92,246,.5)";
    e.target.style.background = "rgba(139,92,246,.05)";
  };
  const blurStyle = (e, key) => {
    e.target.style.borderColor = errors[key] ? "rgba(250,80,80,.5)" : "rgba(255,255,255,.07)";
    e.target.style.background = "rgba(255,255,255,.04)";
  };

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        style={{
          position: "fixed", inset: 0, zIndex: 40,
          background: "rgba(4,4,12,.88)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        key="modal"
        style={{
          position: "fixed", inset: 0, zIndex: 50,
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "16px",
          pointerEvents: "none",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          style={{
            background: "#0d0d1a",
            borderRadius: 24,
            border: "1px solid rgba(255,255,255,.12)",
            width: "100%",
            maxWidth: 500,
            maxHeight: "90vh",
            overflowY: "auto",
            position: "relative",
            pointerEvents: "all",
          }}
          initial={{ opacity: 0, scale: 0.94, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top accent line */}
          <div style={{
            position: "absolute", top: 0, left: "15%", right: "15%", height: 1,
            background: "linear-gradient(90deg,transparent,rgba(139,92,246,.6),transparent)",
          }} />

          {/* Close */}
          <motion.button
            onClick={onClose}
            style={{
              position: "absolute", top: 18, right: 18, zIndex: 10,
              width: 32, height: 32, borderRadius: 10,
              border: "1px solid rgba(255,255,255,.1)",
              background: "rgba(255,255,255,.04)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: "rgba(255,255,255,.4)",
            }}
            whileHover={{ scale: 1.05, background: "rgba(255,255,255,.1)", color: "#fff" }}
            whileTap={{ scale: 0.95 }}
          >
            <CloseIcon />
          </motion.button>

          {/* Body */}
          <div style={{ padding: 28 }}>
            {/* Header */}
            <div style={{ marginBottom: 22 }}>
              <h2 style={{
                fontFamily: "'Georgia', serif",
                fontSize: "1.25rem", fontWeight: 700,
                color: "#fff", marginBottom: 4,
              }}>
                {isEdit ? "Edit Team Member" : "Add Team Member"}
              </h2>
              <p style={{
                fontFamily: "monospace", fontSize: 10, letterSpacing: ".12em",
                textTransform: "uppercase", color: "#555566",
              }}>
                {isEdit ? `PUT /team/${member?.id}` : "POST /team"}
              </p>
            </div>

            {/* Photo upload */}
            <PhotoUpload
              value={form.photo_url}
              onChange={(url) => setForm((f) => ({ ...f, photo_url: url }))}
            />

            {/* Name */}
            <Field label="Full Name" required>
              <input
                value={form.name}
                onChange={set("name")}
                placeholder="e.g. Priya Nair"
                style={inputStyle("name")}
                onFocus={focusStyle}
                onBlur={(e) => blurStyle(e, "name")}
              />
              {errors.name && (
                <p style={{ marginTop: 4, fontSize: 11, fontFamily: "monospace", color: "rgb(250,130,130)" }}>
                  {errors.name}
                </p>
              )}
            </Field>

            {/* Role */}
            <Field label="Role" required>
              <input
                value={form.role}
                onChange={set("role")}
                placeholder="e.g. Lead ML Engineer"
                style={inputStyle("role")}
                onFocus={focusStyle}
                onBlur={(e) => blurStyle(e, "role")}
              />
              {errors.role && (
                <p style={{ marginTop: 4, fontSize: 11, fontFamily: "monospace", color: "rgb(250,130,130)" }}>
                  {errors.role}
                </p>
              )}
            </Field>

            {/* Bio */}
            <Field label="Bio" required>
              <textarea
                value={form.bio}
                onChange={set("bio")}
                placeholder="Short professional bio..."
                rows={3}
                style={{ ...inputStyle("bio"), resize: "vertical", lineHeight: 1.6 }}
                onFocus={focusStyle}
                onBlur={(e) => blurStyle(e, "bio")}
              />
              {errors.bio && (
                <p style={{ marginTop: 4, fontSize: 11, fontFamily: "monospace", color: "rgb(250,130,130)" }}>
                  {errors.bio}
                </p>
              )}
            </Field>

            {/* Social */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label="LinkedIn">
                <input
                  value={form.linkedin_url}
                  onChange={set("linkedin_url")}
                  placeholder="https://linkedin.com/in/..."
                  style={FIELD_STYLE}
                  onFocus={focusStyle}
                  onBlur={(e) => blurStyle(e, "")}
                />
              </Field>
              <Field label="GitHub">
                <input
                  value={form.github_url}
                  onChange={set("github_url")}
                  placeholder="https://github.com/..."
                  style={FIELD_STYLE}
                  onFocus={focusStyle}
                  onBlur={(e) => blurStyle(e, "")}
                />
              </Field>
            </div>

            <Field label="Twitter / X">
              <input
                value={form.twitter_url}
                onChange={set("twitter_url")}
                placeholder="https://twitter.com/..."
                style={FIELD_STYLE}
                onFocus={focusStyle}
                onBlur={(e) => blurStyle(e, "")}
              />
            </Field>

            {/* Buttons */}
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <motion.button
                onClick={onClose}
                type="button"
                style={{
                  padding: "10px 20px", borderRadius: 12,
                  border: "1px solid rgba(255,255,255,.08)",
                  background: "transparent", color: "#888899",
                  fontFamily: "monospace", fontSize: 12, letterSpacing: ".08em",
                  textTransform: "uppercase", cursor: "pointer",
                }}
                whileHover={{ borderColor: "rgba(255,255,255,.16)", color: "#e8e8f0" }}
                whileTap={{ scale: 0.97 }}
              >
                Cancel
              </motion.button>

              <motion.button
                onClick={handleSubmit}
                disabled={saving}
                type="button"
                style={{
                  flex: 1, padding: 10, borderRadius: 12, border: "none",
                  background: saving ? "rgba(139,92,246,.5)" : "rgba(139,92,246,1)",
                  color: "#fff", fontFamily: "monospace", fontSize: 12,
                  letterSpacing: ".08em", textTransform: "uppercase",
                  cursor: saving ? "not-allowed" : "pointer",
                }}
                whileHover={saving ? {} : { background: "rgba(139,92,246,.85)", y: -1 }}
                whileTap={saving ? {} : { scale: 0.98 }}
              >
                {saving ? "Saving..." : isEdit ? "Save Changes" : "Add to Team"}
              </motion.button>
            </div>

            {/* Bottom accent */}
            <motion.div
              style={{
                height: 1, marginTop: 20,
                background: "linear-gradient(90deg,rgba(139,92,246,.3),rgba(249,115,22,.2),transparent)",
              }}
              initial={{ scaleX: 0, originX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
