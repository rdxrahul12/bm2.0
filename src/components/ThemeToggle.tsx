import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  theme: "light" | "dark";
  onToggle: () => void;
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  return (
    <motion.button
      onClick={onToggle}
      className="relative h-14 w-14 rounded-xl bg-background neu-raised flex items-center justify-center overflow-hidden"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <motion.div
        initial={false}
        animate={{
          rotate: theme === "dark" ? 180 : 0,
          scale: 1,
        }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        {theme === "dark" ? (
          <Moon className="h-7 w-7 text-primary" />
        ) : (
          <Sun className="h-7 w-7 text-primary" />
        )}
      </motion.div>
    </motion.button>
  );
}
