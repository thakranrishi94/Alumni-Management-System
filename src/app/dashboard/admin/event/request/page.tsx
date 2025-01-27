"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, User, BookOpen, Clock, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

// Define the type for Event Request
type EventRequest = {
  id: number;
  EventName: string;
  HostName: string;
  FacultyName: string;
  Title: string;
  Type: string;
  Date: string;
};

// Define the type for Faculty
type Faculty = {
  id: number;
  name: string;
};

export default function EventRequestPage() {
  const [selectedEvent, setSelectedEvent] = useState<EventRequest | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState<string>("");
  const [isCreateEventDialogOpen, setIsCreateEventDialogOpen] = useState(false);
  const [eventName, setEventName] = useState("");
  const [hostName, setHostName] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedFacultyForCreate, setSelectedFacultyForCreate] = useState("");
  const [eventImage, setEventImage] = useState<File | null>(null);

  // Validation error states
  const [eventNameError, setEventNameError] = useState("");
  const [hostNameError, setHostNameError] = useState("");
  const [dateError, setDateError] = useState("");
  const [facultyError, setFacultyError] = useState("");
  const [eventImageError, setEventImageError] = useState("");

  // Sample data for Event Requests
  const eventRequests: EventRequest[] = [
    {
      id: 1,
      EventName: "Tech Conference 2023",
      HostName: "Marie Johnson",
      FacultyName: "Dr. John Doe",
      Title: "Future of AI",
      Type: "Conference",
      Date: "2023-10-15",
    },
    {
      id: 2,
      EventName: "Workshop on Web Development",
      HostName: "Sarah Liu",
      FacultyName: "Prof. Jane Smith",
      Title: "Advanced JavaScript",
      Type: "Workshop",
      Date: "2023-11-05",
    },
  ];

  // Sample data for Faculty
  const facultyMembers: Faculty[] = [
    { id: 1, name: "Dr. John Doe" },
    { id: 2, name: "Prof. Jane Smith" },
  ];

  const handleViewDetails = (event: EventRequest) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedEvent(null);
    setSelectedFaculty("");
  };

  const handleFacultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFaculty(e.target.value);
  };

  const handleApprove = () => {
    if (selectedEvent && selectedFaculty) {
      console.log("Event Approved:", selectedEvent);
      console.log("Assigned Faculty:", selectedFaculty);
      handleCloseDialog();
    } else {
      alert("Please select a faculty member to approve the event.");
    }
  };

  const handleReject = () => {
    handleCloseDialog();
  };

  const handleCreateEvent = () => {
    setIsCreateEventDialogOpen(true);
  };

  const handleCloseCreateEventDialog = () => {
    setIsCreateEventDialogOpen(false);
    setEventName("");
    setHostName("");
    setSelectedDate(undefined);
    setSelectedFacultyForCreate("");
    setEventImage(null);
    // Clear validation errors
    setEventNameError("");
    setHostNameError("");
    setDateError("");
    setFacultyError("");
    setEventImageError("");
  };

  const handleSubmitCreateEvent = () => {
    let isValid = true;

    if (!eventName) {
      setEventNameError("Event name is required");
      isValid = false;
    } else {
      setEventNameError("");
    }

    if (!hostName) {
      setHostNameError("Host name is required");
      isValid = false;
    } else {
      setHostNameError("");
    }

    if (!selectedDate) {
      setDateError("Date is required");
      isValid = false;
    } else {
      setDateError("");
    }

    if (!selectedFacultyForCreate) {
      setFacultyError("Faculty is required");
      isValid = false;
    } else {
      setFacultyError("");
    }

    if (!eventImage) {
      setEventImageError("Event image is required");
      isValid = false;
    } else {
      setEventImageError("");
    }

    if (isValid) {
      console.log("New Event Created:", {
        eventName,
        hostName,
        selectedDate,
        selectedFacultyForCreate,
        eventImage,
      });

      handleCloseCreateEventDialog();
    }
  };

  return (
    <div className="bg-gray-100 w-full">
      <main className="flex-1 p-4 md:p-8 overflow-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h1 className="text-xl md:text-2xl font-bold">Event Requests</h1>
            <p className="text-gray-600">Manage Event Requests</p>
          </div>
          <Button onClick={handleCreateEvent} className="bg-blue-600 hover:bg-blue-500 w-full md:w-auto">
            <Plus className="mr-2 h-4 w-4" /> Create New Event
          </Button>
        </div>

        <div className="mt-6">
          <input
            type="text"
            placeholder="Search event requests by name, host, or type"
            className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
          />
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {eventRequests.map((event) => (
            <div
              key={event.id}
              onClick={() => handleViewDetails(event)}
              className="bg-white p-4 md:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Calendar className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-bold">{event.EventName}</h2>
                  <p className="text-gray-600">{event.Type}</p>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-500" />
                  <p className="text-gray-700">
                    <strong>Host:</strong> {event.HostName}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-gray-500" />
                  <p className="text-gray-700">
                    <strong>Faculty:</strong> {event.FacultyName}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-gray-500" />
                  <p className="text-gray-700">
                    <strong>Date:</strong> {event.Date}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-center">
          <nav className="flex items-center space-x-2">
            <a href="#" className="px-4 py-2 border rounded-lg">
              1
            </a>
            {/* Pagination links */}
          </nav>
        </div>
      </main>

      {/* Event Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="w-full sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl md:text-2xl font-bold">Event Request Details</DialogTitle>
            <DialogDescription>
              Detailed information about the selected event request.
            </DialogDescription>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-6">
              <div className="flex items-center space-x-6">
                <div className="h-16 w-16 md:h-20 md:w-20 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-xl md:text-2xl">
                  {selectedEvent.EventName.split(" ")
                    .map((word) => word[0])
                    .join("")
                    .toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold">{selectedEvent.EventName}</h2>
                  <p className="text-gray-600">{selectedEvent.Type}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <div className="flex items-center space-x-4">
                  <User className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-600">Host Name</p>
                    <p className="font-medium">{selectedEvent.HostName}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <BookOpen className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-600">Faculty Name</p>
                    <p className="font-medium">{selectedEvent.FacultyName}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Calendar className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-medium">{selectedEvent.Date}</p>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="faculty" className="block text-sm font-medium text-gray-700">
                  Assign Faculty
                </label>
                <select
                  id="faculty"
                  value={selectedFaculty}
                  onChange={handleFacultyChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                >
                  <option value="">Select Faculty</option>
                  {facultyMembers.map((faculty) => (
                    <option key={faculty.id} value={faculty.name}>
                      {faculty.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleApprove}>Approve</Button>
                <Button onClick={handleReject} className="bg-red-600 hover:bg-red-500 hover:text-white ml-3">
                  Reject
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create New Event Dialog */}
      <Dialog open={isCreateEventDialogOpen} onOpenChange={handleCloseCreateEventDialog}>
        <DialogContent className="w-full sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl md:text-2xl font-bold">Create New Event</DialogTitle>
            <DialogDescription>Fill in the details to create a new event.</DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div>
              <Label htmlFor="eventName">Event Name</Label>
              <Input
                id="eventName"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                placeholder="Enter event name"
              />
              {eventNameError && <p className="text-red-500 text-sm mt-1">{eventNameError}</p>}
            </div>
            <div>
              <Label htmlFor="hostName">Host Name</Label>
              <Input
                id="hostName"
                value={hostName}
                onChange={(e) => setHostName(e.target.value)}
                placeholder="Enter host name"
              />
              {hostNameError && <p className="text-red-500 text-sm mt-1">{hostNameError}</p>}
            </div>
            <div>
              <Label htmlFor="date">Date & Time</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-gray-500"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
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
              {dateError && <p className="text-red-500 text-sm mt-1">{dateError}</p>}
            </div>
            <div>
              <Label htmlFor="faculty">Faculty</Label>
              <Select value={selectedFacultyForCreate} onValueChange={setSelectedFacultyForCreate}>
                <SelectTrigger>
                  <SelectValue placeholder="Select faculty" />
                </SelectTrigger>
                <SelectContent>
                  {facultyMembers.map((faculty) => (
                    <SelectItem key={faculty.id} value={faculty.name}>
                      {faculty.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {facultyError && <p className="text-red-500 text-sm mt-1">{facultyError}</p>}
            </div>
            <div>
              <Label htmlFor="eventImage">Event Image</Label>
              <Input
                id="eventImage"
                type="file"
                onChange={(e) => setEventImage(e.target.files?.[0] || null)}
                accept="image/*"
              />
              {eventImageError && <p className="text-red-500 text-sm mt-1">{eventImageError}</p>}
            </div>
            <div className="flex justify-end">
              <Button onClick={handleSubmitCreateEvent}>Create Event</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}