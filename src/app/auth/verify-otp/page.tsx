import { titleFont } from "@/config/fonts/fonts";
import { VerifyOtpForm } from "./ui/VerifyOtpForm";

interface Props {
    searchParams: Promise<{ email?: string }>;
}

export default async function VerifyOtpPage({ searchParams }: Props) {
    const { email } = await searchParams;

    if (!email) {
        return (
            <div className="flex flex-col justify-center min-h-screen py-8 px-4 sm:px-0">
                <div className="w-full max-w-sm mx-auto sm:mx-0">
                    <h1
                        className={`${titleFont.className} text-2xl sm:text-3xl md:text-4xl mb-4 sm:mb-6 text-center sm:text-left`}
                    >
                        Enlace inválido
                    </h1>
                    <p className="text-gray-600 text-sm mb-6 text-center sm:text-left">
                        No se ha proporcionado un correo electrónico. Por favor, solicita un nuevo código.
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
                    Verifica tu código
                </h1>

                <p className="text-gray-600 text-sm mb-6 text-center sm:text-left">
                    Hemos enviado un código de 6 dígitos a <strong>{email}</strong>
                </p>

                <VerifyOtpForm email={email} />
            </div>
        </div>
    );
}
