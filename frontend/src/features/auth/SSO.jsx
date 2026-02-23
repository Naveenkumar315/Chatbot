import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import toast from "react-hot-toast";

export default function SSOCallback() {

    const navigate = useNavigate();
    const [status, setStatus] = useState("Processing...");
    const hasProcessed = useRef(false);

    useEffect(() => {

        //  Prevent React StrictMode double call
        if (hasProcessed.current) return;
        hasProcessed.current = true;

        const token =
            new URLSearchParams(window.location.search).get("token");

        if (!token) {
            // toast.error("Invalid SSO response");
            navigate("/");
            return;
        }

        const exchangeToken = async () => {

            try {
                setStatus("Exchanging token...");

                const res = await axios.post(
                    `${import.meta.env.VITE_BACKEND_URL}/sso-exchange`,
                    { token }
                );

                //  SESSION STORAGE (tab lifetime)
                sessionStorage.setItem(
                    "access_token",
                    res.data.access_token
                );

                sessionStorage.setItem(
                    "refresh_token",
                    res.data.refresh_token
                );

                sessionStorage.setItem(
                    "user",
                    JSON.stringify({
                        email: res.data.email,
                        role: res.data.role,
                        user_id: res.data.user_id
                    })
                );

                setStatus("Redirecting...");

                navigate("/chat", { replace: true });

            } catch (err) {
                console.error("SSO exchange failed:", err);
                // toast.error("SSO login failed");
                navigate("/");
            }
        };

        exchangeToken();

    }, [navigate]);

    return (
        <div className="h-screen flex items-center justify-center">
            <div className="text-center">
                <span className="text-gray-500 text-sm block mb-2">
                    Signing you in with Microsoft…
                </span>
                <span className="text-gray-400 text-xs">
                    {status}
                </span>
            </div>
        </div>
    );
}