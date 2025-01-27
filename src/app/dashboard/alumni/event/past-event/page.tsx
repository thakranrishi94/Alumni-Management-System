"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"; // Import your dialog components
import { Calendar, User, BookOpen, FileText, Tag, Clock } from "lucide-react"; // Import icons

export default function PastEvent() {
  const [selectedEvent, setSelectedEvent] = useState(null); // State to track the selected event
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false); // State to manage dialog visibility

  const event = [
    {
      EventName: "Tech Conference 2023",
      HostName: "Marie Johnson",
      FacultyName: "Dr. John Doe",
      Title: "Future of AI",
      Type: "Conference",
      Date: "2023-10-15",
    },
    {
      EventName: "Workshop on Web Development",
      HostName: "Sarah Liu",
      FacultyName: "Prof. Jane Smith",
      Title: "Advanced JavaScript",
      Type: "Workshop",
      Date: "2023-11-05",
    },
    {
      EventName: "Seminar on Cybersecurity",
      HostName: "Alex Grimes",
      FacultyName: "Dr. Emily Brown",
      Title: "Cybersecurity Trends",
      Type: "Seminar",
      Date: "2023-09-20",
    },
    {
      EventName: "Hackathon 2023",
      HostName: "Chris Davis",
      FacultyName: "Prof. Michael Green",
      Title: "Innovate and Build",
      Type: "Hackathon",
      Date: "2023-12-10",
    },
    {
      EventName: "Alumni Meet 2023",
      HostName: "Tara Smith",
      FacultyName: "Dr. Susan White",
      Title: "Networking and Collaboration",
      Type: "Networking Event",
      Date: "2023-08-25",
    },
  ];

  // Handle row click
  const handleRowClick = (event) => {
    setSelectedEvent(event); // Set the selected event
    setIsDialogOpen(true); // Open the dialog
  };

  // Close the dialog
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedEvent(null); // Clear the selected event
  };

  return (
    <div className="bg-gray-100 w-full">
      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <h1 className="text-2xl font-bold ml-5 md:ml-0">Upcoming Events</h1>
        <p className="text-gray-600">Manage Events</p>

        {/* Search */}
        <div className="mt-6">
          <input
            type="text"
            placeholder="Search events by name, type, or date"
            className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
          />
        </div>

        {/* Updated Table Design */}
        <div className="mt-8 bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-3 text-left text-gray-700 font-semibold">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      <span>Event Name</span>
                    </div>
                  </th>
                  <th className="p-3 text-left text-gray-700 font-semibold">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-green-500" />
                      <span>Host Name</span>
                    </div>
                  </th>
                  <th className="p-3 text-left text-gray-700 font-semibold">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="h-4 w-4 text-purple-500" />
                      <span>Faculty Name</span>
                    </div>
                  </th>
                  <th className="p-3 text-left text-gray-700 font-semibold">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-yellow-500" />
                      <span>Title</span>
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
                      <Clock className="h-4 w-4 text-indigo-500" />
                      <span>Date</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {event.map((event, index) => (
                  <tr
                    key={index}
                    onClick={() => handleRowClick(event)} // Handle row click
                    className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-gray-100 transition-colors cursor-pointer`} // Alternating row colors and hover effect
                  >
                    <td className="p-3 text-gray-700">{event.EventName}</td>
                    <td className="p-3 text-gray-700">{event.HostName}</td>
                    <td className="p-3 text-gray-700">{event.FacultyName}</td>
                    <td className="p-3 text-gray-700">{event.Title}</td>
                    <td className="p-3 text-gray-700">
                      <span
                        className={`px-2 py-1 text-sm rounded-full ${event.Type === "Conference"
                            ? "bg-blue-100 text-blue-800"
                            : event.Type === "Workshop"
                              ? "bg-green-100 text-green-800"
                              : event.Type === "Seminar"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}
                      >
                        {event.Type}
                      </span>
                    </td>
                    <td className="p-3 text-gray-700">{event.Date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
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

      {/* Dialog to Show Event Details */}
      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Event Details</DialogTitle>
            <DialogDescription>View and manage event information</DialogDescription>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-6">
              {/* Profile Section */}
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

              {/* Details Section */}
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
              </div>

              {/* Additional Details Section */}
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

              {/* Last Updated Section */}
              <div className="text-sm text-gray-600">
                <p>Last updated: {selectedEvent.updated}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}