import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Type definitions based on your Prisma schema
interface EventRequestData {
  eventRequestId: number;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventType: 'WEBINAR' | 'WORKSHOP' | 'SEMINAR' | 'LECTURE';
  requestStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
}

// Simplified event type for display
interface TickerEvent {
  id: number;
  title: string;
  date: string;
  type: string;
}

const EventTicker = () => {
  const [events, setEvents] = useState<TickerEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await axios.get<EventRequestData[]>(
          `${process.env.NEXT_PUBLIC_API_URL}/event/upcomingEvents`
        );
        
        // Transform API data to the format needed for the ticker
        const formattedEvents = response.data
          .filter(event => event.requestStatus === 'APPROVED') // Only show approved events
          .map(event => {
            // Format the date for display
            const eventDate = new Date(event.eventDate);
            const formattedDate = eventDate.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric'
            });
            
            return {
              id: event.eventRequestId,
              title: event.eventTitle,
              date: formattedDate,
              type: event.eventType.charAt(0) + event.eventType.slice(1).toLowerCase()
            };
          });
        
        setEvents(formattedEvents);
        setError(null);
      } catch (err) {
        setError('Failed to load events');
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Triplicate events for continuous scrolling effect
  const triplicatedEvents = [...events, ...events, ...events];

  if (loading) {
    return (
      <div className="w-full bg-gradient-to-r from-indigo-900 to-purple-900 p-10 text-center">
        <div className="text-white">Loading events...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-gradient-to-r from-indigo-900 to-purple-900 p-10 text-center">
        <div className="text-red-300">{error}</div>
      </div>
    );
  }

  // If there are no events
  if (events.length === 0) {
    return (
      <div className="w-full bg-gradient-to-r from-indigo-900 to-purple-900 p-10 text-center">
        <div className="text-white">No upcoming events found</div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-r from-indigo-900 to-purple-900">
      <div
        className="overflow-hidden"
        style={{ isolation: 'isolate' }}
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
                  <span className="text-pink-300/80 text-xs px-2 py-1 bg-white/10 rounded-full">
                    {event.type}
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