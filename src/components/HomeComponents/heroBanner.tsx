// components/Banner/Banner.tsx
"use client"
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface BannerImage {
    src: string;
    alt: string;
    title: string;
    description: string;
}

interface BannerProps {
    images: BannerImage[];
    autoSlideInterval?: number;
    className?: string;
}

const HeroBanner = ({ 
    images, 
    autoSlideInterval = 5000,
    className = "" 
}: BannerProps) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        if (autoSlideInterval <= 0) return;

        const timer = setInterval(() => {
            setCurrentSlide((prevSlide) => 
                prevSlide === images.length - 1 ? 0 : prevSlide + 1
            );
        }, autoSlideInterval);

        return () => clearInterval(timer);
    }, [autoSlideInterval, images.length]);

    const nextSlide = () => {
        setCurrentSlide((prevSlide) => 
            prevSlide === images.length - 1 ? 0 : prevSlide + 1
        );
    };

    const prevSlide = () => {
        setCurrentSlide((prevSlide) => 
            prevSlide === 0 ? images.length - 1 : prevSlide - 1
        );
    };

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
    };

    return (
        <div className={`relative w-full h-[300px] md:h-[500px] lg:h-[600px] overflow-hidden ${className}`}>
            {/* Main banner */}
            <div className="relative h-full w-full">
                {images.map((image, index) => (
                    <div
                        key={index}
                        className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ease-in-out
                            ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                    >
                        <Image
                            src={image.src}
                            alt={image.alt}
                            fill
                            priority={index === 0}
                            className="object-cover"
                        />
                        {/* Text overlay */}
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white px-4">
                            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-center mb-4">
                                {image.title}
                            </h1>
                            <p className="text-lg md:text-xl lg:text-2xl text-center">
                                {image.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation arrows */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
                aria-label="Previous slide"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
                aria-label="Next slide"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>

            {/* Dots navigation */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all
                            ${currentSlide === index ? 'bg-white' : 'bg-white/50'}`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default HeroBanner;