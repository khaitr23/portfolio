"use client";

import { useState, useTransition, useEffect } from "react";
import { Reorder, useDragControls, motion } from "framer-motion";
import { updateContent } from "./actions";
import type { Content, Experience, Project, SkillGroup, Course, CourseGroup } from "@/lib/content";
import { Check, Plus, Trash2, ChevronDown, ChevronUp, Save, Loader } from "lucide-react";

const SECTIONS = ["Hero", "About", "Experience", "Projects", "Skills", "Contact"] as const;
type Section = (typeof SECTIONS)[number];

// ─── Drop indicator line ────────────────────────────────────────────────────

function DropLine({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0.8 }}
      animate={{ opacity: 1, scaleX: 1 }}
      exit={{ opacity: 0 }}
      className="h-0.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)] mx-1 -mb-1 z-10 relative"
    />
  );
}

// ─── Field ──────────────────────────────────────────────────────────────────

function Field({
  label, value, onChange, multiline = false, mono = false, placeholder = "",
}: {
  label: string; value: string; onChange: (v: string) => void;
  multiline?: boolean; mono?: boolean; placeholder?: string;
}) {
  const base = "w-full bg-white/3 border border-white/8 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500/40 focus:bg-emerald-500/3 transition-all resize-none placeholder-slate-600";
  return (
    <div>
      <label className="block text-xs text-slate-500 font-mono uppercase tracking-wider mb-1.5">{label}</label>
      {multiline ? (
        <textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={`${base} ${mono ? "font-mono text-xs" : ""}`} />
      ) : (
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={`${base} ${mono ? "font-mono text-xs" : ""}`} />
      )}
    </div>
  );
}

// ─── TagList ────────────────────────────────────────────────────────────────

function TagList({ label, items, onChange }: { label: string; items: string[]; onChange: (v: string[]) => void }) {
  const [input, setInput] = useState("");
  const [dragging, setDragging] = useState(false);
  const [dropIdx, setDropIdx] = useState<number | null>(null);

  useEffect(() => {
    const reset = () => { setDragging(false); setDropIdx(null); };
    window.addEventListener("pointerup", reset);
    return () => window.removeEventListener("pointerup", reset);
  }, []);

  const add = () => {
    const val = input.trim();
    if (val && !items.includes(val)) onChange([...items, val]);
    setInput("");
  };

  return (
    <div>
      <label className="block text-xs text-slate-500 font-mono uppercase tracking-wider mb-1.5">{label}</label>
      <Reorder.Group axis="x" values={items} onReorder={onChange} className="flex flex-wrap gap-1.5 mb-2" style={{ listStyle: "none" }}>
        {items.map((item, i) => (
          <TagItem
            key={item}
            item={item}
            i={i}
            dragging={dragging}
            dropIdx={dropIdx}
            setDragging={setDragging}
            setDropIdx={setDropIdx}
            onRemove={() => onChange(items.filter((_, j) => j !== i))}
          />
        ))}
      </Reorder.Group>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
          placeholder="Add item, press Enter"
          className="flex-1 bg-white/3 border border-white/8 rounded-lg px-3 py-2 text-white text-xs font-mono focus:outline-none focus:border-emerald-500/40 transition-all placeholder-slate-600"
        />
        <button onClick={add} className="px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-all">
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}

function TagItem({ item, i, dragging, dropIdx, setDragging, setDropIdx, onRemove }: {
  item: string; i: number; dragging: boolean; dropIdx: number | null;
  setDragging: (v: boolean) => void; setDropIdx: (v: number | null) => void; onRemove: () => void;
}) {
  const controls = useDragControls();
  return (
    <Reorder.Item
      value={item}
      dragControls={controls}
      dragListener={false}
      whileDrag={{ scale: 1.05, zIndex: 50 }}
      onPointerEnter={() => dragging && setDropIdx(i)}
      className="relative inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono select-none"
      style={{ listStyle: "none", cursor: "default" }}
    >
      {dragging && dropIdx === i && (
        <div className="absolute -left-1 top-0 bottom-0 w-0.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.7)]" />
      )}
      <span
        onPointerDown={(e) => { setDragging(true); controls.start(e); }}
        className="text-emerald-700 text-[10px] mr-0.5 cursor-grab active:cursor-grabbing touch-none"
      >⠿</span>
      {item}
      <button onClick={onRemove} className="text-emerald-600 hover:text-red-400 transition-colors">×</button>
    </Reorder.Item>
  );
}

// ─── BulletList ─────────────────────────────────────────────────────────────

function BulletList({ label, items, onChange }: { label: string; items: string[]; onChange: (v: string[]) => void }) {
  return (
    <div>
      {label && <label className="block text-xs text-slate-500 font-mono uppercase tracking-wider mb-1.5">{label}</label>}
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <textarea rows={2} value={item}
              onChange={(e) => { const next = [...items]; next[i] = e.target.value; onChange(next); }}
              className="flex-1 bg-white/3 border border-white/8 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/40 transition-all resize-none placeholder-slate-600"
            />
            <button onClick={() => onChange(items.filter((_, j) => j !== i))} className="text-slate-600 hover:text-red-400 transition-colors self-start mt-2">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        <button onClick={() => onChange([...items, ""])} className="flex items-center gap-1.5 text-xs text-emerald-500 hover:text-emerald-400 transition-colors font-mono">
          <Plus size={12} /> Add bullet
        </button>
      </div>
    </div>
  );
}

function SolutionField({ value, onChange }: { value: string | string[]; onChange: (v: string | string[]) => void }) {
  const isBullets = Array.isArray(value);
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-xs text-slate-500 font-mono uppercase tracking-wider">The Solution</label>
        <button
          onClick={() => onChange(isBullets ? (value as string[]).join(" ") : (value as string).split(/\.\s+/).filter(Boolean).map(s => s.endsWith(".") ? s : s + "."))}
          className="text-xs font-mono text-emerald-500 hover:text-emerald-400 transition-colors"
        >
          {isBullets ? "Switch to prose" : "Switch to bullets"}
        </button>
      </div>
      {isBullets ? (
        <BulletList label="" items={value as string[]} onChange={onChange} />
      ) : (
        <textarea rows={4} value={value as string}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-white/3 border border-white/8 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/40 transition-all resize-none placeholder-slate-600"
        />
      )}
    </div>
  );
}

