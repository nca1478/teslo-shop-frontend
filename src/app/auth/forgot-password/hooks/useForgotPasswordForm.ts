'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { requestOtpAction } from '@/actions/auth/request-otp';

interface ForgotPasswordFormData {
    email: string;
}

export const useForgotPasswordForm = () => {
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<ForgotPasswordFormData>({
        mode: 'onBlur',
    });

    const onSubmit = async (data: ForgotPasswordFormData) => {
        setIsLoading(true);
        setErrorMessage(null);

        try {
            const result = await requestOtpAction(data.email);
            if (result.ok) {
                setIsSuccess(true);
                setTimeout(() => {
                    router.push(`/auth/verify-otp?email=${encodeURIComponent(data.email)}`);
                }, 1500);
            } else {
                setErrorMessage(result.message || 'Error al enviar el código');
            }
        } catch {
            setErrorMessage('Error al enviar el código');
        } finally {
            setIsLoading(false);
        }
    };

    return {
        register,
        handleSubmit,
        errors,
        errorMessage,
        isLoading,
        isSuccess,
        onSubmit,
        email: watch('email'),
    };
};
