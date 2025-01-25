"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"; // Import your dialog components
import { Button } from "@/components/ui/button"; // Import your button component

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
  const [selectedEvent, setSelectedEvent] = useState<EventRequest | null>(null); // State to track the selected event
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State to manage dialog visibility
  const [selectedFaculty, setSelectedFaculty] = useState<string>(""); // State to track selected faculty

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
    {
      id: 3,
      EventName: "Seminar on Cybersecurity",
      HostName: "Alex Grimes",
      FacultyName: "Dr. Emily Brown",
      Title: "Cybersecurity Trends",
      Type: "Seminar",
      Date: "2023-09-20",
    },
    {
      id: 4,
      EventName: "Hackathon 2023",
      HostName: "Chris Davis",
      FacultyName: "Prof. Michael Green",
      Title: "Innovate and Build",
      Type: "Hackathon",
      Date: "2023-12-10",
    },
    {
      id: 5,
      EventName: "Alumni Meet 2023",
      HostName: "Tara Smith",
      FacultyName: "Dr. Susan White",
      Title: "Networking and Collaboration",
      Type: "Networking Event",
      Date: "2023-08-25",
    },
  ];

  // Sample data for Faculty
  const facultyMembers: Faculty[] = [
    { id: 1, name: "Dr. John Doe" },
    { id: 2, name: "Prof. Jane Smith" },
    { id: 3, name: "Dr. Emily Brown" },
    { id: 4, name: "Prof. Michael Green" },
    { id: 5, name: "Dr. Susan White" },
  ];

  // Handle button click to show event details
  const handleViewDetails = (event: EventRequest) => {
    setSelectedEvent(event); // Set the selected event
    setIsDialogOpen(true); // Open the dialog
  };

  // Close the dialog
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedEvent(null); // Clear the selected event
    setSelectedFaculty(""); // Reset selected faculty
  };

  // Handle faculty selection
  const handleFacultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFaculty(e.target.value);
  };

  // Handle approve button click
  const handleApprove = () => {
    if (selectedEvent && selectedFaculty) {
      console.log("Event Approved:", selectedEvent);
      console.log("Assigned Faculty:", selectedFaculty);
      // Add your approval logic here (e.g., update the event request status)
      handleCloseDialog(); // Close the dialog after approval
    } else {
      alert("Please select a faculty member to approve the event.");
    }
  };

  return (
    <div className="bg-gray-100 w-full">
      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <h1 className="text-2xl font-bold ml-5 md:ml-0">Event Requests</h1>
        <p className="text-gray-600">Manage Event Requests</p>

        {/* Search */}
        <div className="mt-6">
          <input
            type="text"
            placeholder="Search event requests by name, host, or type"
            className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
          />
        </div>

        {/* Event Requests Table */}
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
                  <th className="p-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {eventRequests.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50">
                    <td className="p-3">{event.EventName}</td>
                    <td className="p-3">{event.HostName}</td>
                    <td className="p-3">{event.FacultyName}</td>
                    <td className="p-3">{event.Title}</td>
                    <td className="p-3">{event.Type}</td>
                    <td className="p-3">{event.Date}</td>
                    <td className="p-3">
                      <Button
                        variant="outline"
                        onClick={() => handleViewDetails(event)}
                      >
                        View Details
                      </Button>
                    </td>
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
            <DialogTitle>Event Request Details</DialogTitle>
            <DialogDescription>
              Detailed information about the selected event request.
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

              {/* Assign Faculty Dropdown */}
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

              {/* Approve Button */}
              <div className="flex justify-end">
                <Button onClick={handleApprove}>Approve</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}