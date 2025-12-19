"use client";

import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser } from "@/actions";
import { useAuth } from "@/contexts/AuthContext";

type FormInputs = {
    fullName: string;
    email: string;
    password: string;
};

export const RegisterForm = () => {
    const router = useRouter();
    const { refreshUser } = useAuth();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormInputs>();

    const [errorMessage, setErrorMessage] = useState("");

    const onSubmit: SubmitHandler<FormInputs> = async (data) => {
        setErrorMessage("");

        const { fullName, email, password } = data;

        // Server action
        const resp = await registerUser(fullName, email, password);

        if (!resp.ok) {
            setErrorMessage(resp.message);
            return;
        }

        // Refrescar el contexto de autenticación
        refreshUser()
            .then(() => {
                router.replace("/");
            })
            .catch(() => {
                // Fallback: recargar la página si hay error
                window.location.replace("/");
            });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
            <label htmlFor="name">Nombre completo</label>
            <input
                className={clsx("px-5 py-2 border bg-gray-200 rounded mb-5", {
                    "border-red-500": errors.fullName,
                })}
                type="text"
                autoFocus
                {...register("fullName", { required: true })}
            />

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

            {/* Errores */}
            <span className="text-red-500 mb-4">{errorMessage}</span>

            <button className="btn-primary">Crear cuenta</button>

            {/* divisor line */}
            <div className="flex items-center my-5">
                <div className="flex-1 border-t border-gray-500"></div>
                <div className="px-2 text-gray-800">O</div>
                <div className="flex-1 border-t border-gray-500"></div>
            </div>

            <Link href="/auth/login" className="btn-secondary text-center">
                Ingresar
            </Link>
        </form>
    );
};
