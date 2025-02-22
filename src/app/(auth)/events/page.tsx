import React from 'react'
import AllEvents from '@/components/AllEvents';
import Banner from '../../../components/HomeComponents/heroBanner';

function page() {
    const bannerImages = [
        {
            src: "/banner/event1.jpg",
            alt: "University Campus",
            title: "Welcome to KR Mangalam University",
            description: "Empowering minds, shaping futures"
        },
        {
            src: "/banner/event2.jpg",
            alt: "Students in Campus",
            title: "Join Our Alumni Network",
            description: "Connect with fellow graduates"
        },
        {
            src: "/banner/event3.jpg",
            alt: "HACK-KRMU",
            title: "HACK KRMU 4.0",
            description: "An event in university"
        }
    ];
    return (
        <main className="min-h-screen">
            <Banner
                images={bannerImages}
                autoSlideInterval={5000} // Optional: 5 seconds per slide
                className="my-banner" // Optional: additional classes
            />
            <AllEvents />
        </main>
    )
}

export default page