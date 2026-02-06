import { useState, useEffect, useCallback } from "react";
import { Bookmark, Category, DEFAULT_CATEGORIES, SAMPLE_BOOKMARKS } from "@/types/bookmark";
import { uploadFaviconToCloudinary } from "@/utils/cloudinaryService";
import { getDomain } from "@/utils/faviconUtils";

const BOOKMARKS_KEY = "bookmark-manager-bookmarks";
const CATEGORIES_KEY = "bookmark-manager-categories";

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const storedBookmarks = localStorage.getItem(BOOKMARKS_KEY);
    const storedCategories = localStorage.getItem(CATEGORIES_KEY);

    if (storedBookmarks) {
      setBookmarks(JSON.parse(storedBookmarks));
    } else {
      setBookmarks(SAMPLE_BOOKMARKS);
    }

    if (storedCategories) {
      setCategories(JSON.parse(storedCategories));
    } else {
      setCategories(DEFAULT_CATEGORIES);
    }

    setIsLoaded(true);
  }, []);

  // Sync bookmarks to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
    }
  }, [bookmarks, isLoaded]);

  // Sync categories to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
    }
  }, [categories, isLoaded]);

  const addBookmark = useCallback((bookmark: Omit<Bookmark, "id" | "createdAt">) => {
    const newBookmark: Bookmark = {
      ...bookmark,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    setBookmarks((prev) => [...prev, newBookmark]);

    // Trigger background upload to Cloudinary
    const domain = getDomain(newBookmark.url);
    if (domain) {
      // Source: Google Favicon API (High Res)
      const sourceUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
      uploadFaviconToCloudinary(domain, sourceUrl).catch(err =>
        console.error("Background icon upload failed:", err)
      );
    }

    return newBookmark;
  }, []);

  const updateBookmark = useCallback((id: string, updates: Partial<Bookmark>) => {
    setBookmarks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updates } : b))
    );
  }, []);

  const deleteBookmark = useCallback((id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const restoreBookmark = useCallback((bookmark: Bookmark) => {
    setBookmarks((prev) => {
      // Prevent duplicates if restore is called multiple times or race conditions
      if (prev.some((b) => b.id === bookmark.id)) {
        return prev;
      }
      return [...prev, bookmark];
    });
  }, []);

  const togglePin = useCallback((id: string) => {
    setBookmarks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isPinned: !b.isPinned } : b))
    );
  }, []);

  const addCategory = useCallback((category: Omit<Category, "id">) => {
    const newCategory: Category = {
      ...category,
      id: crypto.randomUUID(),
    };
    setCategories((prev) => [...prev, newCategory]);
    return newCategory;
  }, []);

  const updateCategory = useCallback((id: string, updates: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  }, []);

  const deleteCategory = useCallback((id: string) => {
    // Delete all bookmarks in this category
    setBookmarks((prev) => prev.filter((b) => b.category !== id));
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const exportData = useCallback(() => {
    // Map internal state back to external format
    const externalBookmarks = bookmarks.map(b => ({
      id: b.id,
      name: b.title, // Map 'title' -> 'name'
      url: b.url,
      categoryId: b.category, // Map 'category' -> 'categoryId'
      usageCount: 0, // Default or track if possible
      lastUsed: b.createdAt // Map 'createdAt' -> 'lastUsed'
    }));

    const externalCategories = categories.map(c => ({
      id: c.id,
      name: c.name,
      emoji: c.emoji,
      color: c.color
    }));

    const data = {
      version: "1.0",
      exportedAt: new Date().toISOString(),
      categories: externalCategories,
      bookmarks: externalBookmarks,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bookmarks-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [bookmarks, categories]);

  const importData = useCallback((file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const rawData = JSON.parse(e.target?.result as string);

          let importedBookmarks: any[] = [];
          let importedCategories: any[] = [];

          // Determine structure
          if (Array.isArray(rawData)) {
            // Legacy array format of just bookmarks
            importedBookmarks = rawData;
          } else {
            // Object format (legacy or new versioned)
            importedBookmarks = Array.isArray(rawData.bookmarks) ? rawData.bookmarks : [];
            importedCategories = Array.isArray(rawData.categories) ? rawData.categories : [];
          }

          // Map and validate Categories
          const validCategories: Category[] = importedCategories.map((c: any) => ({
            id: c.id || crypto.randomUUID(),
            name: c.name || "Untitled Category",
            emoji: c.emoji || "📁",
            color: c.color
          }));

          // Map and validate Bookmarks
          const validBookmarks: Bookmark[] = importedBookmarks.map((b: any) => ({
            id: b.id || crypto.randomUUID(),
            title: b.title || b.name || "Untitled Bookmark",
            url: b.url || "",
            favicon: b.favicon,
            category: b.category || b.categoryId || "other",
            isPinned: b.isPinned || false,
            createdAt: b.createdAt || b.lastUsed || Date.now(),
          }));

          if (validBookmarks.length > 0) setBookmarks(validBookmarks);
          if (validCategories.length > 0) setCategories(validCategories);

          resolve();
        } catch (error) {
          console.error("Import failed:", error);
          reject(new Error("Invalid file format"));
        }
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsText(file);
    });
  }, []);

  const getPinnedBookmarks = useCallback(() => {
    return bookmarks.filter((b) => b.isPinned);
  }, [bookmarks]);

  const getBookmarksByCategory = useCallback((categoryId: string | null) => {
    if (!categoryId) return bookmarks;
    return bookmarks.filter((b) => b.category === categoryId);
  }, [bookmarks]);

  return {
    bookmarks,
    categories,
    isLoaded,
    addBookmark,
    updateBookmark,
    deleteBookmark,
    restoreBookmark,
    togglePin,
    addCategory,
    updateCategory,
    deleteCategory,
    exportData,
    importData,
    getPinnedBookmarks,
    getBookmarksByCategory,
  };
}
