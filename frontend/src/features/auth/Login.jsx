import { Form, Button } from "antd";
import { useNavigate } from "react-router-dom";
import FormField from "./FormField";
import files from "../../file";
import { loginUser } from "./authService";
import { message } from "antd";

const SparkleIcon = () => (
    <svg width="22" height="22" viewBox="0 0 28 28">
        <path d="M14 2L16.5 11.5L26 14L16.5 16.5L14 26L11.5 16.5L2 14L11.5 11.5L14 2Z" fill="#4FC3F7" />
    </svg>
);

const ArrowRightIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" stroke="white" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
    </svg>
);

const LoginPage = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const handleMicrosoftLogin = () => {
        let url = `${import.meta.env.VITE_BACKEND_URL}/api/ValidateAzureAD`;
        window.location.href = url;
    };

    const onFinish = async (values) => {
        try {

            message.loading({
                content: "Logging in...",
                key: "login"
            });

            const response = await loginUser(values);

            //  store JWT
            localStorage.setItem(
                "token",
                response.access_token
            );

            message.success({
                content: "Login successful ",
                key: "login",
                duration: 2
            });

            navigate("/chat");

        } catch (error) {

            message.error({
                content:
                    error?.response?.data?.detail ||
                    "Login failed",
                key: "login"
            });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-full min-w-[420px] max-w-[420px] px-9 py-10">

                {/* Logo */}
                <div className="text-center mb-2">
                    <div className="flex justify-center items-center gap-2">
                        <h1 className="text-2xl font-bold italic">Genie</h1>
                        <SparkleIcon />
                    </div>
                    <p className="text-xs italic text-gray-500 mt-1">
                        Your go-to assistant for all company policy questions
                    </p>
                </div>

                {/* Heading */}
                <div className="text-center">
                    <h2 className="text-3xl text-gray-800">Log In</h2>
                    <p className="text-sm text-gray-400">Please log in to continue</p>
                </div>

                {/* FORM */}
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    style={{ width: "100%" }}
                >
                    <FormField
                        name="email"
                        label="Email Address"
                        placeholder="Enter email"
                        required
                        rules={[
                            { required: true, message: "Email required" },
                            { type: "email", message: "Invalid email" }
                        ]}
                    />

                    <FormField
                        type="password"
                        name="password"
                        label="Password"
                        placeholder="Enter password"
                        required
                        rules={[{ required: true, message: "Password required" }]}
                    />

                    {/* Forgot Password */}
                    <div className="text-right -mt-2 mb-4">
                        <button type="button" className="text-sm text-[#24A1DD] hover:underline">
                            Forgot password?
                        </button>
                    </div>

                    <Button
                        htmlType="submit"
                        className="!w-full !h-10 !bg-[#24A1DD] hover:!bg-sky-500 !text-white !rounded-md flex items-center justify-center gap-2"
                    >
                        Login <ArrowRightIcon />
                    </Button>
                </Form>

                {/* Divider */}
                <div className="flex items-center gap-3 my-3">
                    <div className="flex-1 h-px bg-gray-200" />
                    <span className="text-[11px] text-gray-400">OR LOG IN WITH</span>
                    <div className="flex-1 h-px bg-gray-200" />
                </div>

                {/* Microsoft */}
                <button
                    onClick={handleMicrosoftLogin}
                    className="flex items-center justify-center w-full gap-3 px-6 py-2 border border-blue-400 rounded-md bg-white hover:bg-blue-50 transition shadow-sm mb-5"
                >
                    <img src={files.Microsoft_Icon} className="w-5 h-5" />
                    <span className="text-sm font-medium text-slate-700">Microsoft</span>
                </button>

                <p className="text-center text-sm text-gray-500">
                    Don't have an account?{" "}
                    <button onClick={() => navigate("/signup")} className="text-[#24A1DD] hover:underline">
                        Sign Up
                    </button>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;