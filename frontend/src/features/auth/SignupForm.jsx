import { useState } from "react";
import { Form, Button } from "antd";
import { useNavigate } from "react-router-dom";
import FormField from "./FormField";
import files from "../../file";
import { SparkleIcon, ArrowRightIcon } from "./AuthIcons";

const SignupForm = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const handleMicrosoftLogin = () => {
        let url = `${import.meta.env.VITE_BACKEND_URL}/api/ValidateAzureAD`;
        window.location.href = url;
    };

    const [passwordValue, setPasswordValue] = useState("");

    const passwordChecks = {
        length: passwordValue.length >= 12,
        uppercase: /[A-Z]/.test(passwordValue),
        lowercase: /[a-z]/.test(passwordValue),
        number: /[0-9]/.test(passwordValue),
        special: /[!@#$%^&*(),.[\]{}\-_=+]/.test(passwordValue),
    };

    const onFinish = async (values) => {
        try {
            const payload = {
                email: values.email,
                password: values.password,
                confirm_password: values.confirmPassword,
            };

            await signupUser(payload);

            message.success("Signup successful!");

            navigate("/"); // go to login
        } catch (error) {
            message.error(
                error?.response?.data?.detail || "Signup failed"
            );
        }
    };

    return (
        <div className="w-full max-w-[420px] px-9 py-4">

            {/* Logo */}
            <div className="text-center mb-1">
                <div className="flex justify-center items-center gap-2">
                    <h1 className="text-2xl font-bold italic text-gray-800">Genie</h1>
                    <img src={files.ai_assistant_logo} alt="logo" />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                    Your go-to assistant for all company policy questions
                </p>
            </div>

            {/* Heading */}
            <div className="text-center mb-0">
                <h2 className="text-3xl text-gray-800">Sign Up</h2>
                <p className="text-sm text-gray-400">Welcome! Let's set things up</p>
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

                <FormField
                    type="password"
                    name="password"
                    label="Create Password"
                    placeholder="Enter password"
                    required
                    prefix={
                        <img
                            src={files.lock_keyhole}
                            alt="lock"
                            className="w-4 h-4 opacity-70"
                        />
                    }
                    onChange={(e) => setPasswordValue(e.target.value)}
                    rules={[
                        { required: true, message: "Password is required" },
                    ]}
                />

                <FormField
                    type="password"
                    name="confirmPassword"
                    label="Confirm Password"
                    placeholder="Confirm password"
                    required
                    prefix={
                        <img
                            src={files.lock_keyhole}
                            alt="lock"
                            className="w-4 h-4 opacity-70"
                        />
                    }
                    dependencies={["password"]}
                    rules={[
                        { required: true, message: "Confirm password is required" },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue("password") === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error("Passwords do not match"));
                            },
                        }),
                    ]}
                />

                <p className="text-xs mb-2 text-gray-400 leading-4">
                    <span
                        className={
                            passwordChecks.lowercase ? "text-green-600 font-medium" : ""
                        }
                    >
                        At lease one lowercase
                    </span>
                    ,{" "}
                    <span
                        className={
                            passwordChecks.uppercase ? "text-green-600 font-medium" : ""
                        }
                    >
                        one uppercase
                    </span>
                    ,{" "}
                    <span
                        className={
                            passwordChecks.number ? "text-green-600 font-medium" : ""
                        }
                    >
                        one number
                    </span>
                    ,{" "}
                    <span
                        className={
                            passwordChecks.special ? "text-green-600 font-medium" : ""
                        }
                    >
                        one special character - !@#$%^&*(),.[]
                    </span>
                    .{" "}
                    <span
                        className={
                            passwordChecks.length ? "text-green-600 font-medium" : ""
                        }
                    >
                        Minimum 12 characters
                    </span>
                </p>

                <Button
                    htmlType="submit"
                    className="!w-full !h-10 !bg-[#24A1DD] hover:!bg-sky-500 !text-white !rounded-md flex items-center justify-center gap-2"
                >
                    Sign Up <ArrowRightIcon />
                </Button>
            </Form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-2">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-[11px] text-gray-400 tracking-wide">OR SIGN UP WITH</span>
                <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Microsoft */}
            <button
                onClick={handleMicrosoftLogin}
                className="flex items-center justify-center w-full gap-3 px-6 py-2 border border-blue-400 rounded-md bg-white hover:bg-blue-50 transition shadow-sm mb-3 cursor-pointer"
            >
                <img src={files.Microsoft_Icon} className="w-5 h-5" />
                <span className="text-sm font-medium text-slate-700">Microsoft</span>
            </button>

            <p className="text-center text-sm text-gray-500">
                Already have an account?{" "}
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

export default SignupForm;