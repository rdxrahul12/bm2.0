import React, { createContext, useContext, useState, useEffect } from "react";

type AnimationSpeed = "fast" | "normal" | "relaxed";

interface UiPreferencesContextType {
    animationSpeed: AnimationSpeed;
    setAnimationSpeed: (speed: AnimationSpeed) => void;
}

const UiPreferencesContext = createContext<UiPreferencesContextType | undefined>(undefined);

export const UiPreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [animationSpeed, setAnimationSpeed] = useState<AnimationSpeed>(() => {
        const saved = localStorage.getItem("ui-animation-speed");
        return (saved as AnimationSpeed) || "normal";
    });

    useEffect(() => {
        localStorage.setItem("ui-animation-speed", animationSpeed);

        // update CSS variables for global animation control if needed
        const root = document.documentElement;
        switch (animationSpeed) {
            case "fast":
                root.style.setProperty("--duration-factor", "0.5");
                break;
            case "relaxed":
                root.style.setProperty("--duration-factor", "2.0");
                break;
            default:
                root.style.setProperty("--duration-factor", "1.0");
        }

    }, [animationSpeed]);

    return (
        <UiPreferencesContext.Provider value={{ animationSpeed, setAnimationSpeed }}>
            {children}
        </UiPreferencesContext.Provider>
    );
};

export const useUiPreferences = () => {
    const context = useContext(UiPreferencesContext);
    if (context === undefined) {
        throw new Error("useUiPreferences must be used within a UiPreferencesProvider");
    }
    return context;
};
