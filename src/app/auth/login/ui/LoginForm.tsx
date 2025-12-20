"use client";

import { useState, useEffect } from "react";
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
        clearErrors,
    } = useForm<FormInputs>();

    // Efecto para mostrar errores de validación en el área centralizada
    useEffect(() => {
        if (errors.email) {
            setErrorMessage(errors.email.message || "Error en el email");
        } else if (errors.password) {
            setErrorMessage(errors.password.message || "Error en la contraseña");
        } else {
            // Solo limpiar si no hay errores de validación y no hay error de servidor
            if (
                !errorMessage.includes("Credenciales") &&
                !errorMessage.includes("servidor") &&
                !errorMessage.includes("activo")
            ) {
                setErrorMessage("");
            }
        }
    }, [errors.email, errors.password]);

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

    const handleInputChange = () => {
        // Limpiar errores cuando el usuario empiece a escribir
        if (
            errorMessage &&
            (errorMessage.includes("email") || errorMessage.includes("contraseña"))
        ) {
            setErrorMessage("");
            clearErrors();
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-3 sm:space-y-4">
            {/* Email Field */}
            <div className="flex flex-col">
                <label htmlFor="email" className="text-sm font-medium text-gray-700 mb-1.5">
                    Correo electrónico
                </label>
                <input
                    id="email"
                    className={clsx(
                        "px-3 py-2.5 sm:px-4 sm:py-3 border bg-gray-200 rounded-lg transition-colors duration-200 text-sm touch-target",
                        {
                            "border-red-500 focus:border-red-500 focus:ring-red-200": errors.email,
                            "border-gray-300 focus:border-blue-500 focus:ring-blue-200":
                                !errors.email,
                        }
                    )}
                    type="email"
                    placeholder="tu@email.com"
                    {...register("email", {
                        required: "El email es requerido",
                        pattern: {
                            value: /^\S+@\S+$/i,
                            message: "Formato de email inválido",
                        },
                        onChange: handleInputChange,
                    })}
                />
            </div>

            {/* Password Field */}
            <div className="flex flex-col">
                <label htmlFor="password" className="text-sm font-medium text-gray-700 mb-1.5">
                    Contraseña
                </label>
                <input
                    id="password"
                    className={clsx(
                        "px-3 py-2.5 sm:px-4 sm:py-3 border bg-gray-200 rounded-lg transition-colors duration-200 text-sm touch-target",
                        {
                            "border-red-500 focus:border-red-500 focus:ring-red-200":
                                errors.password,
                            "border-gray-300 focus:border-blue-500 focus:ring-blue-200":
                                !errors.password,
                        }
                    )}
                    type="password"
                    placeholder="••••••••"
                    {...register("password", {
                        required: "La contraseña es requerida",
                        minLength: {
                            value: 6,
                            message: "Debe tener al menos 6 caracteres",
                        },
                        onChange: handleInputChange,
                    })}
                />
            </div>

            {/* Error Message Area */}
            {errorMessage && (
                <div className="flex items-center space-x-2 bg-red-50 border border-red-200 rounded-lg p-2.5 w-full">
                    <IoInformationOutline className="h-4 w-4 text-red-500 shrink-0" />
                    <p className="text-xs text-red-600">{errorMessage}</p>
                </div>
            )}

            {/* Login Button */}
            <button
                type="submit"
                className={clsx(
                    "w-full py-2.5 text-sm font-medium rounded-lg transition-all duration-200 touch-target mt-4",
                    {
                        "btn-primary": !isLoading,
                        "btn-disabled": isLoading,
                    }
                )}
                disabled={isLoading}
            >
                {isLoading ? "Ingresando..." : "Ingresar"}
            </button>

            {/* Divider */}
            <div className="flex items-center my-4">
                <div className="flex-1 border-t border-gray-300"></div>
                <div className="px-3 text-gray-600 text-sm">O</div>
                <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Secondary Actions */}
            <div className="flex flex-col space-y-2">
                <Link
                    href="/auth/new-account"
                    className="btn-secondary text-center py-2.5 text-sm touch-target"
                >
                    Crear una nueva cuenta
                </Link>

                <Link href="/" className="btn-secondary text-center py-2.5 text-sm touch-target">
                    ← Volver al inicio
                </Link>
            </div>
        </form>
    );
};
