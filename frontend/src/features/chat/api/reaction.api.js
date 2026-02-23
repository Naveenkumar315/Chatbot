import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export const sendReactionApi = async ({ messageId, emoji, action }) => {
    const url = `${API_URL}/api/reaction`;
    console.log("Full API URL:", url);
    console.log("Payload:", { emoji });
    let user_id = JSON.parse(sessionStorage.user).email
    try {
        const response = await axios.post(
            url,
            { message_id: messageId, reaction: emoji, user_email: user_id, action },
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