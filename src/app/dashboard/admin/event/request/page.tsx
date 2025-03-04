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
import { Button } from "@/components/ui/button";
import {
  Calendar,
  User,
  BookOpen,
  Clock,
  Plus,
  Search,
  ListTodo,
  Target,
  AlertCircle,
  UserPlus
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import Cookies from "js-cookie";
import { useToast } from "@/hooks/use-toast";
import AlumniConsentForm from "@/components/HomeComponents/AlumniConsentForm";

// Types
type Faculty = {
  id: number;
  user: {
    name: string;
  };
};

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
//formate date and time
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

export default function EventRequestPage() {
  // States for event requests
  const [eventRequests, setEventRequests] = useState<EventRequest[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<EventRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<EventRequest | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreateEventDialogOpen, setIsCreateEventDialogOpen] = useState(false);
  const [isAlumniEventFormOpen, setIsAlumniEventFormOpen] = useState(false); // New state for Alumni Event Form
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [selectedFacultyId, setSelectedFacultyId] = useState<number | null>(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const { toast } = useToast();

  // Form states
  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventType, setEventType] = useState<EventRequest["eventType"]>("WEBINAR");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [eventTime, setEventTime] = useState("");
  const [eventDuration, setEventDuration] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [eventAgenda, setEventAgenda] = useState("");
  const [specialRequirements, setSpecialRequirements] = useState("");

  // Fetch event requests
  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventResponse = await axios.get<EventRequest[]>(`${process.env.NEXT_PUBLIC_API_URL}/event`);
        setEventRequests(eventResponse.data);
        setFilteredEvents(eventResponse.data);
        setLoading(false);
      } catch (error) {
        setError(`${error}`);
        setLoading(false);
        toast({
          title: "Error",
          description: "Failed to fetch data. Please try again.",
          variant: "destructive",
        });
      }
    };

    fetchData();
  }, [toast]);

  // Fetch available faculties when viewing event details
  useEffect(() => {
    const fetchAvailableFaculties = async () => {
      if (selectedEvent) {
        try {
          const formattedDate = format(new Date(selectedEvent.eventDate), 'yyyy-MM-dd');
          const response = await axios.get<Faculty[]>(
            `${process.env.NEXT_PUBLIC_API_URL}/faculty/available-faculty?date=${formattedDate}`
          );
          setFaculties(response.data);
        } catch (error) {
          console.error("Failed to fetch available faculties:", error);
          toast({
            title: "Error",
            description: "Failed to load available faculty members",
            variant: "destructive",
          });
        }
      }
    };

    fetchAvailableFaculties();
  }, [selectedEvent, toast]);

  // Search functionality
  useEffect(() => {
    const filtered = eventRequests.filter(event =>
      event.eventTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.eventType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.alumni?.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
    );
    setFilteredEvents(filtered);
  }, [searchQuery, eventRequests]);

  // Handlers
  const handleViewDetails = (event: EventRequest) => {
    setSelectedEvent(event);
    setSelectedFacultyId(event.facultyId);
    setIsDialogOpen(true);
  };

  const handleEventStatus = async (eventRequestId: number, requestStatus: "APPROVED" | "REJECTED") => {
    try {
      setUpdateLoading(true);

      if (requestStatus === "APPROVED" && !selectedFacultyId) {
        toast({
          title: "Error",
          description: "Please select a faculty member before approving.",
          variant: "destructive",
        });
        return;
      }

      const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/event/${eventRequestId}/status`;

      if (!process.env.NEXT_PUBLIC_API_URL) {
        throw new Error('API URL is not configured');
      }

      const response = await axios.put(endpoint, {
        requestStatus,
        facultyId: selectedFacultyId
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.status !== 200) {
        throw new Error(`API returned status ${response.status}`);
      }

      const updatedEvents = await axios.get<EventRequest[]>(`${process.env.NEXT_PUBLIC_API_URL}/event`);
      setEventRequests(updatedEvents.data);
      setFilteredEvents(updatedEvents.data);
      setIsDialogOpen(false);

      toast({
        title: "Success",
        description: `Event ${requestStatus.toLowerCase()} successfully`,
      });
    } catch (error) {
      console.error("Failed to update event status:", error);

      if (axios.isAxiosError(error)) {
        console.error('Axios Error:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          config: error.config
        });
      }

      toast({
        title: "Error",
        description: "Failed to update event status. Please check the console for details.",
        variant: "destructive",
      });
    } finally {
      setUpdateLoading(false);
    }
  };

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
      const token = Cookies.get('ams_token')
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/event`, eventData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const response = await axios.get<EventRequest[]>(`${process.env.NEXT_PUBLIC_API_URL}/event`);
      setEventRequests(response.data);
      setFilteredEvents(response.data);

      setIsCreateEventDialogOpen(false);
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
    } catch (error) {
      console.error("Failed to create event:", error);
      toast({
        title: "Error",
        description: "Failed to create event",
        variant: "destructive",
      });
    }
  };

  // Handle refresh events after alumni event creation
  const handleAlumniEventCreated = async () => {
    try {
      const eventResponse = await axios.get<EventRequest[]>(`${process.env.NEXT_PUBLIC_API_URL}/event`);
      setEventRequests(eventResponse.data);
      setFilteredEvents(eventResponse.data);
      return Promise.resolve();
    } catch (error) {
      console.error("Failed to refresh events:", error);
      toast({
        title: "Error",
        description: "Failed to refresh events after creating alumni event",
        variant: "destructive",
      });
      return Promise.reject(error);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (error) return <div className="flex items-center justify-center h-screen text-red-500">{error}</div>;

  return (
    <div className="bg-gray-100 w-full">
      <main className="flex-1 p-4 md:p-8 overflow-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h1 className="text-xl md:text-2xl font-bold">Event Requests</h1>
            <p className="text-gray-600">Manage Event Requests</p>
          </div>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-3 w-full md:w-auto">
            <Button
              onClick={() => setIsAlumniEventFormOpen(true)}
              className="bg-green-600 hover:bg-green-500 w-full md:w-auto"
            >
              <UserPlus className="mr-2 h-4 w-4" /> Alumni Consent Form
            </Button>
            <Button
              onClick={() => setIsCreateEventDialogOpen(true)}
              className="bg-blue-600 hover:bg-blue-500 w-full md:w-auto"
            >
              <Plus className="mr-2 h-4 w-4" /> Create New Event
            </Button>
          </div>
        </div>

        <div className="mt-6 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            className="pl-10 pr-4 py-2"
            type="text"
            placeholder="Search by event name, type, or host..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredEvents.map((event, index) => (
            <div
              key={event.eventRequestId || index}
              onClick={() => handleViewDetails(event)}
              className="bg-white p-4 md:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Calendar className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-bold">{event.eventTitle}</h2>
                  <p className="text-gray-600">{event.eventType}</p>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-500" />
                  <p className="text-gray-700">
                    <strong>Host:</strong> {event.alumni?.user.name || "Admin"}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-gray-500" />
                  <p className="text-gray-700">
                    <strong>Faculty:</strong> {event.faculty?.user.name || 'Not assigned'}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-gray-500" />
                  <p className="text-gray-700">
                    <strong>Date:</strong> {format(new Date(event.eventDate), 'PP')}
                  </p>
                </div>
                <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                  ${event.requestStatus === 'APPROVED' ? 'bg-green-100 text-green-800' :
                  event.requestStatus === 'REJECTED' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'}">
                  {event.requestStatus}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Event Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[95vw] max-h-[90vh] overflow-hidden sm:max-w-7xl">
          <DialogHeader className="sticky top-0 z-10">
            <DialogTitle className="text-xl md:text-2xl font-bold">Event Request Details</DialogTitle>
          </DialogHeader>
          
          {selectedEvent && (
            <div className="overflow-y-auto max-h-[calc(90vh-8rem)] pr-2">
              <div className="space-y-6 py-4">
                {/* Header Section */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold">{selectedEvent.eventTitle}</h2>
                  <p className="text-gray-600">{selectedEvent.eventType}</p>
                  <p className="mt-2">{selectedEvent.eventDescription}</p>
                </div>

                {/* Responsive Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Column 1: Basic Info */}
                  <div className="space-y-4  p-4 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <User className="h-5 w-5 text-blue-500 shrink-0" />
                      <div className="min-w-0">
                        <p className="font-semibold">Host</p>
                        <p className="truncate">{selectedEvent.alumni?.user.name || "Admin"}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <BookOpen className="h-5 w-5 text-green-500 shrink-0" />
                      <div className="min-w-0">
                        <p className="font-semibold">Faculty</p>
                        <p className="truncate">{selectedEvent.faculty?.user.name || 'Not assigned'}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-purple-500 shrink-0" />
                      <div className="min-w-0">
                        <p className="font-semibold">Date & Time</p>
                        <p className="truncate">
                        {formatDate(selectedEvent.eventDate)} {formatTime(selectedEvent.eventTime)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Clock className="h-5 w-5 text-orange-500 shrink-0" />
                      <div className="min-w-0">
                        <p className="font-semibold">Duration</p>
                        <p className="truncate">{selectedEvent.eventDuration}</p>
                      </div>
                    </div>
                  </div>

                  {/* Column 2: Target & Requirements */}
                  <div className="space-y-4 p-4 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <Target className="h-5 w-5 text-red-500 mt-1 shrink-0" />
                      <div className="min-w-0">
                        <p className="font-semibold">Target Audience</p>
                        <p className="whitespace-pre-wrap break-words">{selectedEvent.targetAudience}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <AlertCircle className="h-5 w-5 text-yellow-500 mt-1 shrink-0" />
                      <div className="min-w-0">
                        <p className="font-semibold">Special Requirements</p>
                        <p className="whitespace-pre-wrap break-words">{selectedEvent.specialRequirements}</p>
                      </div>
                    </div>
                  </div>

                  {/* Column 3: Agenda & Actions */}
                  <div className="space-y-4  p-4 rounded-lg  md:col-span-2 lg:col-span-1">
                    <div className="flex items-start space-x-3">
                      <ListTodo className="h-5 w-5 text-indigo-500 mt-1 shrink-0" />
                      <div className="min-w-0">
                        <p className="font-semibold">Event Agenda</p>
                        <p className="whitespace-pre-wrap break-words">{selectedEvent.eventAgenda}</p>
                      </div>
                    </div>

                    {selectedEvent.requestStatus === "PENDING" && (
                      <div className="space-y-4 pt-4 border-t mt-4">
                        <div className="flex flex-col space-y-2">
                          <Label htmlFor="faculty">Assign Faculty</Label>
                          <Select
                            value={selectedFacultyId?.toString() || ""}
                            onValueChange={(value) => setSelectedFacultyId(Number(value))}
                            disabled={faculties.length === 0}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder={
                                faculties.length === 0
                                  ? "No available faculty"
                                  : "Select a faculty member"
                              } />
                            </SelectTrigger>
                            <SelectContent>
                              {faculties.map((faculty) => (
                                <SelectItem key={faculty.id} value={faculty.id.toString()}>
                                  {faculty.user.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 pt-4">
                          <Button
                            variant="outline"
                            className="border-red-300 text-red-600 hover:bg-red-50 w-full sm:w-auto"
                            onClick={() => handleEventStatus(selectedEvent.eventRequestId, "REJECTED")}
                            disabled={updateLoading}
                          >
                            {updateLoading ? "Processing..." : "Reject"}
                          </Button>
                          <Button
                            className="bg-green-600 hover:bg-green-500 text-white w-full sm:w-auto"
                            onClick={() => handleEventStatus(selectedEvent.eventRequestId, "APPROVED")}
                            disabled={!selectedFacultyId || updateLoading}
                          >
                            {updateLoading ? "Processing..." : "Approve"}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Event Dialog */}
      <Dialog open={isCreateEventDialogOpen} onOpenChange={setIsCreateEventDialogOpen}>
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
                onClick={() => setIsCreateEventDialogOpen(false)}
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

      {/* Alumni Event Form Dialog */}
      <AlumniConsentForm 
        isOpen={isAlumniEventFormOpen} 
        onClose={() => setIsAlumniEventFormOpen(false)}
        onEventCreated={handleAlumniEventCreated}
      />
    </div>
  );
}