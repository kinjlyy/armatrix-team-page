"use client";

import { motion } from "framer-motion";
import TeamCard from "./TeamCard";

function SkeletonCard({ index }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.06 }}
      className="rounded-2xl overflow-hidden border border-white/5"
      style={{ background: "#0f0f1a" }}
    >
      <div className="p-6">
        {/* Avatar skeleton */}
        <div className="w-16 h-16 rounded-xl skeleton mb-5" />

        {/* Name */}
        <div className="h-5 w-32 rounded-lg skeleton mb-2" />

        {/* Role */}
        <div className="h-3 w-24 rounded-full skeleton mb-5" />

        {/* Bio lines */}
        <div className="space-y-2 mb-5">
          <div className="h-3 w-full rounded skeleton" />
          <div className="h-3 w-5/6 rounded skeleton" />
          <div className="h-3 w-4/6 rounded skeleton" />
        </div>

        <div className="h-px bg-white/5 mb-4" />

        {/* Social row */}
        <div className="flex gap-2">
          <div className="w-8 h-8 rounded-lg skeleton" />
          <div className="w-8 h-8 rounded-lg skeleton" />
        </div>
      </div>
    </motion.div>
  );
}

export default function TeamGrid({ members, isLoading, onCardClick }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} index={i} />
        ))}
      </div>
    );
  }

  if (!members || members.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-24 text-center"
      >
        <div className="text-6xl mb-4 opacity-20">◎</div>
        <p className="text-white/30 text-sm font-mono">No team members found.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
      initial="hidden"
      animate="show"
    >
      {members.map((member, index) => (
        <TeamCard
          key={member.id}
          member={member}
          index={index}
          onClick={onCardClick}
        />
      ))}
    </motion.div>
  );
}
