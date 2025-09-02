"use client";

import React from "react";
import { motion } from "framer-motion";
import { Cloud } from "lucide-react";

export function GlobalBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Base gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-indigo-50/60 to-slate-50/90 dark:from-slate-900/95 dark:via-blue-950/90 dark:to-indigo-950/95" />

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-3 dark:opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25px 25px, rgba(59, 130, 246, 0.4) 2px, transparent 0), radial-gradient(circle at 75px 75px, rgba(99, 102, 241, 0.4) 2px, transparent 0)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Floating Cloud Elements */}
      <motion.div
        className="absolute top-10 left-10 opacity-15 dark:opacity-10"
        animate={{
          y: [0, -20, 0],
          x: [0, 10, 0],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Cloud className="h-16 w-16 text-blue-400 dark:text-blue-300" />
      </motion.div>

      <motion.div
        className="absolute top-32 right-20 opacity-10 dark:opacity-8"
        animate={{
          y: [0, -15, 0],
          x: [0, -5, 0],
          rotate: [0, -3, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      >
        <Cloud className="h-12 w-12 text-indigo-400 dark:text-indigo-300" />
      </motion.div>

      <motion.div
        className="absolute bottom-20 left-1/4 opacity-8 dark:opacity-6"
        animate={{
          y: [0, -25, 0],
          x: [0, 15, 0],
          rotate: [0, 8, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      >
        <Cloud className="h-20 w-20 text-purple-400 dark:text-purple-300" />
      </motion.div>

      <motion.div
        className="absolute top-1/2 right-10 opacity-12 dark:opacity-8"
        animate={{
          y: [0, -18, 0],
          x: [0, -8, 0],
          rotate: [0, -5, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      >
        <Cloud className="h-14 w-14 text-cyan-400 dark:text-cyan-300" />
      </motion.div>

      <motion.div
        className="absolute bottom-32 right-1/3 opacity-10 dark:opacity-7"
        animate={{
          y: [0, -22, 0],
          x: [0, 12, 0],
          rotate: [0, 6, 0],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3,
        }}
      >
        <Cloud className="h-18 w-18 text-violet-400 dark:text-violet-300" />
      </motion.div>

      <motion.div
        className="absolute top-20 left-1/3 opacity-6 dark:opacity-5"
        animate={{
          y: [0, -12, 0],
          x: [0, -6, 0],
          rotate: [0, -4, 0],
        }}
        transition={{
          duration: 11,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4,
        }}
      >
        <Cloud className="h-10 w-10 text-emerald-400 dark:text-emerald-300" />
      </motion.div>

      <motion.div
        className="absolute bottom-10 right-10 opacity-14 dark:opacity-9"
        animate={{
          y: [0, -16, 0],
          x: [0, 8, 0],
          rotate: [0, 7, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5,
        }}
      >
        <Cloud className="h-8 w-8 text-rose-400 dark:text-rose-300" />
      </motion.div>
    </div>
  );
}
