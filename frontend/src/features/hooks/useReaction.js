import { useMutation } from "@tanstack/react-query";
import { sendReactionApi } from "../chat/api/reaction.api";
import { useChartStore } from "../chat/store/chat.store";

export const useReaction = () => {
    const addReaction = useChartStore((s) => s.addReaction);
    const removeReaction = useChartStore((s) => s.removeReaction);

    return useMutation({
        mutationFn: async (data) => {
            console.log("Sending reaction:", data);
            return sendReactionApi(data);
        },

        onMutate: ({ messageId, emoji, action }) => {
            if (action === 'add') {
                addReaction(messageId, emoji);
            } else {
                removeReaction(messageId);
            }
        },

        onError: (error, variables) => {
            console.error("Reaction error:", error);
        },

        onSuccess: (response) => {
            console.log("Reaction updated successfully:", response?.data);
        }
    });
};