// ─── Section editors ────────────────────────────────────────────────────────

function HeroEditor({ data, onChange }: { data: Content["hero"]; onChange: (v: Content["hero"]) => void }) {
  const set = (key: keyof Content["hero"]) => (v: string) => onChange({ ...data, [key]: v });
  return (
    <div className="space-y-4">
      <Field label="Badge text" value={data.badge} onChange={set("badge")} />
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Name" value={data.name} onChange={set("name")} />
        <Field label="Role" value={data.role} onChange={set("role")} />
      </div>
      <Field label="Tagline" value={data.tagline} onChange={set("tagline")} multiline />
      <div className="grid sm:grid-cols-3 gap-4">
        <Field label="GitHub URL" value={data.github} onChange={set("github")} mono />
        <Field label="LinkedIn URL" value={data.linkedin} onChange={set("linkedin")} mono />
        <Field label="Email" value={data.email} onChange={set("email")} mono />
      </div>
    </div>
  );
}

function AboutEditor({ data, onChange, coursework, onCourseworkChange }: {
  data: Content["about"]; onChange: (v: Content["about"]) => void;
  coursework: CourseGroup[]; onCourseworkChange: (v: CourseGroup[]) => void;
}) {
  return (
    <div className="space-y-6">
      <Field label="Headline (use \\n for line breaks)" value={data.headline} onChange={(v) => onChange({ ...data, headline: v })} multiline />
      <Field label="Bio paragraph 1" value={data.bio1} onChange={(v) => onChange({ ...data, bio1: v })} multiline />
      <Field label="Bio paragraph 2" value={data.bio2} onChange={(v) => onChange({ ...data, bio2: v })} multiline />
      <div>
        <label className="block text-xs text-slate-500 font-mono uppercase tracking-wider mb-3">Stats</label>
        <div className="grid sm:grid-cols-2 gap-3">
          {data.stats.map((s, i) => (
            <div key={i} className="p-3 rounded-lg bg-white/2 border border-white/6 space-y-2">
              <div className="grid grid-cols-3 gap-2">
                <Field label="Value" value={s.value} onChange={(v) => { const next = [...data.stats]; next[i] = { ...s, value: v }; onChange({ ...data, stats: next }); }} />
                <Field label="Label" value={s.label} onChange={(v) => { const next = [...data.stats]; next[i] = { ...s, label: v }; onChange({ ...data, stats: next }); }} />
                <Field label="Sub" value={s.sub} onChange={(v) => { const next = [...data.stats]; next[i] = { ...s, sub: v }; onChange({ ...data, stats: next }); }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <TagList label="Interests" items={data.interests} onChange={(v) => onChange({ ...data, interests: v })} />
      <div className="p-4 rounded-lg bg-white/2 border border-white/6 space-y-3">
        <p className="text-xs text-slate-400 font-mono uppercase tracking-wider">Education</p>
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="School" value={data.education.school} onChange={(v) => onChange({ ...data, education: { ...data.education, school: v } })} />
          <Field label="Degree" value={data.education.degree} onChange={(v) => onChange({ ...data, education: { ...data.education, degree: v } })} />
          <Field label="Location" value={data.education.location} onChange={(v) => onChange({ ...data, education: { ...data.education, location: v } })} />
          <Field label="Graduation" value={data.education.graduation} onChange={(v) => onChange({ ...data, education: { ...data.education, graduation: v } })} />
          <Field label="Award" value={data.education.award} onChange={(v) => onChange({ ...data, education: { ...data.education, award: v } })} />
        </div>
      </div>
      <CourseworkEditor items={coursework} onChange={onCourseworkChange} />
    </div>
  );
}

// ─── Experience ──────────────────────────────────────────────────────────────

function ExpItem({ exp, isOpen, onToggle, onUpdate, onRemove, dragging, dropIdx, i, setDragging, setDropIdx }: {
  exp: Experience; isOpen: boolean; onToggle: () => void;
  onUpdate: (v: Experience) => void; onRemove: () => void;
  dragging: boolean; dropIdx: number | null; i: number;
  setDragging: (v: boolean) => void; setDropIdx: (v: number | null) => void;
}) {
  const controls = useDragControls();
  return (
    <Reorder.Item
      value={exp}
      dragControls={controls}
      dragListener={false}
      layout="position"
      whileDrag={{ scale: 1.01, boxShadow: "0 8px 32px rgba(0,0,0,0.4)", zIndex: 50 }}
      onPointerEnter={() => dragging && setDropIdx(i)}
      className="rounded-xl border border-white/8 overflow-visible relative"
      style={{ listStyle: "none" }}
    >
      <DropLine show={dragging && dropIdx === i} />
      <div className="rounded-xl overflow-hidden bg-[#0d1117]">
        <div
          role="button" tabIndex={0}
          onClick={onToggle}
          onKeyDown={(e) => e.key === "Enter" && onToggle()}
          className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/3 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <span
              onPointerDown={(e) => { e.stopPropagation(); setDragging(true); controls.start(e); }}
              className="text-slate-600 text-base select-none cursor-grab active:cursor-grabbing touch-none"
            >⠿</span>
            <div>
              <p className="text-white text-sm font-medium">{exp.title}</p>
              <p className="text-slate-500 text-xs font-mono">{exp.company} · {exp.period}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={(e) => { e.stopPropagation(); onRemove(); }} className="text-slate-600 hover:text-red-400 transition-colors p-1"><Trash2 size={13} /></button>
            {isOpen ? <ChevronUp size={14} className="text-slate-500" /> : <ChevronDown size={14} className="text-slate-500" />}
          </div>
        </div>
        {isOpen && (
          <div className="px-4 pb-4 space-y-4 border-t border-white/6 pt-4">
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Title" value={exp.title} onChange={(v) => onUpdate({ ...exp, title: v })} />
              <Field label="Company" value={exp.company} onChange={(v) => onUpdate({ ...exp, company: v })} />
              <Field label="Location" value={exp.location} onChange={(v) => onUpdate({ ...exp, location: v })} />
              <Field label="Period" value={exp.period} onChange={(v) => onUpdate({ ...exp, period: v })} />
              <Field label="Type" value={exp.type} onChange={(v) => onUpdate({ ...exp, type: v })} />
              <Field label="Impact line" value={exp.impact} onChange={(v) => onUpdate({ ...exp, impact: v })} />
            </div>
            <BulletList label="Bullet points" items={exp.bullets} onChange={(v) => onUpdate({ ...exp, bullets: v })} />
            <TagList label="Tags" items={exp.tags} onChange={(v) => onUpdate({ ...exp, tags: v })} />
          </div>
        )}
      </div>
    </Reorder.Item>
  );
}

function ExperienceEditor({ data, onChange }: { data: Experience[]; onChange: (v: Experience[]) => void }) {
  const [open, setOpen] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);
  const [dropIdx, setDropIdx] = useState<number | null>(null);

  useEffect(() => {
    const reset = () => { setDragging(false); setDropIdx(null); };
    window.addEventListener("pointerup", reset);
    return () => window.removeEventListener("pointerup", reset);
  }, []);

  const addExp = () => onChange([...data, { title: "New Role", company: "Company", location: "City, ST", period: "Mon YYYY – Mon YYYY", type: "Internship", impact: "", bullets: [""], tags: [] }]);

  return (
    <div className="space-y-1">
      <Reorder.Group axis="y" values={data} onReorder={(next) => { onChange(next); setOpen(null); }} style={{ listStyle: "none", padding: 0 }} className="space-y-2">
        {data.map((exp, i) => (
          <ExpItem
            key={i}
            exp={exp} i={i}
            isOpen={open === i}
            onToggle={() => setOpen(open === i ? null : i)}
            onUpdate={(v) => { const next = [...data]; next[i] = v; onChange(next); }}
            onRemove={() => { const next = data.filter((_, j) => j !== i); onChange(next); if (open !== null && open >= next.length) setOpen(null); }}
            dragging={dragging} dropIdx={dropIdx}
            setDragging={setDragging} setDropIdx={setDropIdx}
          />
        ))}
      </Reorder.Group>
      <button onClick={addExp} className="flex items-center gap-2 text-sm text-emerald-500 hover:text-emerald-400 transition-colors font-mono pt-2">
        <Plus size={14} /> Add experience
      </button>
    </div>
  );
}

// ─── Projects ────────────────────────────────────────────────────────────────

const renumber = (arr: Project[]) => arr.map((p, i) => ({ ...p, number: String(i + 1).padStart(2, "0") }));

function ProjectItem({ p, i, isOpen, onToggle, onUpdate, onRemove, dragging, dropIdx, setDragging, setDropIdx }: {
  p: Project; i: number; isOpen: boolean; onToggle: () => void;
  onUpdate: (v: Project) => void; onRemove: () => void;
  dragging: boolean; dropIdx: number | null;
  setDragging: (v: boolean) => void; setDropIdx: (v: number | null) => void;
}) {
  const controls = useDragControls();
  return (
    <Reorder.Item
      value={p}
      dragControls={controls}
      dragListener={false}
      layout="position"
      whileDrag={{ scale: 1.01, boxShadow: "0 8px 32px rgba(0,0,0,0.4)", zIndex: 50 }}
      onPointerEnter={() => dragging && setDropIdx(i)}
      className="rounded-xl border border-white/8 overflow-visible relative"
      style={{ listStyle: "none" }}
    >
      <DropLine show={dragging && dropIdx === i} />
      <div className="rounded-xl overflow-hidden bg-[#0d1117]">
        <div
          role="button" tabIndex={0}
          onClick={onToggle}
          onKeyDown={(e) => e.key === "Enter" && onToggle()}
          className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/3 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <span
              onPointerDown={(e) => { e.stopPropagation(); setDragging(true); controls.start(e); }}
              className="text-slate-600 text-base select-none cursor-grab active:cursor-grabbing touch-none"
            >⠿</span>
            <span className="text-emerald-500/40 font-mono text-sm">{p.number}</span>
            <div>
              <div className="flex items-center gap-2">
                <p className={`text-sm font-medium ${p.hidden ? "text-slate-500 line-through" : "text-white"}`}>{p.title}</p>
                {p.hidden && <span className="text-xs font-mono text-red-400/70 bg-red-500/10 px-1.5 py-0.5 rounded">hidden</span>}
              </div>
              <p className="text-slate-500 text-xs font-mono">{p.category}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={(e) => { e.stopPropagation(); onRemove(); }} className="text-slate-600 hover:text-red-400 transition-colors p-1"><Trash2 size={13} /></button>
            {isOpen ? <ChevronUp size={14} className="text-slate-500" /> : <ChevronDown size={14} className="text-slate-500" />}
          </div>
        </div>
        {isOpen && (
          <div className="px-4 pb-4 space-y-4 border-t border-white/6 pt-4">
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Category" value={p.category} onChange={(v) => onUpdate({ ...p, category: v })} />
            </div>
            <Field label="Title" value={p.title} onChange={(v) => onUpdate({ ...p, title: v })} />
            <Field label="Summary" value={p.summary} onChange={(v) => onUpdate({ ...p, summary: v })} multiline />
            <Field label="The Problem" value={p.problem} onChange={(v) => onUpdate({ ...p, problem: v })} multiline />
            <SolutionField
              value={p.solution}
              onChange={(v) => onUpdate({ ...p, solution: v })}
            />
            <Field label="Why I Built This" value={p.why} onChange={(v) => onUpdate({ ...p, why: v })} multiline />
            <BulletList label="Results" items={p.results} onChange={(v) => onUpdate({ ...p, results: v })} />
            <TagList label="Tools" items={p.tools} onChange={(v) => onUpdate({ ...p, tools: v })} />
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="GitHub URL" value={p.github} onChange={(v) => onUpdate({ ...p, github: v })} mono />
              <Field label="Live URL" value={p.live} onChange={(v) => onUpdate({ ...p, live: v })} mono />
            </div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={p.featured} onChange={(e) => onUpdate({ ...p, featured: e.target.checked })} className="accent-emerald-500" />
                <span className="text-xs text-slate-400 font-mono">Featured project</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={!!p.hidden} onChange={(e) => onUpdate({ ...p, hidden: e.target.checked })} className="accent-red-500" />
                <span className="text-xs text-slate-400 font-mono">Hide from site</span>
              </label>
            </div>
          </div>
        )}
      </div>
    </Reorder.Item>
  );
}

function ProjectsEditor({ data, onChange }: { data: Project[]; onChange: (v: Project[]) => void }) {
  const [open, setOpen] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);
  const [dropIdx, setDropIdx] = useState<number | null>(null);

  useEffect(() => {
    const reset = () => { setDragging(false); setDropIdx(null); };
    window.addEventListener("pointerup", reset);
    return () => window.removeEventListener("pointerup", reset);
  }, []);

  const addProject = () => onChange(renumber([...data, { number: "", title: "New Project", category: "Category", summary: "", problem: "", solution: "", why: "", results: [""], tools: [], featured: false, github: "", live: "" }]));

  return (
    <div className="space-y-1">
      <Reorder.Group axis="y" values={data} onReorder={(next) => { onChange(renumber(next)); setOpen(null); }} style={{ listStyle: "none", padding: 0 }} className="space-y-2">
        {data.map((p, i) => (
          <ProjectItem
            key={i}
            p={p} i={i}
            isOpen={open === i}
            onToggle={() => setOpen(open === i ? null : i)}
            onUpdate={(v) => { const next = [...data]; next[i] = v; onChange(next); }}
            onRemove={() => { const next = renumber(data.filter((_, j) => j !== i)); onChange(next); if (open !== null && open >= next.length) setOpen(null); }}
            dragging={dragging} dropIdx={dropIdx}
            setDragging={setDragging} setDropIdx={setDropIdx}
          />
        ))}
      </Reorder.Group>
      <button onClick={addProject} className="flex items-center gap-2 text-sm text-emerald-500 hover:text-emerald-400 transition-colors font-mono pt-2">
        <Plus size={14} /> Add project
      </button>
    </div>
  );
}

// ─── Coursework ───────────────────────────────────────────────────────────────

function CourseRow({ course, gi, ci, dragging, dropIdx, setDragging, setDropIdx, onUpdate, onRemove }: {
  course: Course; gi: number; ci: number;
  dragging: boolean; dropIdx: string | null;
  setDragging: (v: boolean) => void; setDropIdx: (v: string | null) => void;
  onUpdate: (c: Course) => void; onRemove: () => void;
}) {
  const controls = useDragControls();
  const id = `${gi}-${ci}`;
  return (
    <Reorder.Item
      value={course}
      dragControls={controls}
      dragListener={false}
      layout
      whileDrag={{ scale: 1.01, zIndex: 50 }}
      onPointerEnter={() => dragging && setDropIdx(id)}
      className="relative"
      style={{ listStyle: "none" }}
    >
      {dragging && dropIdx === id && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="h-0.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)] mb-1"
        />
      )}
      <div className="flex gap-2 items-center">
        <span
          onPointerDown={(e) => { e.stopPropagation(); setDragging(true); controls.start(e); }}
          className="text-slate-600 text-sm select-none cursor-grab active:cursor-grabbing touch-none shrink-0"
        >⠿</span>
        <input value={course.name} onChange={(e) => onUpdate({ ...course, name: e.target.value })} placeholder="Course name"
          className="flex-1 bg-white/3 border border-white/8 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500/40 transition-all placeholder-slate-600" />
        <input value={course.url} onChange={(e) => onUpdate({ ...course, url: e.target.value })} placeholder="URL (optional)"
          className="flex-1 bg-white/3 border border-white/8 rounded-lg px-3 py-2 text-white text-sm font-mono focus:outline-none focus:border-emerald-500/40 transition-all placeholder-slate-600" />
        <button onClick={onRemove} className="text-slate-600 hover:text-red-400 transition-colors shrink-0"><Trash2 size={13} /></button>
      </div>
    </Reorder.Item>
  );
}

function CourseworkEditor({ items, onChange }: { items: CourseGroup[]; onChange: (v: CourseGroup[]) => void }) {
  const [dragging, setDragging] = useState(false);
  const [dropIdx, setDropIdx] = useState<string | null>(null);
  const [groupDragging, setGroupDragging] = useState(false);
  const [groupDropIdx, setGroupDropIdx] = useState<number | null>(null);

  useEffect(() => {
    const reset = () => { setDragging(false); setDropIdx(null); setGroupDragging(false); setGroupDropIdx(null); };
    window.addEventListener("pointerup", reset);
    return () => window.removeEventListener("pointerup", reset);
  }, []);

  const updateGroup = (gi: number, g: CourseGroup) => { const next = [...items]; next[gi] = g; onChange(next); };
  const removeGroup = (gi: number) => onChange(items.filter((_, j) => j !== gi));
  const addGroup = () => onChange([...items, { category: "", courses: [] }]);
  const updateCourse = (gi: number, ci: number, c: Course) => { const courses = [...items[gi].courses]; courses[ci] = c; updateGroup(gi, { ...items[gi], courses }); };
  const removeCourse = (gi: number, ci: number) => updateGroup(gi, { ...items[gi], courses: items[gi].courses.filter((_, j) => j !== ci) });
  const addCourse = (gi: number) => updateGroup(gi, { ...items[gi], courses: [...items[gi].courses, { name: "", url: "" }] });

  return (
    <div>
      <label className="block text-xs text-slate-500 font-mono uppercase tracking-wider mb-3">Coursework</label>
      <Reorder.Group axis="y" values={items} onReorder={onChange} style={{ listStyle: "none", padding: 0 }} className="space-y-3">
        {items.map((group, gi) => (
          <CourseGroupItem
            key={group.category || gi}
            group={group} gi={gi}
            groupDragging={groupDragging} groupDropIdx={groupDropIdx}
            setGroupDragging={setGroupDragging} setGroupDropIdx={setGroupDropIdx}
            dragging={dragging} dropIdx={dropIdx}
            setDragging={setDragging} setDropIdx={setDropIdx}
            onUpdateGroup={(g) => updateGroup(gi, g)}
            onRemoveGroup={() => removeGroup(gi)}
            onUpdateCourse={(ci, c) => updateCourse(gi, ci, c)}
            onRemoveCourse={(ci) => removeCourse(gi, ci)}
            onAddCourse={() => addCourse(gi)}
          />
        ))}
      </Reorder.Group>
      <button onClick={addGroup} className="flex items-center gap-1.5 text-xs text-emerald-500 hover:text-emerald-400 transition-colors font-mono mt-3">
        <Plus size={12} /> Add category
      </button>
    </div>
  );
}

function CourseGroupItem({ group, gi, groupDragging, groupDropIdx, setGroupDragging, setGroupDropIdx, dragging, dropIdx, setDragging, setDropIdx, onUpdateGroup, onRemoveGroup, onUpdateCourse, onRemoveCourse, onAddCourse }: {
  group: CourseGroup; gi: number;
  groupDragging: boolean; groupDropIdx: number | null;
  setGroupDragging: (v: boolean) => void; setGroupDropIdx: (v: number | null) => void;
  dragging: boolean; dropIdx: string | null;
  setDragging: (v: boolean) => void; setDropIdx: (v: string | null) => void;
  onUpdateGroup: (g: CourseGroup) => void; onRemoveGroup: () => void;
  onUpdateCourse: (ci: number, c: Course) => void; onRemoveCourse: (ci: number) => void; onAddCourse: () => void;
}) {
  const controls = useDragControls();
  return (
    <Reorder.Item
      value={group}
      dragControls={controls}
      dragListener={false}
      layout
      whileDrag={{ scale: 1.01, zIndex: 50 }}
      onPointerEnter={() => groupDragging && setGroupDropIdx(gi)}
      className="relative"
      style={{ listStyle: "none" }}
    >
      {groupDragging && groupDropIdx === gi && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="h-0.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)] mb-1" />
      )}
      <div className="p-4 rounded-xl bg-white/2 border border-white/6 space-y-3">
        <div className="flex gap-2 items-center">
          <span
            onPointerDown={(e) => { e.stopPropagation(); setGroupDragging(true); controls.start(e); }}
            className="text-slate-600 text-base select-none cursor-grab active:cursor-grabbing touch-none"
          >⠿</span>
          <input value={group.category} onChange={(e) => onUpdateGroup({ ...group, category: e.target.value })}
            placeholder="Category (e.g. Computer Science)"
            className="flex-1 bg-white/3 border border-white/8 rounded-lg px-3 py-2 text-white text-sm font-semibold focus:outline-none focus:border-emerald-500/40 transition-all placeholder-slate-600" />
          <button onClick={onRemoveGroup} className="text-slate-600 hover:text-red-400 transition-colors shrink-0"><Trash2 size={13} /></button>
        </div>
        <Reorder.Group axis="y" values={group.courses} onReorder={(next) => onUpdateGroup({ ...group, courses: next })} style={{ listStyle: "none", padding: 0 }} className="space-y-2">
          {group.courses.map((c, ci) => (
            <CourseRow
              key={c.name + ci}
              course={c} gi={gi} ci={ci}
              dragging={dragging} dropIdx={dropIdx}
              setDragging={setDragging} setDropIdx={setDropIdx}
              onUpdate={(updated) => onUpdateCourse(ci, updated)}
              onRemove={() => onRemoveCourse(ci)}
            />
          ))}
        </Reorder.Group>
        <button onClick={onAddCourse} className="flex items-center gap-1.5 text-xs text-emerald-500 hover:text-emerald-400 transition-colors font-mono">
          <Plus size={12} /> Add course
        </button>
      </div>
    </Reorder.Item>
  );
}

