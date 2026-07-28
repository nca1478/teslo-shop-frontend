'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { resetPasswordAction } from '@/actions/auth/reset-password';

interface ResetPasswordFormData {
    password: string;
    confirmPassword: string;
}

export const useResetPasswordForm = (email: string, otp: string) => {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<ResetPasswordFormData>({
        mode: 'onBlur',
    });

    const onSubmit = async (data: ResetPasswordFormData) => {
        setIsLoading(true);
        setErrorMessage(null);

        try {
            const result = await resetPasswordAction(email, otp, data.password);
            if (result.ok) {
                setIsSuccess(true);
            } else {
                setErrorMessage(result.message || 'Error al restablecer la contraseña');
            }
        } catch {
            setErrorMessage('Error al restablecer la contraseña');
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
        watch,
    };
};
