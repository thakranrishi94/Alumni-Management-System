"use client";
import React, { useState } from "react";
import Image from "next/image"; // Import the Image component
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"; // Import your dialog components
import { Search, Filter, Users, Calendar, GraduationCap, Mail, Phone, User } from "lucide-react"; // Import icons from a library like lucide-react

export default function AlumniPage() {
  const [selectedAlumni, setSelectedAlumni] = useState(null); // State to track the selected alumni
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false); // State to manage dialog visibility
  const [searchQuery, setSearchQuery] = useState<string>(""); // State for search query
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false); // State to manage sidebar visibility

  const alumni = [
    { name: "Marie Johnson", email: "marie@acme.com", year: 2010, Cno: 1234567890, Course: "MCA", school: "SOET", status: "Active", profilePhoto: "/logo.jpg", updated: "3 days ago" },
    { name: "Sarah Liu", email: "sarah@acme.com", year: 2015, Cno: 1234567840, Course: "MCA", school: "SOET", status: "Active", profilePhoto: "/logo.jpg", updated: "2 weeks ago" },
    { name: "Alex Grimes", email: "alex@acme.com", year: 2005, Cno: 1234567890, Course: "MCA", school: "SOET", status: "Inactive", profilePhoto: null, updated: "1 month ago" },
    { name: "Chris Davis", email: "chris@acme.com", year: 2020, Cno: 1234567820, Course: "MCA", school: "SOET", status: "Active", profilePhoto: "/logo.jpg", updated: "2 days ago" },
    { name: "Tara Smith", email: "tara@acme.com", year: 2000, Cno: 1234567870, Course: "MCA", school: "SOET", status: "Inactive", profilePhoto: null, updated: "1 week ago" },
  ];

  // Filter alumni based on search query
  const filteredAlumni = alumni.filter((person) =>
    person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    person.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    person.year.toString().includes(searchQuery) ||
    person.Cno.toString().includes(searchQuery) ||
    person.Course.toLowerCase().includes(searchQuery.toLowerCase()) ||
    person.school.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle row click
  const handleRowClick = (person) => {
    setSelectedAlumni(person); // Set the selected alumni
    setIsDialogOpen(true); // Open the dialog
  };

  // Function to generate initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="bg-gray-100 min-h-screen ">
      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <h1 className="text-2xl font-bold ml-5 md:ml-0">Alumni</h1>
        <p className="text-gray-600">Manage alumni profiles, track engagement, and organize events</p>

        {/* Statistics Cards */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Alumni</p>
                <p className="text-2xl font-bold">2000+</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-full">
                <Users className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Alumni</p>
                <p className="text-2xl font-bold">1500+</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <Calendar className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Events</p>
                <p className="text-2xl font-bold">200+</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-orange-100 rounded-full">
                <GraduationCap className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Courses</p>
                <p className="text-2xl font-bold">10+</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mt-6 flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" /> {/* Search icon */}
            </div>
            <input
              type="text"
              placeholder="Search alumni by name, email, grad year, phone, course, or school"
              className="w-full pl-10 p-3 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="ml-4 p-3 border rounded-lg shadow-sm hover:bg-gray-100"
          >
            <Filter className="h-5 w-5 text-gray-600" /> {/* Filter icon */}
          </button>
        </div>

        {/* Alumni Table */}
        <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-4 text-left">Profile</th>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Grad Year</th>
                <th className="p-4 text-left">Phone</th>
                <th className="p-4 text-left">Course</th>
                <th className="p-4 text-left">School</th>
                <th className="p-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredAlumni.map((person, index) => (
                <tr
                  key={index}
                  onClick={() => handleRowClick(person)} // Handle row click
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  <td className="p-4">
                    {person.profilePhoto ? (
                      <Image
                        src={person.profilePhoto}
                        alt={person.name}
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
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
                  <td className="p-4">{person.Course}</td>
                  <td className="p-4">{person.school}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 text-sm rounded-full ${
                        person.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {person.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex justify-center">
          <nav className="flex items-center space-x-2">
            <a href="#" className="px-4 py-2 border rounded-lg bg-blue-500 text-white hover:bg-blue-600">
              1
            </a>
            <a href="#" className="px-4 py-2 border rounded-lg text-gray-500 hover:bg-gray-100">
              2
            </a>
            <a href="#" className="px-4 py-2 border rounded-lg text-gray-500 hover:bg-gray-100">
              3
            </a>
            <a href="#" className="px-4 py-2 border rounded-lg text-gray-500 hover:bg-gray-100">
              4
            </a>
            <a href="#" className="px-4 py-2 border rounded-lg text-gray-500 hover:bg-gray-100">
              5
            </a>
          </nav>
        </div>
      </main>

      {/* Sidebar Filter */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsSidebarOpen(false)}>
          <div className="fixed inset-y-0 right-0 w-64 bg-white shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Filters</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Graduation Year</label>
                <input
                  type="text"
                  placeholder="Enter year"
                  className="w-full p-2 border rounded-lg mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Course</label>
                <input
                  type="text"
                  placeholder="Enter course"
                  className="w-full p-2 border rounded-lg mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">School</label>
                <input
                  type="text"
                  placeholder="Enter school"
                  className="w-full p-2 border rounded-lg mt-1"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dialog to Show Alumni Details */}
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
                    width={80}
                    height={80}
                    className="rounded-full object-cover"
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
                          selectedAlumni.status === "Active"
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