// ─── Skills ──────────────────────────────────────────────────────────────────

function SkillGroupItem({ g, i, dragging, dropIdx, setDragging, setDropIdx, onUpdate }: {
  g: SkillGroup; i: number; dragging: boolean; dropIdx: number | null;
  setDragging: (v: boolean) => void; setDropIdx: (v: number | null) => void;
  onUpdate: (v: SkillGroup) => void;
}) {
  const controls = useDragControls();
  return (
    <Reorder.Item
      value={g}
      dragControls={controls}
      dragListener={false}
      layout
      whileDrag={{ scale: 1.01, zIndex: 50 }}
      onPointerEnter={() => dragging && setDropIdx(i)}
      className="relative"
      style={{ listStyle: "none" }}
    >
      <DropLine show={dragging && dropIdx === i} />
      <div className="p-4 rounded-xl bg-white/2 border border-white/6 space-y-3">
        <div className="flex items-center gap-3">
          <span
            onPointerDown={(e) => { e.stopPropagation(); setDragging(true); controls.start(e); }}
            className="text-slate-600 text-base select-none cursor-grab active:cursor-grabbing touch-none"
          >⠿</span>
          <div className="grid grid-cols-2 gap-3 flex-1">
            <Field label="Category name" value={g.category} onChange={(v) => onUpdate({ ...g, category: v })} />
            <Field label="Icon" value={g.icon} onChange={(v) => onUpdate({ ...g, icon: v })} mono />
          </div>
        </div>
        <TagList label="Skills" items={g.skills} onChange={(v) => onUpdate({ ...g, skills: v })} />
      </div>
    </Reorder.Item>
  );
}

