"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AuroraBackground from "../../components/AuroraBackground";
import Navbar from "../../components/Navbar";
import HeroSection from "../../components/HeroSection";
import TeamGrid from "../../components/TeamGrid";
import TeamModal from "../../components/TeamModal";
import AddEditModal from "../../components/AddEditModal";
import Footer from "../../components/Footer";
import { fetchTeamMembers, createTeamMember, updateTeamMember, deleteTeamMember } from "../../lib/api";

export default function TeamPage() {
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Profile view modal
  const [selectedMember, setSelectedMember] = useState(null);

  // Add / edit modal
  const [formOpen, setFormOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null); // null = add, object = edit

  const load = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await fetchTeamMembers();
      setMembers(data);
      setError(null);
    } catch (err) {
      setError("Unable to load team data. Is the API running?");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleCardClick = useCallback((member) => setSelectedMember(member), []);
  const handleModalClose = useCallback(() => setSelectedMember(null), []);

  const openAdd = () => { setEditingMember(null); setFormOpen(true); };
  const openEdit = (member) => { setEditingMember(member); setFormOpen(true); };
  const closeForm = () => { setFormOpen(false); setEditingMember(null); };

  const handleDelete = useCallback(async (id) => {
    await deleteTeamMember(id);
    await load();
  }, [load]);

  const handleSave = useCallback(async (payload) => {
    if (editingMember) {
      await updateTeamMember(editingMember.id, payload);
    } else {
      await createTeamMember(payload);
    }
    closeForm();
    await load();
  }, [editingMember, load]);

  return (
    <div className="relative min-h-screen" style={{ background: "#080810", fontFamily: "var(--font-body)" }}>
      <AuroraBackground />
      <Navbar />

      <main className="relative z-10">
        <HeroSection memberCount={members.length} />

        <section className="max-w-7xl mx-auto px-6 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-4 mb-12 flex-wrap"
          >
            <div className="w-8 h-px" style={{ background: "linear-gradient(90deg,rgba(139,92,246,.8),transparent)" }} />
            <span className="text-xs font-mono tracking-widest uppercase text-white/20">The Team</span>
            {!isLoading && members.length > 0 && (
              <span className="tag-pill ml-2">{members.length} members</span>
            )}
            <motion.button
              onClick={openAdd}
              className="ml-auto flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-xs tracking-widest uppercase"
              style={{
                border: "1px solid rgba(139,92,246,.35)",
                background: "rgba(139,92,246,.08)",
                color: "rgba(139,92,246,1)",
              }}
              whileHover={{ background: "rgba(139,92,246,.16)", borderColor: "rgba(139,92,246,.6)", y: -1 }}
              whileTap={{ scale: 0.97 }}
            >
              + Add Member
            </motion.button>
          </motion.div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="mb-8 px-5 py-4 rounded-xl border border-red-500/20 bg-red-500/5 text-sm text-red-400/70 font-mono"
              >
                <span className="text-red-400/40 mr-2">⚠</span>{error}
              </motion.div>
            )}
          </AnimatePresence>

          <TeamGrid
            members={members}
            isLoading={isLoading}
            onCardClick={handleCardClick}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
        </section>

        {/* Values strip */}
        <motion.section
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.7 }}
          className="max-w-7xl mx-auto px-6 py-16 mb-8"
        >
          <div className="rounded-3xl p-8 md:p-12 border border-white/5 relative overflow-hidden" style={{ background: "#0d0d1a" }}>
            <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 80% 50%,rgba(139,92,246,.06),transparent 60%)" }} />
            <div className="relative grid md:grid-cols-3 gap-8 md:gap-12">
              {[
                { n: "01", t: "Depth over breadth", d: "We go deep on hard problems. Surface-level solutions don't survive contact with the factory floor." },
                { n: "02", t: "Ship with conviction", d: "We ship fast, but with intent. Every release has a measurable outcome we're aiming for." },
                { n: "03", t: "Trust the machine", d: "We trust our models because we built the data. Rigour in training means confidence in deployment." },
              ].map((v, i) => (
                <motion.div key={v.n} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <div className="text-xs font-mono text-white/15 mb-3 tracking-widest">{v.n}</div>
                  <h3 className="text-base font-bold text-white/80 mb-2" style={{ fontFamily: "var(--font-display)" }}>{v.t}</h3>
                  <p className="text-sm text-white/30 leading-relaxed">{v.d}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      </main>

      <Footer />

      {/* Profile modal */}
      <AnimatePresence>
        {selectedMember && <TeamModal member={selectedMember} onClose={handleModalClose} />}
      </AnimatePresence>

      {/* Add / Edit modal */}
      <AnimatePresence>
        {formOpen && (
          <AddEditModal
            member={editingMember}
            onClose={closeForm}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

