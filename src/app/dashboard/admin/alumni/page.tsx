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
import { Search, Users, Calendar, Mail, Phone, User, Briefcase, Building, Linkedin, Twitter, Facebook, Instagram, Globe, FileText } from "lucide-react";
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
  designation: string;
  bio?: string;
  image?: string;
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
  website?: string;
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
        includes(safeGet(person, 'organization')) ||
        (person.bio && includes(person.bio))
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

  // Function to open social media links
  const openSocialMedia = (url: string | undefined, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent dialog from closing
    if (url) {
      // Add http if not present
      const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
      window.open(formattedUrl, '_blank');
    }
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
                <th className="p-4 text-left">Organization</th>
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
                      className={`px-2 py-1 text-sm rounded-full ${safeGet(person, 'user.status') === "ACTIVE"
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
          <DialogContent className="sm:max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl sm:text-2xl font-bold">Alumni Details</DialogTitle>
              <DialogDescription>View and manage alumni information</DialogDescription>
            </DialogHeader>
            {selectedAlumni && (
              <div className="space-y-4 sm:space-y-6">
                {/* Profile Section - Made responsive */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:space-x-6">
                  {selectedAlumni.image ? (
                    <Image
                      src={selectedAlumni.image}
                      alt={safeGet(selectedAlumni, 'user.name', 'Alumni')}
                      width={80}
                      height={80}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-xl sm:text-2xl flex-shrink-0">
                      {getInitials(safeGet(selectedAlumni, 'user.name'))}
                    </div>
                  )}
                  <div className="text-center sm:text-left">
                    <h2 className="text-xl sm:text-2xl font-bold">{safeGet(selectedAlumni, 'user.name')}</h2>
                    <p className="text-gray-600 text-sm sm:text-base">{safeGet(selectedAlumni, 'user.email')}</p>

                    {/* Social Media Icons - Made responsive */}
                    <div className="flex justify-center sm:justify-start mt-2 space-x-2 sm:space-x-3">
                      {selectedAlumni.linkedin && (
                        <div
                          onClick={(e) => openSocialMedia(selectedAlumni.linkedin, e)}
                          className="p-1.5 sm:p-2 bg-blue-100 rounded-full cursor-pointer hover:bg-blue-200"
                        >
                          <Linkedin className="h-4 w-4 sm:h-5 sm:w-5 text-blue-700" />
                        </div>
                      )}
                      {selectedAlumni.twitter && (
                        <div
                          onClick={(e) => openSocialMedia(selectedAlumni.twitter, e)}
                          className="p-1.5 sm:p-2 bg-blue-100 rounded-full cursor-pointer hover:bg-blue-200"
                        >
                          <Twitter className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                        </div>
                      )}
                      {selectedAlumni.facebook && (
                        <div
                          onClick={(e) => openSocialMedia(selectedAlumni.facebook, e)}
                          className="p-1.5 sm:p-2 bg-blue-100 rounded-full cursor-pointer hover:bg-blue-200"
                        >
                          <Facebook className="h-4 w-4 sm:h-5 sm:w-5 text-blue-800" />
                        </div>
                      )}
                      {selectedAlumni.instagram && (
                        <div
                          onClick={(e) => openSocialMedia(selectedAlumni.instagram, e)}
                          className="p-1.5 sm:p-2 bg-pink-100 rounded-full cursor-pointer hover:bg-pink-200"
                        >
                          <Instagram className="h-4 w-4 sm:h-5 sm:w-5 text-pink-600" />
                        </div>
                      )}
                      {selectedAlumni.website && (
                        <div
                          onClick={(e) => openSocialMedia(selectedAlumni.website, e)}
                          className="p-1.5 sm:p-2 bg-gray-100 rounded-full cursor-pointer hover:bg-gray-200"
                        >
                          <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bio Section */}
                {selectedAlumni.bio && (
                  <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1 sm:mb-2">
                      <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                      <h3 className="font-medium text-sm sm:text-base">Biography</h3>
                    </div>
                    <p className="text-gray-700 text-sm sm:text-base">{selectedAlumni.bio}</p>
                  </div>
                )}

                {/* Details Section - Made responsive with grid adjustments */}
                <div className="grid grid-cols-1 gap-3 sm:gap-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className="p-2 sm:p-3 bg-blue-100 rounded-full flex-shrink-0">
                        <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm text-gray-600">Email</p>
                        <p className="font-medium text-sm sm:text-base truncate">{safeGet(selectedAlumni, 'user.email')}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className="p-2 sm:p-3 bg-green-100 rounded-full flex-shrink-0">
                        <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm text-gray-600">Phone</p>
                        <p className="font-medium text-sm sm:text-base truncate">{safeGet(selectedAlumni, 'user.phone')}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className="p-2 sm:p-3 bg-purple-100 rounded-full flex-shrink-0">
                        <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm text-gray-600">Graduation Year</p>
                        <p className="font-medium text-sm sm:text-base truncate">{safeGet(selectedAlumni, 'batch')}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className="p-2 sm:p-3 bg-yellow-100 rounded-full flex-shrink-0">
                        <User className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm text-gray-600">Status</p>
                        <div className="font-medium text-sm sm:text-base">
                          <span
                            className={`px-2 py-0.5 text-xs sm:text-sm rounded-full ${safeGet(selectedAlumni, 'user.status') === "ACTIVE"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                              }`}
                          >
                            {safeGet(selectedAlumni, 'user.status', 'Unknown')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className="p-2 sm:p-3 bg-blue-100 rounded-full flex-shrink-0">
                        <Building className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm text-gray-600">Organization</p>
                        <p className="font-medium text-sm sm:text-base truncate">{selectedAlumni.organization}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className="p-2 sm:p-3 bg-blue-100 rounded-full flex-shrink-0">
                        <Briefcase className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm text-gray-600">Designation</p>
                        <p className="font-medium text-sm sm:text-base truncate">{selectedAlumni.designation}</p>
                      </div>
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