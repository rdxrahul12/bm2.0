import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

interface ActionBarProps {
  onAddBookmark: () => void;
}

export function ActionBar({ onAddBookmark }: ActionBarProps) {
  return (
    <div className="flex items-center gap-3">
      {/* Add Bookmark button - Primary action with pulse */}
      <motion.button
        onClick={onAddBookmark}
        className="h-10 px-5 rounded-xl bg-primary text-primary-foreground flex items-center gap-2 text-sm font-medium animate-pulse-glow"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <motion.div
          whileHover={{ rotate: 90 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
          <Plus className="h-4 w-4" />
        </motion.div>
        <span>Add Bookmark</span>
      </motion.button>
    </div>
  );
}
