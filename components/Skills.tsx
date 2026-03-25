"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import type { Content } from "@/lib/content";
import TypewriterHeading from "./TypewriterHeading";

type Props = { data: Content["skills"] };

export default function Skills({ data }: Props) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="skills" ref={ref} className="py-20 w-full">
      <div className="max-w-6xl mx-auto px-8 md:px-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="mb-16"
      >
        <p className="text-emerald-500 text-xs font-mono tracking-widest uppercase mb-3">Skills</p>
        <TypewriterHeading text="Tech stack" className="text-4xl md:text-5xl font-bold text-white" />
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {data.groups.map((group, i) => (
          <motion.div
            key={group.category}
            initial={{ opacity: 0, y: 32 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
            className="card-glass rounded-2xl p-6 card-hover transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-5">
              <span className="text-emerald-400 font-mono text-lg">{group.icon}</span>
              <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">{group.category}</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {group.skills.map((skill, j) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.3, delay: i * 0.1 + j * 0.04, ease: "easeOut" }}
                  className="skill-tag hover:border-emerald-400/40 hover:text-emerald-300 cursor-default transition-all duration-200"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      </div>
    </section>
  );
}
