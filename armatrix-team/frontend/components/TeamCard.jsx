"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";

const SocialIcon = ({ href, label, children }) => {
  if (!href) return null;
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 hover:border-white/20 transition-colors"
      whileHover={{ scale: 1.15, rotate: [-2, 2, 0] }}
      whileTap={{ scale: 0.9 }}
      transition={{ duration: 0.2 }}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </motion.a>
  );
};

const LinkedInIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);
const GitHubIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
  </svg>
);
const TwitterIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
  </svg>
);

// Role → accent color map
const ROLE_COLORS = {
  "CEO": "249,115,22",
  "CTO": "139,92,246",
  "Co-Founder": "234,179,8",
  "Engineer": "6,182,212",
  "Design": "236,72,153",
  "ML": "139,92,246",
  "Data": "34,197,94",
  "Research": "168,85,247",
  "Success": "249,115,22",
};
function getRoleColor(role) {
  for (const [key, color] of Object.entries(ROLE_COLORS)) {
    if (role.includes(key)) return color;
  }
  return "139,92,246";
}

export default function TeamCard({ member, index, onClick }) {
  const cardRef = useRef(null);
  const glowRef = useRef(null);
  const shimmerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const accentColor = getRoleColor(member.role);

  const onMouseMove = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;

    // 3D tilt
    const rotX = ((y - cy) / cy) * -8;
    const rotY = ((x - cx) / cx) * 8;
    el.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(8px)`;

    // Spotlight glow follows mouse
    if (glowRef.current) {
      const pctX = (x / rect.width) * 100;
      const pctY = (y / rect.height) * 100;
      glowRef.current.style.background = `radial-gradient(circle at ${pctX}% ${pctY}%, rgba(${accentColor},0.18) 0%, transparent 65%)`;
      glowRef.current.style.opacity = "1";
    }

    // Shimmer sweep
    if (shimmerRef.current) {
      const pct = (x / rect.width) * 100;
      shimmerRef.current.style.background = `linear-gradient(105deg, transparent ${pct - 20}%, rgba(255,255,255,0.04) ${pct}%, transparent ${pct + 20}%)`;
    }
  };

  const onMouseLeave = () => {
    const el = cardRef.current;
    if (el) {
      el.style.transform = "perspective(600px) rotateX(0deg) rotateY(0deg) translateZ(0px)";
      el.style.transition = "transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94)";
    }
    if (glowRef.current) glowRef.current.style.opacity = "0";
    setIsHovered(false);
  };

  const onMouseEnter = () => {
    if (cardRef.current) cardRef.current.style.transition = "transform 0.1s ease";
    setIsHovered(true);
  };

  return (
    <motion.article
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={() => onClick(member)}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.6,
        delay: (index % 4) * 0.09,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative cursor-pointer rounded-2xl overflow-hidden"
      style={{
        background: "#0f0f1a",
        border: `1px solid rgba(${accentColor},${isHovered ? 0.35 : 0.1})`,
        boxShadow: isHovered
          ? `0 0 30px rgba(${accentColor},0.12), 0 20px 40px rgba(0,0,0,0.4)`
          : "0 4px 20px rgba(0,0,0,0.3)",
        transition: "border-color 0.3s ease, box-shadow 0.3s ease",
        willChange: "transform",
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick(member)}
      aria-label={`View profile of ${member.name}`}
    >
      {/* Spotlight glow layer */}
      <div
        ref={glowRef}
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "inherit",
          opacity: 0,
          transition: "opacity 0.2s ease",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Shimmer sweep layer */}
      <div
        ref={shimmerRef}
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "inherit",
          pointerEvents: "none",
          zIndex: 2,
          opacity: isHovered ? 1 : 0,
          transition: "opacity 0.2s",
        }}
      />

      {/* Top edge accent line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "20%",
          right: "20%",
          height: 1,
          background: `linear-gradient(90deg, transparent, rgba(${accentColor},0.7), transparent)`,
          opacity: isHovered ? 1 : 0,
          transition: "opacity 0.3s ease",
          zIndex: 3,
        }}
      />

      {/* Card content */}
      <div className="relative p-6" style={{ zIndex: 4 }}>
        {/* Avatar */}
        <div className="relative mb-5 flex items-start justify-between">
          <div className="relative">
            {/* Glow halo behind avatar */}
            <div
              style={{
                position: "absolute",
                inset: -6,
                borderRadius: "50%",
                background: `radial-gradient(circle, rgba(${accentColor},0.35), transparent 70%)`,
                opacity: isHovered ? 1 : 0,
                transition: "opacity 0.4s ease",
                filter: "blur(8px)",
              }}
            />
            <div
              className="relative w-16 h-16 rounded-xl overflow-hidden"
              style={{ border: `1px solid rgba(${accentColor},0.25)` }}
            >
              <img
                src={member.photo_url}
                alt={member.name}
                className="w-full h-full object-cover"
                style={{ background: "#1a1a2e" }}
              />
            </div>
          </div>

          {/* Online indicator */}
          <motion.div
            className="flex items-center gap-1.5 px-2 py-1 rounded-full"
            style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.15)" }}
            animate={isHovered ? { scale: [1, 1.05, 1] } : {}}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-green-400" style={{ animation: "pulse 2s infinite" }} />
            <span className="text-[10px] font-mono text-green-400/70 tracking-wide">active</span>
          </motion.div>
        </div>

        {/* Name */}
        <h3
          className="font-display font-bold text-lg text-white leading-tight mb-1"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {member.name}
        </h3>

        {/* Role badge */}
        <div className="mb-4">
          <span
            className="text-xs font-mono tracking-wider uppercase"
            style={{ color: `rgba(${accentColor},0.85)` }}
          >
            {member.role}
          </span>
        </div>

        {/* Bio */}
        <p className="text-sm text-white/40 leading-relaxed line-clamp-3 mb-5">
          {member.bio}
        </p>

        {/* Divider */}
        <div
          style={{
            height: 1,
            background: `linear-gradient(90deg, rgba(${accentColor},0.2), transparent)`,
            marginBottom: 16,
          }}
        />

        {/* Social + CTA */}
        <div className="flex items-center justify-between">
          <motion.div
            className="flex items-center gap-2"
            animate={isHovered ? { x: 0, opacity: 1 } : { x: -4, opacity: 0.7 }}
            transition={{ duration: 0.2 }}
          >
            <SocialIcon href={member.linkedin_url} label="LinkedIn"><LinkedInIcon /></SocialIcon>
            <SocialIcon href={member.github_url} label="GitHub"><GitHubIcon /></SocialIcon>
            <SocialIcon href={member.twitter_url} label="Twitter"><TwitterIcon /></SocialIcon>
          </motion.div>

          <motion.span
            className="text-xs font-mono tracking-wide"
            style={{ color: `rgba(${accentColor},0.5)` }}
            animate={isHovered ? { x: 0, opacity: 1 } : { x: 4, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            View profile →
          </motion.span>
        </div>
      </div>
    </motion.article>
  );
}
