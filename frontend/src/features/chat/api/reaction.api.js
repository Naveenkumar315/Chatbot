import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export const sendReactionApi = async ({ messageId, emoji, action }) => {
    const url = `${API_URL}/api/reaction`;
    console.log("Full API URL:", url);
    console.log("Payload:", { messageId, emoji });

    try {
        const response = await axios.post(
            url,
            { messageId, emoji, action },
            {
                headers: {
                    Authorization: `Bearer 123456789`,
                }
            }
        );
        return response;
    } catch (error) {
        console.error("API Error Details:", {
            url,
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data
        });
        throw error;
    }
};