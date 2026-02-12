import Header from "./Header";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <Outlet />
        </div>
    );
};

export default AppLayout;
