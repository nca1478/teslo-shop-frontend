import { titleFont } from "@/config/fonts/fonts";
import { ResetPasswordForm } from "./ui/ResetPasswordForm";

interface Props {
    searchParams: Promise<{ email?: string; otp?: string }>;
}

export default async function ResetPasswordPage({ searchParams }: Props) {
    const { email, otp } = await searchParams;

    if (!email || !otp) {
        return (
            <div className="flex flex-col justify-center min-h-screen py-8 px-4 sm:px-0">
                <div className="w-full max-w-sm mx-auto sm:mx-0">
                    <h1
                        className={`${titleFont.className} text-2xl sm:text-3xl md:text-4xl mb-4 sm:mb-6 text-center sm:text-left`}
                    >
                        Enlace inválido
                    </h1>
                    <p className="text-gray-600 text-sm mb-6 text-center sm:text-left">
                        No se han proporcionado los datos necesarios. Por favor, solicita un nuevo código.
                    </p>
                    <a
                        href="/auth/forgot-password"
                        className="btn-secondary text-center block py-2.5 text-sm touch-target"
                    >
                        Solicitar nuevo código
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col justify-center min-h-screen py-8 px-4 sm:px-0">
            <div className="w-full max-w-sm mx-auto sm:mx-0">
                <h1
                    className={`${titleFont.className} text-2xl sm:text-3xl md:text-4xl mb-4 sm:mb-6 text-center sm:text-left`}
                >
                    Nueva contraseña
                </h1>

                <p className="text-gray-600 text-sm mb-6 text-center sm:text-left">
                    Ingresa tu nueva contraseña para <strong>{email}</strong>
                </p>

                <ResetPasswordForm email={email} otp={otp} />
            </div>
        </div>
    );
}
