import { Outlet } from "react-router-dom";
import files from "../../file";

const AuthLayout = () => {

    return (
        <div className="h-screen w-screen flex">

            {/* LEFT SIDE */}
            <div
                className="w-1/2 relative bg-cover"
                style={{
                    backgroundImage: `url(${files.bg_Login_Without_Logo})`
                }}
            >
                <div className="absolute bottom-8 left-8">
                    <img
                        src={files.CA_Logo_white}
                        className="w-16 h-16"
                    />
                </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="w-1/2 flex items-center justify-center bg-gray-100">
                <Outlet />
            </div>

        </div>
    );
};

export default AuthLayout;