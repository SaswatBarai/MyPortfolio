"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { gsap } from "gsap";

const Preloader = () => {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const tl = gsap.timeline();

    // Simulate loading progress
    tl.to(
      { value: 0 },
      {
        value: 100,
        duration: 2,
        ease: "power2.out",
        onUpdate: function () {
          setProgress(Math.round(this.targets()[0].value));
        },
        onComplete: () => {
          setTimeout(() => setIsLoading(false), 500);
        },
      }
    );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background"
        >
          <div className="flex flex-col items-center space-y-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center"
            >
              <h1 className="text-2xl font-bold mb-2">Saswat</h1>
              <p className="text-muted-foreground">Bringing Ideas to Life ✨</p>
            </motion.div>

            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 300 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="w-72"
            >
              <Progress value={progress} className="h-2" />
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1 }}
              className="text-sm text-muted-foreground"
            >
              {progress}%
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;