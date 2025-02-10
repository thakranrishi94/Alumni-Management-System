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
  Type,
  Users,
  FileText,
  ListTodo,
  MessageSquare,
  Target,
  AlertCircle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import toast from "react-hot-toast";

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

export default function EventRequestPage() {
  // States for event requests
  const [eventRequests, setEventRequests] = useState<EventRequest[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<EventRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<EventRequest | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreateEventDialogOpen, setIsCreateEventDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [selectedFacultyId, setSelectedFacultyId] = useState<number | null>(null);
  const [updateLoading, setUpdateLoading] = useState(false);

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
      } catch (err) {
        setError("Failed to fetch data");
        setLoading(false);
        toast({
          title: "Error",
          description: "Failed to fetch data. Please try again.",
          variant: "destructive",
        });
      }
    };

    fetchData();
  }, []);

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
        } catch (err) {
          console.error("Failed to fetch available faculties:", err);
          toast({
            title: "Error",
            description: "Failed to load available faculty members",
            variant: "destructive",
          });
        }
      }
    };

    fetchAvailableFaculties();
  }, [selectedEvent]);

  // Search functionality
  useEffect(() => {
    const filtered = eventRequests.filter(event =>
      event.eventTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.eventType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.alumni.user.name.toLowerCase().includes(searchQuery.toLowerCase())
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
    } catch (err) {
      console.error("Failed to update event status:", err);
      
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
        description: "Failed to update event status. Please check the console for details.",
        variant: "destructive",
      });
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleCreateEvent = async () => {
    try {
      if (!selectedDate) {
        toast({
          title: "Error",
          description: "Please select a date",
          variant: "destructive",
        });
        return;
      }

      const eventDate = new Date(selectedDate);
      eventDate.setUTCHours(0, 0, 0, 0);

      const eventData = {
        adminId: 1, // Replace with actual alumni ID from auth
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

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/event`, eventData);
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
    } catch (err) {
      console.error("Failed to create event:", err);
      toast({
        title: "Error",
        description: "Failed to create event",
        variant: "destructive",
      });
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
          <Button
            onClick={() => setIsCreateEventDialogOpen(true)}
            className="bg-blue-600 hover:bg-blue-500 w-full md:w-auto"
          >
            <Plus className="mr-2 h-4 w-4" /> Create New Event
          </Button>
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
        <DialogContent className="w-full sm:max-w-7xl">
          <DialogHeader>
            <DialogTitle className="text-xl md:text-2xl font-bold">Event Request Details</DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-6">
              {/* Header Section */}
              <div className="mb-8">
                <h2 className="text-xl font-bold">{selectedEvent.eventTitle}</h2>
                <p className="text-gray-600">{selectedEvent.eventType}</p>
                <p className="mt-2">{selectedEvent.eventDescription}</p>
              </div>

              {/* Three Column Layout */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Column 1: Basic Info */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-semibold">Host</p>
                      <p>{selectedEvent.alumni?.user.name || "Admin"}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <BookOpen className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-semibold">Faculty</p>
                      <p>{selectedEvent.faculty?.user.name || 'Not assigned'}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-purple-500" />
                    <div>
                      <p className="font-semibold">Date & Time</p>
                      <p>{format(new Date(selectedEvent.eventDate), 'PP')} at {selectedEvent.eventTime}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-orange-500" />
                    <div>
                      <p className="font-semibold">Duration</p>
                      <p>{selectedEvent.eventDuration}</p>
                    </div>
                  </div>
                </div>

                {/* Column 2: Target & Requirements */}
                <div className="space-y-6">
                  <div className="flex items-start space-x-3">
                    <Target className="h-5 w-5 text-red-500 mt-1" />
                    <div>
                      <p className="font-semibold">Target Audience</p>
                      <p className="whitespace-pre-wrap">{selectedEvent.targetAudience}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-yellow-500 mt-1" />
                    <div>
                      <p className="font-semibold">Special Requirements</p>
                      <p className="whitespace-pre-wrap">{selectedEvent.specialRequirements}</p>
                    </div>
                  </div>
                </div>

                {/* Column 3: Agenda & Actions */}
                <div className="space-y-6">
                  <div className="flex items-start space-x-3">
                    <ListTodo className="h-5 w-5 text-indigo-500 mt-1" />
                    <div>
                      <p className="font-semibold">Event Agenda</p>
                      <p className="whitespace-pre-wrap">{selectedEvent.eventAgenda}</p>
                    </div>
                  </div>

                  {selectedEvent.requestStatus === "PENDING" && (
                    <div className="space-y-6">
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

                      <div className="flex justify-end space-x-3 pt-4">
                        <Button
                          variant="outline"
                          className="border-red-300 text-red-600 hover:bg-red-50"
                          onClick={() => handleEventStatus(selectedEvent.eventRequestId, "REJECTED")}
                          disabled={updateLoading}
                        >
                          {updateLoading ? "Processing..." : "Reject"}
                        </Button>
                        <Button
                          className="bg-green-600 hover:bg-green-500 text-white"
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
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full mt-1 flex justify-start items-center">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
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
    </div>
  );
}