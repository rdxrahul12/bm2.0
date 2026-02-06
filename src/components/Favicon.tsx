import { useState, useMemo, useEffect } from "react";
import { getDomain, getColorForDomain } from "@/utils/faviconUtils";
import { getCloudinaryFaviconUrl, uploadFaviconToCloudinary } from "@/utils/cloudinaryService";
import { findBestFavicon } from "@/utils/iconRanker";
import { iconCache } from "@/utils/iconCache";
import { motion } from "framer-motion";

interface FaviconProps {
    url: string;
    title: string;
    size?: number;
    className?: string;
}

export function Favicon({ url, title, size = 40, className = "" }: FaviconProps) {
    const [displayUrl, setDisplayUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const domain = getDomain(url);
    const color = useMemo(() => getColorForDomain(domain), [domain]);
    const cloudUrl = useMemo(() => domain ? getCloudinaryFaviconUrl(domain) : null, [domain]);

    useEffect(() => {
        let isMounted = true;
        setIsLoading(true);

        const resolveIcon = async () => {
            // 1. FAST PATH: Check IndexedDB for Cloudinary Icon
            if (cloudUrl) {
                try {
                    const cachedBlob = await iconCache.get(cloudUrl);
                    if (cachedBlob && isMounted) {
                        setDisplayUrl(URL.createObjectURL(cachedBlob));
                        setIsLoading(false);
                        return;
                        // If cached, we assume it's good (self-healing should have happened already)
                        // Or should we still race to see if there's a better one? 
                        // For performance, trust the cache.
                    }
                } catch (e) {
                    // Cache error, proceed to race
                }
            }

            // 2. SLOW PATH: Run Request Race (Google vs DDG vs Cloudinary)
            const best = await findBestFavicon(url);

            if (!isMounted) return;

            if (best) {
                setDisplayUrl(best.url);

                // Optimization: If Cloudinary won, cache it for next time
                if (best.source === 'cloudinary' && cloudUrl) {
                    // Fetch/Blob/Store (supports CORS)
                    fetch(best.url).then(res => res.blob()).then(blob => {
                        iconCache.set(cloudUrl, blob);
                    }).catch(() => { });
                }

                // Self-Healing: If we found a high-quality external icon, upload it!
                // Constraint: Must be >= 128x128 to be worth replacing.
                if (best.source !== 'cloudinary' && best.width >= 128 && domain) {
                    uploadFaviconToCloudinary(domain, best.url).catch(console.error);
                }

            } else {
                // No valid icon found -> Letter Fallback
                setDisplayUrl(null);
            }

            setIsLoading(false);
        };

        resolveIcon();

        return () => {
            isMounted = false;
        };
    }, [url, cloudUrl, domain]);

    const getIconContent = () => {
        // If no display URL and not loading, it means we failed to find an icon -> FAllBACK
        if (!displayUrl && !isLoading) {
            const letter = domain ? domain.charAt(0).toUpperCase() : (title ? title.charAt(0).toUpperCase() : '?');
            return (
                <div
                    className="flex items-center justify-center w-full h-full text-white font-bold text-lg select-none"
                    style={{ backgroundColor: color }}
                >
                    {letter}
                </div>
            );
        }

        // Loading state
        if (isLoading) {
            return <div className="w-full h-full bg-secondary/50 animate-pulse" />;
        }

        // Success state
        return (
            <img
                src={displayUrl!}
                alt={`${title} favicon`}
                className="w-full h-full object-cover"
            // No onLoad/onError needed here, probing was done in iconRanker
            />
        );
    };

    return (
        <motion.div
            className={`relative overflow-hidden rounded-[10px] bg-secondary/30 shrink-0 ${className}`}
            style={{ width: size, height: size }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
        >
            <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-zinc-800">
                {getIconContent()}
            </div>

            {/* Subtle Inner Border/Shadow for Consistency */}
            <div className="absolute inset-0 rounded-[10px] ring-1 ring-black/5 dark:ring-white/10 pointer-events-none" />
        </motion.div>
    );
}
