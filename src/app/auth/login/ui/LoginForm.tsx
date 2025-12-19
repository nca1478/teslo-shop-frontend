"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import clsx from "clsx";
import Link from "next/link";
import { IoInformationOutline } from "react-icons/io5";
import { authService } from "@/lib/services";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

type FormInputs = {
    email: string;
    password: string;
};

export const LoginForm = () => {
    const router = useRouter();
    const { login: loginContext } = useAuth();
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormInputs>();

    const onSubmit = async (data: FormInputs) => {
        setErrorMessage("");
        setIsLoading(true);

        try {
            const response = await authService.login({
                email: data.email,
                password: data.password,
            });

            // Guardar la sesión en el servidor
            await authService.saveSession({
                token: response.token,
                user: response.user,
            });

            // Actualizar el contexto inmediatamente
            loginContext(response.user);

            // Redirigir
            router.push("/");
        } catch (error) {
            console.error("Login error:", error);

            if (error instanceof Error) {
                if (error.message.includes("Invalid credentials")) {
                    setErrorMessage("Credenciales no son correctas");
                } else if (error.message.includes("not active")) {
                    setErrorMessage("Usuario no activo");
                } else {
                    setErrorMessage("Error del servidor. Intenta de nuevo");
                }
            } else {
                setErrorMessage("Error del servidor. Intenta de nuevo");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
            <label htmlFor="email">Correo electrónico</label>
            <input
                className={clsx("px-5 py-2 border bg-gray-200 rounded mb-5", {
                    "border-red-500": errors.email,
                })}
                type="email"
                {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
            />

            <label htmlFor="password">Contraseña</label>
            <input
                className={clsx("px-5 py-2 border bg-gray-200 rounded mb-5", {
                    "border-red-500": errors.password,
                })}
                type="password"
                {...register("password", { required: true, minLength: 6 })}
            />

            <div
                className="flex justify-center h-8 items-end space-x-1"
                aria-live="polite"
                aria-atomic="true"
            >
                {errorMessage && (
                    <div className="flex flex-row mb-2">
                        <IoInformationOutline className="h-5 w-5 text-red-500" />
                        <p className="text-sm text-red-500">{errorMessage}</p>
                    </div>
                )}
            </div>

            {/* Botón de Login */}
            <button
                type="submit"
                className={clsx({
                    "btn-primary": !isLoading,
                    "btn-disabled": isLoading,
                })}
                disabled={isLoading}
            >
                {isLoading ? "Ingresando..." : "Ingresar"}
            </button>

            {/* divisor line */}
            <div className="flex items-center my-5">
                <div className="flex-1 border-t border-gray-500"></div>
                <div className="px-2 text-gray-800">O</div>
                <div className="flex-1 border-t border-gray-500"></div>
            </div>

            <Link href="/auth/new-account" className="btn-secondary text-center">
                Crear una nueva cuenta
            </Link>

            <Link href="/" className="btn-secondary text-center mt-2">
                ← Volver al inicio
            </Link>
        </form>
    );
};
