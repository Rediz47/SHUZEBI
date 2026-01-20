import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const Preloader: React.FC = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const duration = 2000; // 2 seconds total
    const interval = 30;
    const steps = duration / interval;
    const increment = 100 / steps;

    const timer = setInterval(() => {
      setCount((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          return 100;
        }
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ y: 0 }}
      exit={{
        y: '-100%',
        transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
      }}
      className="fixed inset-0 z-[9999] bg-black text-white flex flex-col items-center justify-center font-['Space_Grotesk']"
    >
      <div className="overflow-hidden">
        <motion.h1
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          transition={{ duration: 0.8, ease: "circOut", delay: 0.2 }}
          className="text-6xl md:text-9xl font-bold tracking-tighter"
        >
          SHUZEBI
        </motion.h1>
      </div>

      <div className="mt-6 w-64 flex flex-col gap-2">
        <div className="flex justify-between text-xs font-mono uppercase text-gray-400">
          <span>Loading Experience</span>
          <span>{Math.round(count)}%</span>
        </div>
        <div className="h-[2px] w-full bg-white/10 overflow-hidden">
          <motion.div
            className="h-full bg-white"
            style={{ width: `${count}%` }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default Preloader;