import API from "./api";

export const signupUser = async (data) => {
    const response = await API.post("/auth/signup", data);
    return response.data;
};

export const loginUser = async (data) => {
    const response = await API.post("/auth/login", data);
    return response.data;
};


export const forgotPassword = async (data) => {
    const response = await API.post("/auth/forgot-password", data);
    return response.data;
}
export const updatePassword = async (data) => {
    const response = await API.post("/auth/update-password", data);
    return response.data;
}