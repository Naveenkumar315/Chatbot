
import { create } from "zustand";

export const useSettingsStore = create((set) => ({
    country: "India",

    setCountry: (value) => set({ country: value })
}))