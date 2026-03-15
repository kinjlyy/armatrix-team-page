"use client";

import { useEffect, useRef } from "react";

// ─── Particle class ────────────────────────────────────────────────────────────
class Particle {
  constructor(canvas) {
    this.canvas = canvas;
    this.reset();
  }
  reset() {
    this.x = Math.random() * this.canvas.width;
    this.y = Math.random() * this.canvas.height;
    this.baseX = this.x;
    this.baseY = this.y;
    this.size = Math.random() * 1.5 + 0.4;
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.speedY = (Math.random() - 0.5) * 0.3;
    this.opacity = Math.random() * 0.5 + 0.1;
    const colors = [
      "139,92,246",   // purple
      "249,115,22",   // orange
      "234,179,8",    // gold
      "236,72,153",   // pink
      "255,255,255",  // white
    ];
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.mouseRepelRadius = 80 + Math.random() * 60;
    this.mouseRepelStrength = 2 + Math.random() * 3;
  }
  update(mouseX, mouseY) {
    // Drift
    this.x += this.speedX;
    this.y += this.speedY;

    // Mouse repel
    const dx = this.x - mouseX;
    const dy = this.y - mouseY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < this.mouseRepelRadius) {
      const force = (1 - dist / this.mouseRepelRadius) * this.mouseRepelStrength;
      this.x += (dx / dist) * force;
      this.y += (dy / dist) * force;
    }

    // Wrap edges
    if (this.x < -10) this.x = this.canvas.width + 10;
    if (this.x > this.canvas.width + 10) this.x = -10;
    if (this.y < -10) this.y = this.canvas.height + 10;
    if (this.y > this.canvas.height + 10) this.y = -10;
  }
  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color},${this.opacity})`;
    ctx.fill();
  }
}

// ─── Sparkle trail ─────────────────────────────────────────────────────────────
class Sparkle {
  constructor(x, y) {
    this.x = x + (Math.random() - 0.5) * 20;
    this.y = y + (Math.random() - 0.5) * 20;
    this.size = Math.random() * 3 + 1;
    this.life = 1;
    this.decay = 0.04 + Math.random() * 0.04;
    this.vx = (Math.random() - 0.5) * 1.5;
    this.vy = (Math.random() - 0.5) * 1.5 - 0.5;
    const colors = ["139,92,246", "249,115,22", "234,179,8", "236,72,153"];
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life -= this.decay;
    this.size *= 0.96;
  }
  draw(ctx) {
    if (this.life <= 0) return;
    ctx.save();
    ctx.globalAlpha = this.life * 0.7;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color},1)`;
    ctx.shadowBlur = 8;
    ctx.shadowColor = `rgba(${this.color},0.8)`;
    ctx.fill();
    ctx.restore();
  }
  get dead() { return this.life <= 0; }
}

