"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { uploadPhoto } from "../lib/api";

const AVATAR_IDS = [1,2,3,4,5,6,7,8,9,10,21,22,23,24,25,26,27,28,29,30,33,34,35,36,37,38,39,40,41,42];
const MAX_SIZE = 5 * 1024 * 1024;

const UploadIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/>
    <line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);
const PersonIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="8" r="4"/>
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const LABEL_STYLE = {
  display: "block", fontFamily: "monospace", fontSize: 10,
  letterSpacing: ".12em", textTransform: "uppercase", color: "#555566", marginBottom: 7,
};
const TAB_BASE = {
  flex: 1, padding: "5px 0", borderRadius: 8,
  fontFamily: "monospace", fontSize: 10, letterSpacing: ".08em",
  textTransform: "uppercase", cursor: "pointer", transition: "all .2s",
};

export default function PhotoUpload({ value, onChange }) {
  const [tab, setTab] = useState("upload");
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState("");
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [selAvatar, setSelAvatar] = useState(null);
  const [error, setError] = useState("");
  const fileRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => () => clearInterval(timerRef.current), []);

  const setPhoto = useCallback((url) => { onChange(url); setError(""); }, [onChange]);

  const clearPhoto = useCallback(() => {
    onChange("");
    setFileName("");
    setSelAvatar(null);
    setError("");
    if (fileRef.current) fileRef.current.value = "";
  }, [onChange]);

  const processFile = useCallback(async (file) => {
    if (!file.type.startsWith("image/")) { setError("Please select an image file."); return; }
    if (file.size > MAX_SIZE) { setError("File must be under 5 MB."); return; }
    setError("");
    setFileName(file.name);
    setUploading(true);
    setProgress(0);

    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 88) { clearInterval(timerRef.current); return p; }
        return p + Math.random() * 18 + 8;
      });
    }, 60);

    try {
      const data = await uploadPhoto(file);
      clearInterval(timerRef.current);
      setProgress(100);
      setPhoto(data.url);
      setTimeout(() => { setProgress(0); setUploading(false); }, 500);
    } catch (err) {
      clearInterval(timerRef.current);
      setUploading(false);
      setProgress(0);
      setError(err.message || "Could not upload the file.");
    }
  }, [setPhoto]);

  const onFileChange = (e) => { const f = e.target.files?.[0]; if (f) processFile(f); };

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) processFile(f);
    else setError("Please drop an image file.");
  }, [processFile]);

  const pickAvatar = (id) => {
    setSelAvatar(id);
    setPhoto(`https://i.pravatar.cc/300?img=${id}`);
  };

  const hasPhoto = !!value;

  return (
    <div style={{ marginBottom: 20 }}>
      <label style={LABEL_STYLE}>Profile Photo</label>

      <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
        {/* Preview */}
        <div style={{
          width: 76, height: 76, borderRadius: 14, flexShrink: 0,
          border: "1px solid rgba(255,255,255,.08)",
          background: "rgba(255,255,255,.04)",
          overflow: "hidden", position: "relative",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {hasPhoto ? (
            <>
              <img src={value} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              <motion.div
                style={{
                  position: "absolute", inset: 0,
                  background: "rgba(0,0,0,.62)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "monospace", fontSize: 9, letterSpacing: ".06em",
                  color: "rgba(250,80,80,.9)", cursor: "pointer",
                }}
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                onClick={clearPhoto}
              >
                Remove
              </motion.div>
            </>
          ) : (
            <span style={{ color: "rgba(255,255,255,.18)" }}><PersonIcon /></span>
          )}
        </div>

        {/* Controls */}
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 8 }}>
          {/* Tabs */}
          <div style={{ display: "flex", gap: 6 }}>
            {[{ id: "upload", label: "Upload File" }, { id: "avatar", label: "Pick Avatar" }].map((t) => (
              <button
                key={t.id} type="button" onClick={() => { setTab(t.id); setError(""); }}
                style={{
                  ...TAB_BASE,
                  border: `1px solid ${tab === t.id ? "rgba(139,92,246,.4)" : "rgba(255,255,255,.07)"}`,
                  background: tab === t.id ? "rgba(139,92,246,.1)" : "transparent",
                  color: tab === t.id ? "rgba(139,92,246,1)" : "#555566",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {tab === "upload" && (
              <motion.div key="upload" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.15 }}>
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={onDrop}
                  onClick={() => fileRef.current?.click()}
                  style={{
                    border: `1.5px dashed ${isDragging ? "rgba(139,92,246,.8)" : fileName ? "rgba(34,197,94,.5)" : "rgba(139,92,246,.3)"}`,
                    borderRadius: 12, padding: "14px 12px", textAlign: "center",
                    cursor: "pointer", transition: "all .22s",
                    background: isDragging ? "rgba(139,92,246,.08)" : fileName ? "rgba(34,197,94,.04)" : "rgba(139,92,246,.03)",
                  }}
                >
                  <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={onFileChange} style={{ display: "none" }} />
                  <div style={{ display: "flex", justifyContent: "center", color: fileName ? "rgba(34,197,94,.8)" : "rgba(139,92,246,.7)", marginBottom: 5 }}>
                    {fileName ? <CheckIcon /> : <UploadIcon />}
                  </div>
                  <div style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: ".08em", textTransform: "uppercase", color: fileName ? "rgba(34,197,94,.9)" : "rgba(139,92,246,.85)", lineHeight: 1.5 }}>
                    {fileName ? "Photo ready" : "Drop image here or click to browse"}
                  </div>
                  <div style={{ fontSize: 10, color: "#555566", marginTop: 3 }}>
                    {fileName ? fileName : "JPG, PNG, WebP, GIF · max 5 MB"}
                  </div>
                </div>

                {uploading && (
                  <div style={{ height: 3, borderRadius: 2, background: "rgba(255,255,255,.05)", marginTop: 6, overflow: "hidden" }}>
                    <motion.div
                      style={{ height: "100%", borderRadius: 2, background: "linear-gradient(90deg,rgba(139,92,246,1),rgba(249,115,22,1))" }}
                      animate={{ width: `${Math.min(progress, 100)}%` }}
                      transition={{ duration: 0.15 }}
                    />
                  </div>
                )}
              </motion.div>
            )}

            {tab === "avatar" && (
              <motion.div key="avatar" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.15 }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 5 }}>
                  {AVATAR_IDS.map((id) => (
                    <div
                      key={id} onClick={() => pickAvatar(id)}
                      style={{
                        aspectRatio: "1", borderRadius: 8, overflow: "hidden", cursor: "pointer",
                        transition: "all .18s",
                        border: `2px solid ${selAvatar === id ? "rgba(139,92,246,1)" : "transparent"}`,
                        boxShadow: selAvatar === id ? "0 0 0 2px rgba(139,92,246,.3)" : "none",
                        transform: selAvatar === id ? "scale(1.07)" : "scale(1)",
                        background: "rgba(255,255,255,.05)",
                      }}
                    >
                      <img src={`https://i.pravatar.cc/80?img=${id}`} alt="" loading="lazy"
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
              style={{ fontSize: 11, fontFamily: "monospace", color: "rgb(250,130,130)", letterSpacing: ".04em" }}>
              {error}
            </motion.p>
          )}
        </div>
      </div>
    </div>
  );
}
