"use client";
import React, { useEffect, useState } from "react";
type CardData = {
  title: string;
  value: number;
  description: string;
  icon: string; // You can use icons from libraries like react-icons or custom SVGs
};
export default function OverviewPage() {
  const [alumniScore, setAlumniScore] = useState(0);
  const [eventsCount, setEventsCount] = useState(0);
  const [facultyCount, setFacultyCount] = useState(0);
  const [partnerships, setPartnerships] = useState(0);
  // Simulate incrementing numbers for the cards
  useEffect(() => {
    const incrementNumbers = () => {
      if (alumniScore < 2000) setAlumniScore((prev) => prev + 100);
      if (eventsCount < 200) setEventsCount((prev) => prev + 10);
      if (facultyCount < 300) setFacultyCount((prev) => prev + 10);
      if (partnerships < 50) setPartnerships((prev) => prev + 10);
    };
    const interval = setInterval(incrementNumbers, 50); // Adjust speed as needed
    return () => clearInterval(interval);
  }, [alumniScore, eventsCount, facultyCount, partnerships]);
  // Card Data
  const cards: CardData[] = [
    {
      title: "Alumni Score",
      value: alumniScore,
      description: "Total alumni connected with us",
      icon: "👨‍🎓", // Replace with an icon or SVG
    },
    {
      title: "Events",
      value: eventsCount,
      description: "Events organized so far",
      icon: "🎉", // Replace with an icon or SVG
    },
    {
      title: "Faculty",
      value: facultyCount,
      description: "Faculty members contributing",
      icon: "👩‍🏫", // Replace with an icon or SVG
    },
    {
      title: "Partnerships",
      value: partnerships,
      description: "Collaborations with organizations",
      icon: "🤝", // Replace with an icon or SVG
    },
    {
      title: "Projects",
      value: 150,
      description: "Ongoing and completed projects",
      icon: "📂", // Replace with an icon or SVG
    },
    {
      title: "Students",
      value: 5000,
      description: "Students enrolled in programs",
      icon: "👩‍🎓", // Replace with an icon or SVG
    },
  ];
  return (
    <div className="bg-gray-100 min-h-screen p-8 md-10">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Overview</h1>
        <p className="text-gray-600">Key metrics and statistics at a glance</p>
      </div>
      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">{card.title}</h2>
                <p className="text-gray-600">{card.description}</p>
              </div>
              <span className="text-3xl">{card.icon}</span> {/* Icon */}
            </div>
            <div className="mt-4">
              <p className="text-4xl font-bold text-blue-600">{card.value}+</p>
            </div>
          </div>
        ))}
      </div>
      {/* Additional Content */}
      <div className="mt-12 pb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Activities</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800">Alumni Meet 2023</h3>
            <p className="text-gray-600">A successful event with 500+ attendees.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800">Faculty Workshop</h3>
            <p className="text-gray-600">Workshop on modern teaching techniques.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800">New Partnerships</h3>
            <p className="text-gray-600">Collaborated with 5 new organizations.</p>
          </div>
        </div>
      </div>
    </div>
  );
}