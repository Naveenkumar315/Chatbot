import { Form, Button } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import FormField from "./FormField";
import { SparkleIcon, ArrowRightIcon } from "./AuthIcons";
import { useState } from "react";
import files from "../../file";
import { updatePassword } from "./authService";
import toast from "react-hot-toast";

const UpdatePasswordPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || "";

    const [form] = Form.useForm();

    const [passwordValue, setPasswordValue] = useState("");

    const passwordChecks = {
        length: passwordValue.length >= 8,
        uppercase: /[A-Z]/.test(passwordValue),
        lowercase: /[a-z]/.test(passwordValue),
        number: /[0-9]/.test(passwordValue),
        special: /[!@#$%^&*(),.[\]{}\-_=+]/.test(passwordValue),
    };

    const onFinish = async (values) => {
        try {
            console.log(values);
            const payload = {
                email,
                code: values.code,
                password: values.password,
            };
            const response = await updatePassword(payload);
            if (response.message === "Invalid verification code") {
                toast.error("Invalid verification code")
                return
            }
            if (response.message === "Code expired") {
                toast.error("Code expired")
                return
            }
            toast.success("Password updated successfully");
            navigate("/");
        } catch (error) {
            toast.error("Update failed");
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
                <p className="text-xs text-gray-500 mt-1 italic">
                    Your go-to assistant for all company policy questions
                </p>
            </div>

            {/* Heading */}
            <div className="text-center mb-1">
                <h2 className="text-3xl text-gray-800 custom-font-jura ">Update Password</h2>
                <p className="text-sm text-gray-400">
                    Verification code sent to {email}
                </p>
            </div>

            {/* Form */}
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                requiredMark={false}
                style={{ width: "100%" }}
            >
                <FormField
                    name="code"
                    label="Verification Code"
                    placeholder="Enter code"
                    required
                    rules={[
                        { required: true, message: "Code is required" },
                        { len: 6, message: "Code must be exactly 6 digits" },
                        // { pattern: /^\d{6}$/, message: "Code must be 6 digits only" }
                    ]}
                    onKeyPress={(e) => {
                        if (!/[0-9]/.test(e.key)) {
                            e.preventDefault();
                        }
                    }}
                    maxLength={6}
                    autoComplete="one-time-code"
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
                        Minimum 8 characters
                    </span>
                </p>
                <Button
                    htmlType="submit"
                    className="!w-full !h-10 !bg-[#24A1DD] hover:!bg-sky-500 !text-white !rounded-md flex items-center justify-center gap-2"
                >
                    Update Password <ArrowRightIcon />
                </Button>
            </Form>

            <p className="text-center text-sm text-gray-500 mt-4 cursor-pointer">
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