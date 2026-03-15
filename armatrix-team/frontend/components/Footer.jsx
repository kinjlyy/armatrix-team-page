"use client";

import { motion } from "framer-motion";

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative z-10 border-t border-white/5 mt-28"
    >
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div
            className="w-1 h-4 rounded-full"
            style={{
              background:
                "linear-gradient(180deg, rgba(139,92,246,0.8), rgba(249,115,22,0.6))",
            }}
          />
          <span
            className="text-xs font-black tracking-widest text-white/30 uppercase"
            style={{ fontFamily: "var(--font-display)" }}
          >
            ARMATRIX
          </span>
        </div>

        <p className="text-xs text-white/15 font-mono text-center">
          Building inspection intelligence — {new Date().getFullYear()}
        </p>

        <div className="flex items-center gap-5">
          {["Privacy", "Legal", "Contact"].map((item) => (
            <a
              key={item}
              href="#"
              className="text-xs text-white/20 hover:text-white/50 transition-colors font-mono tracking-wide"
            >
              {item}
            </a>
          ))}
        </div>
      </div>
    </motion.footer>
  );
}
