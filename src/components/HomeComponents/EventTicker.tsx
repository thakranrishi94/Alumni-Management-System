import React from 'react';

interface Event {
  id: number;
  title: string;
  date: string;
}

const EventTicker = () => {
  const events: Event[] = [
    { id: 1, title: "Summer Concert 2025", date: "June 15" },
    { id: 2, title: "Tech Conference", date: "July 20" },
    { id: 3, title: "Food Festival", date: "August 5" },
    { id: 4, title: "Art Exhibition", date: "Sept 10" },
    { id: 5, title: "Sports Tournament", date: "Oct 1" },
  ];

  const triplicatedEvents = [...events, ...events, ...events];

  return (
    <div className="w-full bg-gradient-to-r from-indigo-900 to-purple-900">
      <div
        className="overflow-hidden"
        style={{ isolation: 'isolate' }} // Prevents stacking context issues
      >
        {/* Heading Section */}
        <div className="text-center py-6">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-violet-300 inline-block">
            Upcoming Events
          </h2>
          <div className="mt-2 w-24 h-1 bg-gradient-to-r from-pink-500 to-violet-500 mx-auto rounded-full" />
        </div>

        {/* Ticker Section */}
        <div className="relative flex border-t border-white/10">
          <div 
            className="flex whitespace-nowrap items-center py-4"
            style={{
              animation: 'slide 30s linear infinite',
              width: 'fit-content'
            }}
          >
            {triplicatedEvents.map((event, index) => (
              <div
                key={`${event.id}-${index}`}
                className="inline-flex items-center group"
              >
                <div className="px-4 flex items-center space-x-2 cursor-pointer">
                  <span className="text-white font-medium transition-colors duration-200 ease-in-out group-hover:text-pink-300">
                    {event.title}
                  </span>
                  <span className="text-violet-300 text-sm transition-colors duration-200 ease-in-out group-hover:text-white/80">
                    {event.date}
                  </span>
                </div>
                <span className="text-white/40 mx-4">•</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scoped styles */}
      <style jsx>{`
        @keyframes slide {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.33%);
          }
        }
        
        /* Pause animation on hover */
        div:hover > div > div {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default EventTicker;