export default function AuroraBackground() {
  const canvasRef = useRef(null);
  const cursorLightRef = useRef(null);
  const cursorRingRef = useRef(null);
  const orb1Ref = useRef(null);
  const orb2Ref = useRef(null);
  const orb3Ref = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // ── Resize ──────────────────────────────────────────────────────────────
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // ── Particles ───────────────────────────────────────────────────────────
    const PARTICLE_COUNT = 90;
    const particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle(canvas));

    // ── Sparkles ────────────────────────────────────────────────────────────
    const sparkles = [];
    let lastSparkleTime = 0;

    // ── Mouse state ─────────────────────────────────────────────────────────
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let smoothX = mouseX;
    let smoothY = mouseY;
    let prevMouseX = mouseX;
    let prevMouseY = mouseY;

    const onMouseMove = (e) => {
      prevMouseX = mouseX;
      prevMouseY = mouseY;
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Spawn sparkles on fast movement
      const speed = Math.hypot(mouseX - prevMouseX, mouseY - prevMouseY);
      const now = performance.now();
      if (speed > 8 && now - lastSparkleTime > 30) {
        for (let i = 0; i < Math.min(4, Math.floor(speed / 8)); i++) {
          sparkles.push(new Sparkle(mouseX, mouseY));
        }
        lastSparkleTime = now;
      }
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    // ── Lerp helper ──────────────────────────────────────────────────────────
    const lerp = (a, b, t) => a + (b - a) * t;

    // ── Main loop ────────────────────────────────────────────────────────────
    let animFrame;
    const animate = () => {
      smoothX = lerp(smoothX, mouseX, 0.07);
      smoothY = lerp(smoothY, mouseY, 0.07);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connection lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 90) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(139,92,246,${0.07 * (1 - dist / 90)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Update + draw particles
      for (const p of particles) {
        p.update(smoothX, smoothY);
        p.draw(ctx);
      }

      // Update + draw sparkles
      for (let i = sparkles.length - 1; i >= 0; i--) {
        sparkles[i].update();
        sparkles[i].draw(ctx);
        if (sparkles[i].dead) sparkles.splice(i, 1);
      }

      // ── Cursor glow ────────────────────────────────────────────────────────
      if (cursorLightRef.current) {
        cursorLightRef.current.style.left = `${smoothX}px`;
        cursorLightRef.current.style.top = `${smoothY}px`;
      }

      // ── Cursor ring (snappier) ─────────────────────────────────────────────
      if (cursorRingRef.current) {
        const ringX = lerp(parseFloat(cursorRingRef.current.style.left) || mouseX, mouseX, 0.18);
        const ringY = lerp(parseFloat(cursorRingRef.current.style.top) || mouseY, mouseY, 0.18);
        cursorRingRef.current.style.left = `${ringX}px`;
        cursorRingRef.current.style.top = `${ringY}px`;
      }

      // ── Orb parallax ──────────────────────────────────────────────────────
      const normX = (mouseX / window.innerWidth - 0.5);
      const normY = (mouseY / window.innerHeight - 0.5);

      if (orb1Ref.current) {
        orb1Ref.current.style.transform = `translate(${normX * 60}px, ${normY * 40}px)`;
      }
      if (orb2Ref.current) {
        orb2Ref.current.style.transform = `translate(${-normX * 50}px, ${-normY * 60}px)`;
      }
      if (orb3Ref.current) {
        orb3Ref.current.style.transform = `translate(${normX * 30}px, ${normY * 70}px)`;
      }

      // ── Grid perspective tilt ─────────────────────────────────────────────
      if (gridRef.current) {
        const tiltX = normY * 6;
        const tiltY = -normX * 6;
        gridRef.current.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      }

      animFrame = requestAnimationFrame(animate);
    };
    animFrame = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(animFrame);
    };
  }, []);

  return (
    <>
      {/* Grain overlay */}
      <div className="noise-overlay" aria-hidden="true" />

      {/* Aurora orbs */}
      <div className="aurora-bg" aria-hidden="true">
        <div ref={orb1Ref} className="aurora-orb aurora-orb-1" style={{ transition: "transform 1.2s cubic-bezier(0.25,0.46,0.45,0.94)" }} />
        <div ref={orb2Ref} className="aurora-orb aurora-orb-2" style={{ transition: "transform 1.4s cubic-bezier(0.25,0.46,0.45,0.94)" }} />
        <div ref={orb3Ref} className="aurora-orb aurora-orb-3" style={{ transition: "transform 1.0s cubic-bezier(0.25,0.46,0.45,0.94)" }} />

        {/* Perspective tilt grid */}
        <div
          ref={gridRef}
          style={{
            position: "absolute",
            inset: "-20%",
            backgroundImage: `
              linear-gradient(rgba(139,92,246,0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(139,92,246,0.04) 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px",
            transition: "transform 0.4s ease",
            transformOrigin: "center center",
          }}
        />
      </div>

      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      {/* Soft cursor glow */}
      <div
        ref={cursorLightRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          width: 500,
          height: 500,
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 1,
          background: "radial-gradient(circle, rgba(139,92,246,0.09) 0%, rgba(249,115,22,0.05) 40%, transparent 70%)",
          transform: "translate(-50%,-50%)",
          transition: "left 0.12s ease, top 0.12s ease",
        }}
      />

      {/* Sharp cursor ring */}
      <div
        ref={cursorRingRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          width: 28,
          height: 28,
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 2,
          border: "1px solid rgba(139,92,246,0.6)",
          transform: "translate(-50%,-50%)",
          mixBlendMode: "screen",
          boxShadow: "0 0 8px rgba(139,92,246,0.4), inset 0 0 8px rgba(139,92,246,0.1)",
        }}
      />
    </>
  );
}
