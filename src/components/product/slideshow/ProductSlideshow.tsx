"use client";

import { useState } from "react";
import { Swiper as SwiperObject } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode, Navigation, Pagination, Thumbs } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import "./slideshow.css";
import { ProductImage } from "../product-image/ProductImage";

interface Props {
    images: string[];
    title: string;
    className?: string;
}

export const ProductSlideshow = ({ images, title, className }: Props) => {
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperObject>();

    // Si no hay imágenes, usar placeholder
    const displayImages = images.length > 0 ? images : ["placeholder.png"];

    return (
        <div className={className}>
            <div className="rounded-lg overflow-hidden mb-4">
                <Swiper
                    // Estilos de las flechas
                    // style={
                    //     {
                    //         "--swiper-navigation-color": "#fff",
                    //         "--swiper-pagination-color": "#fff",
                    //     } as React.CSSProperties
                    // }
                    spaceBetween={10}
                    pagination={true}
                    navigation={true}
                    autoplay={{
                        delay: 2500,
                    }}
                    thumbs={{
                        swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
                    }}
                    modules={[FreeMode, Navigation, Thumbs, Autoplay, Pagination]}
                    className="mySwiper2"
                >
                    {displayImages.map((image, index) => (
                        <SwiperSlide key={index}>
                            <ProductImage
                                src={image}
                                alt={title}
                                width={1024}
                                height={800}
                                className="w-full h-full object-cover"
                                priority={index === 0}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            <div className="rounded-lg overflow-hidden">
                <Swiper
                    onSwiper={setThumbsSwiper}
                    spaceBetween={10}
                    slidesPerView={4}
                    freeMode={true}
                    watchSlidesProgress={true}
                    modules={[FreeMode, Navigation, Thumbs]}
                    className="mySwiper"
                >
                    {displayImages.map((image, index) => (
                        <SwiperSlide key={index}>
                            <ProductImage
                                src={image}
                                alt={title}
                                width={300}
                                height={300}
                                className="rounded-lg object-cover w-full h-full cursor-pointer hover:opacity-80 transition-opacity"
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
};
