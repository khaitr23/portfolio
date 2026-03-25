"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface Highlight {
  word: string;
  className: string;
}

interface Props {
  text: string;
  className?: string;
  speed?: number;
  delay?: number;
  as?: "h1" | "h2" | "h3";
  /** Words to style differently once typing finishes */
  highlights?: Highlight[];
}

/** Render text with highlighted words as styled spans */
function renderWithHighlights(text: string, highlights: Highlight[]) {
  const lines = text.split("\n");
  return lines.map((line, li, allLines) => {
    // Build segments for this line
    let segments: Array<string | React.ReactElement> = [line];
    for (const { word, className } of highlights) {
      segments = segments.flatMap((seg): Array<string | React.ReactElement> => {
        if (typeof seg !== "string") return [seg];
        const parts = seg.split(word);
        return parts.flatMap((part, i): Array<string | React.ReactElement> =>
          i < parts.length - 1
            ? [part, <span key={`${word}-${i}`} className={className}>{word}</span>]
            : [part]
        );
      });
    }
    return (
      <span key={li}>
        {segments}
        {li < allLines.length - 1 && <br />}
      </span>
    );
  });
}

export default function TypewriterHeading({
  text,
  className = "",
  speed = 38,
  delay = 120,
  as: Tag = "h2",
  highlights = [],
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, { once: true, margin: "-20px" });
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!inView || started) return;
    const t = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(t);
  }, [inView, started, delay]);

  useEffect(() => {
    if (!started || done) return;
    if (count >= text.length) { setDone(true); return; }
    const t = setTimeout(() => setCount((c) => c + 1), speed);
    return () => clearTimeout(t);
  }, [started, count, text.length, speed, done]);

  const displayed = text.slice(0, count);

  return (
    // @ts-expect-error polymorphic ref
    <Tag ref={ref} className={className}>
      {done && highlights.length > 0
        ? renderWithHighlights(text, highlights)
        : displayed.split("\n").map((line, i, arr) => (
            <span key={i}>
              {line}
              {i < arr.length - 1 && <br />}
            </span>
          ))}
      {inView && !done && (
        <span
          className="inline-block w-[2px] h-[0.9em] bg-emerald-400 ml-[2px] align-middle"
          style={{ animation: "blink 0.7s step-end infinite" }}
        />
      )}
    </Tag>
  );
}
