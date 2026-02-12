import { useNavigate } from "react-router-dom";
import files from "../file";
import { useSettingsStore } from "../features/chat/store/settings.store";

const Header = () => {
    const navigate = useNavigate();
    const country = useSettingsStore((s) => s.country);
    const setCountry = useSettingsStore((s) => s.setCountry);

    const handleLogout = () => {
        navigate("/");
    };

    return (
        <header className="fixed top-0 left-0 h-[50px] w-full z-50 bg-white shadow px-6 flex items-center justify-between border-b-border-black">

            {/* Left Section */}
            <div className="flex items-center gap-3">
                <img src={files.logo} alt="Logo" className="h-8" />
            </div>



            {/* Right Section */}
            <div className="flex items-center gap-3">
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
                    className="px-4 py-2 w-28 flex gap-2 text-sm font-medium bg-white border-2 border-primary rounded transition cursor-pointer text-primary-text"

                >
                    <img src={files.logOut} alt="" />
                    Logout
                </button>
            </div>
        </header>
    );
};
export default Header;
