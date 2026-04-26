"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const CODE_LINES = [
  { text: `import { Developer } from "saswat-barai";`,          color: "text-yellow-400" },
  { text: `import { Backend, React, Node } from "skills";`,     color: "text-muted-foreground" },
  { text: ``,                                                    color: "" },
  { text: `const portfolio = new Developer({`,                   color: "text-foreground" },
  { text: `  name:     "Saswat Barai",`,                        color: "text-green-400" },
  { text: `  role:     "Backend Engineer",`,                     color: "text-green-400" },
  { text: `  college:  "SOA University (ITER)",`,               color: "text-green-400" },
  { text: `  stack:    ["Node.js", "React", "TypeScript"],`,    color: "text-green-400" },
  { text: `  open_to:  "freelance & collab",`,                  color: "text-green-400" },
  { text: `});`,                                                  color: "text-foreground" },
  { text: ``,                                                    color: "" },
  { text: `portfolio.build();`,                                  color: "text-yellow-400" },
  { text: `// launching...  ✓`,                                  color: "text-muted-foreground" },
];

const TOTAL_DURATION = 5000;

export default function Preloader() {
  const [visibleLines, setVisibleLines] = useState(0);
  const [charCount, setCharCount]       = useState(0);
  const [progress, setProgress]         = useState(0);
  const [done, setDone]                 = useState(false);

  useEffect(() => {
    const perLine = TOTAL_DURATION / CODE_LINES.length;

    const lineTimers = CODE_LINES.map((_, i) =>
      setTimeout(() => setVisibleLines(i + 1), i * perLine)
    );

    // Char counter for current line
    let charTimer: ReturnType<typeof setInterval>;
    let currentLine = 0;
    const advanceLine = () => {
      currentLine++;
      setCharCount(0);
      if (currentLine < CODE_LINES.length) {
        charTimer = setInterval(() => {
          setCharCount((c) => {
            const max = CODE_LINES[currentLine]?.text.length ?? 0;
            if (c >= max) { clearInterval(charTimer); return max; }
            return c + 1;
          });
        }, perLine / Math.max(CODE_LINES[currentLine]?.text.length ?? 1, 1));
      }
    };
    const lineAdvanceTimers = CODE_LINES.map((_, i) =>
      setTimeout(advanceLine, i * perLine)
    );

    // Progress bar
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const p = Math.min(100, ((now - start) / TOTAL_DURATION) * 100);
      setProgress(Math.round(p));
      if (p < 100) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const doneTimer = setTimeout(() => setDone(true), TOTAL_DURATION + 600);

    return () => {
      lineTimers.forEach(clearTimeout);
      lineAdvanceTimers.forEach(clearTimeout);
      clearInterval(charTimer);
      cancelAnimationFrame(raf);
      clearTimeout(doneTimer);
    };
  }, []);

  const currentLineText = CODE_LINES[visibleLines - 1]?.text ?? "";
  const isTypingLast = visibleLines > 0 && visibleLines <= CODE_LINES.length;

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[999] bg-[#0d0d0d] flex flex-col items-center justify-center px-2 sm:px-4"
        >
          {/* Scanlines */}
          <div
            className="pointer-events-none absolute inset-0 z-10"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(255,229,0,0.018) 3px,rgba(255,229,0,0.018) 4px)",
            }}
          />

          <div className="relative z-20 w-full max-w-2xl">

            {/* Editor chrome */}
            <div className="border-2 border-border shadow-[0_0_40px_rgba(255,229,0,0.06)]">

              {/* Title bar */}
              <div className="flex items-center gap-2 px-2.5 sm:px-4 py-2 bg-card border-b-2 border-border">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                </div>
                <span className="flex-1 text-center font-mono text-[9px] sm:text-[10px] text-muted-foreground tracking-widest uppercase truncate">
                  portfolio.ts — saswat_barai
                </span>
                <span className="hidden sm:inline font-mono text-[10px] text-accent animate-pulse">● compiling</span>
              </div>

              {/* Line numbers + code */}
              <div className="bg-background p-0 overflow-hidden">
                <div className="flex">
                  {/* Line numbers gutter */}
                  <div className="select-none border-r border-border bg-card px-2 sm:px-3 py-3 sm:py-4 flex flex-col gap-0.5 min-w-[32px] sm:min-w-[40px] items-end">
                    {CODE_LINES.map((_, i) => (
                      <span
                        key={i}
                        className={`font-mono text-[11px] leading-5 transition-colors ${
                          i < visibleLines ? "text-muted-foreground/60" : "text-transparent"
                        } ${i === visibleLines - 1 ? "text-accent" : ""}`}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    ))}
                  </div>

                  {/* Code area */}
                  <div className="flex-1 px-2.5 sm:px-4 py-3 sm:py-4 flex flex-col gap-0.5 overflow-x-auto">
                    {CODE_LINES.map((line, i) => {
                      const isActive = i === visibleLines - 1;
                      const isVisible = i < visibleLines - 1;

                      return (
                        <div
                          key={i}
                          className={`font-mono text-[10px] sm:text-xs leading-5 whitespace-pre ${line.color} ${
                            !isVisible && !isActive ? "opacity-0" : ""
                          }`}
                        >
                          {isActive ? (
                            <>
                              {currentLineText.slice(0, charCount)}
                              <motion.span
                                animate={{ opacity: [1, 0, 1] }}
                                transition={{ duration: 0.5, repeat: Infinity }}
                                className="inline-block w-[7px] h-[13px] bg-accent align-middle ml-px"
                              />
                            </>
                          ) : isVisible ? (
                            line.text || "\u00A0"
                          ) : (
                            "\u00A0"
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Status bar */}
                <div className="border-t border-border bg-card px-2.5 sm:px-4 py-1.5 flex items-center justify-between gap-2">
                  <div className="hidden sm:flex items-center gap-4 font-mono text-[10px] text-muted-foreground">
                    <span>TypeScript</span>
                    <span>UTF-8</span>
                    <span>Ln {visibleLines}, Col {isTypingLast ? charCount : 0}</span>
                  </div>
                  <div className="flex items-center gap-2 sm:ml-auto">
                    <div className="w-20 sm:w-24 h-1 bg-muted border border-border">
                      <div
                        className="h-full bg-accent transition-all duration-75"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="font-mono text-[10px] text-accent">{progress}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Below editor */}
            <div className="mt-3 hidden sm:flex items-center justify-between font-mono text-[10px] text-muted-foreground px-1">
              <span>// saswat barai · portfolio v3</span>
              <motion.span
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.4, repeat: Infinity }}
                className="text-accent"
              >
                building...
              </motion.span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
