import { Link } from "react-router";

interface Props {
    subtitle?: string;
    handleClickLogo?: () => void;
}

export const CustomLogo = ({ subtitle = "Shop", handleClickLogo }: Props) => {
    return (
        <Link to="/" className="flex items-center whitespace-nowrap" onClick={handleClickLogo}>
            <span className="font-montserrat font-bold text-xl m-0 whitespace-nowrap">Teslo |</span>
            <p className="text-muted-foreground text-xl m-0 px-2 whitespace-nowrap">{subtitle}</p>
        </Link>
    );
};
