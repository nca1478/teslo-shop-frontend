'use server';

import { authService } from '@/lib/services';

export async function requestOtpAction(email: string): Promise<{ ok: boolean; message?: string }> {
    try {
        return await authService.requestOtp(email);
    } catch {
        return { ok: false, message: 'Error al enviar el código OTP' };
    }
}
