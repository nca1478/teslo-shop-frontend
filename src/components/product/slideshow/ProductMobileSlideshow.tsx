"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode, Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "./slideshow.css";
import { ProductImage } from "../product-image/ProductImage";

interface Props {
    images: string[];
    title: string;
    className?: string;
}

export const ProductMobileSlideshow = ({ images, title, className }: Props) => {
    // Si no hay imágenes, usar placeholder
    const displayImages = images.length > 0 ? images : ["placeholder.png"];

    return (
        <div className={className}>
            <Swiper
                style={{
                    width: "100%",
                    height: "400px",
                }}
                pagination={{
                    clickable: true,
                    dynamicBullets: true,
                }}
                navigation={false}
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                }}
                modules={[FreeMode, Autoplay, Pagination]}
                className="mySwiper2 rounded-lg overflow-hidden"
            >
                {displayImages.map((image, index) => (
                    <SwiperSlide key={index}>
                        <ProductImage
                            src={image}
                            alt={title}
                            width={600}
                            height={400}
                            className="w-full h-full object-cover"
                            priority={index === 0}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};
