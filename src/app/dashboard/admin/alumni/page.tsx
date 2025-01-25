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
  const [selectedAlumni, setSelectedAlumni] = useState<any>(null); // State to track the selected alumni
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false); // State to manage dialog visibility

  const alumni = [
    { name: "Marie Johnson", email: "marie@acme.com", year: 2010, Cno: 1234567890, Course: "MCA", school: "SOET" },
    { name: "Sarah Liu", email: "sarah@acme.com", year: 2015, Cno: 1234567840, Course: "MCA", school: "SOET" },
    { name: "Alex Grimes", email: "alex@acme.com", year: 2005, Cno: 1234567890, Course: "MCA", school: "SOET" },
    { name: "Chris Davis", email: "chris@acme.com", year: 2020, Cno: 1234567820, Course: "MCA", school: "SOET" },
    { name: "Tara Smith", email: "tara@acme.com", year: 2000, Cno: 1234567870, Course: "MCA", school: "SOET" },
  ];

  // Handle row click
  const handleRowClick = (person:any) => {
    setSelectedAlumni(person); // Set the selected alumni
    setIsDialogOpen(true); // Open the dialog
  };

  // Close the dialog
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedAlumni(null); // Clear the selected alumni
  };

  return (
    <div className="bg-gray-100 w-full">
      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <h1 className="text-2xl font-bold ml-5 md:ml-0">Alumni</h1>
        <p className="text-gray-600">Manage alumni profiles, track engagement, and organize events</p>

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
          <table className="w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Grad Year</th>
                <th className="p-4 text-left">Phone Number</th>
                <th className="p-4 text-left">Course</th>
                <th className="p-4 text-left">School</th>
              </tr>
            </thead>
            <tbody>
              {alumni.map((person, index) => (
                <tr
                  key={index}
                  onClick={() => handleRowClick(person)} // Handle row click
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  <td className="p-4">{person.name}</td>
                  <td className="p-4">{person.email}</td>
                  <td className="p-4">{person.year}</td>
                  <td className="p-4">{person.Cno}</td>
                  <td className="p-4">{person.Course}</td>
                  <td className="p-4">{person.school}</td>
                </tr>
              ))}
            </tbody>
          </table>
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

      {/* Dialog to Show Alumni Details */}
      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alumni Details</DialogTitle>
            <DialogDescription>
              Detailed information about the selected alumni.
            </DialogDescription>
          </DialogHeader>
          {selectedAlumni && (
            <div className="space-y-4">
              <div>
                <strong>Name:</strong> {selectedAlumni.name}
              </div>
              <div>
                <strong>Email:</strong> {selectedAlumni.email}
              </div>
              <div>
                <strong>Graduation Year:</strong> {selectedAlumni.year}
              </div>
              <div>
                <strong>Phone Number:</strong> {selectedAlumni.Cno}
              </div>
              <div>
                <strong>Course:</strong> {selectedAlumni.Course}
              </div>
              <div>
                <strong>School:</strong> {selectedAlumni.school}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}