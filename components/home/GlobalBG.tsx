"use client";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";

export const GlobalBG = () => {
  const [raindrops, setRaindrops] = useState<
    Array<{
      id: number;
      left: string;
      height: string;
      duration: number;
      delay: number;
      x: number;
    }>
  >([]);
  const [clouds, setClouds] = useState<
    Array<{
      id: number;
      top: string;
      scale: number;
      duration: number;
      delay: number;
      opacity: number;
    }>
  >([]);
  const { theme } = useTheme();
  const [heavyDrops, setHeavyDrops] = useState<
    Array<{
      id: number;
      left: string;
      height: string;
      duration: number;
      delay: number;
      x: number;
    }>
  >([]);

  useEffect(() => {
    // Generate raindrops only on client side to avoid hydration mismatch
    const isLight = theme === "light";
    const dropCount = isLight ? 200 : 140;
    const drops = Array.from({ length: dropCount }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      height: `${Math.random() * (isLight ? 28 : 22) + (isLight ? 14 : 10)}px`,
      duration: Math.random() * (isLight ? 1.0 : 1.3) + (isLight ? 1.4 : 1.8),
      delay: Math.random() * 2,
      x: Math.random() * 20 - 10,
    }));
    setRaindrops(drops);
    const heavyCount = isLight ? 80 : 50;
    const heavy = Array.from({ length: heavyCount }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      height: `${Math.random() * (isLight ? 40 : 32) + (isLight ? 18 : 14)}px`,
      duration: Math.random() * (isLight ? 0.9 : 1.1) + (isLight ? 1.0 : 1.3),
      delay: Math.random() * 1.5,
      x: Math.random() * 24 - 12,
    }));
    setHeavyDrops(heavy);
    const cloudLayer = Array.from({ length: isLight ? 14 : 10 }, (_, i) => ({
      id: i,
      top: `${10 + Math.random() * 60}%`,
      scale: 0.9 + Math.random() * (isLight ? 1.3 : 1.2),
      duration: (isLight ? 30 : 35) + Math.random() * (isLight ? 40 : 35),
      delay: Math.random() * 10,
      opacity:
        (isLight ? 0.45 : 0.25) + Math.random() * (isLight ? 0.45 : 0.35),
    }));
    setClouds(cloudLayer);
  }, [theme]);

  if (raindrops.length === 0) {
    return null; // Don't render anything on server side
  }

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* subtle background tint for better contrast in light mode */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_60%_at_50%_-10%,rgba(120,140,160,0.15),transparent)]" />
      <div className="absolute inset-0 opacity-40 lg:opacity-50">
        {clouds.map((c) => (
          <motion.div
            key={`cloud-${c.id}`}
            className="absolute -left-1/3 w-1/2 h-24 rounded-full"
            style={{
              top: c.top,
              scale: c.scale,
              background:
                "radial-gradient(60% 60% at 50% 50%, rgba(190,198,206,0.8), rgba(150,160,170,0.25))",
              filter: "blur(8px)",
              opacity: c.opacity,
            }}
            animate={{ x: ["0%", "200%"] }}
            transition={{
              duration: c.duration,
              repeat: Infinity,
              ease: "linear",
              delay: c.delay,
            }}
          />
        ))}
      </div>
      <div className="absolute inset-0 opacity-70">
        {raindrops.map((drop) => (
          <motion.div
            key={drop.id}
            className="absolute w-px bg-gradient-to-b from-transparent to-blue-400/60"
            style={{
              left: drop.left,
              top: `-10%`,
              height: drop.height,
            }}
            animate={{
              y: ["0vh", "110vh"],
              x: [0, drop.x],
            }}
            transition={{
              duration: drop.duration,
              repeat: Infinity,
              ease: "linear",
              delay: drop.delay,
            }}
          />
        ))}
        {heavyDrops.map((drop) => (
          <motion.div
            key={`h-${drop.id}`}
            className="absolute w-0.5 bg-gradient-to-b from-transparent to-blue-500/70"
            style={{
              left: drop.left,
              top: `-12%`,
              height: drop.height,
            }}
            animate={{
              y: ["0vh", "115vh"],
              x: [0, drop.x],
            }}
            transition={{
              duration: drop.duration,
              repeat: Infinity,
              ease: "linear",
              delay: drop.delay,
            }}
          />
        ))}
      </div>
    </div>
  );
};
