import { useMutation } from "@tanstack/react-query";
import { sendMessageApi } from "../chat/api/chat.api";
import { useChartStore } from "../chat/store/chat.store";

export const useSendMessage = () => {
    const addMessage = useChartStore((state) => state.addMessage);
    const setTyping = useChartStore((state) => state.setTyping);

    return useMutation({
        mutationFn: sendMessageApi,
        onMutate: () => {
            setTyping(true);
        },

        onSuccess: (data) => {
            addMessage({
                _id: Date.now(),
                type: "bot",
                text: data.answer,
                source: data.sources,
                timing: data.timing,
                collection: data.collections_used,
                message_id: data.message_id
            })
        },

        onError: () => {
            addMessage({
                _id: Date.now(),
                type: "bot",
                text: "Something went wrong. Please try again."
            })
        },

        onSettled: () => {
            setTyping(false);
        }
    })
}