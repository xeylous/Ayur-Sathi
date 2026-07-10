"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const images = [
  { src: "/Image_1.jpeg", alt: "Ayurvedic herbs being harvested in a field" },
  { src: "/Image_2.jpeg", alt: "Traditional herbal medicine preparation" },
  { src: "/Image_3.jpeg", alt: "Quality testing of Ayurvedic herbs in a lab" },
  { src: "/Image_4.jpeg", alt: "Dried medicinal herbs ready for processing" },
  { src: "/Image_5.jpeg", alt: "Sustainable herb cultivation practices" },
  { src: "/Image_6.jpeg", alt: "Packaged Ayurvedic herbal products" },
  { src: "/Image_7.jpeg", alt: "Farmer collecting medicinal plants" },
];

export default function ImageSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto slide every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full aspect-square overflow-hidden rounded-xl">
      {images.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={img.src}
            alt={img.alt}
            fill
            quality={60}
            sizes="(max-width: 768px) 100vw, 
         (max-width: 1200px) 50vw, 
         33vw"
            className="object-cover rounded-xl"
            priority={index === 0}
            loading={index === 0 ? "eager" : "lazy"}
          />
        </div>
      ))}
    </div>
  );
}
