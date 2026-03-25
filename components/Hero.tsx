"use client";

import { useEffect, useRef, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { ArrowDown, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./icons";
import type { Content } from "@/lib/content";
import { showToast } from "@/lib/toast";

type Props = { data: Content["hero"] };

export default function Hero({ data }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let mouse = { x: -9999, y: -9999 };
    let lazy = { x: -9999, y: -9999 };
    let vel = { x: 0, y: 0 };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouse = (e: MouseEvent) => {
      if (mouse.x === -9999) {
        lazy = { x: e.clientX, y: e.clientY };
      }
      mouse = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMouse);

    const COLS = Math.ceil(window.innerWidth / 48);
    const ROWS = Math.ceil(window.innerHeight / 48);

    const draw = () => {
      // Spring physics: natural trailing movement
      const stiffness = 0.010;
      const damping = 0.88;
      vel.x = vel.x * damping + (mouse.x - lazy.x) * stiffness;
      vel.y = vel.y * damping + (mouse.y - lazy.y) * stiffness;
      lazy.x += vel.x;
      lazy.y += vel.y;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < COLS; i++) {
        for (let j = 0; j < ROWS; j++) {
          const x = i * 48 + 24;
          const y = j * 48 + 24;
          const dist = Math.hypot(x - lazy.x, y - lazy.y);
          const influence = Math.max(0, 1 - dist / 200);
          const opacity = 0.08 + influence * 0.55;
          const radius = 1 + influence * 3;
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          // Blur glow on influenced dots
          if (influence > 0.05) {
            ctx.shadowBlur = 8 + influence * 16;
            ctx.shadowColor = `rgba(16, 185, 129, ${influence * 0.8})`;
          } else {
            ctx.shadowBlur = 0;
          }
          ctx.fillStyle = `rgba(16, 185, 129, ${opacity})`;
          ctx.fill();
        }
      }
      ctx.shadowBlur = 0;
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7 } },
  };

  const nameParts = data.name.split(" ");
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(" ");
  const fullName = data.name;

  // Typewriter for name — starts after the hero fade-in settles
  const [nameCount, setNameCount] = useState(0);
  const [nameDone, setNameDone] = useState(false);

  useEffect(() => {
    if (nameDone) return;
    const delay = nameCount === 0 ? 700 : 48;
    const t = setTimeout(() => {
      if (nameCount >= fullName.length) { setNameDone(true); return; }
      setNameCount((c) => c + 1);
    }, delay);
    return () => clearTimeout(t);
  }, [nameCount, fullName.length, nameDone]);

  // Split typed chars into first / last portions
  const typedFirst = fullName.slice(0, Math.min(nameCount, firstName.length));
  const typedLast = nameCount > firstName.length
    ? fullName.slice(firstName.length + 1, nameCount)
    : "";

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden grid-pattern">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 max-w-4xl mx-auto px-8 text-center"
      >
        <motion.div variants={item} className="mb-10 inline-flex">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs font-mono tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            {data.badge}
          </span>
        </motion.div>

        <motion.h1
          variants={item}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 leading-none" style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          <span className="text-white">{typedFirst}</span>
          {nameCount > firstName.length && <span className="text-white"> </span>}
          {typedLast && <span className="text-gradient">{typedLast}</span>}
          {!nameDone && (
            <span
              className="inline-block w-[3px] h-[0.85em] bg-emerald-400 ml-[3px] align-middle"
              style={{ animation: "blink 0.7s step-end infinite" }}
            />
          )}
        </motion.h1>

        <motion.p
          variants={item}
          className="text-lg md:text-xl text-slate-400 mb-8 font-light tracking-wide"
        >
          {data.role}
        </motion.p>

        <motion.p
          variants={item}
          className="text-slate-500 max-w-xl mx-auto mb-14 leading-relaxed text-sm md:text-base whitespace-pre-line"
        >
          {data.tagline}
        </motion.p>

        <motion.div
          variants={item}
          className="flex items-center justify-center gap-4 flex-wrap"
        >
          <a
            href="#projects"
            className="px-7 py-3.5 rounded bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm transition-all duration-200 hover:shadow-[0_0_24px_rgba(16,185,129,0.5)]"
          >
            View Case Studies
          </a>
          <a
            href="#contact"
            className="px-7 py-3.5 rounded border border-emerald-500/30 text-emerald-400 hover:border-emerald-500/60 text-sm font-medium transition-all duration-200 hover:bg-emerald-500/5"
          >
            Contact Me
          </a>
        </motion.div>

        <motion.div
          variants={item}
          className="mt-16 flex items-center justify-center gap-8"
        >
          {[
            { icon: GithubIcon, href: data.github, label: "GitHub", isEmail: false },
            { icon: LinkedinIcon, href: data.linkedin, label: "LinkedIn", isEmail: false },
            { icon: Mail, href: `mailto:${data.email}`, label: "Email", isEmail: true },
          ].map(({ icon: Icon, href, label, isEmail }) =>
            isEmail ? (
              <button
                key={label}
                aria-label={label}
                onClick={() => {
                  window.location.href = href;
                  navigator.clipboard?.writeText(data.email).then(() => showToast("Email copied to clipboard"));
                }}
                className="text-slate-500 hover:text-emerald-400 transition-colors duration-200 cursor-pointer"
              >
                <Icon size={18} />
              </button>
            ) : (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-slate-500 hover:text-emerald-400 transition-colors duration-200"
              >
                <Icon size={18} />
              </a>
            )
          )}
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-600"
      >
        <span className="text-xs font-mono tracking-widest uppercase">scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown size={14} />
        </motion.div>
      </motion.div>
    </section>
  );
}
