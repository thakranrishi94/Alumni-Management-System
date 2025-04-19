"use client";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Search, Check, X, Clock, Mail, Phone, Calendar, User } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import Image from "next/image";
import axios from "axios";

interface AlumniData {
  name: string;
  email: string;
  year: number;
  phone: number;
  updatedAt: string;
  batch: number;
  id: number;
  requestStatus: "PENDING" | "APPROVED" | "REJECTED";
  image?: string;
  designation: string;
  organization: string;
  user: { email: string; name: string; phone: number };
}

export default function AlumniRequest() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedAlumni, setSelectedAlumni] = useState<AlumniData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [alumni, setAlumni] = useState<AlumniData[]>([]);
  const [filteredAlumni, setFilteredAlumni] = useState<AlumniData[]>([]);
  const [isApproving, setIsApproving] = useState<boolean>(false);
  const [isRejecting, setIsRejecting] = useState<boolean>(false);

  // Calculate request counts using useMemo
  const requestCounts = useMemo(() => {
    return alumni.reduce(
      (acc, curr) => {
        switch (curr.requestStatus) {
          case "PENDING":
            acc.pending += 1;
            break;
          case "APPROVED":
            acc.approved += 1;
            break;
          case "REJECTED":
            acc.rejected += 1;
            break;
        }
        return acc;
      },
      { pending: 0, approved: 0, rejected: 0 }
    );
  }, [alumni]);

  // Memoize filterAlumni function
  const filterAlumni = useCallback(() => {
    if (!searchQuery.trim()) {
      setFilteredAlumni(alumni);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const filtered = alumni.filter((person) => {
      const searchableFields = [
        person.user.name,
        person.user.email,
        person.batch.toString(),
        person.user.phone.toString(),
        person.requestStatus.toLowerCase()
      ];

      return searchableFields.some(field =>
        field.toLowerCase().includes(query)
      );
    });

    setFilteredAlumni(filtered);
  }, [searchQuery, alumni]);

  useEffect(() => {
    getAllumniDetails();
  }, []);

  // Updated useEffect with proper dependency
  useEffect(() => {
    filterAlumni();
  }, [filterAlumni]);

  async function getAllumniDetails() {
    try {
      const aData = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/alumni/alumniRequest`);
      setAlumni(aData.data);
      setFilteredAlumni(aData.data);
    } catch (error) {
      console.error("Error fetching alumni details:", error);
      setAlumni([]);
      setFilteredAlumni([]);
    }
  }

  const getInitials = (name: string | undefined): string => {
    if (!name) return "??";

    return name
      .split(" ")
      .map((word) => word[0] || "")
      .join("")
      .toUpperCase();
  };

  const handleRowClick = (person: AlumniData) => {
    setSelectedAlumni(person);
    setIsDialogOpen(true);
  };

  const handleStatusChange = async (requestStatus: 'APPROVED' | 'REJECTED') => {
    try {
      if (!selectedAlumni?.id) {
        console.error('User ID is missing');
        return;
      }

      // Set loading state
      if (requestStatus === 'APPROVED') {
        setIsApproving(true);
      } else {
        setIsRejecting(true);
      }

      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/alumni/update-status/${selectedAlumni.id}`, {
        requestStatus: requestStatus,
      });

      // Reset loading state
      setIsApproving(false);
      setIsRejecting(false);
      
      setIsDialogOpen(false);
      getAllumniDetails();
    } catch (error) {
      console.error("Error updating status:", error);
      
      // Reset loading state on error
      setIsApproving(false);
      setIsRejecting(false);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="bg-gray-100 min-h-screen w-full">
      <main className="flex-1 p-8 overflow-auto">
        <h1 className="text-2xl font-bold ml-5 md:ml-0">Alumni Requests</h1>
        <p className="text-gray-600">Manage alumni requests, approve or reject applications</p>

        {/* Statistics Cards */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Clock className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending Requests</p>
                <p className="text-2xl font-bold">{requestCounts.pending}</p>
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
                <p className="text-2xl font-bold">{requestCounts.approved}</p>
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
                <p className="text-2xl font-bold">{requestCounts.rejected}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mt-6 flex items-center justify-between">
          <div className="relative flex-1 w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search alumni by name, email, grad year, phone, or status"
              className="w-full pl-10 p-3 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
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
              </tr>
            </thead>
            <tbody>
              {filteredAlumni.map((person, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                  onClick={() => handleRowClick(person)}
                >
                  <td className="p-4">
                    {person.image ? (
                      <Image
                        src={person.image}
                        alt={person.user.name}
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                        {getInitials(person.user.name)}
                      </div>
                    )}
                  </td>
                  <td className="p-4">{person.user.name}</td>
                  <td className="p-4">{person.user.email}</td>
                  <td className="p-4">{person.batch}</td>
                  <td className="p-4">{person.user.phone}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 text-sm rounded-full ${person.requestStatus === "PENDING"
                        ? "bg-yellow-100 text-yellow-800"
                        : person.requestStatus === "APPROVED"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                        }`}
                    >
                      {person.requestStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Alumni Details</DialogTitle>
              <DialogDescription>View and manage alumni information</DialogDescription>
            </DialogHeader>
            {selectedAlumni && (
              <div className="space-y-6">
                <div className="flex items-center space-x-6">
                  {selectedAlumni.image ? (
                    <Image
                      src={selectedAlumni.image}
                      alt={selectedAlumni.user.name}
                      width={80}
                      height={80}
                      className="h-20 w-20 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-20 w-20 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-2xl">
                      {getInitials(selectedAlumni.user.name)}
                    </div>
                  )}
                  <div>
                    <h2 className="text-2xl font-bold">{selectedAlumni.user.name}</h2>
                    <p className="text-gray-600">{selectedAlumni.user.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <Mail className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{selectedAlumni.user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-green-100 rounded-full">
                      <Phone className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium">{selectedAlumni.user.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-purple-100 rounded-full">
                      <Calendar className="h-5 w-5 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Graduation Year</p>
                      <p className="font-medium">{selectedAlumni.batch}</p>
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
                          className={`px-2 py-1 text-sm rounded-full ${selectedAlumni.requestStatus === "PENDING"
                            ? "bg-yellow-100 text-yellow-800"
                            : selectedAlumni.requestStatus === "APPROVED"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                            }`}
                        >
                          {selectedAlumni.requestStatus}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <Mail className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Organization</p>
                      <p className="font-medium">{selectedAlumni.organization}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <Mail className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Designation</p>
                      <p className="font-medium">{selectedAlumni.designation}</p>
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <p>Last updated: {selectedAlumni.updatedAt}</p>
                </div>

                {/* Buttons for Approve/Reject with Loading States */}
                <div className="flex space-x-4 mt-4">
                  <button
                    className={`w-full p-3 rounded-lg ${
                      selectedAlumni.requestStatus === 'APPROVED'
                        ? 'bg-green-300 cursor-not-allowed'
                        : isApproving
                        ? 'bg-green-400'
                        : 'bg-green-500 hover:bg-green-600'
                    } text-white transition-colors duration-200 flex items-center justify-center`}
                    title="Approve"
                    onClick={() => handleStatusChange('APPROVED')}
                    disabled={selectedAlumni.requestStatus === 'APPROVED' || isApproving || isRejecting}
                  >
                    {isApproving ? 'Approving...' : 'Approve'}
                  </button>
                  <button
                    className={`w-full p-3 rounded-lg ${
                      selectedAlumni.requestStatus === 'REJECTED'
                        ? 'bg-red-300 cursor-not-allowed'
                        : isRejecting
                        ? 'bg-red-400'
                        : 'bg-red-500 hover:bg-red-600'
                    } text-white transition-colors duration-200 flex items-center justify-center`}
                    title="Reject"
                    onClick={() => handleStatusChange('REJECTED')}
                    disabled={selectedAlumni.requestStatus === 'REJECTED' || isApproving || isRejecting}
                  >
                    {isRejecting ? 'Rejecting...' : 'Reject'}
                  </button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}