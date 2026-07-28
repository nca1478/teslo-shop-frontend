"use client";

import clsx from "clsx";
import Link from "next/link";
import { IoInformationOutline } from "react-icons/io5";
import { useVerifyOtpForm } from "../hooks/useVerifyOtpForm";

interface Props {
    email: string;
}

export const VerifyOtpForm = ({ email }: Props) => {
    const {
        otp,
        setOtp,
        errorMessage,
        isLoading,
        onSubmit,
        handleResend,
        isResending,
        inputRefs,
    } = useVerifyOtpForm(email);

    const handleChange = (index: number, value: string) => {
        if (value && !/^\d$/.test(value)) return;

        const newOtp = otp.split("");
        newOtp[index] = value;
        const joined = newOtp.join("").slice(0, 6);
        setOtp(joined);

        if (value && index < 5 && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        setOtp(pasted);
        const lastIndex = Math.min(pasted.length, 5);
        if (inputRefs.current[lastIndex]) {
            inputRefs.current[lastIndex]?.focus();
        }
    };

    return (
        <div className="flex flex-col space-y-3 sm:space-y-4">
            <div className="grid grid-cols-6 gap-1 sm:gap-2 w-full">
                {Array.from({ length: 6 }).map((_, index) => (
                    <input
                        key={index}
                        ref={(el) => {
                            if (el) inputRefs.current[index] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={otp[index] || ""}
                        onChange={(e) => handleChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={handlePaste}
                        className={clsx(
                            "w-full h-12 sm:h-14 text-center text-lg font-bold border-2 rounded-lg transition-colors duration-200",
                            {
                                "border-blue-500 ring-2 ring-blue-200": otp[index],
                                "border-gray-300": !otp[index],
                            }
                        )}
                    />
                ))}
            </div>

            {errorMessage && (
                <div className="flex items-center space-x-2 bg-red-50 border border-red-200 rounded-lg p-2.5 w-full">
                    <IoInformationOutline className="h-4 w-4 text-red-500 shrink-0" />
                    <p className="text-xs text-red-600">{errorMessage}</p>
                </div>
            )}

            <button
                type="button"
                onClick={onSubmit}
                className={clsx(
                    "w-full py-2.5 text-sm font-medium rounded-lg transition-all duration-200 touch-target mt-4 cursor-pointer",
                    {
                        "btn-primary": !isLoading && otp.length === 6,
                        "btn-disabled": isLoading || otp.length !== 6,
                    }
                )}
                disabled={isLoading || otp.length !== 6}
            >
                {isLoading ? "Verificando..." : "Verificar"}
            </button>

            <div className="flex flex-col space-y-2 mt-2">
                <button
                    type="button"
                    onClick={handleResend}
                    disabled={isResending}
                    className={clsx("btn-secondary text-center py-2.5 text-sm touch-target cursor-pointer", {
                        "opacity-50 cursor-not-allowed": isResending,
                    })}
                >
                    {isResending ? "Reenviando..." : "Reenviar código"}
                </button>

                <Link
                    href="/auth/forgot-password"
                    className="btn-secondary text-center py-2.5 text-sm touch-target"
                >
                    ← Cambiar email
                </Link>
            </div>
        </div>
    );
};
