"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"; // Import your dialog components

export default function AlumniPage() {
  const [selectedEvent, setSelectedEvent] = useState<any>(null); // State to track the selected event
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
  const handleRowClick = (event:any) => {
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
            placeholder="Search alumni by name, email or grad year"
            className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
          />
        </div>

        {/* Alumni Table */}
        <div className="mt-8 bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-2 text-left">Event Name</th>
                  <th className="p-2 text-left">Host Name</th>
                  <th className="p-2 text-left">Faculty Name</th>
                  <th className="p-2 text-left">Title</th>
                  <th className="p-2 text-left">Type</th>
                  <th className="p-2 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {event.map((event, index) => (
                  <tr
                    key={index}
                    onClick={() => handleRowClick(event)} // Handle row click
                    className="hover:bg-gray-50 cursor-pointer" // Add cursor pointer
                  >
                    <td className="p-3">{event.EventName}</td>
                    <td className="p-3">{event.HostName}</td>
                    <td className="p-3">{event.FacultyName}</td>
                    <td className="p-3">{event.Title}</td>
                    <td className="p-3">{event.Type}</td>
                    <td className="p-3">{event.Date}</td>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Event Details</DialogTitle>
            <DialogDescription>
              Detailed information about the selected event.
            </DialogDescription>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4">
              <div>
                <strong>Event Name:</strong> {selectedEvent.EventName}
              </div>
              <div>
                <strong>Host Name:</strong> {selectedEvent.HostName}
              </div>
              <div>
                <strong>Faculty Name:</strong> {selectedEvent.FacultyName}
              </div>
              <div>
                <strong>Title:</strong> {selectedEvent.Title}
              </div>
              <div>
                <strong>Type:</strong> {selectedEvent.Type}
              </div>
              <div>
                <strong>Date:</strong> {selectedEvent.Date}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}