import { titleFont } from "@/config/fonts/fonts";
import { RegisterForm } from "./ui/RegisterForm";

export default function NewAccountPage() {
    return (
        <div className="flex flex-col justify-center min-h-screen py-8 px-4 sm:px-0">
            <div className="w-full max-w-sm mx-auto sm:mx-0">
                <h1
                    className={`${titleFont.className} text-2xl sm:text-3xl md:text-4xl mb-4 sm:mb-6 text-center sm:text-left cursor-pointer`}
                >
                    Nueva cuenta
                </h1>

                <RegisterForm />
            </div>
        </div>
    );
}
