import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { registerUser } from "@/actions";

type FormInputs = {
    name: string;
    email: string;
    password: string;
};

export const useRegisterForm = () => {
    const router = useRouter();
    const { refreshUser } = useAuth();
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
        if (errors.name) {
            setErrorMessage(errors.name.message || "El nombre es requerido");
        } else if (errors.email) {
            setErrorMessage(errors.email.message || "Error en el email");
        } else if (errors.password) {
            setErrorMessage(errors.password.message || "Error en la contraseña");
        } else {
            // Solo limpiar si no hay errores de validación y no hay error de servidor
            if (
                !errorMessage.includes("usuario") &&
                !errorMessage.includes("servidor") &&
                !errorMessage.includes("existe")
            ) {
                setErrorMessage("");
            }
        }
    }, [errors.name, errors.email, errors.password, errorMessage]);

    const onSubmit: SubmitHandler<FormInputs> = async (data) => {
        setErrorMessage("");
        setIsLoading(true);

        const { name, email, password } = data;

        try {
            // Server action
            const resp = await registerUser(name, email, password);

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
        } catch (error) {
            console.error("Register error:", error);
            setErrorMessage("Error del servidor. Intenta de nuevo");
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = () => {
        // Limpiar errores cuando el usuario empiece a escribir
        if (
            errorMessage &&
            (errorMessage.includes("nombre") ||
                errorMessage.includes("email") ||
                errorMessage.includes("contraseña"))
        ) {
            setErrorMessage("");
            clearErrors();
        }
    };

    return {
        register,
        handleSubmit,
        errors,
        errorMessage,
        isLoading,
        onSubmit,
        handleInputChange,
    };
};
