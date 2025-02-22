import React, { useState, useEffect } from 'react';
import { useTypewriter } from 'react-simple-typewriter';
import Image from 'next/image';

const AlumniSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageFading, setIsImageFading] = useState(false);

  // Sample alumni images - replace with your actual images
  const alumniImages = [
    '/alumni/alumni1.jpg',
    '/alumni/alumni2.jpg',
    '/alumni/alumni3.jpg',
    '/alumni/alumni1.jpg'
  ];

  // Typewriter text
  const [text] = useTypewriter({
    words: [
      'Inspiring Success Stories',
      'Global Leaders',
      'Industry Innovators',
      'Change Makers'
    ],
    loop: true,
    delaySpeed: 2000,
    typeSpeed: 70,
    deleteSpeed: 50
  });

  // Image carousel effect
  useEffect(() => {
    const timer = setInterval(() => {
      setIsImageFading(true);
      setTimeout(() => {
        setCurrentImageIndex((prev) => 
          prev === alumniImages.length - 1 ? 0 : prev + 1
        );
        setIsImageFading(false);
      }, 500);
    }, 3000);

    return () => clearInterval(timer);
  }, [alumniImages.length]); // Added alumniImages.length as dependency

  return (
    <div className="w-full py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left Column - Content */}
          <div className="w-full lg:w-1/2 space-y-6">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Our Alumni Network
            </h2>
            
            <div className="h-16 flex items-center">
              <span className="text-2xl text-blue-600 font-semibold">
                {text}
              </span>
              <span className="text-2xl text-blue-600 animate-blink">|</span>
            </div>

            <div className="relative">
              <div className="absolute left-0 w-2 h-full bg-blue-500 rounded"></div>
              <div className="ml-6">
                <p className="text-gray-600 leading-relaxed">
                  Our alumni are making waves across the globe, leading innovation
                  and creating positive impact in various industries. With a network
                  spanning over 50 countries, our graduates continue to push
                  boundaries and achieve remarkable success.
                </p>
                <p className="text-gray-600 leading-relaxed mt-4">
                  Join our prestigious network of professionals who are shaping the
                  future of technology, business, and society. Our alumni community
                  provides mentorship, networking opportunities, and lifelong
                  learning resources.
                </p>
              </div>
            </div>

            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg 
              hover:bg-blue-700 transition duration-300">
              Connect with Alumni
            </button>
          </div>

          {/* Right Column - Image Carousel */}
          <div className="w-full lg:w-1/2">
            <div className="relative h-[500px] w-full rounded-lg overflow-hidden">
              <div className={`transition-opacity duration-500 h-full 
                ${isImageFading ? 'opacity-0' : 'opacity-100'}`}>
                <Image
                  src={alumniImages[currentImageIndex]}
                  alt={`Alumni ${currentImageIndex + 1}`}
                  fill
                  priority={currentImageIndex === 0}
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              
              {/* Image Navigation Dots */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {alumniImages.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 
                      ${currentImageIndex === index ? 'bg-white w-4' : 'bg-white/50'}`}
                    onClick={() => setCurrentImageIndex(index)}
                    aria-label={`View alumni image ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlumniSection;