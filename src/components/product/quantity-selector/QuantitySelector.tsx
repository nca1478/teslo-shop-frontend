"use client";

import { IoAddCircleOutline, IoRemoveCircleOutline } from "react-icons/io5";

interface Props {
    quantity: number;
    onQuantityChanged: (value: number) => void;
    showLabel?: boolean;
    size?: "sm" | "md" | "lg";
}

export const QuantitySelector = ({
    quantity,
    onQuantityChanged,
    showLabel = true,
    size = "md",
}: Props) => {
    const onValueChanged = (value: number) => {
        if (quantity + value < 1) return;

        onQuantityChanged(quantity + value);
    };

    const sizeClasses = {
        sm: {
            button: "w-8 h-8",
            icon: 20,
            text: "text-sm",
            input: "w-12 h-8 text-sm",
        },
        md: {
            button: "w-10 h-10",
            icon: 24,
            text: "text-base",
            input: "w-16 h-10 text-base",
        },
        lg: {
            button: "w-12 h-12",
            icon: 28,
            text: "text-lg",
            input: "w-20 h-12 text-lg",
        },
    };

    const currentSize = sizeClasses[size];

    return (
        <div className="space-y-2">
            {showLabel && (
                <h3 className={`font-semibold text-gray-900 ${currentSize.text}`}>Cantidad</h3>
            )}

            <div className="flex items-center space-x-2">
                <button
                    onClick={() => onValueChanged(-1)}
                    disabled={quantity <= 1}
                    className={`
                        ${currentSize.button} 
                        flex items-center justify-center 
                        rounded-full 
                        transition-all duration-200 
                        ${
                            quantity <= 1
                                ? "text-gray-300 cursor-not-allowed"
                                : "text-gray-600 hover:text-red-600 hover:bg-red-50 active:scale-95"
                        }
                        touch-target
                    `}
                    aria-label="Disminuir cantidad"
                >
                    <IoRemoveCircleOutline size={currentSize.icon} />
                </button>

                <div
                    className={`
                    ${currentSize.input} 
                    flex items-center justify-center 
                    bg-gray-50 border border-gray-200 
                    rounded-lg font-medium text-gray-900
                    ${currentSize.text}
                `}
                >
                    {quantity}
                </div>

                <button
                    onClick={() => onValueChanged(+1)}
                    className={`
                        ${currentSize.button} 
                        flex items-center justify-center 
                        rounded-full 
                        text-gray-600 hover:text-blue-600 hover:bg-blue-50 
                        transition-all duration-200 active:scale-95
                        touch-target
                    `}
                    aria-label="Aumentar cantidad"
                >
                    <IoAddCircleOutline size={currentSize.icon} />
                </button>
            </div>
        </div>
    );
};
