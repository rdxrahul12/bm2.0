export interface Bookmark {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  category: string;
  isPinned: boolean;
  createdAt: number;
}

export interface Category {
  id: string;
  name: string;
  emoji: string;
  color?: string;
}

export const DEFAULT_CATEGORIES: Category[] = [
  { id: "google", name: "Google🌐", emoji: "" },
  { id: "social", name: "Social💬", emoji: "" },
  { id: "dsa", name: "DSA🧑‍💻", emoji: "" },
  { id: "development", name: "Development👩‍💻", emoji: "" },
  { id: "shopping", name: "Shopping🛍️", emoji: "" },
  { id: "tools", name: "Tools🛠️", emoji: "" },
  { id: "todo", name: "To Do📌", emoji: "" },
];

export const SAMPLE_BOOKMARKS: Bookmark[] = [
  { id: "yt", title: "YouTube", url: "https://www.youtube.com/", category: "google", isPinned: false, createdAt: Date.now() },
  { id: "gmail", title: "Gmail", url: "https://mail.google.com/", category: "google", isPinned: false, createdAt: Date.now() },
  { id: "classroom", title: "Classroom", url: "https://classroom.google.com/", category: "google", isPinned: false, createdAt: Date.now() },
  { id: "keep", title: "Google Keep", url: "https://keep.google.com/", category: "google", isPinned: false, createdAt: Date.now() },
  { id: "calendar", title: "Calendar", url: "https://calendar.google.com/", category: "google", isPinned: false, createdAt: Date.now() },
  { id: "drive", title: "Google Drive", url: "https://drive.google.com/", category: "google", isPinned: false, createdAt: Date.now() },
  { id: "whatsapp", title: "WhatsApp Web", url: "https://web.whatsapp.com/", category: "social", isPinned: false, createdAt: Date.now() },
  { id: "instagram", title: "Instagram", url: "https://www.instagram.com/", category: "social", isPinned: false, createdAt: Date.now() },
  { id: "linkedin", title: "LinkedIn", url: "https://www.linkedin.com/", category: "social", isPinned: false, createdAt: Date.now() },
  { id: "twitter", title: "X (Twitter)", url: "https://x.com/", category: "social", isPinned: false, createdAt: Date.now() },
  { id: "leetcode", title: "LeetCode", url: "https://leetcode.com/", category: "dsa", isPinned: false, createdAt: Date.now() },
  { id: "striver", title: "Striver A2Z", url: "https://takeuforward.org/strivers-a2z-dsa-course/", category: "dsa", isPinned: false, createdAt: Date.now() },
  { id: "codeforces", title: "Codeforces", url: "https://codeforces.com/", category: "dsa", isPinned: false, createdAt: Date.now() },
  { id: "codechef", title: "CodeChef", url: "https://www.codechef.com/", category: "dsa", isPinned: false, createdAt: Date.now() },
  { id: "gfg", title: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/", category: "dsa", isPinned: false, createdAt: Date.now() },
  { id: "loveable", title: "Loveable", url: "https://lovable.dev/", category: "development", isPinned: false, createdAt: Date.now() },
  { id: "github", title: "GitHub", url: "https://github.com/", category: "development", isPinned: false, createdAt: Date.now() },
  { id: "smartprix", title: "Smartprix", url: "https://www.smartprix.com/", category: "shopping", isPinned: false, createdAt: Date.now() },
  { id: "myntra", title: "Myntra", url: "https://www.myntra.com/", category: "shopping", isPinned: false, createdAt: Date.now() },
  { id: "amazon", title: "Amazon", url: "https://www.amazon.in/", category: "shopping", isPinned: false, createdAt: Date.now() },
  { id: "flipkart", title: "Flipkart", url: "https://www.flipkart.com/", category: "shopping", isPinned: false, createdAt: Date.now() },
  { id: "ajio", title: "AJIO", url: "https://www.ajio.com/", category: "shopping", isPinned: false, createdAt: Date.now() },
  { id: "ytlength", title: "YT Playlist Length", url: "https://ytplaylist-len.sharats.dev/", category: "tools", isPinned: false, createdAt: Date.now() },
  { id: "simplenote", title: "SimpleNote", url: "https://app.simplenote.com/", category: "tools", isPinned: false, createdAt: Date.now() },
  { id: "cs50", title: "CS50 Lectures", url: "https://cs50.harvard.edu/", category: "todo", isPinned: false, createdAt: Date.now() },
  { id: "campusx", title: "CampusX ML Playlist", url: "https://www.youtube.com/playlist?list=PLKnIA16_Rmvbr7zKYQuBfsVkjoLcJgxHH", category: "todo", isPinned: false, createdAt: Date.now() },
];

