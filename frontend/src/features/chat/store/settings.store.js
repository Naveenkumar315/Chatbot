import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useSettingsStore = create(
    persist(
        (set) => ({
            country: "India",
            theme: "light",

            setCountry: (value) => set({ country: value }),

            setTheme: () =>
                set((state) => ({
                    theme: state.theme === "light" ? "dark" : "light",
                })),
        }),
        {
            name: "settings-storage", // key in localStorage
        }
    )
);
