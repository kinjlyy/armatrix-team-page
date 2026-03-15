"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-30 transition-all duration-500 ${
        scrolled
          ? "py-3 border-b border-white/5"
          : "py-5 border-b border-transparent"
      }`}
      style={{
        background: scrolled ? "rgba(8,8,16,0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo wordmark */}
        <a
          href="/"
          className="flex items-center gap-2.5 group"
          aria-label="Armatrix home"
        >
          {/* Icon mark */}
          <div className="relative w-7 h-7">
            <motion.div
              className="absolute inset-0 rounded-md opacity-70"
              style={{
                background:
                  "linear-gradient(135deg, rgba(139,92,246,0.8), rgba(249,115,22,0.6))",
              }}
              animate={{ rotate: [0, 90, 180, 270, 360] }}
              transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
            />
            <div
              className="absolute inset-[3px] rounded-sm"
              style={{ background: "#080810" }}
            />
            <div
              className="absolute inset-[5px] rounded-sm"
              style={{
                background:
                  "linear-gradient(135deg, rgba(139,92,246,0.9), rgba(249,115,22,0.7))",
              }}
            />
          </div>

          <span
            className="text-sm font-black tracking-tight text-white/90 group-hover:text-white transition-colors"
            style={{ fontFamily: "var(--font-display)", letterSpacing: "0.04em" }}
          >
            ARMATRIX
          </span>
        </a>

        {/* Nav items */}
        <nav className="hidden md:flex items-center gap-7">
          {["Product", "Research", "Team", "Careers"].map((item) => (
            <a
              key={item}
              href={item === "Team" ? "/team" : "#"}
              className={`text-xs font-mono tracking-widest uppercase transition-colors ${
                item === "Team"
                  ? "text-purple-400"
                  : "text-white/30 hover:text-white/70"
              }`}
            >
              {item}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <motion.a
          href="#"
          className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono tracking-wide text-white/80 border border-white/10 hover:border-white/20 hover:text-white transition-all"
          style={{ background: "rgba(255,255,255,0.03)" }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Request Demo
        </motion.a>
      </div>
    </motion.header>
  );
}
