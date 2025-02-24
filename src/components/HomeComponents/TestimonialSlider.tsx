// import { useState } from 'react';
import Image from 'next/image';

export default function TestimonialSlider() {
    const alumni = [
        { id: 1, name: 'Sarah Johnson', year: 2018, field: 'Computer Science', image: '/alumni/person1.jpg' },
        { id: 2, name: 'Michael Chen', year: 2019, field: 'Business', image: '/alumni/person2.jpg' },
        { id: 3, name: 'Priya Patel', year: 2020, field: 'Engineering', image: '/alumni/person3.jpg' },
        { id: 4, name: 'James Wilson', year: 2018, field: 'Medicine', image: '/alumni/person4.jpg' },
        { id: 5, name: 'Emma Rodriguez', year: 2021, field: 'Arts', image: '/alumni/person5.jpg' },
        { id: 6, name: 'David Kim', year: 2019, field: 'Engineering', image: '/alumni/person6.jpg' },
        { id: 7, name: 'Olivia Taylor', year: 2020, field: 'Computer Science', image: '/alumni/person7.jpg' },
        { id: 8, name: 'Robert Garcia', year: 2021, field: 'Business', image: '/alumni/person8.jpg' },
    ];

    return (
        <>
            {/* Testimonials with Parallax */}
            <section className="py-20 relative overflow-hidden">
                <div 
                    className="absolute inset-0 bg-fixed bg-center bg-cover"
                    style={{ 
                        backgroundImage: "url('/campus-library.jpg')", 
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
                                    <div className="h-12 w-12 rounded-full overflow-hidden mr-4 relative">
                                        <Image 
                                            src={`/testimonial/person${i + 2}.jpg`} 
                                            alt="Alumni testimonial"
                                            layout="fill"
                                            objectFit="cover"
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
        </>
    );
}