import files from "../../file";

const LoginPage = () => {



    const handleMicrosoftLogin = () => {
        let url = `${import.meta.env.VITE_BACKEND_URL}/api/ValidateAzureAD`
        window.location.href = url;
    }

    return (
        <div className="h-screen w-screen flex">

            {/* LEFT SIDE */}
            <div
                className="w-1/2 relative bg-cover "
                style={{ backgroundImage: `url(${files.bg_Login_Without_Logo})` }}
            >


                <div className="absolute bottom-8 left-8 text-white">
                    <img src={files.CA_Logo_white} alt="CA Logo" className="w-16 h-16" />
                </div>

            </div>

            {/* RIGHT SIDE */}
            <div className="w-1/2 flex items-center justify-center bg-white">

                <div className="text-center space-y-6 w-[400px]">

                    {/* Title */}
                    <div>
                        <h1 className="flex items-center justify-center gap-2 text-4xl font-bold italic text-slate-800">
                            Genie
                            <img
                                src={files.group_}
                                alt=""
                                className="w-8 h-8"
                            />
                        </h1>

                        <p className="text-sm text-slate-500 mt-2">
                            Your go-to assistant for all company policy questions
                        </p>
                    </div>


                    {/* Microsoft Login Button */}
                    <button className="flex items-center justify-center w-full gap-3 px-6 py-2 border border-blue-400 rounded-md bg-white hover:bg-blue-50 transition shadow-sm cursor-pointer"
                        onClick={handleMicrosoftLogin}
                    >
                        <img
                            src={files.Microsoft_Icon}
                            alt="Microsoft"
                            className="w-5 h-5"
                        />
                        <span className="text-sm font-medium text-slate-700">
                            Log in with Microsoft
                        </span>
                    </button>

                </div>


            </div>
        </div>
    );
};

export default LoginPage;
