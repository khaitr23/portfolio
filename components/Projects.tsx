"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { ExternalLink, X, ChevronRight } from "lucide-react";
import { GithubIcon } from "./icons";
import type { Content } from "@/lib/content";
import TypewriterHeading from "./TypewriterHeading";

type Props = { data: Content["projects"] };
type Project = Content["projects"][0];

function CaseStudyModal({ project, onClose }: { project: Project; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 24 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto card-glass rounded-2xl border border-emerald-500/20 p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-500 hover:text-white transition-colors rounded-lg hover:bg-white/5">
          <X size={16} />
        </button>

        <span className="text-emerald-500/30 font-mono text-5xl font-bold leading-none block mb-4">{project.number}</span>
        <p className="text-emerald-400 text-xs font-mono tracking-wider uppercase mb-2">{project.category}</p>
        <h3 className="text-2xl font-bold text-white mb-6">{project.title}</h3>

        {[
          { label: "The Problem", content: project.problem },
          { label: "The Solution", content: project.solution },
          { label: "Why I Built This", content: project.why },
        ].map(({ label, content }) => (
          <div key={label} className="mb-6">
            <p className="text-xs font-mono text-emerald-500 uppercase tracking-wider mb-2">{label}</p>
            <p className="text-slate-300 text-sm leading-relaxed">{content}</p>
          </div>
        ))}

        <div className="mb-6">
          <p className="text-xs font-mono text-emerald-500 uppercase tracking-wider mb-3">Results</p>
          <ul className="space-y-2">
            {project.results.map((r, i) => (
              <li key={i} className="flex gap-2 text-sm text-slate-300">
                <ChevronRight size={14} className="text-emerald-400 mt-0.5 shrink-0" />
                {r}
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-6">
          <p className="text-xs font-mono text-emerald-500 uppercase tracking-wider mb-3">Tools & Tech</p>
          <div className="flex flex-wrap gap-2">
            {project.tools.map((t) => <span key={t} className="skill-tag">{t}</span>)}
          </div>
        </div>

        <div className="flex gap-3">
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-emerald-500/30 text-emerald-400 hover:border-emerald-500/60 text-sm transition-all duration-200 hover:bg-emerald-500/5">
              <GithubIcon size={14} /> GitHub
            </a>
          )}
          {project.live && (
            <a href={project.live} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-sm font-semibold transition-all duration-200">
              <ExternalLink size={14} /> Live Demo
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Projects({ data }: Props) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [selected, setSelected] = useState<Project | null>(null);

  return (
    <section id="projects" ref={ref} className="py-20 w-full">
      <div className="max-w-6xl mx-auto px-8 md:px-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="mb-4"
      >
        <p className="text-emerald-500 text-xs font-mono tracking-widest uppercase mb-3">Projects</p>
        <div className="flex items-end justify-between flex-wrap gap-4">
          <TypewriterHeading text="Case Studies" className="text-4xl md:text-5xl font-bold text-white" />
          <p className="text-slate-500 text-sm max-w-sm">
            Click any project to explore the problem, solution, and impact in depth.
          </p>
        </div>
      </motion.div>

      <div className="h-px bg-emerald-500/10 mb-12" />

      <div className="space-y-6">
        {data.map((project, i) => (
          <motion.div
            key={project.number}
            initial={{ opacity: 0, y: 32 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
            onClick={() => setSelected(project)}
            className="group card-glass rounded-2xl p-6 md:p-8 card-hover transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-start gap-6">
              <span className="text-emerald-500/20 font-mono text-4xl font-bold leading-none shrink-0 group-hover:text-emerald-500/40 transition-colors duration-300">
                {project.number}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="text-emerald-500/60 text-xs font-mono">{project.category}</span>
                  {project.featured && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      Featured
                    </span>
                  )}
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-2 group-hover:text-emerald-100 transition-colors duration-300">
                  {project.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">{project.summary}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tools.slice(0, 4).map((t) => <span key={t} className="skill-tag">{t}</span>)}
                  {project.tools.length > 4 && <span className="skill-tag">+{project.tools.length - 4}</span>}
                </div>
              </div>
              <div className="shrink-0 p-2 rounded-lg text-slate-600 group-hover:text-emerald-400 group-hover:bg-emerald-500/10 transition-all duration-300">
                <ChevronRight size={20} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selected && <CaseStudyModal project={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
      </div>
    </section>
  );
}
