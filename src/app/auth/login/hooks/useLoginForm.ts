import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { authService } from "@/lib/services";

type FormInputs = {
    email: string;
    password: string;
};

export const useLoginForm = () => {
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
    }, [errors.email, errors.password, errorMessage]);

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

    return {
        // Form state
        register,
        handleSubmit,
        errors,
        errorMessage,
        isLoading,

        // Form handlers
        onSubmit,
        handleInputChange,
    };
};
