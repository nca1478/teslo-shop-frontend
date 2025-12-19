import { titleFont } from "@/config/fonts/fonts";

interface Props {
    title: string;
    subtitle?: string;
    className?: string;
    size?: "sm" | "md" | "lg" | "xl";
}

export const Title = ({ title, subtitle, className, size = "lg" }: Props) => {
    const sizeClasses = {
        sm: {
            title: "text-xl sm:text-2xl",
            subtitle: "text-sm sm:text-base",
        },
        md: {
            title: "text-2xl sm:text-3xl",
            subtitle: "text-base sm:text-lg",
        },
        lg: {
            title: "text-3xl sm:text-4xl lg:text-5xl",
            subtitle: "text-lg sm:text-xl",
        },
        xl: {
            title: "text-4xl sm:text-5xl lg:text-6xl",
            subtitle: "text-xl sm:text-2xl",
        },
    };

    const currentSize = sizeClasses[size];

    return (
        <div className={`space-y-2 sm:space-y-4 ${className}`}>
            <h1
                className={`
                ${titleFont.className} 
                antialiased font-semibold 
                text-gray-900 
                leading-tight
                ${currentSize.title}
            `}
            >
                {title}
            </h1>

            {subtitle && (
                <p
                    className={`
                    text-gray-600 
                    leading-relaxed
                    ${currentSize.subtitle}
                `}
                >
                    {subtitle}
                </p>
            )}
        </div>
    );
};
