'use server';

import { authService } from '@/lib/services';

export async function resetPasswordAction(email: string, otp: string, password: string): Promise<{ ok: boolean; message?: string }> {
    try {
        return await authService.resetPassword(email, otp, password);
    } catch {
        return { ok: false, message: 'Error al restablecer la contraseña' };
    }
}
