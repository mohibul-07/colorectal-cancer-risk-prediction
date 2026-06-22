import { useEffect, useRef } from "react";

/**
 * Lightweight canvas particle system for the hero background.
 * 40–60 small circles drift slowly upward; nearby pairs briefly connect with
 * thin lines to evoke DNA base pairs. Pure requestAnimationFrame + canvas 2d.
 * Top/bottom edges are faded via a CSS mask on the canvas element.
 */
export default function DNAParticles() {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let width = 0;
    let height = 0;
    let particles = [];

    const TEAL = "20, 184, 166"; // teal-400-ish
    const INDIGO = "129, 140, 248"; // indigo-400

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // particle count scales with area, clamped 40–60
      const count = Math.max(40, Math.min(60, Math.round((width * height) / 22000)));
      particles = Array.from({ length: count }, () => spawn(true));
    };

    const spawn = (anywhere) => ({
      x: Math.random() * width,
      y: anywhere ? Math.random() * height : height + 10,
      r: 3 + Math.random() * 2,
      vy: -(0.15 + Math.random() * 0.35), // drift upward
      vx: (Math.random() - 0.5) * 0.25, // slight horizontal drift
      indigo: Math.random() < 0.3,
      alpha: 0.25 + Math.random() * 0.15,
    });

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // move + draw particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -10) Object.assign(p, spawn(false));
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        const color = p.indigo ? INDIGO : TEAL;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, ${p.alpha})`;
        ctx.fill();
      }

      // connect nearby pairs with thin lines (base-pair effect)
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 90) {
            const op = (1 - dist / 90) * 0.18;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(45, 212, 191, ${op})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-60 pointer-events-none"
      style={{
        willChange: "transform",
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)",
        maskImage:
          "linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)",
      }}
    />
  );
}
