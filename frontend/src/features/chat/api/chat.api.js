import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const sendMessageApi = async ({ question, country }) => {
    const response = await axios.post(`${BASE_URL}/query`, {
        question,
        country,
    });

    return response.data;
};
