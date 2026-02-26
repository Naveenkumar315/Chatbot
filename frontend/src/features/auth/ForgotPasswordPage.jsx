import { Form, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import FormField from "./FormField";
import { SparkleIcon, ArrowRightIcon } from "./AuthIcons";
import files from "../../file";

const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        try {
            console.log(values);
            message.success("Verification code sent");
            navigate("/update-password", { state: { email: values.email } });
        } catch (err) {
            message.error("Something went wrong");
        }
    };

    return (
        <div className="w-full max-w-[420px] px-9 py-8">

            {/* Logo */}
            <div className="text-center mb-2">
                <div className="flex justify-center items-center gap-2">
                    <h1 className="text-2xl font-bold italic text-gray-800">Genie</h1>
                    <img src={files.ai_assistant_logo} alt="logo" />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                    Your go-to assistant for all company policy questions
                </p>
            </div>

            {/* Heading */}
            <div className="text-center mb-1">
                <h2 className="text-3xl text-gray-800">Forgot Password</h2>
                <p className="text-sm text-gray-400">Enter your registered email</p>
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
                        { required: true, message: "Email is required" },
                        { type: "email", message: "Invalid email" },
                    ]}
                />

                <Button
                    htmlType="submit"
                    className="!w-full !h-10 !bg-[#24A1DD] hover:!bg-sky-500 !text-white !rounded-md flex items-center justify-center gap-2"
                >
                    Send Verification Code <ArrowRightIcon />
                </Button>
            </Form>

            <p className="text-center text-sm text-gray-500 mt-4 cursor-pointer">
                Remember your password?{" "}
                <button
                    onClick={() => navigate("/")}
                    className="text-[#24A1DD] hover:underline cursor-pointer"
                >
                    Log In
                </button>
            </p>
        </div>
    );
};

export default ForgotPasswordPage;