"use client";
import React, { useState } from "react";
import { CiEdit } from "react-icons/ci";
import { Users, GraduationCap, Mail, Phone, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import AddNewFaculty from "@/components/AddNewFaculty";
import { Search } from "lucide-react";
export default function FacultyPage() {
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const faculty = [
    {
      name: "Marie Johnson",
      email: "marie@acme.com",
      school: "SOMC",
      Cno: 1234567890,
      updated: "3 days ago",
      designation: "Professor",
      status: "Inactive",
    },
    {
      name: "Sarah Liu",
      email: "sarah@acme.com",
      school: "SOET",
      Cno: 1234567840,
      updated: "2 weeks ago",
      designation: "Associate Professor",
      status: "Active",
    }, {
      name: "Marie Johnson",
      email: "marie@acme.com",
      school: "SOMC",
      Cno: 1234567890,
      updated: "3 days ago",
      designation: "Professor",
      status: "Inactive",
    },
    {
      name: "Sarah Liu",
      email: "sarah@acme.com",
      school: "SOET",
      Cno: 1234567840,
      updated: "2 weeks ago",
      designation: "Associate Professor",
      status: "Active",
    }, {
      name: "Marie Johnson",
      email: "marie@acme.com",
      school: "SOMC",
      Cno: 1234567890,
      updated: "3 days ago",
      designation: "Professor",
      status: "Inactive",
    },
    {
      name: "Sarah Liu",
      email: "sarah@acme.com",
      school: "SOET",
      Cno: 1234567840,
      updated: "2 weeks ago",
      designation: "Associate Professor",
      status: "Active",
    },
    // Add more faculty data as needed
  ];

  // Handle edit button click
  const handleEditClick = (person) => {
    setSelectedFaculty(person);
    setIsDialogOpen(true);
  };

  // Handle saving changes
  const handleSaveChanges = () => {
    console.log("Updated Faculty Status:", selectedFaculty);
    // Add logic to save the updated status (e.g., API call)
    setIsDialogOpen(false); // Close the dialog after saving
  };

  return (
    <div className="bg-gray-100 w-full">
      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <h1 className="text-2xl font-bold ml-5 md:ml-0">Faculty</h1>
        <p className="text-gray-600">Manage Faculty profiles</p>
        {/* Statistics Cards */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Faculty</p>
                <p className="text-2xl font-bold">200</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-full">
                <Users className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Faculty</p>
                <p className="text-2xl font-bold">150</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <Users className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Inactive Faculty</p>
                <p className="text-2xl font-bold">10</p>
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
        {/* Faculty Table */}
        <div className="mt-6 flex items-center justify-between">
          <div className="relative flex-1 w-full ">
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
          <AddNewFaculty />
        </div>
        <div className="mt-8 bg-white shadow-md rounded-lg overflow-hidden">

          <table className="w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">School</th>
                <th className="p-4 text-left">Contact No</th>
                <th className="p-4 text-left">Designation</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {faculty.map((person, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-4">{person.name}</td>
                  <td className="p-4">{person.email}</td>
                  <td className="p-4">{person.school}</td>
                  <td className="p-4">{person.Cno}</td>
                  <td className="p-4">{person.designation}</td>
                  <td className="p-4">
                    <span
                      className={`p-2 w-24 h-10 text-center rounded-xl border-solid ${person.status === "Active"
                        ? "bg-green-400 hover:bg-green-700"
                        : "bg-red-400 hover:bg-red-700"
                        } border-black text-white`}
                    >
                      {person.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleEditClick(person)}
                      className="p-2 w-12 h-10 text-white font-bold text-center rounded-xl bg-blue-500 hover:bg-blue-700"
                    >
                      <CiEdit size={25} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
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
        {/* Dialog for Editing Faculty Details */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Faculty Details</DialogTitle>
              <DialogDescription>View and manage faculty information</DialogDescription>
            </DialogHeader>
            {selectedFaculty && (
              <div className="space-y-6">
                {/* Profile Section */}
                <div className="flex items-center space-x-6">
                  <div className="h-20 w-20 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-2xl">
                    {selectedFaculty.name
                      .split(" ")
                      .map((word: string) => word[0])
                      .join("")
                      .toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedFaculty.name}</h2>
                    <p className="text-gray-600">{selectedFaculty.email}</p>
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
                      <p className="font-medium">{selectedFaculty.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-green-100 rounded-full">
                      <Phone className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium">{selectedFaculty.Cno}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-purple-100 rounded-full">
                      <GraduationCap className="h-5 w-5 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Designation</p>
                      <p className="font-medium">{selectedFaculty.designation}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-yellow-100 rounded-full">
                      <User className="h-5 w-5 text-yellow-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <select
                        name="status"
                        value={selectedFaculty.status}
                        onChange={(e) =>
                          setSelectedFaculty({
                            ...selectedFaculty,
                            status: e.target.value,
                          })
                        }
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Last Updated Section */}
                <div className="text-sm text-gray-600">
                  <p>Last updated: {selectedFaculty.updated}</p>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                  <Button onClick={handleSaveChanges}>Save Changes</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}