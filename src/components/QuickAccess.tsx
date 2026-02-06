import { motion } from "framer-motion";
import { Bookmark } from "@/types/bookmark";
import { Favicon } from "./Favicon";

interface QuickAccessProps {
  bookmarks: Bookmark[];
}

export function QuickAccess({ bookmarks }: QuickAccessProps) {
  if (bookmarks.length === 0) return null;

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-muted-foreground mr-2">Quick:</span>
      <div className="flex items-center gap-2">
        {bookmarks.slice(0, 6).map((bookmark, index) => (
          <motion.a
            key={bookmark.id}
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-[10px]"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
              delay: index * 0.05,
            }}
            whileHover={{
              scale: 1.15,
              y: -4,
              transition: { type: "spring", stiffness: 400, damping: 10 },
            }}
            whileTap={{ scale: 0.9 }}
            title={bookmark.title}
          >
            <Favicon url={bookmark.url} title={bookmark.title} size={40} className="rounded-[10px]" />
          </motion.a>
        ))}
      </div>
    </div>
  );
}
