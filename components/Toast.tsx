"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";

export default function Toast() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const handler = (e: Event) => {
      const { message } = (e as CustomEvent<{ message: string }>).detail;
      setMessage(message);
      clearTimeout(timer);
      timer = setTimeout(() => setMessage(null), 2500);
    };

    window.addEventListener("app:toast", handler);
    return () => {
      window.removeEventListener("app:toast", handler);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] pointer-events-none">
      <AnimatePresence>
        {message && (
          <motion.div
            key={message + Date.now()}
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#0d1117] border border-emerald-500/30 text-emerald-400 text-xs font-mono shadow-xl"
          >
            <Check size={12} />
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
