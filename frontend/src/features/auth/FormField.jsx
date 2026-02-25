import React from "react";
import { Input, Select, Form } from "antd";

export default function FormField({
    type = "text",
    label,
    name,
    placeholder,
    rules = [],
    options = [],
    required = false,
    className = "",
    onChange,
    maxLength,
    disabled,
    ...restProps
}) {
    const sanitizeDigits = (value = "") => String(value).replace(/[^0-9]/g, "");

    const baseInputProps = { placeholder, maxLength, disabled, ...restProps };

    const handleChangeFactory = (externalOnChange) => (e) => {
        const raw = e && e.target ? e.target.value : e;
        const sanitized = sanitizeDigits(raw);
        if (externalOnChange) {
            try { externalOnChange({ target: { value: sanitized } }); }
            catch { externalOnChange(sanitized); }
        }
    };

    const handleKeyDownDigits = (e) => {
        const allowedKeys = ["Backspace", "Delete", "Tab", "Escape", "Enter", "Home", "End", "ArrowLeft", "ArrowRight"];
        if (e.ctrlKey || e.metaKey) return;
        if (allowedKeys.includes(e.key)) return;
        if (!/^[0-9]$/.test(e.key)) e.preventDefault();
    };

    const inputClassName = `
        !h-10 !px-3 !py-2
        !rounded-lg
        !bg-neutral-subtle
        !border !border-base-custom
        !shadow-sm
        !text-sm !font-creato
        !text-base-lightest-custom
        placeholder-base-lightest-custom
    `;

    return (
        <Form.Item
            name={name}
            label={
                label && (
                    <span className="text-base-custom text-sm font-creato leading-4">
                        {label}
                    </span>
                )
            }
            rules={rules}
            required={required}
            className={`!mb-3 ${className}`}
            style={{ width: "100%" }}
            colon={false}
            labelCol={{ style: { paddingBottom: "2px", marginBottom: "0px", lineHeight: "1" } }}
        >
            {type === "password" ? (
                <Input.Password
                    {...baseInputProps}
                    onChange={onChange}
                    className={inputClassName}
                    style={{ width: "100%" }}
                />
            ) : type === "dropdown" ? (
                <Select
                    placeholder={placeholder}
                    options={options}
                    onChange={onChange}
                    disabled={disabled}
                    {...restProps}
                    className={`!h-10 !rounded-lg !border-base-custom !shadow-sm !font-creato !text-sm !text-base-lightest-custom`}
                    style={{ width: "100%" }}
                />
            ) : type === "numeric" ? (
                <Input
                    {...baseInputProps}
                    inputMode="numeric"
                    onChange={handleChangeFactory(onChange)}
                    onKeyDown={handleKeyDownDigits}
                    className={inputClassName}
                    style={{ width: "100%" }}
                />
            ) : type === "otp" ? (
                <Input
                    {...baseInputProps}
                    inputMode="numeric"
                    onChange={handleChangeFactory(onChange)}
                    onKeyDown={handleKeyDownDigits}
                    maxLength={maxLength ?? 6}
                    className={`${inputClassName} !text-center`}
                    style={{ width: "100%" }}
                />
            ) : (
                <Input
                    {...baseInputProps}
                    onChange={onChange}
                    className={inputClassName}
                    style={{ width: "100%" }}
                />
            )}
        </Form.Item>
    );
}