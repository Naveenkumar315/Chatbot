import files from "../../file";

const LoginForm = ({ switchToSignup }) => {

    const handleMicrosoftLogin = () => {
        let url = `${import.meta.env.VITE_BACKEND_URL}/api/ValidateAzureAD`;
        window.location.href = url;
    };

    return (
        <div className="text-center space-y-6 w-[400px]">

            <div>
                <h1 className="flex items-center justify-center gap-2 text-4xl font-bold italic text-slate-800">
                    Genie
                    <img src={files.group_} className="w-8 h-8" />
                </h1>

                <p className="text-sm text-slate-500 mt-2">
                    Your go-to assistant for all company policy questions
                </p>
            </div>

            <button
                onClick={handleMicrosoftLogin}
                className="flex items-center justify-center w-full gap-3 px-6 py-2 border border-blue-400 rounded-md bg-white hover:bg-blue-50 transition shadow-sm"
            >
                <img src={files.Microsoft_Icon} className="w-5 h-5" />
                <span className="text-sm font-medium text-slate-700">
                    Log in with Microsoft
                </span>
            </button>

            <p className="text-sm">
                Don’t have an account?{" "}
                <span
                    onClick={switchToSignup}
                    className="text-blue-600 cursor-pointer"
                >
                    Sign Up
                </span>
            </p>

        </div>
    );
};

export default LoginForm;