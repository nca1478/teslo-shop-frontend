"use client";

import clsx from "clsx";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/contexts/AuthContext";
import { Address, Country } from "@/interfaces";
import { useAddressStore } from "@/store";
import { deleteUserAddress, setUserAddress } from "@/actions";
import { useRouter } from "next/navigation";

type FormInputs = {
    firstName: string;
    lastName: string;
    address: string;
    address2?: string;
    postalCode: string;
    city: string;
    country: string;
    phone: string;
    rememberAddress: boolean;
};

interface Props {
    countries: Country[];
    userStoredAddress?: Partial<Address>;
}

export const AddressForm = ({ countries, userStoredAddress = {} }: Props) => {
    const {
        handleSubmit,
        register,
        formState: { isValid },
        reset,
    } = useForm<FormInputs>({
        defaultValues: {
            //Leer de la base de datos
            ...userStoredAddress,
            rememberAddress: false,
        },
    });

    const setAddress = useAddressStore((state) => state.setAddress);
    const address = useAddressStore((state) => state.address);
    const router = useRouter();

    // obtener datos del usuario
    const { user } = useAuth();

    const onSubmit = async (data: FormInputs) => {
        const { rememberAddress, ...restAddress } = data;

        setAddress(restAddress); // guarda en el store

        if (rememberAddress && user) {
            await setUserAddress(restAddress); // guardar en la db
        } else if (user) {
            await deleteUserAddress(); // eliminar de la db
        }

        router.push("/checkout"); // si sale bien, abre el page checkout
    };

    useEffect(() => {
        if (address.firstName) {
            reset(address);
        }
    }, [reset, address]);

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Información personal */}
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Información personal
                            </h3>

                            <div className="space-y-4">
                                {/* Nombres */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nombres *
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="Ingresa tu nombre"
                                        {...register("firstName", { required: true })}
                                    />
                                </div>

                                {/* Apellidos */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Apellidos *
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="Ingresa tus apellidos"
                                        {...register("lastName", { required: true })}
                                    />
                                </div>

                                {/* Teléfono */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Teléfono *
                                    </label>
                                    <input
                                        type="tel"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="Ej: +507 6123-4567"
                                        {...register("phone", { required: true })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Información de dirección */}
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Dirección de entrega
                            </h3>

                            <div className="space-y-4">
                                {/* Dirección principal */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Dirección *
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="Calle, número, colonia"
                                        {...register("address", { required: true })}
                                    />
                                </div>

                                {/* Dirección 2 */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Dirección 2 (opcional)
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="Apartamento, suite, edificio"
                                        {...register("address2")}
                                    />
                                </div>

                                {/* Ciudad y Código Postal */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Ciudad *
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            placeholder="Tu ciudad"
                                            {...register("city", { required: true })}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Código postal *
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            placeholder="12345"
                                            {...register("postalCode", { required: true })}
                                        />
                                    </div>
                                </div>

                                {/* País */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        País *
                                    </label>
                                    <select
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                                        {...register("country", { required: true })}
                                    >
                                        <option value="">Selecciona un país</option>
                                        {countries.map((country) => (
                                            <option key={country.id} value={country.id}>
                                                {country.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Opciones adicionales y botón */}
                <div className="border-t border-gray-200 pt-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        {/* Checkbox recordar dirección */}
                        <div className="flex items-center">
                            <div className="relative flex items-center">
                                <input
                                    type="checkbox"
                                    id="rememberAddress"
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                    {...register("rememberAddress")}
                                />
                                <label
                                    htmlFor="rememberAddress"
                                    className="ml-3 text-sm font-medium text-gray-700 cursor-pointer"
                                >
                                    Recordar esta dirección para futuros pedidos
                                </label>
                            </div>
                        </div>

                        {/* Botón continuar */}
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className={clsx(
                                    "px-8 py-3 rounded-lg font-medium transition-all duration-200 min-w-[160px]",
                                    {
                                        "bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 active:scale-95 shadow-sm":
                                            isValid,
                                        "bg-gray-300 text-gray-500 cursor-not-allowed": !isValid,
                                    }
                                )}
                                disabled={!isValid}
                            >
                                Continuar al pago
                            </button>
                        </div>
                    </div>

                    {/* Información adicional */}
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-start">
                            <div className="shrink-0">
                                <svg
                                    className="h-5 w-5 text-blue-600 mt-0.5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h4 className="text-sm font-medium text-blue-800">
                                    Información de envío
                                </h4>
                                <div className="mt-1 text-sm text-blue-700">
                                    <p>• Envío gratuito en pedidos superiores a $50</p>
                                    <p>• Tiempo de entrega: 3-5 días hábiles</p>
                                    <p>• Recibirás un código de seguimiento por email</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};
