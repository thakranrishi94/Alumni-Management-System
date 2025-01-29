"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Calendar, User, BookOpen, FileText, Tag, Clock, Plus, CheckCircle, Link } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";

export default function UpcomingEvents() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isCreateEventDialogOpen, setIsCreateEventDialogOpen] = useState<boolean>(false);
  const [eventName, setEventName] = useState("");
  const [title, setTitle] = useState("");
  const [eventType, setEventType] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [prerequisite, setPrerequisite] = useState("");
  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState<boolean>(false);

  const event = [
    {
      EventName: "Tech Conference 2023",
      HostName: "Marie Johnson",
      FacultyName: "Dr. John Doe",
      Title: "Future of AI",
      Type: "Conference",
      Date: "2023-10-15",
      MeetLink:"https://meet.google.com/frg-idkk-hcv",
    },
    {
      EventName: "Workshop on Web Development",
      HostName: "Sarah Liu",
      FacultyName: "Prof. Jane Smith",
      Title: "Advanced JavaScript",
      Type: "Workshop",
      Date: "2023-11-05",
      MeetLink:"",
    },
    {
      EventName: "Seminar on Cybersecurity",
      HostName: "Alex Grimes",
      FacultyName: "Dr. Emily Brown",
      Title: "Cybersecurity Trends",
      Type: "Seminar",
      Date: "2023-09-20",
      MeetLink:"",
    },
    {
      EventName: "Hackathon 2023",
      HostName: "Chris Davis",
      FacultyName: "Prof. Michael Green",
      Title: "Innovate and Build",
      Type: "Hackathon",
      Date: "2023-12-10",
      MeetLink:"https://meet.google.com/hes-idkk-fde",
    },
    {
      EventName: "Alumni Meet 2023",
      HostName: "Tara Smith",
      FacultyName: "Dr. Susan White",
      Title: "Networking and Collaboration",
      Type: "Networking Event",
      Date: "2023-08-25",
      MeetLink:"https://meet.google.com/hes-idkk-hkj",
    },
  ];
  const handleRowClick = (event) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedEvent(null);
  };

  const handleCreateEvent = () => {
    setIsCreateEventDialogOpen(true);
  };

  const handleCloseCreateEventDialog = () => {
    setIsCreateEventDialogOpen(false);
    setEventName("");
    setTitle("");
    setEventType("");
    setSelectedDate(undefined);
    setPrerequisite("");
  };

  const handleSubmitCreateEvent = () => {
    if (!eventName || !title || !eventType || !selectedDate || !prerequisite) {
      alert("Please fill all the fields");
      return;
    }

    console.log("New Event Created:", {
      eventName,
      title,
      eventType,
      selectedDate,
      prerequisite,
    });

    // Simulate sending an email notification
    sendEmailNotification();

    handleCloseCreateEventDialog();
    setIsSuccessPopupOpen(true);
  };

  const sendEmailNotification = () => {
    // Simulate sending an email
    console.log("Email notification sent to your email address.");
  };

  return (
    <div className="bg-gray-100 w-full">
      <main className="flex-1 p-8 overflow-auto">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Upcoming Events</h1>
            <p className="text-gray-600">Manage Events</p>
          </div>
          <Button onClick={handleCreateEvent} className="bg-blue-600 hover:bg-blue-500">
            <Plus className="mr-2 h-4 w-4" /> Create Event
          </Button>
        </div>

        <div className="mt-6">
          <Input
            type="text"
            placeholder="Search events by name, type, or date"
            className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
          />
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {event.map((event, index) => (
            <div
              key={index}
              onClick={() => handleRowClick(event)}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Calendar className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{event.EventName}</h2>
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
            <a href="#" className="px-4 py-2 border rounded-lg text-gray-500">
              2
            </a>
            <a href="#" className="px-4 py-2 border rounded-lg text-gray-500">
              3
            </a>
            <a href="#" className="px-4 py-2 border rounded-lg text-gray-500">
              4
            </a>
            <a href="#" className="px-4 py-2 border rounded-lg text-gray-500">
              5
            </a>
          </nav>
        </div>
      </main>

      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Event Details</DialogTitle>
            <DialogDescription>View and manage event information</DialogDescription>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-6">
              <div className="flex items-center space-x-6">
                <div className="h-20 w-20 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-2xl">
                  {selectedEvent.EventName.split(" ")
                    .map((word: string) => word[0])
                    .join("")
                    .toUpperCase()}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{selectedEvent.EventName}</h2>
                  <p className="text-gray-600">{selectedEvent.Type}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <User className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Host Name</p>
                    <p className="font-medium">{selectedEvent.HostName}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-green-100 rounded-full">
                    <BookOpen className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Faculty Name</p>
                    <p className="font-medium">{selectedEvent.FacultyName}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Calendar className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-medium">{selectedEvent.Date}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-yellow-100 rounded-full">
                    <User className="h-5 w-5 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Type</p>
                    <p className="font-medium">{selectedEvent.Type}</p>
                  </div>
                </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <BookOpen className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Title</p>
                    <p className="font-medium">{selectedEvent.Title}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Link   className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Meeting Link</p>
                    <p className="font-medium">{selectedEvent.MeetLink? selectedEvent.MeetLink : "Not Assigned"}</p>
                  </div>
                </div>
              </div>
              </div>
              
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isCreateEventDialogOpen} onOpenChange={handleCloseCreateEventDialog}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Create New Event</DialogTitle>
            <DialogDescription>Fill in the details to create a new event</DialogDescription>
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
            </div>

            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter event title"
              />
            </div>

            <div>
              <Label htmlFor="eventType">Event Type</Label>
              <Select value={eventType} onValueChange={setEventType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Webinar">Webinar</SelectItem>
                  <SelectItem value="Lecture">Lecture</SelectItem>
                  <SelectItem value="Seminar">Seminar</SelectItem>
                </SelectContent>
              </Select>
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
            </div>

            <div>
              <Label htmlFor="prerequisite">Prerequisite</Label>
              <Input
                id="prerequisite"
                value={prerequisite}
                onChange={(e) => setPrerequisite(e.target.value)}
                placeholder="Enter prerequisites"
              />
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSubmitCreateEvent}>Create Event</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Popup */}
      <Dialog open={isSuccessPopupOpen} onOpenChange={() => setIsSuccessPopupOpen(false)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center space-x-2">
              <CheckCircle className="h-6 w-6 text-green-500" />
              <span>Success</span>
            </DialogTitle>
            <DialogDescription>
              Your request has been sent successfully. You will receive an update on your email.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}