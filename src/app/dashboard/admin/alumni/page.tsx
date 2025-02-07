"use client";
import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Search, Users, Calendar, Mail, Phone, User } from "lucide-react";
import axios from "axios";

interface AlumniUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: "ACTIVE" | "INACTIVE";
}

interface AlumniData {
  id: number;
  userId: number;
  batch: string;
  course: string;
  organization: string;
  image?: string;
  user: AlumniUser;
}

interface AlumniCount {
  totalApproved: number;
  active: number;
  inactive: number;
}

// Type for nested object paths
type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

export default function AlumniPage() {
  const [selectedAlumni, setSelectedAlumni] = useState<AlumniData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [alumni, setAlumni] = useState<AlumniData[]>([]);
  const [filteredAlumni, setFilteredAlumni] = useState<AlumniData[]>([]);
  const [alumniCount, setAlumniCount] = useState<AlumniCount>({
    totalApproved: 0,
    active: 0,
    inactive: 0
  });

  // Type-safe getter function for nested object properties
  const safeGet = useCallback(<T extends object>(
    obj: T,
    path: NestedKeyOf<T>,
    defaultValue: string = ''
  ): string => {
    try {
      return path.split('.').reduce((current: unknown, part: string) => {
        if (current && typeof current === 'object' && part in current) {
          const value = (current as Record<string, unknown>)[part];
          return value;
        }
        return defaultValue;
      }, obj)?.toString() ?? defaultValue;
    } catch {
      return defaultValue;
    }
  }, []);
  // Filter alumni based on search query
  const filterAlumni = useCallback(() => {
    if (!searchQuery.trim()) {
      setFilteredAlumni(alumni);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const filtered = alumni.filter((person) => {
      const includes = (value: string): boolean => 
        value.toLowerCase().includes(query);

      return (
        includes(safeGet(person, 'user.name')) ||
        includes(safeGet(person, 'user.email')) ||
        includes(safeGet(person, 'batch')) ||
        includes(safeGet(person, 'user.phone')) ||
        includes(safeGet(person, 'course')) ||
        includes(safeGet(person, 'organization'))
      );
    });

    setFilteredAlumni(filtered);
  }, [searchQuery, alumni, safeGet]);

  // Get alumni details from API
  const getAllumniDetails = useCallback(async () => {
    try {
      const response = await axios.get<AlumniData[]>(`${process.env.NEXT_PUBLIC_API_URL}/alumni`);
      setAlumni(response.data);
      setFilteredAlumni(response.data);
    } catch (error) {
      console.error("Error fetching alumni details:", error);
      setAlumni([]);
      setFilteredAlumni([]);
    }
  }, []);

  // Get alumni count from API
  const getAllumniCount = useCallback(async () => {
    try {
      const response = await axios.get<AlumniCount>(`${process.env.NEXT_PUBLIC_API_URL}/alumni/alumni-status`);
      setAlumniCount(response.data);
    } catch (error) {
      console.error("Error fetching alumni counts:", error);
    }
  }, []);

  // Initialize data on component mount
  useEffect(() => {
    getAllumniDetails();
    getAllumniCount();
  }, [getAllumniDetails, getAllumniCount]);

  // Update filtered alumni when search query or alumni data changes
  useEffect(() => {
    filterAlumni();
  }, [filterAlumni]);

  // Get initials from name for avatar
  const getInitials = (name: string): string => {
    if (!name || typeof name !== 'string') return '??';
    
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase() || '??';
  };

  const handleRowClick = (person: AlumniData) => {
    if (!person) return;
    setSelectedAlumni(person);
    setIsDialogOpen(true);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
          {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <h1 className="text-2xl font-bold ml-5 md:ml-0">Alumni</h1>
        <p className="text-gray-600">Manage alumni profiles, track engagement, and organize events</p>
            
        {/* Statistics Cards */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md py-9">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Alumni</p>
                <p className="text-2xl font-bold">{alumniCount.totalApproved}</p>
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
                <p className="text-2xl font-bold">{alumniCount.active}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <Users className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Inactive Alumni</p>
                <p className="text-2xl font-bold">{alumniCount.inactive}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mt-6 flex items-center w-full justify-between">
          <div className="relative flex-1 w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search alumni by name, email, grad year, phone, course, or school"
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
                  onClick={() => handleRowClick(person)}
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  <td className="p-4">
                    {person.image ? (
                      <Image
                        src={person.image}
                        alt={safeGet(person, 'user.name', 'Alumni')}
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                        {getInitials(safeGet(person, 'user.name'))}
                      </div>
                    )}
                  </td>
                  <td className="p-4">{safeGet(person, 'user.name')}</td>
                  <td className="p-4">{safeGet(person, 'user.email')}</td>
                  <td className="p-4">{safeGet(person, 'batch')}</td>
                  <td className="p-4">{safeGet(person, 'user.phone')}</td>
                  <td className="p-4">{safeGet(person, 'course')}</td>
                  <td className="p-4">{safeGet(person, 'organization')}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 text-sm rounded-full ${
                        safeGet(person, 'user.status') === "ACTIVE"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {safeGet(person, 'user.status', 'Unknown')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Alumni Details Dialog */}
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
                  {selectedAlumni.image ? (
                    <Image
                      src={selectedAlumni.image}
                      alt={safeGet(selectedAlumni, 'user.name', 'Alumni')}
                      width={80}
                      height={80}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-20 w-20 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-2xl">
                      {getInitials(safeGet(selectedAlumni, 'user.name'))}
                    </div>
                  )}
                  <div>
                    <h2 className="text-2xl font-bold">{safeGet(selectedAlumni, 'user.name')}</h2>
                    <p className="text-gray-600">{safeGet(selectedAlumni, 'user.email')}</p>
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
                      <p className="font-medium">{safeGet(selectedAlumni, 'user.email')}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-green-100 rounded-full">
                      <Phone className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium">{safeGet(selectedAlumni, 'user.phone')}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-purple-100 rounded-full">
                      <Calendar className="h-5 w-5 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Graduation Year</p>
                      <p className="font-medium">{safeGet(selectedAlumni, 'batch')}</p>
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
                            safeGet(selectedAlumni, 'user.status') === "ACTIVE"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {safeGet(selectedAlumni, 'user.status', 'Unknown')}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}