"use client";

import { useEffect, useRef } from "react";

type Particle = { x: number; y: number; vx: number; vy: number; size: number; hue: number; drift: number };

export default function FluidCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointer = { x: window.innerWidth * 0.62, y: window.innerHeight * 0.22, px: 0, py: 0 };
    let frame = 0;
    let particles: Particle[] = [];
    let width = 0;
    let height = 0;
    let ratio = 1;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      const count = Math.min(560, Math.round((width * height) / 2600));
      particles = Array.from({ length: count }, (_, index) => ({
        x: Math.random() * width, y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.41, vy: (Math.random() - 0.5) * 0.41,
        size: Math.random() * 1.7 + 0.35, hue: index % 6 === 0 ? 270 : 188,
        drift: Math.random() * Math.PI * 2,
      }));
    };
    const move = (event: PointerEvent) => { pointer.x = event.clientX; pointer.y = event.clientY; };
    const draw = (time: number) => {
      context.clearRect(0, 0, width, height);
      const velocity = Math.hypot(pointer.x - pointer.px, pointer.y - pointer.py);
      pointer.px += (pointer.x - pointer.px) * 0.12;
      pointer.py += (pointer.y - pointer.py) * 0.12;
      const glow = context.createRadialGradient(pointer.px, pointer.py, 0, pointer.px, pointer.py, 360 + velocity * 2);
      glow.addColorStop(0, "rgba(0, 239, 255, .22)");
      glow.addColorStop(.32, "rgba(29, 124, 204, .12)");
      glow.addColorStop(1, "rgba(0, 0, 0, 0)");
      context.fillStyle = glow;
      context.fillRect(0, 0, width, height);

      const CELL = 112;
      const cols = Math.max(1, Math.ceil(width / CELL));
      const rows = Math.max(1, Math.ceil(height / CELL));
      const grid: number[][] = new Array(cols * rows);
      for (let g = 0; g < grid.length; g += 1) grid[g] = [];
      for (let p = 0; p < particles.length; p += 1) {
        const pt = particles[p];
        const cx = Math.min(cols - 1, Math.max(0, (pt.x / CELL) | 0));
        const cy = Math.min(rows - 1, Math.max(0, (pt.y / CELL) | 0));
        grid[cy * cols + cx].push(p);
      }
      particles.forEach((particle, index) => {
        const dx = pointer.px - particle.x;
        const dy = pointer.py - particle.y;
        const distance = Math.max(1, Math.hypot(dx, dy));
        if (!reducedMotion && distance < 360) {
          const force = (1 - distance / 360) * (0.255 + Math.min(velocity / 90, 0.57));
          particle.vx -= (dx / distance) * force;
          particle.vy -= (dy / distance) * force;
        }
        particle.vx += Math.sin(time * .00035 + particle.drift) * .014;
        particle.vy += Math.cos(time * .00031 + particle.drift) * .014;
        particle.vx += Math.sin(time * .00082 + particle.drift * 1.7) * .006;
        particle.vy += Math.cos(time * .00077 + particle.drift * 2.3) * .006;
        particle.vx *= .992;
        particle.vy *= .992;
        particle.x += particle.vx * 1.5;
        particle.y += particle.vy * 1.5;
        if (particle.x < -15) particle.x = width + 15;
        if (particle.x > width + 15) particle.x = -15;
        if (particle.y < -15) particle.y = height + 15;
        if (particle.y > height + 15) particle.y = -15;
        context.beginPath();
        context.fillStyle = `hsla(${particle.hue}, 100%, 76%, ${distance < 360 ? .92 : .60})`;
        context.arc(particle.x, particle.y, particle.size + (distance < 150 ? 1 : .25), 0, Math.PI * 2);
        context.fill();
        const cx = Math.min(cols - 1, Math.max(0, (particle.x / CELL) | 0));
        const cy = Math.min(rows - 1, Math.max(0, (particle.y / CELL) | 0));
        for (let oy = -1; oy <= 1; oy += 1) {
          const ny = cy + oy;
          if (ny < 0 || ny >= rows) continue;
          for (let ox = -1; ox <= 1; ox += 1) {
            const nx = cx + ox;
            if (nx < 0 || nx >= cols) continue;
            const bucket = grid[ny * cols + nx];
            for (let b = 0; b < bucket.length; b += 1) {
              const otherIndex = bucket[b];
              if (otherIndex <= index) continue;
              const other = particles[otherIndex];
              const ddx = other.x - particle.x;
              const ddy = other.y - particle.y;
              if (Math.abs(ddx) >= CELL || Math.abs(ddy) >= CELL) continue;
              const connection = ddx * ddx + ddy * ddy;
              if (connection < 12544) {
                const len = Math.sqrt(connection);
                context.beginPath();
                context.strokeStyle = `rgba(77, 226, 240, ${.16 * (1 - len / 112)})`;
                context.moveTo(particle.x, particle.y); context.lineTo(other.x, other.y); context.stroke();
              }
            }
          }
        }
      });
      frame = requestAnimationFrame(draw);
    };
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", move, { passive: true });
    frame = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("resize", resize); window.removeEventListener("pointermove", move); };
  }, []);

  return <canvas ref={canvasRef} className="fluid-canvas" aria-hidden="true" />;
}
