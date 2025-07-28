"use client";

import { useEffect, useState } from "react";
import { getStockBySlug } from "@/actions";
import { titleFont } from "@/config/fonts";

interface Props {
    slug: string;
}

export const StockLabel = ({ slug }: Props) => {
    const [stock, setStock] = useState(0);

    const getStock = async () => {
        const inStock = await getStockBySlug(slug);
        setStock(inStock);
    };

    useEffect(() => {
        getStock();
    }, [getStock]);

    return (
        <h1 className={`${titleFont.className} antialiased font-bold text-xl`}>
            En Stock: {stock} Und.
        </h1>
    );
};
