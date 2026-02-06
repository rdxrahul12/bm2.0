import { motion } from "framer-motion";
import { Plus, X } from "lucide-react";
import { Category } from "@/types/bookmark";
import { useState } from "react";

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (id: string | null) => void;
  onAddCategory: () => void;
  onDeleteCategory: (id: string) => void;
  onDropUrl?: (url: string, categoryId: string) => void;
}

import { ConfirmationModal } from "./ConfirmationModal";

export function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
  onAddCategory,
  onDeleteCategory,
  onDropUrl,
}: CategoryFilterProps) {
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const handleDragOver = (e: React.DragEvent, categoryId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    setDragOverId(categoryId);
  };

  const handleDragLeave = () => {
    setDragOverId(null);
  };

  const handleDrop = (e: React.DragEvent, categoryId: string) => {
    e.preventDefault();
    setDragOverId(null);

    // Try to get URL from various data types
    const url = e.dataTransfer.getData("text/uri-list")
      || e.dataTransfer.getData("text/plain")
      || e.dataTransfer.getData("text");

    if (url && onDropUrl && url.startsWith("http")) {
      onDropUrl(url.trim(), categoryId);
    }
  };

  const confirmDelete = (category: Category) => {
    setCategoryToDelete(category);
    setDeleteModalOpen(true);
  };

  const handleDelete = () => {
    if (categoryToDelete) {
      onDeleteCategory(categoryToDelete.id);
    }
    setDeleteModalOpen(false);
    setCategoryToDelete(null);
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        {/* All button */}
        <motion.button
          onClick={() => onSelectCategory(null)}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${selectedCategory === null
            ? "bg-primary text-primary-foreground glow-primary"
            : "bg-card neu-raised-sm text-foreground"
            }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          All
        </motion.button>

        {/* Category pills */}
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            className="relative group"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
              delay: index * 0.03,
            }}
          >
            <motion.button
              onClick={() => onSelectCategory(category.id)}
              onDragOver={(e) => handleDragOver(e, category.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, category.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-all ${dragOverId === category.id
                ? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2 scale-110"
                : selectedCategory === category.id
                  ? "bg-primary text-primary-foreground glow-primary"
                  : "bg-card neu-raised-sm text-foreground"
                }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <span>{category.name}</span>
            </motion.button>

            {/* Delete button - appears on hover */}
            {!["social", "work", "entertainment", "news", "shopping", "other"].includes(category.id) && (
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  confirmDelete(category);
                }}
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="h-3 w-3" />
              </motion.button>
            )}
          </motion.div>
        ))}

        {/* Add category button */}
        <motion.button
          onClick={onAddCategory}
          className="h-9 w-9 rounded-xl bg-card neu-raised-sm flex items-center justify-center text-primary"
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
          <Plus className="h-5 w-5" />
        </motion.button>
      </div>

      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Category?"
        description={`Are you sure you want to delete "${categoryToDelete?.name}"? All bookmarks in this category will also be permanently deleted.`}
        confirmText="Delete Category"
      />
    </>
  );
}
