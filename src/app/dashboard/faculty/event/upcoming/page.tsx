"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Calendar, User, BookOpen, FileText, Tag, Clock, ListTodo, Mail, Phone } from "lucide-react";
import Cookies from "js-cookie";
import { useToast } from "@/hooks/use-toast";

// Update interface to include email and phone number
interface Event {
  eventRequestId: number;
  eventTitle: string;
  eventDescription: string;
  eventType: string;
  eventDate: string;
  eventTime: string;
  eventDuration: string;
  eventLink: string | null;
  eventAgenda: string;
  alumni?: {
    user: {
      name: string;
      email?: string; // Alumni email
      phone?: string; // Alumni phone
    };
    alumniEmail?: string; // Dedicated alumni email field
    alumniPhone?: string; // Dedicated alumni phone field
  } | null;
  faculty?: {
    user: {
      name: string;
      email?: string;
      phone?: string;
    };
  } | null;
  adminId?: number;
}

//error interface
interface ApiError {
  response?: {
    status?: number;
    data?: {
      error?: string;
    };
  };
  message?: string;
}

// Utility functions remain the same
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  return `${hours}:${minutes}:${seconds} ${ampm}`;
};

// Helper function to get event host name
const getHostName = (event: Event): string => {
  if (event.alumni?.user.name) {
    return event.alumni.user.name;
  }
  // You might want to fetch admin name from your API if needed
  return event.adminId ? 'Admin' : 'Unknown Host';
};

// Helper functions to get alumni email and phone
const getAlumniEmail = (event: Event): string => {
  if (event.alumni?.alumniEmail) {
    return event.alumni.alumniEmail;
  }
  if (event.alumni?.user.email) {
    return event.alumni.user.email;
  }
  return 'Not provided';
};

const getAlumniPhone = (event: Event): string => {
  if (event.alumni?.alumniPhone) {
    return event.alumni.alumniPhone;
  }
  if (event.alumni?.user.phone) {
    return event.alumni.user.phone;
  }
  return 'Not provided';
};

