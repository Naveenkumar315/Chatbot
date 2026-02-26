import files from "../../file";
import { SparkleIcon } from "./AuthIcons";

const LoginForm = ({ switchToSignup }) => {

    const handleMicrosoftLogin = () => {
        let url = `${import.meta.env.VITE_BACKEND_URL}/api/ValidateAzureAD`;
        window.location.href = url;
    };

    return (
        <div className="w-full max-w-[420px] px-9 py-8 text-center">

            {/* Logo */}
            <div className="mb-2">
                <div className="flex justify-center items-center gap-2">
                    <h1 className="text-2xl font-bold italic text-gray-800">Genie</h1>
                    <SparkleIcon />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                    Your go-to assistant for all company policy questions
                </p>
            </div>

            {/* Heading */}
            <div className="mb-4">
                <h2 className="text-3xl text-gray-800">Log In</h2>
                <p className="text-sm text-gray-400">Please log in to continue</p>
            </div>

            {/* Microsoft Login */}
            <button
                onClick={handleMicrosoftLogin}
                className="flex items-center justify-center w-full gap-3 px-6 py-2 border border-blue-400 rounded-md bg-white hover:bg-blue-50 transition shadow-sm mb-5"
            >
                <img src={files.Microsoft_Icon} className="w-5 h-5" />
                <span className="text-sm font-medium text-slate-700">Log in with Microsoft</span>
            </button>

            <p className="text-sm text-gray-500">
                Don't have an account?{" "}
                <span
                    onClick={switchToSignup}
                    className="text-[#24A1DD] cursor-pointer hover:underline"
                >
                    Sign Up
                </span>
            </p>

        </div>
    );
};

export default LoginForm;