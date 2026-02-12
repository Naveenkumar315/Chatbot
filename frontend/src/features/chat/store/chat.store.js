import { create } from "zustand";

export const useChartStore = create((set, get) => ({
    message: [],
    isTyping: false,
    selectedMessage: null,
    isSourceOpen: false,
    isPdfOpen: false,
    pdfData: null,

    page: 1,
    pageSize: 20,
    hasMore: true,

    addMessage: (msg) =>
        set((state) => ({ message: [...state.message, msg] })),

    setTyping: (value) => set({ isTyping: value }),

    openSourceModal: (message) => set({ selectedMessage: message, isSourceOpen: true }),

    closeSourceModal: () => set({ isSourceOpen: false, selectedMessage: null }),

    openPdfModal: (pdfData) => set({ pdfData, isPdfOpen: true }),

    closePdfModal: () => set({ isPdfOpen: false, pdfData: null }),

    clearMessage: () => set({ message: [] }),

    loadMoreMessages: async () => {
        const { page, pageSize, hasMore } = get();

        if (!hasMore) return [];

        try {
            const response = await fetch(`/api/messages?page=${page}&limit=${pageSize}`);
            const newMessages = await response.json();

            if (newMessages.length < pageSize) {
                set({ hasMore: false });
            }

            if (newMessages.length > 0) {
                set((state) => ({
                    message: [...newMessages.reverse(), ...state.message],
                    page: state.page + 1
                }));
            }

            return newMessages;
        } catch (error) {
            console.error('Error loading messages:', error);
            return [];
        }
    },

    // Set single reaction (replaces any existing reaction)
    addReaction: (messageId, emoji) => {
        set((state) => ({
            message: state.message.map((msg) =>
                msg._id === messageId
                    ? { ...msg, reaction: emoji }
                    : msg
            )
        }));
    },

    // Remove reaction
    removeReaction: (messageId) => {
        set((state) => ({
            message: state.message.map((msg) =>
                msg._id === messageId
                    ? { ...msg, reaction: null }
                    : msg
            )
        }));
    },

    // Update message reaction from backend
    updateMessageReaction: (messageId, reaction) => {
        set((state) => ({
            message: state.message.map((msg) =>
                msg._id === messageId
                    ? { ...msg, reaction }
                    : msg
            )
        }));
    },

}));