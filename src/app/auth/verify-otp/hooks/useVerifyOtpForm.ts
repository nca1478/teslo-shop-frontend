'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { verifyOtpAction } from '@/actions/auth/verify-otp';
import { requestOtpAction } from '@/actions/auth/request-otp';

export const useVerifyOtpForm = (email: string) => {
    const router = useRouter();
    const [otp, setOtp] = useState('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const onSubmit = async () => {
        if (otp.length !== 6) return;
        setIsLoading(true);
        setErrorMessage(null);

        try {
            const result = await verifyOtpAction(email, otp);
            if (result.verified) {
                router.push(
                    `/auth/reset-password?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`,
                );
            } else {
                setErrorMessage(result.message || 'Código inválido o expirado');
                setOtp('');
                inputRefs.current[0]?.focus();
            }
        } catch {
            setErrorMessage('Error al verificar el código');
            setOtp('');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        setIsResending(true);
        try {
            await requestOtpAction(email);
            setErrorMessage(null);
            setOtp('');
            inputRefs.current[0]?.focus();
        } catch {
            setErrorMessage('Error al reenviar el código');
        } finally {
            setIsResending(false);
        }
    };

    return {
        otp,
        setOtp,
        errorMessage,
        isLoading,
        onSubmit,
        handleResend,
        isResending,
        inputRefs,
    };
};
