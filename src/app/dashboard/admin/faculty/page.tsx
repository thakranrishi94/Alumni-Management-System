"use client";
import React, { useEffect, useState } from "react";
import { GraduationCap, Mail, Phone, User } from "lucide-react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import axios, { AxiosError } from "axios";
import { toast } from "react-hot-toast";

interface FacultyData {
  id: number;
  userId: number;
  designation: string;
  school: string;
  updatedAt: string;
  image?: string;
  user: {
    id: number;
    name: string;
    email: string;
    phone: string;
    status: "ACTIVE" | "INACTIVE";
  };
}

interface ApiError {
  error: string;
}

export default function FacultyPage() {
  const [selectedFaculty, setSelectedFaculty] = useState<FacultyData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [faculty, setFaculty] = useState<FacultyData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [newFacultyData, setNewFacultyData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    designation: "",
    school: "",
  });

  useEffect(() => {
    getAllFacultyDetails();
  }, []);

  async function getAllFacultyDetails() {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/faculty`
      );
      setFaculty(data);
    } catch (error) {
      console.error("Error fetching faculty details:", error);
      toast.error("Failed to fetch faculty details");
      setFaculty([]);
    }
  }

  const handleEditClick = (person: FacultyData) => {
    setSelectedFaculty({ ...person });
    setIsDialogOpen(true);
  };

  const handleSaveChanges = async () => {
    if (!selectedFaculty) return;

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/faculty/users/${selectedFaculty.user.id}/status`,
        {
          status: selectedFaculty.user.status,
        }
      );

      const updatedFaculty = faculty.map((f) =>
        f.id === selectedFaculty.id
          ? { ...f, user: { ...f.user, status: selectedFaculty.user.status } }
          : f
      );

      setFaculty(updatedFaculty);
      toast.success("Faculty status updated successfully");
      setIsDialogOpen(false);
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      console.error(
        "Error updating faculty status:",
        axiosError.response?.data || error
      );
      toast.error(
        axiosError.response?.data?.error || "Failed to update faculty status"
      );
    }
  };

  const handleAddNewFaculty = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
          ...newFacultyData,
          role: "FACULTY",
          status: "ACTIVE",
        }
      );

      toast.success("Faculty registered successfully!");
      setIsAddDialogOpen(false);
      setNewFacultyData({
        name: "",
        email: "",
        phone: "",
        password: "",
        designation: "",
        school: "",
      });
      getAllFacultyDetails(); // Refresh the faculty list
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      toast.error(axiosError.response?.data?.error || "Failed to register faculty");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewFacultyData({
      ...newFacultyData,
      [e.target.name]: e.target.value,
    });
  };

  // Function to generate initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word: string) => word[0])
      .join("")
      .toUpperCase();
  };

  // Function to render profile image or initials
  const renderProfileImage = (person: FacultyData) => {
    if (person.image) {
      return (
        <div className="relative h-10 w-10">
          <Image 
            src={person.image} 
            alt={`${person.user.name}`}
            fill
            sizes="40px"
            className="rounded-full object-cover"
            priority
          />
        </div>
      );
    } else {
      return (
        <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
          {getInitials(person.user.name)}
        </div>
      );
    }
  };

  // Filter faculty based on search query
  const filteredFaculty = faculty.filter(
    (person) =>
      Object.values(person.user).some((value) =>
        value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      person.school.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.designation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-gray-100 w-full">
      <main className="flex-1 p-8 overflow-auto">
        <h1 className="text-2xl font-bold ml-5 md:ml-0">Faculty</h1>
        <p className="text-gray-600">Manage Faculty profiles</p>

        {/* Search Bar & Add Faculty */}
        <div className="mt-6 flex items-center justify-between">
          <div className="relative flex-1 w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search faculty by name, email, or school"
              className="w-full pl-10 p-3 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="ml-4 bg-blue-600 hover:bg-blue-700"
          >
            Add New Faculty
          </Button>
        </div>

        {/* Faculty Table */}
        <div className="mt-8 bg-white shadow-md rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-4 text-left">Profile</th>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">School</th>
                <th className="p-4 text-left">Contact No</th>
                <th className="p-4 text-left">Designation</th>
                <th className="p-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredFaculty.map((person) => (
                <tr
                  key={person.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleEditClick(person)}
                >
                  <td className="p-4">
                    {renderProfileImage(person)}
                  </td>
                  <td className="p-4">{person.user.name}</td>
                  <td className="p-4">{person.user.email}</td>
                  <td className="p-4">{person.school}</td>
                  <td className="p-4">{person.user.phone}</td>
                  <td className="p-4">{person.designation}</td>
                  <td className="p-4">
                    <span
                      className={`p-2 w-24 h-10 text-center rounded-xl border-solid ${
                        person.user.status === "ACTIVE"
                          ? "bg-green-400 hover:bg-green-700"
                          : "bg-red-400 hover:bg-red-700"
                      } border-black text-white`}
                    >
                      {person.user.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Faculty Details Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                Faculty Details
              </DialogTitle>
              <DialogDescription>
                View and manage faculty information
              </DialogDescription>
            </DialogHeader>
            {selectedFaculty && (
              <div className="space-y-6">
                {/* Profile Section */}
                <div className="flex items-center space-x-6">
                  {selectedFaculty.image ? (
                    <div className="relative h-20 w-20">
                      <Image 
                        src={selectedFaculty.image} 
                        alt={`${selectedFaculty.user.name}`}
                        fill
                        sizes="80px"
                        className="rounded-full object-cover"
                        priority
                      />
                    </div>
                  ) : (
                    <div className="h-20 w-20 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-2xl">
                      {getInitials(selectedFaculty.user.name)}
                    </div>
                  )}
                  <div>
                    <h2 className="text-2xl font-bold">
                      {selectedFaculty.user.name}
                    </h2>
                    <p className="text-gray-600">{selectedFaculty.user.email}</p>
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
                      <p className="font-medium">{selectedFaculty.user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-green-100 rounded-full">
                      <Phone className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium">{selectedFaculty.user.phone}</p>
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
                        value={selectedFaculty.user.status}
                        onChange={(e) =>
                          setSelectedFaculty((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  user: {
                                    ...prev.user,
                                    status: e.target.value as
                                      | "ACTIVE"
                                      | "INACTIVE",
                                  },
                                }
                              : null
                          )
                        }
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                      >
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                  <Button onClick={handleSaveChanges}>Save Changes</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Add New Faculty Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Faculty</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleAddNewFaculty} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={newFacultyData.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={newFacultyData.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={newFacultyData.phone}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  value={newFacultyData.password}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Designation
                </label>
                <input
                  type="text"
                  name="designation"
                  required
                  value={newFacultyData.designation}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  School
                </label>
                <input
                  type="text"
                  name="school"
                  required
                  value={newFacultyData.school}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Registering..." : "Register Faculty"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}