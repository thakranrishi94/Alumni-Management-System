"use client"
import React, { useState, useEffect } from 'react';
import Image from 'next/image'; // Import Next.js Image component

// Define TypeScript interfaces
interface AlumniType {
  id: number;
  name: string;
  year: number;
  field: string;
  image: string;
}

interface MasonryColumnProps {
  column: AlumniType[];
  colIndex: number;
}

export default function AlumniGallery() {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [columns, setColumns] = useState<number>(3);

  // Sample alumni data with placeholder images
  const alumni: AlumniType[] = [
    { id: 1, name: 'Sarah Johnson', year: 2021, field: 'Computer Science', image: '/gallery/gallery.jpg' },
    { id: 2, name: 'Michael Chen', year: 2022, field: 'Business', image: '/gallery/gallery.jpg' },
    { id: 3, name: 'Priya Patel', year: 2023, field: 'Engineering', image: '/gallery/gallery.jpg' },
    { id: 4, name: 'James Wilson', year: 2021, field: 'Medicine', image: '/gallery/gallery.jpg' },
    { id: 5, name: 'Emma Rodriguez', year: 2024, field: 'Arts', image: '/gallery/gallery.jpg' },
    { id: 6, name: 'David Kim', year: 2022, field: 'Engineering', image: '/gallery/gallery.jpg' },
    { id: 7, name: 'Olivia Taylor', year: 2023, field: 'Computer Science', image: '/gallery/gallery.jpg' },
    { id: 8, name: 'Robert Garcia', year: 2024, field: 'Business', image: '/gallery/gallery.jpg' },
    { id: 9, name: 'Robert Garcia', year: 2024, field: 'Business', image: '/gallery/gallery.jpg' }
  ];

  // Filter alumni based on activeFilter
  const filteredAlumni = activeFilter === 'all' 
    ? alumni 
    : alumni.filter(alum => alum.field === activeFilter);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setColumns(1);
      } else if (window.innerWidth < 1024) {
        setColumns(2);
      } else {
        setColumns(3);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const splitArrayIntoColumns = (arr: AlumniType[], cols: number): AlumniType[][] => {
    const result = Array.from({ length: cols }, () => [] as AlumniType[]);
    arr.forEach((item, i) => result[i % cols].push(item));
    return result;
  };

  const masonryColumns = splitArrayIntoColumns(filteredAlumni, columns);

  const MasonryColumn: React.FC<MasonryColumnProps> = ({ column, colIndex }) => (
    <div key={colIndex} className="flex flex-col space-y-6">
      {column.map(alum => (
        <div 
          key={alum.id} 
          className="group relative overflow-hidden rounded-lg shadow-md bg-white"
        >
          <div className="aspect-w-3 aspect-h-4 relative">
            <Image 
              src={alum.image} 
              alt={alum.name}
              width={300}
              height={400}
              className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-8 group-hover:translate-y-0 transition-transform duration-300">
              <h3 className="text-lg font-semibold">{alum.name}</h3>
              <p className="text-sm opacity-90">Class of {alum.year} | {alum.field}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      {/* <section className="relative h-96 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 to-purple-800 opacity-90"></div>
        <Image 
          src="/gallery/gallery.jpg" 
          alt="Campus aerial view"
          width={1920}
          height={1080}
          className="w-full h-full object-cover mix-blend-overlay"
        />
        <div className="relative h-full flex flex-col items-center justify-center text-white px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-center">Our Alumni</h1>
          <p className="text-xl md:text-2xl max-w-2xl text-center font-light">
            Celebrating the success stories of those who shaped our legacy
          </p>
        </div>
      </section> */}

      {/* Gallery Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Alumni Gallery</h2>
          <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
            A visual celebration of our diverse and talented graduate community
          </p>
          
          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center mb-12 gap-2">
            <button 
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              All Fields
            </button>
            {['Computer Science', 'Business', 'Engineering', 'Medicine', 'Arts'].map((field: string) => (
              <button 
                key={field}
                onClick={() => setActiveFilter(field)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === field ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                {field}
              </button>
            ))}
          </div>
          
          {/* Masonry Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {masonryColumns.map((column, colIndex) => (
              <MasonryColumn key={colIndex} column={column} colIndex={colIndex} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials with Parallax */}
      <section className="py-20 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-center bg-cover"
          style={{
            backgroundImage: "url('/api/placeholder/1920/1080')",
            backgroundAttachment: "fixed"
          }}
        ></div>
        <div className="absolute inset-0 bg-indigo-900/80"></div>

        <div className="relative container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-white mb-4">Alumni Voices</h2>
          <p className="text-gray-200 text-center mb-16 max-w-2xl mx-auto">
            Hear what our graduates have to say about their journey
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-lg p-8 shadow-lg transform transition-all duration-300 hover:-translate-y-2">
                <svg className="h-10 w-10 text-indigo-500 mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-gray-700 mb-6">
                  &quot;The education and connections I made during my time at the university were invaluable. The faculty&apos;s mentorship shaped my career path and gave me the confidence to pursue my dreams.&quot;
                </p>
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full overflow-hidden mr-4">
                    <Image
                      src={`/gallery/gallery.jpg`}
                      alt="Alumni testimonial"
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{alumni[i].name}</h4>
                    <p className="text-indigo-600 text-sm">{alumni[i].field}, Class of {alumni[i].year}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Class Year Timeline */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Alumni Through the Years</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Explore our graduates across different graduation years
          </p>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gray-200"></div>

            {[2021, 2022, 2023, 2024].map((year, idx) => (
              <div key={year} className={`relative z-10 flex items-center mb-12 ${idx % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                <div className={`w-full md:w-5/12 ${idx % 2 === 0 ? 'pr-8 md:text-right' : 'pl-8'}`}>
                  <div className="bg-gradient-to-br from-white to-gray-100 p-6 rounded-lg shadow-md border border-gray-200">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Class of {year}</h3>
                    <p className="text-gray-600 mb-4">
                      Our {year} graduates have gone on to work at leading companies and institutions around the world.
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {alumni.filter(a => a.year === year).map(alum => (
                        <div key={alum.id} className="relative h-12 w-12 rounded-full overflow-hidden ring-2 ring-white">
                          <Image
                            src={alum.image}
                            alt={alum.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
                  <div className="h-10 w-10 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold shadow-lg">
                    {year.toString().slice(-2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Animated Grid Gallery */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Memories & Moments</h2>
          <p className="text-gray-300 text-center mb-12 max-w-2xl mx-auto">
            Capturing the special moments from our alumni events and gatherings
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-min">
            {[...Array(8)].map((_, i) => {
              const isLarge = i % 5 === 0;
              const gridClass = isLarge
                ? "col-span-2 row-span-2"
                : "col-span-1 row-span-1";

              return (
                <div
                  key={i}
                  className={`${gridClass} overflow-hidden rounded-lg transform transition-all duration-500 hover:scale-105 hover:z-10`}
                >
                  <div className="w-full h-full relative group">
                    <Image
                      src={`/gallery/gallery.jpg`}
                      alt="Alumni event"
                      width={isLarge ? 600 : 300}
                      height={isLarge ? 400 : 200}
                      className="w-full h-full object-cover transition-all duration-500 group-hover:saturate-150"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                      <div className="p-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <h3 className="text-lg font-medium">Alumni {isLarge ? 'Reunion' : 'Gathering'} {2022 - i}</h3>
                        <p className="text-sm text-gray-300">Campus Center</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Join the Network Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Join Our Alumni Network</h2>
          <p className="max-w-2xl mx-auto mb-8 text-lg">
            Stay connected with your alma mater and fellow graduates. Update your information and be part of our growing community.
          </p>
          <button className="bg-white text-indigo-600 px-8 py-3 rounded-full font-semibold text-lg shadow-lg hover:bg-gray-100 transition-colors">
            Update Your Profile
          </button>
        </div>
      </section>
    </div>
  );
}