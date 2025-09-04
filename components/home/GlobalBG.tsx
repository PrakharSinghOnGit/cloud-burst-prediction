"use client";
import { motion } from "framer-motion";
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

  useEffect(() => {
    // Generate raindrops only on client side to avoid hydration mismatch
    const drops = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      height: `${Math.random() * 20 + 10}px`,
      duration: Math.random() * 1.5 + 2,
      delay: Math.random() * 2,
      x: Math.random() * 20 - 10,
    }));
    setRaindrops(drops);
  }, []);

  if (raindrops.length === 0) {
    return null; // Don't render anything on server side
  }

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <div className="absolute inset-0 opacity-60">
        {raindrops.map((drop) => (
          <motion.div
            key={drop.id}
            className="absolute w-0.5 bg-gradient-to-b from-transparent to-blue-300/50"
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
      </div>
    </div>
  );
};