function SkillsEditor({ data, onChange }: { data: Content["skills"]; onChange: (v: Content["skills"]) => void }) {
  const [dragging, setDragging] = useState(false);
  const [dropIdx, setDropIdx] = useState<number | null>(null);

  useEffect(() => {
    const reset = () => { setDragging(false); setDropIdx(null); };
    window.addEventListener("pointerup", reset);
    return () => window.removeEventListener("pointerup", reset);
  }, []);

  return (
    <Reorder.Group axis="y" values={data.groups} onReorder={(next) => onChange({ ...data, groups: next })} style={{ listStyle: "none", padding: 0 }} className="space-y-3">
      {data.groups.map((g, i) => (
        <SkillGroupItem
          key={g.category}
          g={g} i={i}
          dragging={dragging} dropIdx={dropIdx}
          setDragging={setDragging} setDropIdx={setDropIdx}
          onUpdate={(v) => { const next = [...data.groups]; next[i] = v; onChange({ ...data, groups: next }); }}
        />
      ))}
    </Reorder.Group>
  );
}

function ContactEditor({ data, onChange }: { data: Content["contact"]; onChange: (v: Content["contact"]) => void }) {
  return (
    <div className="space-y-4">
      <Field label="Headline" value={data.headline} onChange={(v) => onChange({ ...data, headline: v })} />
      <Field label="Subtext" value={data.subtext} onChange={(v) => onChange({ ...data, subtext: v })} multiline />
    </div>
  );
}

