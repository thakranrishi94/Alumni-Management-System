// app/page.tsx
"use client"
import Banner from '../components/HomeComponents/heroBanner';
import EventsSection from '@/components/HomeComponents/EventSection';
import AlumniSection from '@/components/HomeComponents/AlumniSection';
import GallerySlider from '@/components/HomeComponents/GallerySlider';
import TestimonialSlider from '@/components/HomeComponents/TestimonialSlider';
import EventTicker from '@/components/HomeComponents/EventTicker';
export default function HomePage() {
    const bannerImages = [
        {
            src: "/banner/hero1.jpg",
            alt: "University Campus",
            title: "Welcome to KR Mangalam University",
            description: "Empowering minds, shaping futures"
        },
        {
            src: "/banner/hero2.jpg",
            alt: "Students in Campus",
            title: "Join Our Alumni Network",
            description: "Connect with fellow graduates"
        },
        {
            src: "/banner/hero3.jpg",
            alt: "Graduation Ceremony",
            title: "Excellence in Education",
            description: "Building tomorrow's leaders"
        }
    ];

    return (
        <main className="min-h-screen">
            <Banner 
                images={bannerImages}
                autoSlideInterval={5000} // Optional: 5 seconds per slide
                className="my-banner" // Optional: additional classes
            />
            <EventTicker/>
            <EventsSection/>
            <AlumniSection/>
            <TestimonialSlider/>
            <GallerySlider/>
        </main>
    );
}