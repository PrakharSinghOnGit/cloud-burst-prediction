"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Cloud } from "lucide-react";

export function BgToggle() {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("bgAnimation") : null;
    if (stored !== null) setEnabled(stored === "on");
    const onStorage = (e: StorageEvent) => {
      if (e.key === "bgAnimation" && e.newValue) setEnabled(e.newValue === "on");
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const toggle = () => {
    const next = !enabled;
    setEnabled(next);
    localStorage.setItem("bgAnimation", next ? "on" : "off");
  };

  return (
    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="relative">
      <Button variant="outline" onClick={toggle} className="relative overflow-hidden text-xs pr-10">
        <span className="relative z-10">Background: {enabled ? "On" : "Off"}</span>

        <AnimatePresence>
          {enabled && (
            <motion.span
              key="rain"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="pointer-events-none absolute inset-0"
            >
              {/* drifting mini-cloud */}
              <motion.span
                className="absolute right-2 top-1/2 -translate-y-1/2"
                initial={{ x: 8, opacity: 0.8 }}
                animate={{ x: [8, 0, 8] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <Cloud className="h-4 w-4 opacity-80" />
              </motion.span>
              {/* tiny rain streaks */}
              {Array.from({ length: 6 }).map((_, i) => (
                <motion.span
                  key={i}
                  className="absolute right-2 h-3 w-0.5 bg-gradient-to-b from-transparent to-blue-400/60"
                  style={{ top: `${30 + i * 8}%` }}
                  initial={{ y: -8, opacity: 0 }}
                  animate={{ y: 10, opacity: [0, 1, 0] }}
                  transition={{ duration: 0.9 + i * 0.1, repeat: Infinity, ease: "linear", delay: i * 0.05 }}
                />
              ))}
            </motion.span>
          )}
        </AnimatePresence>
      </Button>
    </motion.div>
  );
}


