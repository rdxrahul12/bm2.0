const DB_NAME = "BookmarkDelightCache";
const STORE_NAME = "icons";
const DB_VERSION = 1;

class IconCache {
    private db: IDBDatabase | null = null;
    private dbPromise: Promise<IDBDatabase>;

    constructor() {
        this.dbPromise = this.initDB();
    }

    private initDB(): Promise<IDBDatabase> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve(request.result);
            };

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME);
                }
            };
        });
    }

    async get(url: string): Promise<Blob | null> {
        try {
            const db = await this.dbPromise;
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(STORE_NAME, "readonly");
                const store = transaction.objectStore(STORE_NAME);
                const request = store.get(url);

                request.onsuccess = () => resolve(request.result as Blob || null);
                request.onerror = () => reject(request.error);
            });
        } catch (e) {
            console.error("Cache get error:", e);
            return null;
        }
    }

    async set(url: string, blob: Blob): Promise<void> {
        try {
            const db = await this.dbPromise;
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(STORE_NAME, "readwrite");
                const store = transaction.objectStore(STORE_NAME);
                const request = store.put(blob, url);

                request.onsuccess = () => resolve();
                request.onerror = () => reject(request.error);
            });
        } catch (e) {
            console.error("Cache set error:", e);
        }
    }
}

export const iconCache = new IconCache();
