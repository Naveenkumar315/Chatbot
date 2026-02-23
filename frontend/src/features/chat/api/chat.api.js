import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const sendMessageApi = async ({ question, country }) => {
    const response = await axios.post(`${BASE_URL}/query`, {
        question,
        country,
        user_email: JSON.parse(sessionStorage.user).email
    });

    return response.data;
};
