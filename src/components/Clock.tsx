import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  let rawHours = time.getHours();
  const ampm = rawHours >= 12 ? "PM" : "AM";
  rawHours = rawHours % 12;
  rawHours = rawHours ? rawHours : 12; // 0 becomes 12

  const hours = rawHours.toString().padStart(2, "0");
  const minutes = time.getMinutes().toString().padStart(2, "0");
  const seconds = time.getSeconds().toString().padStart(2, "0");

  const dayName = time.toLocaleDateString("en-US", { weekday: "long" });
  const dateStr = time.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-1 font-mono text-lg font-semibold text-foreground/80">
        <motion.span
          key={hours}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {hours}
        </motion.span>
        <span className="animate-pulse">:</span>
        <motion.span
          key={minutes}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {minutes}
        </motion.span>
        <span className="animate-pulse text-xs opacity-50">:</span>
        <motion.span
          key={seconds}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="text-primary"
        >
          {seconds}
        </motion.span>
        <span className="text-xs ml-1 font-sans text-muted-foreground">{ampm}</span>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-[10px] uppercase tracking-wider text-muted-foreground/60 font-medium"
      >
        {dayName}, {dateStr}
      </motion.div>
    </div>
  );
}