export default function UpcomingEvents() {
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [eventLink, setEventLink] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = Cookies.get('ams_token');

        if (!token) {
          setError("Authentication required");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/event/events/upcoming`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setEvents(response.data);
        setLoading(false);
      } catch (err: unknown) {
        const error = err as ApiError;

        console.error("Failed to fetch events:", error);
        setError(error.response?.data?.error || error.message || "Failed to load events");
        setLoading(false);

        // Handle authentication errors
        if (error.response?.status === 401) {
          setError("Please log in to view your events");
          // You might want to redirect to login page here
        }
      }
    };

    fetchEvents();
  }, []);

  const handleRowClick = (event: Event) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
  };
  
  useEffect(() => {
    if (selectedEvent) {
      setEventLink(selectedEvent.eventLink || "");
    } else {
      setEventLink("");
    }
  }, [selectedEvent]);

  const handleUpdateDetails = async () => {
    if (!selectedEvent) return;

    // Check if eventLink is empty
    if (!eventLink.trim()) {
      toast({
        title: "Error",
        description: 'Link field should not be blank',
        variant: "destructive",
      });
      return;
    }

    try {
      setUpdateLoading(true);

      if (!process.env.NEXT_PUBLIC_API_URL) {
        throw new Error('API URL is not configured');
      }

      const token = Cookies.get('ams_token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/event/${selectedEvent.eventRequestId}/link`;

      const response = await axios.put(
        endpoint,
        { 
          eventLink,
          // Removed alumniEmail and alumniPhone from the update payload
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );

      if (response.status !== 200) {
        throw new Error(`API returned status ${response.status}`);
      }

      // Fetch updated events
      const updatedEvents = await axios.get<Event[]>(
        `${process.env.NEXT_PUBLIC_API_URL}/event/events/upcoming`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEvents(updatedEvents.data);

      // Update the selected event with the new link
      setSelectedEvent(prev => {
        if (!prev) return null;
        
        return {
          ...prev,
          eventLink
        };
      });

      // Show success toast and close the dialog
      toast({
        title: "Success",
        description: "Event details updated successfully",
        variant: "default",
      });
      setIsDialogOpen(false);
      
    } catch (err) {
      console.error("Failed to update event details:", err);

      if (axios.isAxiosError(err)) {
        console.error('Axios Error:', {
          status: err.response?.status,
          statusText: err.response?.statusText,
          data: err.response?.data,
          config: err.config
        });
      }
      toast({
        title: "Error",
        description: 'Failed to update event details. Please try again.',
        variant: "destructive",
      });
    } finally {
      setUpdateLoading(false);
    }
  };
  
  // Updated search to handle optional fields
  const filteredEvents = events && events.filter(event =>
    event.eventTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.eventType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    getHostName(event).toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.eventAgenda.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (error) return <div className="flex items-center justify-center h-screen text-red-500">{error}</div>;

  return (
    <div className="bg-gray-100 w-full">
      <main className="flex-1 p-4 md:p-8 overflow-auto">
        <h1 className="text-xl md:text-2xl font-bold ml-2 md:ml-0">Upcoming Events</h1>
        <p className="text-gray-600">Manage Events</p>

        <div className="mt-4 md:mt-6">
          <input
            type="text"
            placeholder="Search events by name, type, host, or agenda"
            className="w-full p-2 md:p-3 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="mt-6 md:mt-8 bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs md:text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 md:p-3 text-left text-gray-700 font-semibold">
                    <div className="flex items-center space-x-1 md:space-x-2">
                      <Calendar className="h-3 w-3 md:h-4 md:w-4 text-blue-500" />
                      <span>Event Name</span>
                    </div>
                  </th>
                  <th className="p-2 md:p-3 text-left text-gray-700 font-semibold">
                    <div className="flex items-center space-x-1 md:space-x-2">
                      <ListTodo className="h-3 w-3 md:h-4 md:w-4 text-purple-500" />
                      <span>Agenda</span>
                    </div>
                  </th>
                  <th className="p-2 md:p-3 text-left text-gray-700 font-semibold">
                    <div className="flex items-center space-x-1 md:space-x-2">
                      <User className="h-3 w-3 md:h-4 md:w-4 text-green-500" />
                      <span>Host</span>
                    </div>
                  </th>
                  <th className="hidden md:table-cell p-2 md:p-3 text-left text-gray-700 font-semibold">
                    <div className="flex items-center space-x-1 md:space-x-2">
                      <BookOpen className="h-3 w-3 md:h-4 md:w-4 text-purple-500" />
                      <span>Faculty</span>
                    </div>
                  </th>
                  <th className="p-2 md:p-3 text-left text-gray-700 font-semibold">
                    <div className="flex items-center space-x-1 md:space-x-2">
                      <Tag className="h-3 w-3 md:h-4 md:w-4 text-red-500" />
                      <span>Type</span>
                    </div>
                  </th>
                  <th className="hidden md:table-cell p-2 md:p-3 text-left text-gray-700 font-semibold">
                    <div className="flex items-center space-x-1 md:space-x-2">
                      <Calendar className="h-3 w-3 md:h-4 md:w-4 text-blue-500" />
                      <span>Date</span>
                    </div>
                  </th>
                  <th className="hidden md:table-cell p-2 md:p-3 text-left text-gray-700 font-semibold">
                    <div className="flex items-center space-x-1 md:space-x-2">
                      <Clock className="h-3 w-3 md:h-4 md:w-4 text-indigo-500" />
                      <span>Time</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((event, index) => (
                  <tr
                    key={event.eventRequestId}
                    onClick={() => handleRowClick(event)}
                    className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-gray-100 transition-colors cursor-pointer`}
                  >
                    <td className="p-2 md:p-3 text-gray-700 max-w-[120px] md:max-w-none truncate">{event.eventTitle}</td>
                    <td className="p-2 md:p-3 text-gray-700 max-w-[120px] md:max-w-none truncate">{event.eventAgenda}</td>
                    <td className="p-2 md:p-3 text-gray-700 max-w-[120px] md:max-w-none truncate">{getHostName(event)}</td>
                    <td className="hidden md:table-cell p-2 md:p-3 text-gray-700">{event.faculty?.user.name || 'Not assigned'}</td>
                    <td className="p-2 md:p-3 text-gray-700">
                      <span className={`px-1 py-0.5 md:px-2 md:py-1 text-xs md:text-sm rounded-full ${event.eventType === "WEBINAR" ? "bg-blue-100 text-blue-800" :
                          event.eventType === "WORKSHOP" ? "bg-green-100 text-green-800" :
                            event.eventType === "SEMINAR" ? "bg-purple-100 text-purple-800" :
                              "bg-yellow-100 text-yellow-800"
                        }`}>
                        {event.eventType}
                      </span>
                    </td>
                    <td className="hidden md:table-cell p-2 md:p-3 text-gray-700">{formatDate(event.eventDate)}</td>
                    <td className="hidden md:table-cell p-2 md:p-3 text-gray-700">{formatTime(event.eventTime)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md md:max-w-2xl max-h-[85vh] overflow-y-auto p-4 md:p-6 w-[95vw] md:w-auto">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-lg md:text-2xl font-bold">Event Details</DialogTitle>
              <DialogDescription className="text-sm md:text-base">View and update event information</DialogDescription>
            </DialogHeader>
            {selectedEvent && (
              <div className="space-y-4 md:space-y-6">
                <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6">
                  <div className="h-16 w-16 md:h-20 md:w-20 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-xl md:text-2xl mx-auto md:mx-0">
                    {(() => {
                      const words = selectedEvent.eventTitle
                        .replace(/[&.]/g, ' ')
                        .split(" ")
                        .filter(word => word.length > 0);

                      if (words.length > 3) {
                        return (words[0][0] + words[words.length - 1][0]).toUpperCase();
                      }

                      return words
                        .map(word => word[0])
                        .join('')
                        .toUpperCase();
                    })()}
                  </div>
                  <div className="text-center md:text-left flex-1">
                    <h2 className="text-xl md:text-2xl font-bold break-words">{selectedEvent.eventTitle}</h2>
                    <p className="text-gray-600">{selectedEvent.eventType}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                  <div className="flex items-center space-x-3 md:space-x-4">
                    <div className="p-2 md:p-3 bg-blue-100 rounded-full flex-shrink-0">
                      <User className="h-4 w-4 md:h-5 md:w-5 text-blue-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs md:text-sm text-gray-600">Host</p>
                      <p className="font-medium text-sm md:text-base truncate">{getHostName(selectedEvent)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 md:space-x-4">
                    <div className="p-2 md:p-3 bg-green-100 rounded-full flex-shrink-0">
                      <BookOpen className="h-4 w-4 md:h-5 md:w-5 text-green-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs md:text-sm text-gray-600">Faculty</p>
                      <p className="font-medium text-sm md:text-base truncate">{selectedEvent.faculty?.user.name || "Not assigned"}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 md:space-x-4">
                    <div className="p-2 md:p-3 bg-purple-100 rounded-full flex-shrink-0">
                      <Calendar className="h-4 w-4 md:h-5 md:w-5 text-purple-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs md:text-sm text-gray-600">Date & Time</p>
                      <p className="font-medium text-sm md:text-base">
                        {formatDate(selectedEvent.eventDate)} {formatTime(selectedEvent.eventTime)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 md:space-x-4">
                    <div className="p-2 md:p-3 bg-yellow-100 rounded-full flex-shrink-0">
                      <Clock className="h-4 w-4 md:h-5 md:w-5 text-yellow-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs md:text-sm text-gray-600">Duration</p>
                      <p className="font-medium text-sm md:text-base">{selectedEvent.eventDuration}</p>
                    </div>
                  </div>
                  
                  {/* Alumni Email contact information - now read-only */}
                  <div className="flex items-center space-x-3 md:space-x-4">
                    <div className="p-2 md:p-3 bg-red-100 rounded-full flex-shrink-0">
                      <Mail className="h-4 w-4 md:h-5 md:w-5 text-red-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs md:text-sm text-gray-600">Alumni Email</p>
                      <p className="font-medium text-sm md:text-base truncate">{getAlumniEmail(selectedEvent)}</p>
                    </div>
                  </div>
                  
                  {/* Alumni Phone contact information - now read-only */}
                  <div className="flex items-center space-x-3 md:space-x-4">
                    <div className="p-2 md:p-3 bg-green-100 rounded-full flex-shrink-0">
                      <Phone className="h-4 w-4 md:h-5 md:w-5 text-green-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs md:text-sm text-gray-600">Alumni Phone</p>
                      <p className="font-medium text-sm md:text-base truncate">{getAlumniPhone(selectedEvent)}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 md:space-y-4">
                  <div className="flex items-start space-x-3 md:space-x-4">
                    <div className="p-2 md:p-3 bg-indigo-100 rounded-full flex-shrink-0">
                      <ListTodo className="h-4 w-4 md:h-5 md:w-5 text-indigo-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs md:text-sm text-gray-600">Agenda</p>
                      <p className="font-medium text-sm md:text-base break-words">{selectedEvent.eventAgenda}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 md:space-y-4">
                  <div className="flex items-start space-x-3 md:space-x-4">
                    <div className="p-2 md:p-3 bg-purple-100 rounded-full flex-shrink-0">
                      <FileText className="h-4 w-4 md:h-5 md:w-5 text-purple-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs md:text-sm text-gray-600">Description</p>
                      <p className="font-medium text-sm md:text-base break-words">{selectedEvent.eventDescription}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-3 md:mt-4">
                  <p className="text-xs md:text-sm text-gray-600 mb-1">Event Link:</p>
                  <div className="flex flex-col space-y-2 mt-1 md:mt-2">
                    <input
                      type="text"
                      value={eventLink}
                      onChange={(e) => setEventLink(e.target.value)}
                      className="border p-2 rounded w-full text-sm md:text-base"
                      placeholder="Enter event link..."
                      disabled={updateLoading}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end mt-4 pt-2 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-2 sm:space-y-0 w-full sm:w-auto">
                    <button
                      onClick={() => setIsDialogOpen(false)}
                      className="px-3 py-1.5 md:px-4 md:py-2 bg-gray-200 text-gray-800 text-sm md:text-base rounded hover:bg-gray-300 order-2 sm:order-1"
                      disabled={updateLoading}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdateDetails}
                      className={`px-3 py-1.5 md:px-4 md:py-2 bg-blue-500 text-white text-sm md:text-base rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2 ${
                        updateLoading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      disabled={updateLoading}
                    >
                      {updateLoading ? 'Updating...' : 'Update Details'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}