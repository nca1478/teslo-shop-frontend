import { titleFont } from "@/config/fonts/fonts";
import { ForgotPasswordForm } from "./ui/ForgotPasswordForm";

export default function ForgotPasswordPage() {
    return (
        <div className="flex flex-col justify-center min-h-screen py-8 px-4 sm:px-0">
            <div className="w-full max-w-sm mx-auto sm:mx-0">
                <h1
                    className={`${titleFont.className} text-2xl sm:text-3xl md:text-4xl mb-4 sm:mb-6 text-center sm:text-left`}
                >
                    ¿Olvidaste tu contraseña?
                </h1>

                <p className="text-gray-600 text-sm mb-6 text-center sm:text-left">
                    Ingresa tu correo electrónico y te enviaremos un código para restablecer tu contraseña.
                </p>

                <ForgotPasswordForm />
            </div>
        </div>
    );
}
