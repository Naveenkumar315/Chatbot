import { Form, Button, message } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import FormField from "./FormField";
import { SparkleIcon, ArrowRightIcon } from "./AuthIcons";
import { useState } from "react";
import files from "../../file";

const UpdatePasswordPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || "";

    const [form] = Form.useForm();

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
            console.log(values);
            message.success("Password updated successfully");
            navigate("/");
        } catch (error) {
            message.error("Update failed");
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
                <h2 className="text-3xl text-gray-800">Update Password</h2>
                <p className="text-sm text-gray-400">
                    Verification code sent to {email}
                </p>
            </div>

            {/* Form */}
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                style={{ width: "100%" }}
            >
                <FormField
                    name="code"
                    label="Verification Code"
                    placeholder="Enter code"
                    required
                    rules={[{ required: true, message: "Code is required" }]}
                />

                <FormField
                    type="password"
                    name="password"
                    label="New Password"
                    placeholder="Enter new password"
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
                    label="Confirm New Password"
                    placeholder="Confirm new password"
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
                                return Promise.reject(
                                    new Error("Passwords do not match")
                                );
                            },
                        }),
                    ]}
                />

                <p className="text-xs mb-5 text-gray-400 leading-5">
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
                    Update Password <ArrowRightIcon />
                </Button>
            </Form>

            <p className="text-center text-sm text-gray-500 mt-4">
                Back to{" "}
                <button
                    onClick={() => navigate("/")}
                    className="text-[#24A1DD] hover:underline"
                >
                    Log In
                </button>
            </p>
        </div>
    );
};

export default UpdatePasswordPage;