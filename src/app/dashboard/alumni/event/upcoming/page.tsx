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
import { Calendar, User, BookOpen, FileText, Tag, Clock, ListTodo, Plus } from "lucide-react";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";


//Interface of form data
type EventRequest = {
  eventRequestId: number;
  alumniId: number;
  facultyId: number | null;
  eventTitle: string;
  eventDescription: string;
  eventType: "WEBINAR" | "WORKSHOP" | "SEMINAR" | "LECTURE";
  eventDate: string;
  eventTime: string;
  eventDuration: string;
  eventLink: string | null;
  targetAudience: string;
  requestStatus: "PENDING" | "APPROVED" | "REJECTED";
  eventAgenda: string;
  specialRequirements: string;
  alumni: {
    user: {
      name: string;
    };
  };
  faculty?: {
    user: {
      name: string;
    };
  };
};

// Update interface to make relationships optional
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
    };
  } | null;
  faculty?: {
    user: {
      name: string;
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

// Utility functions
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
  return event.adminId ? 'Admin' : 'Unknown Host';
};

// Component for the Events Table
const EventsTable = ({
  events,
  searchQuery,
  onRowClick
}: {
  events: Event[],
  searchQuery: string,
  onRowClick: (event: Event) => void
}) => {
  const filteredEvents = events.filter(event =>
    event.eventTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.eventType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    getHostName(event).toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.eventAgenda.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mt-8 bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left text-gray-700 font-semibold">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <span>Event Name</span>
                </div>
              </th>
              <th className="p-3 text-left text-gray-700 font-semibold">
                <div className="flex items-center space-x-2">
                  <ListTodo className="h-4 w-4 text-purple-500" />
                  <span>Agenda</span>
                </div>
              </th>
              <th className="p-3 text-left text-gray-700 font-semibold">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-green-500" />
                  <span>Host</span>
                </div>
              </th>
              <th className="p-3 text-left text-gray-700 font-semibold">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-4 w-4 text-purple-500" />
                  <span>Faculty</span>
                </div>
              </th>
              <th className="p-3 text-left text-gray-700 font-semibold">
                <div className="flex items-center space-x-2">
                  <Tag className="h-4 w-4 text-red-500" />
                  <span>Type</span>
                </div>
              </th>
              <th className="p-3 text-left text-gray-700 font-semibold">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <span>Date</span>
                </div>
              </th>
              <th className="p-3 text-left text-gray-700 font-semibold">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-indigo-500" />
                  <span>Time</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.map((event, index) => (
              <tr
                key={event.eventRequestId}
                onClick={() => onRowClick(event)}
                className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-gray-100 transition-colors cursor-pointer`}
              >
                <td className="p-3 text-gray-700">{event.eventTitle}</td>
                <td className="p-3 text-gray-700">{event.eventAgenda}</td>
                <td className="p-3 text-gray-700">{getHostName(event)}</td>
                <td className="p-3 text-gray-700">{event.faculty?.user.name || 'Not assigned'}</td>
                <td className="p-3 text-gray-700">
                  <span className={`px-2 py-1 text-sm rounded-full ${event.eventType === "WEBINAR" ? "bg-blue-100 text-blue-800" :
                    event.eventType === "WORKSHOP" ? "bg-green-100 text-green-800" :
                      event.eventType === "SEMINAR" ? "bg-purple-100 text-purple-800" :
                        "bg-yellow-100 text-yellow-800"
                    }`}>
                    {event.eventType}
                  </span>
                </td>
                <td className="p-3 text-gray-700">{formatDate(event.eventDate)}</td>
                <td className="p-3 text-gray-700">{formatTime(event.eventTime)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Component for the Event Details Dialog
const EventDetailsDialog = ({
  isOpen,
  onOpenChange,
  selectedEvent
}: {
  isOpen: boolean,
  onOpenChange: (open: boolean) => void,
  selectedEvent: Event | null
}) => {
  if (!selectedEvent) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Event Details</DialogTitle>
          <DialogDescription>View and update event information</DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="flex items-center space-x-6">
            <div className="h-20 w-20 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-2xl">
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
            <div>
              <h2 className="text-2xl font-bold">{selectedEvent.eventTitle}</h2>
              <p className="text-gray-600">{selectedEvent.eventType}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <User className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Host</p>
                <p className="font-medium">{getHostName(selectedEvent)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-full">
                <BookOpen className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Faculty</p>
                <p className="font-medium">{selectedEvent.faculty?.user.name || "Not assigned"}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <Calendar className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Date & Time</p>
                <p className="font-medium">
                  {formatDate(selectedEvent.eventDate)} {formatTime(selectedEvent.eventTime)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-yellow-100 rounded-full">
                <Clock className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Duration</p>
                <p className="font-medium">{selectedEvent.eventDuration}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-indigo-100 rounded-full">
                <ListTodo className="h-5 w-5 text-indigo-500" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Agenda</p>
                <p className="font-medium">{selectedEvent.eventAgenda}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <FileText className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Description</p>
                <p className="font-medium">{selectedEvent.eventDescription}</p>
              </div>
            </div>
          </div>

          {selectedEvent.eventLink && (
            <div className="mt-4">
              <p className="text-sm text-gray-600">Event Link:</p>
              <a href={selectedEvent.eventLink} target="_blank" rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600">
                {selectedEvent.eventLink}
              </a>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Component for the Create Event Dialog
const CreateEventDialog = ({
  isOpen,
  onOpenChange,
  onEventCreated
}: {
  isOpen: boolean,
  onOpenChange: (open: boolean) => void,
  onEventCreated: () => void
}) => {
  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventType, setEventType] = useState<EventRequest["eventType"]>("WEBINAR");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [eventTime, setEventTime] = useState("");
  const [eventDuration, setEventDuration] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [eventAgenda, setEventAgenda] = useState("");
  const [specialRequirements, setSpecialRequirements] = useState("");
  const { toast } = useToast();

  const handleCreateEvent = async () => {
    try {
      // Validation checks
      const requiredFields = {
        'Event Title': eventTitle,
        'Event Description': eventDescription,
        'Event Type': eventType,
        'Event Date': selectedDate,
        'Event Time': eventTime,
        'Event Duration': eventDuration,
        'Target Audience': targetAudience,
        'Event Agenda': eventAgenda,
        'Special Requirements': specialRequirements
      };

      // Check each required field
      for (const [fieldName, value] of Object.entries(requiredFields)) {
        if (!value || value.toString().trim() === '') {
          toast({
            title: `${fieldName}`,
            description: `${fieldName} is required`,
            variant: "destructive",
          });
          return;
        }
      }

      // Additional specific validations
      if (!selectedDate) {
        toast({
          title: "Validation Error",
          description: "Please select a date",
          variant: "destructive",
        });
        return;
      }

      // Time format validation
      const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(eventTime)) {
        toast({
          title: "Validation Error",
          description: "Please enter a valid time in HH:MM format",
          variant: "destructive",
        });
        return;
      }

      // Duration format suggestion
      if (!eventDuration.includes('hour') && !eventDuration.includes('min')) {
        toast({
          title: "Validation Error",
          description: "Please specify duration in hours or minutes (e.g., '2 hours' or '30 minutes')",
          variant: "destructive",
        });
        return;
      }

      const eventDate = new Date(selectedDate);
      eventDate.setUTCHours(0, 0, 0, 0);

      const eventData = {
        alumniId: null,
        facultyId: null,
        eventTitle,
        eventDescription,
        eventType,
        eventDate: eventDate.toISOString(),
        eventTime,
        eventDuration,
        targetAudience,
        eventAgenda,
        specialRequirements,
        requestStatus: "PENDING" as const,
      };

      const token = Cookies.get('ams_token');
      console.log(token)

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/event`, eventData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      onOpenChange(false);
      toast({
        title: "Success",
        description: "Event created successfully",
      });

      // Reset form
      setEventTitle("");
      setEventDescription("");
      setEventType("WEBINAR");
      setSelectedDate(undefined);
      setEventTime("");
      setEventDuration("");
      setTargetAudience("");
      setEventAgenda("");
      setSpecialRequirements("");

      // Notify parent component to refresh events
      onEventCreated();
    } catch (error) {
      console.error("Failed to create event:", error);
      toast({
        title: "Error",
        description: "Failed to create event",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-full sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl md:text-2xl font-bold">Create New Event</DialogTitle>
          <DialogDescription>Fill in the event details</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Row 1: Event Title & Event Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <Label htmlFor="eventTitle">Event Title</Label>
              <Input
                id="eventTitle"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                className="w-full mt-1"
                required
              />
            </div>
            <div className="flex flex-col">
              <Label htmlFor="eventType">Event Type</Label>
              <Select
                value={eventType}
                onValueChange={(value: EventRequest["eventType"]) => setEventType(value)}
                required
              >
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WEBINAR">Webinar</SelectItem>
                  <SelectItem value="WORKSHOP">Workshop</SelectItem>
                  <SelectItem value="SEMINAR">Seminar</SelectItem>
                  <SelectItem value="LECTURE">Lecture</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 2: Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <Label htmlFor="eventDate">Date</Label>
              <Input
                id="eventDate"
                type="date"
                value={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                className="w-full mt-1"
                min={format(new Date(), 'yyyy-MM-dd')}
                required
              />
            </div>
            <div className="flex flex-col">
              <Label htmlFor="eventTime">Time</Label>
              <Input
                id="eventTime"
                type="time"
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
                className="w-full mt-1"
                required
              />
            </div>
          </div>

          {/* Row 3: Duration & Target Audience */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <Label htmlFor="eventDuration">Duration</Label>
              <Input
                id="eventDuration"
                value={eventDuration}
                onChange={(e) => setEventDuration(e.target.value)}
                placeholder="e.g., 2 hours"
                className="w-full mt-1"
                required
              />
            </div>
            <div className="flex flex-col">
              <Label htmlFor="targetAudience">Target Audience</Label>
              <Input
                id="targetAudience"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="w-full mt-1"
                required
              />
            </div>
          </div>

          {/* Row 4: Description & Agenda */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <Label htmlFor="eventDescription">Description</Label>
              <Input
                id="eventDescription"
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
                className="w-full mt-1"
                required
              />
            </div>
            <div className="flex flex-col">
              <Label htmlFor="eventAgenda">Agenda</Label>
              <Input
                id="eventAgenda"
                value={eventAgenda}
                onChange={(e) => setEventAgenda(e.target.value)}
                className="w-full mt-1"
                required
              />
            </div>
          </div>

          {/* Special Requirements */}
          <div className="flex flex-col">
            <Label htmlFor="specialRequirements">Special Requirements</Label>
            <Input
              id="specialRequirements"
              value={specialRequirements}
              onChange={(e) => setSpecialRequirements(e.target.value)}
              className="w-full mt-1"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              onClick={() => onOpenChange(false)}
              variant="outline"
              className="border-gray-300"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateEvent}
              className="bg-blue-600 hover:bg-blue-500"
            >
              Create Event
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default function UpcomingEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateEventDialogOpen, setIsCreateEventDialogOpen] = useState(false);
  // const { toast } = useToast();

  const fetchEvents = async () => {
    try {
      const token = Cookies.get('ams_token');

      if (!token) {
        setError("Authentication required");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/event/events/alumni/upcoming`,
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

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleRowClick = (event: Event) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
  };

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (error) return <div className="flex items-center justify-center h-screen text-red-500">{error}</div>;

  return (
    <div className="bg-gray-100 w-full">
      <main className="flex-1 p-8 overflow-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h1 className="text-xl md:text-2xl font-bold">Upcoming Events</h1>
            <p className="text-gray-600">See all the upcoming events click on row to see the details of the event </p>
            <p className="text-gray-600">Meeting Link will be visible if it assisgned </p>
          </div>
          <Button
            onClick={() => setIsCreateEventDialogOpen(true)}
            className="bg-blue-600 hover:bg-blue-500 w-full md:w-auto"
          >
            <Plus className="mr-2 h-4 w-4" /> Create New Event
          </Button>
        </div>
        <div className="mt-6">
          <input
            type="text"
            placeholder="Search events by name, type, host, or agenda"
            className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <EventsTable
          events={events}
          searchQuery={searchQuery}
          onRowClick={handleRowClick}
        />

        <EventDetailsDialog
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          selectedEvent={selectedEvent}
        />

        <CreateEventDialog
          isOpen={isCreateEventDialogOpen}
          onOpenChange={setIsCreateEventDialogOpen}
          onEventCreated={fetchEvents}
        />
      </main>
    </div>
  );
}