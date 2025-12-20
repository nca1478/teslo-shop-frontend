import clsx from "clsx";
import type { Size } from "@/interfaces";

interface Props {
    selectedSize?: Size;
    availableSizes: Size[]; // ['SX', 'M', 'XL', 'XXL']
    onSizeChanged: (size: Size) => void;
    disabled?: boolean;
}

export const SizeSelector = ({
    selectedSize,
    availableSizes,
    onSizeChanged,
    disabled = false,
}: Props) => {
    return (
        <div className="space-y-3">
            <h3 className={`font-semibold text-gray-900 ${disabled ? "text-gray-400" : ""}`}>
                Tallas disponibles
            </h3>

            <div className="flex flex-wrap gap-2">
                {availableSizes.map((size) => (
                    <button
                        key={size}
                        onClick={() => !disabled && onSizeChanged(size)}
                        disabled={disabled}
                        className={clsx(
                            "px-4 py-2 border-2 rounded-lg font-medium transition-all duration-200 min-w-12",
                            {
                                // Estado seleccionado
                                "bg-blue-500 text-white border-blue-500":
                                    size === selectedSize && !disabled,
                                // Estado normal
                                "bg-white text-gray-700 border-gray-300 hover:border-blue-300 hover:scale-105":
                                    size !== selectedSize && !disabled,
                                // Estado deshabilitado
                                "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed":
                                    disabled,
                            }
                        )}
                        title={disabled ? "No disponible" : `Seleccionar talla ${size}`}
                    >
                        {size}
                    </button>
                ))}
            </div>

            {disabled && (
                <p className="text-xs text-gray-500">
                    Las tallas no están disponibles para este producto
                </p>
            )}
        </div>
    );
};