// ─── Main Editor ─────────────────────────────────────────────────────────────

export default function AdminEditor({ initialContent }: { initialContent: Content }) {
  const [content, setContent] = useState<Content>(initialContent);
  const [activeSection, setActiveSection] = useState<Section>("Hero");
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  const save = () => {
    startTransition(async () => {
      await updateContent(content);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-8 py-10">
      <div className="flex flex-wrap gap-2 mb-8">
        {SECTIONS.map((s) => (
          <button key={s} onClick={() => setActiveSection(s)}
            className={`px-4 py-2 rounded-lg text-sm font-mono transition-all duration-200 ${activeSection === s
              ? "bg-emerald-500/15 border border-emerald-500/40 text-emerald-400"
              : "border border-white/8 text-slate-500 hover:text-slate-300 hover:border-white/15"}`}
          >{s}</button>
        ))}
      </div>

      <div className="bg-white/2 border border-white/8 rounded-2xl p-6 mb-6">
        <h2 className="text-white font-semibold mb-6">{activeSection}</h2>
        {activeSection === "Hero" && <HeroEditor data={content.hero} onChange={(v) => setContent({ ...content, hero: v })} />}
        {activeSection === "About" && (
          <AboutEditor
            data={content.about} onChange={(v) => setContent({ ...content, about: v })}
            coursework={content.skills.coursework}
            onCourseworkChange={(v) => setContent({ ...content, skills: { ...content.skills, coursework: v } })}
          />
        )}
        {activeSection === "Experience" && <ExperienceEditor data={content.experience} onChange={(v) => setContent({ ...content, experience: v })} />}
        {activeSection === "Projects" && <ProjectsEditor data={content.projects} onChange={(v) => setContent({ ...content, projects: v })} />}
        {activeSection === "Skills" && <SkillsEditor data={content.skills} onChange={(v) => setContent({ ...content, skills: v })} />}
        {activeSection === "Contact" && <ContactEditor data={content.contact} onChange={(v) => setContent({ ...content, contact: v })} />}
      </div>

      <div className="flex items-center justify-end gap-4">
        {saved && (
          <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
            <Check size={12} /> Saved to content.json
          </span>
        )}
        <button onClick={save} disabled={isPending}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm transition-all duration-200 disabled:opacity-60 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]"
        >
          {isPending ? <Loader size={14} className="animate-spin" /> : <Save size={14} />}
          {isPending ? "Saving…" : "Save changes"}
        </button>
      </div>
    </div>
  );
}
