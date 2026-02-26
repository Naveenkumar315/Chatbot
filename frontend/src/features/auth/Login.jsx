import { Form, Button } from "antd";
import { useNavigate } from "react-router-dom";
import FormField from "./FormField";
import files from "../../file";
import { SparkleIcon, ArrowRightIcon } from "./AuthIcons";

const LoginPage = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const handleMicrosoftLogin = () => {
        let url = `${import.meta.env.VITE_BACKEND_URL}/api/ValidateAzureAD`;
        window.location.href = url;
    };

    const onFinish = (values) => {
        console.log("Login Values:", values);
    };

    return (
        <div className="w-full max-w-[420px] px-9 py-8">

            {/* Logo */}
            <div className="text-center mb-2">
                <div className="flex justify-center items-center gap-2">
                    <h1 className="text-2xl font-bold italic text-gray-800">Genie</h1>
                    <SparkleIcon />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                    Your go-to assistant for all company policy questions
                </p>
            </div>

            {/* Heading */}
            <div className="text-center mb-1">
                <h2 className="text-3xl text-gray-800">Log In</h2>
                <p className="text-sm text-gray-400">Please log in to continue</p>
            </div>

            {/* Form */}
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                style={{ width: "100%" }}
            >
                <FormField
                    name="email"
                    label="Email Address"
                    placeholder="Enter your email"
                    required
                    rules={[
                        { required: true, message: "Email required" },
                        { type: "email", message: "Invalid email" },
                    ]}
                />

                <FormField
                    type="password"
                    name="password"
                    label="Password"
                    placeholder="Enter password"
                    required
                    prefix={
                        <img
                            src={files.lock_keyhole}
                            alt="lock"
                            className="w-4 h-4 opacity-70"
                        />
                    }
                    rules={[{ required: true, message: "Password required" }]}
                />

                {/* Forgot Password */}
                <div className="text-right -mt-2 mb-4">
                    <button
                        type="button"
                        onClick={() => navigate("/forgot-password")}
                        className="text-sm text-[#24A1DD] hover:underline cursor-pointer"
                    >
                        Forgot Password?
                    </button>
                </div>

                <Button
                    htmlType="submit"
                    className="!w-full !h-10 !bg-[#24A1DD] hover:!bg-sky-500 !text-white !rounded-md flex items-center justify-center gap-2"
                >
                    Log In <ArrowRightIcon />
                </Button>
            </Form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-3">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-[11px] text-gray-400 tracking-wide">OR LOG IN WITH</span>
                <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Microsoft */}
            <button
                onClick={handleMicrosoftLogin}
                className="flex items-center justify-center w-full gap-3 px-6 py-2 border border-blue-400 rounded-md bg-white hover:bg-blue-50 transition shadow-sm mb-5"
            >
                <img src={files.Microsoft_Icon} className="w-5 h-5" />
                <span className="text-sm font-medium text-slate-700 cursor-pointer">Microsoft</span>
            </button>

            <p className="text-center text-sm text-gray-500">
                Don't have an account?{" "}
                <button
                    onClick={() => navigate("/signup")}
                    className="text-[#24A1DD] hover:underline cursor-pointer"
                >
                    Sign Up
                </button>
            </p>
        </div>
    );
};

export default LoginPage;