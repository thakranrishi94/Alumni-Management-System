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
import { CalendarIcon, UserIcon, MapPinIcon, Clock3Icon } from 'lucide-react';
import { cn } from "@/lib/utils";
import Image from 'next/image';

interface EventType {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  category: "academic" | "cultural" | "sports" | "workshop";
  images: string[];
  host: string;
  location: string;
  faculty: string;
  date: string;
  time: string;
  featured: boolean;
}

// Event data remains the same as in your original code
const eventData: EventType[] = [
  {
    id: "evt-001",
    title: "Machine Learning Workshop",
    description: "Hands-on ML workshop for beginners to advanced practitioners",
    fullDescription: `Join us for a comprehensive Machine Learning workshop that covers everything from basic concepts to advanced techniques. 

This full-day session will include:
• Introduction to ML frameworks
• Hands-on training with TensorFlow and PyTorch
• Building and evaluating your first models
• Real-world applications and case studies
• Career opportunities in ML and AI

All participants will receive certificates and access to online resources for continued learning. Lunch and refreshments will be provided.

Prior coding experience is helpful but not required - we welcome students from all departments interested in the exciting world of machine learning!`,
    category: "workshop",
    images: ["/event/card1.jpg", "/event/card1.jpg"],
    host: "Dr. Emma Chen",
    location: "Computer Science Building, Room 302",
    faculty: "Department of Computer Science",
    date: "2025-03-15",
    time: "10:00 AM - 4:00 PM",
    featured: true
  },
  {
    id: "evt-002",
    title: "Spring Cultural Festival",
    description: "Annual celebration of multicultural performances and cuisine",
    fullDescription: "The Spring Cultural Festival returns with music, dance, art, and food from cultures around the world. Student organizations will showcase traditional performances and modern interpretations that highlight our diverse campus community. Don't miss the international food court featuring cuisines from over 20 countries, prepared by student chefs and local restaurants. This year's festival also includes interactive workshops where you can learn traditional crafts, dances, and musical techniques from expert instructors.",
    category: "cultural",
    images: ["/event/card2.jpg"],
    host: "Cultural Affairs Committee",
    location: "University Commons",
    faculty: "Office of Student Life",
    date: "2025-04-10",
    time: "12:00 PM - 8:00 PM",
    featured: true
  },
  {
    id: "evt-003",
    title: "Entrepreneurship Conference",
    description: "Connecting students with industry leaders and startup founders",
    fullDescription: "The annual Entrepreneurship Conference brings together successful founders, investors, and business leaders to inspire the next generation of innovators. Hear keynote speeches from industry pioneers, participate in networking sessions, and learn practical skills through targeted workshops. This year's conference focuses on sustainable business models, tech innovation, and social entrepreneurship. Selected student teams will have the opportunity to pitch their business ideas to a panel of investors, with the chance to win seed funding and mentorship opportunities.",
    category: "academic",
    images: ["/event/card3.jpg", "/event/card3.jpg"],
    host: "Business Innovation Center",
    location: "Business School Auditorium",
    faculty: "School of Business",
    date: "2025-03-28",
    time: "9:00 AM - 5:00 PM",
    featured: false
  },
  {
    id: "evt-004",
    title: "Intercollegiate Basketball Tournament",
    description: "Championship games featuring top college teams from the region",
    fullDescription: "The biggest basketball event of the academic year is here! Watch our university team compete against top-ranked colleges from across the region in this three-day tournament. The championship features both men's and women's divisions, with spectacular matchups guaranteed. Special halftime shows, giveaways, and concessions will keep the energy high throughout the event. Student tickets are discounted, and the first 200 attendees each day receive exclusive university merchandise. Come support our players and show your school spirit!",
    category: "sports",
    images: ["/event/card1.jpg"],
    host: "Athletics Department",
    location: "University Sports Complex",
    faculty: "Department of Athletics",
    date: "2025-05-05",
    time: "6:00 PM - 9:00 PM",
    featured: true
  },
  {
    id: "evt-005",
    title: "Research Symposium",
    description: "Undergraduate and graduate research presentations across disciplines",
    fullDescription: "The annual Research Symposium showcases outstanding student research from all academic departments. This two-day event features oral presentations, poster sessions, and panel discussions highlighting innovative approaches and findings. Faculty judges will select outstanding projects for special recognition and publication opportunities. The symposium provides valuable experience for students planning academic careers and creates connections between departments for interdisciplinary collaboration. Attendance is free and open to all university members and the general public.",
    category: "academic",
    images: ["/event/card2.jpg"],
    host: "Office of Research",
    location: "Multiple Campus Locations",
    faculty: "Office of Academic Affairs",
    date: "2025-04-20",
    time: "10:00 AM - 6:00 PM",
    featured: false
  },
  {
    id: "evt-006",
    title: "Design Thinking Workshop",
    description: "Learn creative problem-solving methods from industry experts",
    fullDescription: "This intensive Design Thinking Workshop will introduce participants to the methodology used by leading innovative companies worldwide. Through hands-on exercises and real-world case studies, you'll learn to approach complex problems with a user-centered perspective. The workshop covers the entire design thinking process: empathizing with users, defining problems, ideating solutions, prototyping concepts, and testing ideas. This workshop is valuable for students from all disciplines, as design thinking principles apply across fields from engineering to business to healthcare and beyond.",
    category: "workshop",
    images: ["/event/card2.jpg"],
    host: "Prof. David Wong",
    location: "Innovation Lab, Engineering Building",
    faculty: "School of Design",
    date: "2025-03-22",
    time: "1:00 PM - 5:00 PM",
    featured: false
  }
];
const categoryColors = {
  academic: "bg-blue-100 text-blue-800",
  cultural: "bg-purple-100 text-purple-800",
  sports: "bg-green-100 text-green-800",
  workshop: "bg-amber-100 text-amber-800"
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
  
  return (
    <Card className="h-full overflow-hidden flex flex-col transition-all hover:shadow-lg">
      <div className="relative w-full h-48 overflow-hidden">
        <Image 
          src={event.images[0]} 
          alt={event.title}
          className="object-cover transition-transform hover:scale-105 duration-500"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={event.featured}
        />
        <div className="absolute top-3 right-3">
          <Badge className={cn("text-xs font-medium py-1", categoryColors[event.category])}>
            {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
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
  
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl p-0 overflow-y-auto">
        <div className="relative w-full h-56 sm:h-64 md:h-72">
          <Image 
            src={event.images[0]} 
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
            <Badge className={cn("text-sm py-1 px-3", categoryColors[event.category])}>
              {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
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
  
  const handleEventClick = (event: EventType): void => {
    setSelectedEvent(event);
    setIsDetailOpen(true);
  };
  
  // Featured events for the hero section
  const featuredEvents = eventData.filter(event => event.featured);
  
  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      {featuredEvents.length > 0 && (
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Featured Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents.map(event => (
              <ClientOnlyEventCard
                key={event.id}
                event={event}
                onClick={() => handleEventClick(event)}
              />
            ))}
          </div>
        </div>
      )}
      
      <EventDetailsPanel
        event={selectedEvent}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
    </section>
  );
};

export default EventSection;