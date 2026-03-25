"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";
import { Award, MapPin, Calendar } from "lucide-react";
import type { Content, CourseGroup } from "@/lib/content";
import { UWIcon } from "./icons";
import TypewriterHeading from "./TypewriterHeading";

type Props = { data: Content["about"]; coursework: CourseGroup[] };

export default function About({ data, coursework }: Props) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 32 },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" },
    }),
  };

  return (
    <section id="about" ref={ref} className="py-20 w-full">
      <div className="max-w-6xl mx-auto px-8 md:px-12">
      <div className="grid lg:grid-cols-2 gap-16 items-start">
        <div>
          <motion.p custom={0} variants={fadeUp} initial="hidden" animate={inView ? "show" : "hidden"}
            className="text-emerald-500 text-xs font-mono tracking-widest uppercase mb-4">
            About
          </motion.p>
          <TypewriterHeading
            text={data.headline}
            className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight"
            highlights={[{ word: "intersection", className: "text-gradient" }]}
            delay={200}
          />
          <motion.p custom={2} variants={fadeUp} initial="hidden" animate={inView ? "show" : "hidden"}
            className="text-slate-400 leading-relaxed mb-4">
            {data.bio1}
          </motion.p>
          <motion.p custom={3} variants={fadeUp} initial="hidden" animate={inView ? "show" : "hidden"}
            className="text-slate-400 leading-relaxed mb-8">
            {data.bio2}
          </motion.p>

        </div>

        <div className="grid grid-cols-2 gap-4">
          {data.stats.map((s, i) => (
            <motion.div key={s.label} custom={i + 2} variants={fadeUp} initial="hidden" animate={inView ? "show" : "hidden"}
              className="card-glass rounded-xl p-6 card-hover transition-all duration-300 group">
              <p className="text-3xl md:text-4xl font-bold text-gradient mb-1">{s.value}</p>
              <p className="text-white text-sm font-medium">{s.label}</p>
              <p className="text-slate-500 text-xs mt-0.5">{s.sub}</p>
            </motion.div>
          ))}
          <motion.div custom={6} variants={fadeUp} initial="hidden" animate={inView ? "show" : "hidden"}
            className="col-span-2 card-glass rounded-xl p-5 card-hover transition-all duration-300">
            <p className="text-xs text-slate-500 font-mono uppercase tracking-wider mb-3">Beyond the Terminal</p>
            <div className="flex flex-wrap gap-2">
              {data.interests.map((interest) => (
                <span key={interest} className="skill-tag">{interest}</span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Full-width Education + Coursework card */}
      <motion.div custom={7} variants={fadeUp} initial="hidden" animate={inView ? "show" : "hidden"}
        className="mt-8 card-glass rounded-xl p-6 card-hover transition-all duration-300">
        {/* Education */}
        <div className="flex items-start gap-4 mb-6">
          <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 shrink-0">
            <UWIcon size={22} />
          </div>
          <div className="flex-1">
            <p className="text-white font-semibold text-sm mb-0.5">{data.education.school}</p>
            <p className="text-slate-400 text-xs mb-2">{data.education.degree}</p>
            <div className="flex flex-wrap gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1"><MapPin size={11} /> {data.education.location}</span>
              <span className="flex items-center gap-1"><Calendar size={11} /> {data.education.graduation}</span>
              <span className="flex items-center gap-1"><Award size={11} /> {data.education.award}</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/6 mb-5" />

        {/* Coursework */}
        <p className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Relevant Coursework</p>
        <div className="flex flex-wrap gap-x-12 gap-y-4">
          {coursework.map((group) => (
            <div key={group.category}>
              <p className="text-xs font-mono text-emerald-500/60 uppercase tracking-wider mb-2">{group.category}</p>
              <div className="flex flex-wrap gap-2">
                {group.courses.map((course) =>
                  course.url ? (
                    <a key={course.name} href={course.url} target="_blank" rel="noopener noreferrer"
                      className="text-xs px-3 py-1.5 rounded-full border border-slate-700/60 text-slate-400 hover:border-emerald-500/50 hover:text-emerald-400 transition-all duration-200 flex items-center gap-1">
                      {course.name}
                      <span className="text-emerald-600 text-[10px]">↗</span>
                    </a>
                  ) : (
                    <span key={course.name}
                      className="text-xs px-3 py-1.5 rounded-full border border-slate-700/60 text-slate-400 hover:border-emerald-500/30 hover:text-emerald-400/80 transition-all duration-200 cursor-default">
                      {course.name}
                    </span>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
      </div>
    </section>
  );
}
