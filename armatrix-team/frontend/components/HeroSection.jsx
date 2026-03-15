"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

function useCountUp(target, duration = 1200, delay = 800) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const timeout = setTimeout(() => {
      const start = performance.now();
      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.floor(eased * target));
        if (progress < 1) requestAnimationFrame(tick);
        else setCount(target);
      };
      requestAnimationFrame(tick);
    }, delay);
    return () => clearTimeout(timeout);
  }, [target, duration, delay]);
  return count;
}

const HERO_LINES = [
  { text: "builders", highlight: true },
  { text: "of inspection", highlight: false },
  { text: "intelligence.", highlight: "gold" },
];

export default function HeroSection({ memberCount = 0 }) {
  const ref = useRef(null);
  const titleRef = useRef(null);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 400], [0, 100]);
  const opacity = useTransform(scrollY, [0, 350], [1, 0]);

  const teamCount = useCountUp(memberCount || 12, 1000, 900);
  const patentCount = useCountUp(4, 800, 1100);
  const yearsCount = useCountUp(12, 900, 1300);

  // Magnetic mouse effect on hero title
  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / rect.width;
      const dy = (e.clientY - cy) / rect.height;
      el.style.textShadow = `
        ${dx * 20}px ${dy * 10}px 40px rgba(139,92,246,0.3),
        ${-dx * 10}px ${-dy * 5}px 30px rgba(249,115,22,0.2)
      `;
    };
    const onLeave = () => { el.style.textShadow = ""; };
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.14, delayChildren: 0.2 } },
  };
  const item = {
    hidden: { opacity: 0, y: 50, skewY: 2 },
    show: { opacity: 1, y: 0, skewY: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <motion.section
      ref={ref}
      style={{ y, opacity }}
      className="relative z-10 flex flex-col items-center justify-center min-h-[92vh] px-6 text-center"
    >
      {/* Eyebrow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mb-10"
      >
        <span className="tag-pill">
          <motion.span
            style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "rgba(139,92,246,0.9)", marginRight: 8 }}
            animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          Armatrix — Team
        </span>
      </motion.div>

      {/* Main headline */}
      <div ref={titleRef} style={{ transition: "text-shadow 0.3s ease" }}>
        <motion.div variants={container} initial="hidden" animate="show">
          {HERO_LINES.map((line, i) => (
            <motion.div key={i} variants={item} className="overflow-hidden">
              <h1
                className={`font-display leading-[0.88] tracking-tight select-none font-black
                  text-[clamp(3.5rem,9.5vw,8.5rem)]
                  ${line.highlight === true ? "text-gradient" : line.highlight === "gold" ? "text-gradient-gold" : "text-white/55"}
                `}
              >
                {line.text}
              </h1>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Sub-copy */}
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.75, duration: 0.6 }}
        className="mt-10 max-w-lg text-base md:text-lg text-white/35 font-body font-light leading-relaxed"
      >
        A small, focused team building inspection intelligence that finds what
        humans miss — at machine speed.
      </motion.p>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.95, duration: 0.5 }}
        className="mt-10 flex gap-4 flex-wrap justify-center"
      >
        {[
          { label: "Team Members", value: teamCount, suffix: "" },
          { label: "Patents Filed", value: patentCount, suffix: "" },
          { label: "Yrs Research", value: yearsCount, suffix: "+" },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            className="flex flex-col items-center px-6 py-3.5 rounded-2xl"
            style={{ border: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.02)" }}
            whileHover={{ scale: 1.04, background: "rgba(139,92,246,0.05)", borderColor: "rgba(139,92,246,0.2)" }}
            transition={{ duration: 0.2 }}
          >
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.9rem",
                fontWeight: 900,
                background: "linear-gradient(135deg, #fff 40%, rgba(139,92,246,0.85))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                minWidth: "2ch",
                display: "block",
              }}
            >
              {stat.value}{stat.suffix}
            </span>
            <span className="text-[10px] text-white/25 font-mono mt-0.5 tracking-widest uppercase">
              {stat.label}
            </span>
          </motion.div>
        ))}
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] tracking-[0.25em] uppercase text-white/15 font-mono">scroll</span>
        <div className="w-px h-10 overflow-hidden relative">
          <motion.div
            className="w-full absolute top-0"
            style={{
              height: "200%",
              background: "linear-gradient(to bottom, transparent, rgba(139,92,246,0.8), transparent)",
            }}
            animate={{ y: ["-100%", "100%"] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </motion.div>
    </motion.section>
  );
}
