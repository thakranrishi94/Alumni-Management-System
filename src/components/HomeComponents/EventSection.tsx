"use client"
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarIcon, UserIcon, MapPinIcon, Clock3Icon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { cn } from "@/lib/utils";
import Image from 'next/image';
import axios from 'axios';

interface EventType {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  category: string;
  images: string[];
  brochure?: string;
  host: string;
  location: string;
  faculty: string;
  date: string;
  time: string;
  featured: boolean;
}

const categoryColors: Record<string, string> = {
  "webinar": "bg-blue-100 text-blue-800",
  "workshop": "bg-amber-100 text-amber-800",
  "seminar": "bg-purple-100 text-purple-800",
  "lecture": "bg-emerald-100 text-emerald-800"
};

const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

// Image Slider Component for the details panel
const ImageSlider: React.FC<{
  images: string[];
  title: string;
}> = ({ images, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const goToPrevious = () => {
    const isFirstImage = currentIndex === 0;
    const newIndex = isFirstImage ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };
  
  const goToNext = () => {
    const isLastImage = currentIndex === images.length - 1;
    const newIndex = isLastImage ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };
  
  const goToSpecificSlide = (index: number) => {
    setCurrentIndex(index);
  };
  
  if (images.length === 0) return null;
  
  if (images.length <= 3) {
    return (
      <div className="grid grid-cols-3 gap-2">
        {images.map((image, index) => (
          <div 
            key={index} 
            className="relative aspect-square rounded-md overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
          >
            <Image 
              src={image} 
              alt={`${title} image ${index + 1}`}
              className="object-cover"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        ))}
      </div>
    );
  }
  
  return (
    <div className="relative w-full">
      <div className="relative aspect-video rounded-md overflow-hidden">
        <Image 
          src={images[currentIndex]} 
          alt={`${title} image ${currentIndex + 1}`}
          className="object-cover"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      
      <button 
        onClick={goToPrevious}
        className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 focus:outline-none"
      >
        <ChevronLeftIcon size={20} />
      </button>
      
      <button 
        onClick={goToNext}
        className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 focus:outline-none"
      >
        <ChevronRightIcon size={20} />
      </button>
      
      <div className="flex justify-center mt-2 gap-1">
        {images.map((_, index) => (
          <button 
            key={index}
            onClick={() => goToSpecificSlide(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex ? 'w-4 bg-gray-800' : 'w-2 bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

const ClientOnlyEventCard: React.FC<{
  event: EventType;
  onClick: () => void;
}> = ({ event, onClick }) => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return (
      <Card className="h-full overflow-hidden animate-pulse">
        <div className="w-full h-48 bg-gray-200"></div>
        <CardContent className="p-6">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </CardContent>
      </Card>
    );
  }
  
  const displayImage = event.brochure || event.images[0];
  
  return (
    <Card className="h-full overflow-hidden flex flex-col transition-all hover:shadow-lg">
      <div className="relative w-full h-48 overflow-hidden">
        <Image 
          src={displayImage} 
          alt={event.title}
          className="object-cover transition-transform hover:scale-105 duration-500"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={event.featured}
        />
        <div className="absolute top-3 right-3">
          <Badge className={cn("text-xs font-medium py-1", categoryColors[event.category.toLowerCase()] || "bg-gray-100 text-gray-800")}>
            {event.category.charAt(0).toUpperCase() + event.category.slice(1).toLowerCase()}
          </Badge>
        </div>
        {event.featured && (
          <div className="absolute bottom-3 left-3">
            <Badge variant="default" className="bg-gradient-to-r from-orange-500 to-pink-500 text-white">
              Featured
            </Badge>
          </div>
        )}
      </div>
      
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold line-clamp-1">{event.title}</CardTitle>
        <CardDescription className="flex items-center gap-1 text-sm">
          <CalendarIcon size={14} className="text-gray-500" />
          <span>{formatDate(event.date)}</span>
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-4">
        <p className="text-gray-600 text-sm line-clamp-2 mb-3">{event.description}</p>
        <div className="flex flex-col gap-2 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Clock3Icon size={14} />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPinIcon size={14} />
            <span className="line-clamp-1">{event.location}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0 mt-auto">
        <Button onClick={onClick} className="w-full" variant="outline">
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

const EventDetailsPanel: React.FC<{
  event: EventType | null;
  isOpen: boolean;
  onClose: () => void;
}> = ({ event, isOpen, onClose }) => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted || !event) return null;
  
  const bannerImage = event.brochure || event.images[0];
  const displayImages = event.images;
  
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl p-0 overflow-y-auto">
        <div className="relative w-full h-56 sm:h-64 md:h-72">
          <Image 
            src={bannerImage} 
            alt={event.title}
            className="object-cover"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <SheetClose className="absolute top-4 right-4 bg-black/40 text-white p-2 rounded-full hover:bg-black/60">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </SheetClose>
          <div className="absolute bottom-4 left-4">
            <Badge className={cn("text-sm py-1 px-3", categoryColors[event.category.toLowerCase()] || "bg-gray-100 text-gray-800")}>
              {event.category.charAt(0).toUpperCase() + event.category.slice(1).toLowerCase()}
            </Badge>
          </div>
        </div>
        
        <div className="p-6">
          <SheetHeader className="text-left mb-6">
            <SheetTitle className="text-2xl font-bold">{event.title}</SheetTitle>
            <SheetDescription className="text-base flex items-center gap-2 mt-2">
              <CalendarIcon size={16} className="text-gray-500" />
              <span>{formatDate(event.date)} • {event.time}</span>
            </SheetDescription>
          </SheetHeader>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 p-4 bg-gray-50 rounded-lg mb-6">
            <div className="flex items-start gap-3">
              <UserIcon size={18} className="text-gray-500 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-gray-700">Host</h4>
                <p className="text-sm text-gray-600">{event.host}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 mt-0.5">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
              </svg>
              <div>
                <h4 className="text-sm font-medium text-gray-700">Faculty</h4>
                <p className="text-sm text-gray-600">{event.faculty}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 col-span-1 sm:col-span-2">
              <MapPinIcon size={18} className="text-gray-500 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-gray-700">Location</h4>
                <p className="text-sm text-gray-600">{event.location}</p>
              </div>
            </div>
          </div>
          
          {displayImages.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-3">Event Images</h3>
              <ImageSlider images={displayImages} title={event.title} />
            </div>
          )}
          
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-3">About This Event</h3>
            <p className="text-gray-700 whitespace-pre-line">{event.fullDescription}</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

const EventSection: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  const [eventData, setEventData] = useState<EventType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/post/all`);
        // Only take the first three events
        const firstThreeEvents = response.data.slice(0, 3);
        setEventData(firstThreeEvents);
        setError(null);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, []);
  
  const handleEventClick = (event: EventType): void => {
    setSelectedEvent(event);
    setIsDetailOpen(true);
  };
  
  if (loading) {
    return (
      <section className="py-16 px-4 max-w-7xl mx-auto text-center">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      </section>
    );
  }
  
  if (error) {
    return (
      <section className="py-16 px-4 max-w-7xl mx-auto text-center">
        <div className="bg-red-50 p-6 rounded-lg">
          <h3 className="text-red-800 text-lg font-medium">{error}</h3>
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline" 
            className="mt-4"
          >
            Try Again
          </Button>
        </div>
      </section>
    );
  }
  
  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold mb-8 text-center">Our Times With Alumni</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventData.map(event => (
            <ClientOnlyEventCard
              key={event.id}
              event={event}
              onClick={() => handleEventClick(event)}
            />
          ))}
        </div>
      </div>
      
      <EventDetailsPanel
        event={selectedEvent}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
    </section>
  );
};

export default EventSection;