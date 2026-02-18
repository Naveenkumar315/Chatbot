import { create } from "zustand";

export const useUIStore = create((set) => ({

    panel: "chat",
    isSplit: false,
    rightPanelWidth: 500,
    pdfData: null,

    openSource: () => set({ panel: "source", isSplit: true }),
    openPdf: (pdfData) => set({ panel: "pdf", isSplit: true, pdfData: pdfData }),
    closePanel: () => set({ panel: "chat", isSplit: false }),
    backToSource: () => set({ panel: "source", isSplit: true }),

    setRightPanelWidth: (width) => set({ rightPanelWidth: width }),
}))