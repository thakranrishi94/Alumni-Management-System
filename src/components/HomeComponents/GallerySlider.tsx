import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

const GallerySlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = [
    '/alumni/alumni1.jpg',
    '/alumni/alumni2.jpg',
    '/alumni/alumni3.jpg',
    '/alumni/alumni1.jpg'
  ];

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, [images.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    const timer = setInterval(goToNext, 5000);
    return () => clearInterval(timer);
  }, [goToNext]);

  return (
    <div className="w-full flex flex-col items-center py-10 bg-gray-100">
      <h2 className="text-3xl font-semibold mb-6">Alumni&apos;s Gallery</h2>
      <div className="relative w-full max-w-4xl flex items-center">
        <button
          onClick={goToPrev}
          className="absolute left-2 md:left-4 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-200"
          aria-label="Previous image"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="flex w-full justify-center items-center overflow-hidden">
          <div className="relative flex w-full max-w-3xl h-72 md:h-96">
            {images.map((image, index) => (
              <div
                key={index}
                className={`absolute w-full h-full transition-all duration-500 rounded-lg shadow-lg overflow-hidden flex justify-center items-center
                  ${index === currentIndex ? 'z-20 opacity-100 scale-100' : 'z-10 opacity-50 scale-90'}
                  ${index === (currentIndex - 1 + images.length) % images.length ? '-translate-x-3/4' : ''}
                  ${index === (currentIndex + 1) % images.length ? 'translate-x-3/4' : ''}`}
              >
                <div className="relative w-full h-full">
                  <Image 
                    src={image} 
                    alt={`Gallery image ${index + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover rounded-lg"
                    priority={index === currentIndex}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={goToNext}
          className="absolute right-2 md:right-4 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-200"
          aria-label="Next image"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default GallerySlider;