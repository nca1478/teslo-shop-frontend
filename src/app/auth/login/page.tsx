import { titleFont } from "@/config/fonts/fonts";
import { LoginForm } from "./ui/LoginForm";

export default function LoginPage() {
    return (
        <div className="flex flex-col justify-center min-h-screen py-8 px-4 sm:px-0">
            <div className="w-full max-w-sm mx-auto sm:mx-0">
                <h1
                    className={`${titleFont.className} text-2xl sm:text-3xl md:text-4xl mb-4 sm:mb-6 text-center sm:text-left`}
                >
                    Ingresar
                </h1>

                <LoginForm />
            </div>
        </div>
    );
}
