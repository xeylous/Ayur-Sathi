"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const images = [
  { src: "/Image_1.jpeg", alt: "image" },
  { src: "/Image_2.jpeg", alt: "image" },
  { src: "/Image_3.jpeg", alt: "image" },
  { src: "/Image_4.jpeg", alt: "image" },
  { src: "/Image_5.jpeg", alt: "image" },
  { src: "/Image_6.jpeg", alt: "image" },
  { src: "/Image_7.jpeg", alt: "image" },
  // { src: "/Image_8.jpeg", alt: "image" },
  
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
            className="object-cover rounded-xl"
            priority={index === 0}
          />
        </div>
      ))}
    </div>
  );
}
