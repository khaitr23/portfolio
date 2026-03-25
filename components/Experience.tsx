"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { ChevronRight, Building2 } from "lucide-react";
import type { Content } from "@/lib/content";
import TypewriterHeading from "./TypewriterHeading";

type Props = { data: Content["experience"] };

const colors = ["#10b981", "#34d399", "#6ee7b7", "#a7f3d0"];

export default function Experience({ data }: Props) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [active, setActive] = useState(0);

  return (
    <section id="experience" ref={ref} className="py-20 w-full">
      <div className="max-w-6xl mx-auto px-8 md:px-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="mb-16"
      >
        <p className="text-emerald-500 text-xs font-mono tracking-widest uppercase mb-3">Experience</p>
        <TypewriterHeading text="Where I've worked" className="text-4xl md:text-5xl font-bold text-white" />
      </motion.div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-8">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="flex flex-row lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-thin"
        >
          {data.map((exp, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`flex items-start gap-3 p-4 rounded-xl border text-left transition-all duration-300 shrink-0 lg:shrink
                ${active === i ? "border-emerald-500/40 bg-emerald-500/8" : "border-transparent hover:border-emerald-500/20 hover:bg-white/2"}`}
            >
              <div className="p-1.5 rounded-lg bg-emerald-500/10 shrink-0 mt-0.5">
                <Building2 size={14} className="text-emerald-400" />
              </div>
              <div className="min-w-0">
                <p className={`text-sm font-medium truncate ${active === i ? "text-white" : "text-slate-400"}`}>
                  {exp.company}
                </p>
                <p className="text-xs text-slate-600 mt-0.5">{exp.period}</p>
              </div>
              {active === i && <ChevronRight size={14} className="text-emerald-400 ml-auto shrink-0 mt-1" />}
            </button>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {data.map((exp, i) =>
            active === i && (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="card-glass rounded-2xl p-8"
              >
                <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono px-2 py-0.5 rounded-full border"
                        style={{ color: colors[i] ?? colors[0], borderColor: (colors[i] ?? colors[0]) + "33", background: (colors[i] ?? colors[0]) + "10" }}>
                        {exp.type}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white">{exp.title}</h3>
                    <p className="text-emerald-400 text-sm mt-0.5">{exp.company} · {exp.location}</p>
                  </div>
                  <span className="text-xs text-slate-500 font-mono shrink-0">{exp.period}</span>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-xs text-emerald-400 font-medium">{exp.impact}</span>
                </div>

                <ul className="space-y-3 mb-6">
                  {exp.bullets.map((b, j) => (
                    <li key={j} className="flex gap-3 text-sm text-slate-400">
                      <span className="text-emerald-500 mt-1 shrink-0">▹</span>
                      {b}
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-2">
                  {exp.tags.map((tag) => (
                    <span key={tag} className="skill-tag">{tag}</span>
                  ))}
                </div>
              </motion.div>
            )
          )}
        </motion.div>
      </div>
      </div>
    </section>
  );
}
