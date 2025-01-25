"use client";
import React, { useState } from "react";
import { CiEdit } from "react-icons/ci";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"; // Import your dialog components
import { Button } from "@/components/ui/button"; // Import your button component
import AddNewFaculty from "@/components/AddNewFaculty";

export default function AlumniPage() {
  const [selectedFaculty, setSelectedFaculty] = useState<any>(null); // State to track the selected faculty for editing
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false); // State to manage dialog visibility

  const alumni = [
    {
      name: "Marie Johnson",
      email: "marie@acme.com",
      school: "SOMC",
      Cno: 1234567890,
      updated: "3 days ago",
      designation: "prof",
      status: "Active",
    },
    {
      name: "Sarah Liu",
      email: "sarah@acme.com",
      school: "SOET",
      Cno: 1234567840,
      updated: "2 weeks ago",
      designation: "As prof",
      status: "Active",
    },
    {
      name: "Alex Grimes",
      email: "alex@acme.com",
      school: "SOMC",
      Cno: 1234567890,
      updated: "1 month ago",
      designation: "prof",
      status: "Inactive",
    },
    {
      name: "Chris Davis",
      email: "chris@acme.com",
      school: "SOET",
      Cno: 1234567820,
      updated: "2 days ago",
      designation: "As prof",
      status: "Inactive",
    },
    {
      name: "Tara Smith",
      email: "tara@acme.com",
      school: "SOET",
      Cno: 1234567870,
      updated: "1 week ago",
      designation: "prof",
      status: "Active",
    },
  ];

  // Handle edit button click
  const handleEditClick = (person:any) => {
    setSelectedFaculty(person); // Set the selected faculty
    setIsDialogOpen(true); // Open the dialog
  };

  // Close the dialog
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedFaculty(null); // Clear the selected faculty
  };

  // Handle form submission
  const handleSubmit = (e:any) => {
    e.preventDefault();
    console.log("Updated Faculty Details:", selectedFaculty);
    // Add your logic to update the faculty details (e.g., API call)
    handleCloseDialog(); // Close the dialog after submission
  };

  // Handle input changes
  const handleInputChange = (e:any) => {
    const { name, value } = e.target;
    setSelectedFaculty({
      ...selectedFaculty,
      [name]: value,
    });
  };

  return (
    <div className="bg-gray-100 w-full">
      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <h1 className="text-2xl font-bold ml-5 md:ml-0">Faculty</h1>
        <p className="text-gray-600">Manage Faculty profiles</p>

        {/* Search */}
        <div className="mt-6 flex items-center gap-4">
          <input
            type="text"
            placeholder="Search alumni by name, email or grad year"
            className="w-3/4 p-3 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
          />
          <AddNewFaculty />
        </div>

        {/* Alumni Table */}
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
              </tr>
            </thead>
            <tbody>
              {alumni.map((person, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-4">{person.name}</td>
                  <td className="p-4">{person.email}</td>
                  <td className="p-4">{person.school}</td>
                  <td className="p-4">{person.Cno}</td>
                  <td className="p-4">{person.designation}</td>
                  <td className="p-4 flex items-center justify-start">
                    <a
                      href="#"
                      className={`p-2 w-24 h-10 text-center rounded-xl border-solid ${
                        person.status == "Active"
                          ? "bg-green-400 hover:bg-green-700"
                          : "bg-red-400 hover:bg-red-700"
                      } border-black text-white m-1`}
                    >
                      {person.status}
                    </a>
                    <button
                      onClick={() => handleEditClick(person)}
                      className={`p-2 w-12 h-10 text-white font-bold text-center rounded-xl bg-blue-500 hover:bg-blue-700`}
                    >
                      <CiEdit size={25} />
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

      {/* Dialog for Editing Faculty Details */}
      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Faculty Details</DialogTitle>
            <DialogDescription>
              Update the faculty details below. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          {selectedFaculty && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={selectedFaculty.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={selectedFaculty.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                  required
                />
              </div>
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={selectedFaculty.status}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                  required
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="flex justify-end">
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}