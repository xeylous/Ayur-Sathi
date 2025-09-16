import { motion } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import React from "react";
import { Autoplay, EffectCards, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/effect-cards";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css";

const Cardswap = () => {
  const images = [
    { src: "/image-1.jpg", alt: "Illustrations by my fav AarzooAly" },
    { src: "/image-2.jpg", alt: "Illustrations by my fav AarzooAly" },
    { src: "/image-3.jpg", alt: "Illustrations by my fav AarzooAly" },
    { src: "/image-4.jpg", alt: "Illustrations by my fav AarzooAly" },
    { src: "/image-5.jpg", alt: "Illustrations by my fav AarzooAly" },
    { src: "/image-6.jpg", alt: "Illustrations by my fav AarzooAly" },
    { src: "/image-7.jpg", alt: "Illustrations by my fav AarzooAly" },
    { src: "/image-8.jpg", alt: "Illustrations by my fav AarzooAly" },
    { src: "/image-9.jpg", alt: "Illustrations by my fav AarzooAly" }
  ];

  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden bg-[#ECF39E]">
      <Carousel_002 images={images} loop autoplay />
    </div>
  );
};

export default Cardswap;

const Carousel_002 = ({
  images,
  className,
  showPagination = false,
  showNavigation = false,
  loop = true,
  autoplay = true,
  spaceBetween = 40,
}) => {
  const css = `
  .Carousal_002 {
    padding-bottom: 50px !important;
  }
  `;

  return (
    <motion.div
      initial={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 0.3, delay: 0.5 }}
      className={`relative w-full max-w-3xl ${className || ""}`}
    >
      <style>{css}</style>

      <Swiper
        spaceBetween={spaceBetween}
        autoplay={
          autoplay
            ? {
                delay: 1000, // 5 seconds
                disableOnInteraction: false,
              }
            : false
        }
        effect="cards"
        grabCursor={true}
        loop={loop}
        pagination={
          showPagination
            ? {
                clickable: true,
              }
            : false
        }
        navigation={
          showNavigation
            ? {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
              }
            : false
        }
        className="Carousal_002 h-[380px] w-[260px]"
        modules={[EffectCards, Autoplay, Pagination, Navigation]}
      >
        {images.map((image, index) => (
          <SwiperSlide key={index} className="rounded-3xl">
            <img
              className="h-full w-full object-cover"
              src={image.src}
              alt={image.alt}
            />
          </SwiperSlide>
        ))}

        {showNavigation && (
          <div>
            <div className="swiper-button-next after:hidden">
              <ChevronRightIcon className="h-6 w-6 text-white" />
            </div>
            <div className="swiper-button-prev after:hidden">
              <ChevronLeftIcon className="h-6 w-6 text-white" />
            </div>
          </div>
        )}
      </Swiper>
    </motion.div>
  );
};
