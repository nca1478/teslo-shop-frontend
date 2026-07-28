'use server';

import { authService } from '@/lib/services';

export async function verifyOtpAction(
    email: string,
    otp: string,
): Promise<{ verified: boolean; message?: string }> {
    try {
        return await authService.verifyOtp(email, otp);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Código inválido o expirado';
        return { verified: false, message };
    }
}
