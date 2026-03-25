"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Mail, ArrowUpRight } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./icons";
import type { Content } from "@/lib/content";
import TypewriterHeading from "./TypewriterHeading";
import { showToast } from "@/lib/toast";

type Props = {
  data: Content["contact"];
  email: string;
  github: string;
  linkedin: string;
};

function useEmailClick(email: string) {
  const handleClick = () => {
    window.location.href = `mailto:${email}`;
    navigator.clipboard?.writeText(email).then(() => showToast("Email copied to clipboard"));
  };
  return { handleClick };
}

export default function Contact({ data, email, github, linkedin }: Props) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const { handleClick } = useEmailClick(email);

  const socials = [
    { icon: GithubIcon, label: "GitHub", handle: `@${github.split("/").pop()}`, href: github, desc: "Open source & projects", isEmail: false },
    { icon: LinkedinIcon, label: "LinkedIn", handle: linkedin.split("/").pop() ?? "khaitr", href: linkedin, desc: "Professional network", isEmail: false },
    { icon: Mail, label: "Email", handle: email, href: `mailto:${email}`, desc: "Best for opportunities", isEmail: true },
  ];

  return (
    <section id="contact" ref={ref} className="py-20 w-full">
      <div className="max-w-2xl mx-auto px-8 md:px-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-emerald-500 text-xs font-mono tracking-widest uppercase mb-4">Contact</p>
          <TypewriterHeading text={data.headline} className="text-4xl md:text-5xl font-bold text-white mb-4" />
          <p className="text-slate-400 leading-relaxed mb-12">{data.subtext}</p>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          onClick={handleClick}
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm transition-all duration-200 hover:shadow-[0_0_32px_rgba(16,185,129,0.5)] mb-16 cursor-pointer"
        >
          <Mail size={16} /> Say hello <ArrowUpRight size={14} />
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid sm:grid-cols-3 gap-4"
        >
          {socials.map(({ icon: Icon, label, handle, href, desc, isEmail }) =>
            isEmail ? (
              <button
                key={label}
                onClick={handleClick}
                className="card-glass rounded-xl p-5 card-hover transition-all duration-300 group text-left cursor-pointer w-full"
              >
                <div className="flex items-center justify-between mb-3">
                  <Icon size={18} className="text-emerald-400" />
                  <ArrowUpRight size={14} className="text-slate-600 group-hover:text-emerald-400 transition-colors duration-200" />
                </div>
                <p className="text-white text-sm font-medium mb-0.5">{label}</p>
                <p className="text-emerald-400/70 text-xs font-mono mb-1">{handle}</p>
                <p className="text-slate-500 text-xs">{desc}</p>
              </button>
            ) : (
              <a key={label} href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="card-glass rounded-xl p-5 card-hover transition-all duration-300 group text-left"
              >
                <div className="flex items-center justify-between mb-3">
                  <Icon size={18} className="text-emerald-400" />
                  <ArrowUpRight size={14} className="text-slate-600 group-hover:text-emerald-400 transition-colors duration-200" />
                </div>
                <p className="text-white text-sm font-medium mb-0.5">{label}</p>
                <p className="text-emerald-400/70 text-xs font-mono mb-1">{handle}</p>
                <p className="text-slate-500 text-xs">{desc}</p>
              </a>
            )
          )}
        </motion.div>
      </div>
    </section>
  );
}
