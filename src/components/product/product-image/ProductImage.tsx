import Image from "next/image";

interface Props {
    src?: string;
    alt: string;
    width: number;
    height: number;
    className?: React.StyleHTMLAttributes<HTMLImageElement>["className"];
    style?: React.StyleHTMLAttributes<HTMLImageElement>["style"];
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
}

export const ProductImage = ({
    src,
    alt,
    width,
    height,
    className,
    style,
    onMouseEnter,
    onMouseLeave,
}: Props) => {
    const localSrc = src
        ? src.startsWith("http")
            ? src
            : src === "placeholder.png"
            ? "/imgs/placeholder.png"
            : `/products/${src}`
        : "/imgs/placeholder.png";

    return (
        <Image
            src={localSrc}
            width={width}
            height={height}
            alt={alt}
            className={className}
            style={style}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        ></Image>
    );
};
