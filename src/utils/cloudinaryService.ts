
interface CloudinaryUploadResponse {
    public_id: string;
    secure_url: string;
    error?: { message: string };
}

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "dsupi8dff";
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_PRESET || "bookmark";

/**
 * Uploads a favicon from a source URL to Cloudinary
 * Target Public ID: favicons/{domain}
 * Tags: auto_fetched, favicon
 */
export const uploadFaviconToCloudinary = async (
    domain: string,
    sourceUrl: string
): Promise<CloudinaryUploadResponse | null> => {
    if (!domain || !sourceUrl) return null;

    const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
    const formData = new FormData();

    formData.append("file", sourceUrl);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("public_id", `favicons/${domain}`);
    formData.append("tags", "auto_fetched,favicon");
    formData.append("context", `domain=${domain}`);

    try {
        const response = await fetch(url, {
            method: "POST",
            body: formData,
        });

        const data = await response.json();

        if (data.error) {
            console.warn("Cloudinary upload error:", data.error.message);
            return null;
        }

        return data;
    } catch (error) {
        console.error("Cloudinary upload failed:", error);
        return null;
    }
};

/**
 * Generates the stable optimized URL for a favicon
 */
export const getCloudinaryFaviconUrl = (domain: string): string => {
    // Transformation:
    // c_pad: Pad to aspectRatio (defaults to 1:1 if not set but we set w/h)
    // w_64, h_64: Fixed size
    // q_auto: Auto quality
    // f_auto: Auto format (webp/avif)
    // d_default: Optional placeholder if we had one uploaded, but for now we handle error in UI
    return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/c_pad,w_64,h_64,q_auto,f_auto/favicons/${domain}`;
};
