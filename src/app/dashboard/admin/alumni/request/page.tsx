"use client";
import React, { useState } from "react";
import { Search, Check, X, Clock, Mail, Phone, Calendar, User } from "lucide-react"; // Import icons from a library like lucide-react
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"; // Import shadcn components
import Image from "next/image"; // Import the Image component

export default function AlumniRequest() {
  const [searchQuery, setSearchQuery] = useState<string>(""); // State for search query
  const [selectedAlumni, setSelectedAlumni] = useState(null); // State to store selected alumni
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false); // State to control dialog visibility
  const alumni = [
    { name: "Marie Johnson", email: "marie@acme.com", year: 2010, Cno: 1234567890, updated: "3 days ago", status: "Pending", profilePhoto: null },
    { name: "Sarah Liu", email: "sarah@acme.com", year: 2015, Cno: 1234567840, updated: "2 weeks ago", status: "Approved", profilePhoto: "/logo.jpg" },
    { name: "Alex Grimes", email: "alex@acme.com", year: 2005, Cno: 1234567890, updated: "1 month ago", status: "Rejected", profilePhoto: "/logo.jpg" },
    { name: "Chris Davis", email: "chris@acme.com", year: 2020, Cno: 1234567820, updated: "2 days ago", status: "Pending", profilePhoto: "" },
    { name: "Tara Smith", email: "tara@acme.com", year: 2000, Cno: 1234567870, updated: "1 week ago", status: "Approved", profilePhoto: "/logo.jpg" },
  ];
  // Filter alumni based on search query
  const filteredAlumni = alumni.filter((person) =>
    person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    person.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    person.year.toString().includes(searchQuery) ||
    person.Cno.toString().includes(searchQuery)
  );
  // Function to generate initials for the default logo
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };
  // Function to handle row click
  const handleRowClick = (person) => {
    setSelectedAlumni(person); // Set the selected alumni
    setIsDialogOpen(true); // Open the dialog
  };
  return (
    <div className="bg-gray-100 min-h-screen w-full">
      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <h1 className="text-2xl font-bold ml-5 md:ml-0">Alumni Requests</h1>
        <p className="text-gray-600">Manage alumni requests, approve or reject applications</p>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Clock className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending Requests</p>
                <p className="text-2xl font-bold">12</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-full">
                <Check className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Approved Requests</p>
                <p className="text-2xl font-bold">45</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-red-100 rounded-full">
                <X className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Rejected Requests</p>
                <p className="text-2xl font-bold">8</p>
              </div>
            </div>
          </div>
        </div>
        {/* Statistics Cards */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* ... (same as before) ... */}
        </div>
        {/* Search */}
        <div className="mt-6 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" /> {/* Search icon */}
          </div>
          <input
            type="text"
            placeholder="Search alumni by name, email, grad year, or phone"
            className="w-full pl-10 p-3 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {/* Alumni Table */}
        <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-4 text-left">Profile Photo</th>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Grad Year</th>
                <th className="p-4 text-left">Phone</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredAlumni.map((person, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                  onClick={() => handleRowClick(person)} // Handle row click
                >
                  <td className="p-4">
                    {person.profilePhoto ? (
                      <Image
                        src={person.profilePhoto}
                        alt={person.name}
                        width={40} // Set the width
                        height={40} // Set the height
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                        {getInitials(person.name)}
                      </div>
                    )}
                  </td>
                  <td className="p-4">{person.name}</td>
                  <td className="p-4">{person.email}</td>
                  <td className="p-4">{person.year}</td>
                  <td className="p-4">{person.Cno}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 text-sm rounded-full ${
                        person.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : person.status === "Approved"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {person.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      className="p-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors duration-200"
                      title="Approve"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button
                      className="ml-2 p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors duration-200"
                      title="Reject"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="mt-6 flex justify-center">
          <nav className="flex items-center space-x-2">
            {/* ... (same as before) ... */}
          </nav>
        </div>
      </main>
      {/* Popup Form */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Alumni Details</DialogTitle>
            <DialogDescription>View and manage alumni information</DialogDescription>
          </DialogHeader>
          {selectedAlumni && (
            <div className="space-y-6">
              {/* Profile Section */}
              <div className="flex items-center space-x-6">
                {selectedAlumni.profilePhoto ? (
                  <Image
                    src={selectedAlumni.profilePhoto}
                    alt={selectedAlumni.name}
                    width={80} // Set the width
                    height={80} // Set the height
                    className="h-20 w-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-20 w-20 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-2xl">
                    {getInitials(selectedAlumni.name)}
                  </div>
                )}
                <div>
                  <h2 className="text-2xl font-bold">{selectedAlumni.name}</h2>
                  <p className="text-gray-600">{selectedAlumni.email}</p>
                </div>
              </div>
              {/* Details Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Mail className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{selectedAlumni.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-green-100 rounded-full">
                    <Phone className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium">{selectedAlumni.Cno}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Calendar className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Graduation Year</p>
                    <p className="font-medium">{selectedAlumni.year}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-yellow-100 rounded-full">
                    <User className="h-5 w-5 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <p className="font-medium">
                      <span
                        className={`px-2 py-1 text-sm rounded-full ${
                          selectedAlumni.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : selectedAlumni.status === "Approved"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {selectedAlumni.status}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              {/* Last Updated Section */}
              <div className="text-sm text-gray-600">
                <p>Last updated: {selectedAlumni.updated}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}