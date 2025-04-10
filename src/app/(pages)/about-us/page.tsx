"use client"
import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
// import { useTypewriter } from 'react-simple-typewriter';
import Link from 'next/link';

export default function AlumniAboutPage() {
  // const [typewriterText] = useTypewriter({
  //   words: [
  //     'Building Global Leaders',
  //     'Creating Innovators',
  //     'Fostering Excellence',
  //     'Connecting Generations'
  //   ],
  //   loop: true,
  //   delaySpeed: 2000,
  // });

  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>About Alumni | KR Mangalam University</title>
        <meta name="description" content="KR Mangalam University Alumni Network" />
      </Head>

      {/* Hero Section */}
      {/* <div className="relative h-96 bg-blue-700 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/gallery/gallery.jpg"
            alt="Alumni gathering at campus"
            layout="fill"
            objectFit="cover"
            className="opacity-30"
          />
        </div>
        <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center relative z-10 text-white">
          <h1 className="text-4xl md:text-6xl font-bold text-center mb-4">
            KR Mangalam Alumni Network
          </h1>
          <h2 className="text-xl md:text-3xl text-center">
            <span>{typewriterText}</span>
            <Cursor cursorColor="#f7fafc" />
          </h2>
        </div>
      </div> */}

      {/* About Alumni Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-blue-800 mb-6 text-center">About Our Alumni Network</h2>
            <p className="text-gray-700 mb-8 text-lg leading-relaxed">
              Founded in 2012, the KR Mangalam University Alumni Network serves as a bridge connecting over 15,000 graduates across the globe. Our alumni represent the university&apos;s legacy of excellence and innovation in various fields including Engineering, Management, Law, Fashion Design, Journalism, and more.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
              <div className="bg-blue-50 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-blue-800 mb-3">Our Mission</h3>
                <p className="text-gray-700">
                  To foster lifelong relationships between alumni and the university, creating a supportive network that promotes professional growth, innovation, and gives back to society through meaningful initiatives.
                </p>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-blue-800 mb-3">Our Vision</h3>
                <p className="text-gray-700">
                  To build a vibrant, global community of alumni who serve as ambassadors of KR Mangalam University&apos;s values and contribute to its continued growth while advancing in their respective fields.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Alumni Impact Metrics */}
      <section className="py-16 bg-blue-700 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Alumni Impact</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: '15,000+', text: 'Global Alumni' },
              { number: '45+', text: 'Countries Represented' },
              { number: '500+', text: 'CEOs & Founders' },
              { number: '₹25 Cr+', text: 'Scholarship Fund Contributed' }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <h3 className="text-4xl font-bold mb-2">{item.number}</h3>
                <p className="text-xl">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Alumni Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-blue-800 mb-12 text-center">
            Alumni Voices
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Priya Sharma',
                batch: 'BTech 2015',
                role: 'Senior Software Engineer, Google',
                quote: '"The foundation I received at KR Mangalam University equipped me with both technical skills and adaptability that have been crucial to my success in the tech industry."',
                image: '/gallery/gallery.jpg'
              },
              {
                name: 'Rajiv Mehta',
                batch: 'MBA 2017',
                role: 'Founder & CEO, GreenTech Solutions',
                quote: '"The entrepreneurship cell and mentorship programs at KRMU gave me the confidence to launch my own venture. Today, we employ over 200 people and serve clients across Asia."',
                image: '/api/placeholder/150/150'
              },
              {
                name: 'Ananya Kapoor',
                batch: 'LLB 2018',
                role: 'Legal Advisor, United Nations',
                quote: '"The international exposure and moot court competitions I participated in during my time at KRMU prepared me for the complex challenges I tackle in international law today."',
                image: '/api/placeholder/150/150'
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-blue-50 p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden mr-4 flex-shrink-0">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      width={64}
                      height={64}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-blue-800">{testimonial.name}</h3>
                    <p className="text-gray-600">{testimonial.batch}</p>
                    <p className="text-blue-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">{testimonial.quote}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Get Involved Section */}
      <section className="py-16 bg-gradient-to-r from-blue-700 to-blue-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">
              Get Involved
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {[
                { title: 'Mentor a Student', icon: '👨‍🏫' },
                { title: 'Join Alumni Events', icon: '🎉' },
                { title: 'Contribute to Scholarships', icon: '🎓' }
              ].map((item, index) => (
                <div
                  key={index}
                  className="p-6 rounded-lg bg-white bg-opacity-10 backdrop-blur-sm hover:bg-opacity-20 transition duration-300"
                >
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                </div>
              ))}
            </div>
            <Link href="/signup">
            <button 
              className="bg-white text-blue-800 px-8 py-3 rounded-full font-semibold text-lg hover:bg-blue-50 transition duration-300"
            >
              Register for Alumni Portal
            </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}