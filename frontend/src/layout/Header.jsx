import { useNavigate } from "react-router-dom";
import files from "../file";
import { useSettingsStore } from "../features/chat/store/settings.store";
import { useModeAnimation, ThemeAnimationType } from 'react-theme-switch-animation';
import { Sun, Moon } from "lucide-react";
import { useChartStore } from "../features/chat/store/chat.store";


const Header = () => {
    const navigate = useNavigate();
    const country = useSettingsStore((s) => s.country);
    const setCountry = useSettingsStore((s) => s.setCountry);
    const theme = useSettingsStore((s) => s.theme)
    const setTheme = useSettingsStore((s) => s.setTheme)
    const clearMessage = useChartStore((s) => s.clearMessage)

    const { ref, toggleSwitchTheme } = useModeAnimation({
        duration: 500,
        animationType: ThemeAnimationType.CIRCLE
    })

    const handleThemeToggle = () => {
        toggleSwitchTheme();
        setTimeout(() => {
            setTheme();
        }, 50);
    };

    const handleLogout = () => {
        sessionStorage.clear();
        localStorage.removeItem("token");
        clearMessage()
        navigate("/");
    };

    return (
        <header
            className={`fixed top-0 left-0 h-[50px] w-full z-50  shadow px-6 flex items-center justify-between border-b-border-black ${theme === "light" ? "bg-white" : "bg-bg-dark-header"}`}>

            {/* Left Section */}
            <div className="flex items-center gap-3">
                <img src={theme == "light" ? files.logo : files.logo_dark} alt="Logo" className="h-8" />
            </div>



            {/* Right Section */}
            <div className="flex items-center gap-3">
                <button
                    ref={ref}
                    onClick={handleThemeToggle}
                    className={`w-12 h-5 rounded-full flex items-center px-1 transition-all duration-300 cursor-pointer
                    ${theme === "light"
                            ? "bg-gradient-to-r from-[#24A1DD] to-[#8fdafd]"
                            : "bg-gradient-to-r from-gray-800 to-gray-600"
                        }`}
                >
                    <div
                        className={`w-4 h-4 bg-white rounded-full shadow-md flex items-center justify-center transition-all duration-300
                        ${theme === "light" ? "translate-x-6" : "translate-x-0"}
                        `}
                    >
                        {theme === "light" ? <Sun size={10} /> : <Moon size={10} />}
                    </div>
                </button>

                <div className="flex w-[100px] h-[30px] rounded border border-border-gray overflow-hidden">
                    <button
                        onClick={() => setCountry("India")}
                        className={`flex-1 flex items-center justify-center transition cursor-pointer
                    ${country === "India" ? "bg-bg-light" : "bg-white"}
                    `}
                    >
                        <img src={files.IN} className="h-5" />
                    </button>

                    <button
                        onClick={() => setCountry("US")}
                        className={`flex-1 flex items-center justify-center transition cursor-pointer
                        ${country === "US" ? "bg-bg-light" : "bg-white"}
                    `}
                    >
                        <img src={files.US} className="h-5" />
                    </button>
                </div>

                <button
                    onClick={handleLogout}
                    className={`px-4 py-2 w-28 flex gap-2 text-sm font-medium  rounded transition cursor-pointer border-2 border-primary
                    ${theme === "light"
                            ? " text-primary-text bg-white"
                            : " text-white  bg-bg-dark-header"
                        }`}
                >
                    <img src={files.logOut} alt="" />
                    Logout
                </button>
            </div>
        </header>
    );
};
export default Header;
