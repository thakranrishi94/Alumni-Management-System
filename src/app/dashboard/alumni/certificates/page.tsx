"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Calendar, User, BookOpen, Clock, Link, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";

// Define TypeScript interface for certificate data
interface Certificate {
  id: number;
  eventId: number;
  eventName: string;
  eventType: string;
  eventDate: string;
  alumniId: number;
  alumniName: string;
  alumniEmail: string;
  alumniCourse: string;
  alumniBatch: string;
  certificateUrl: string;
  issuedAt: string;
}

// Define API error response structure
interface ApiErrorResponse {
  message: string;
  success: boolean;
}

export default function FacultyCertificates() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [filteredCertificates, setFilteredCertificates] = useState<Certificate[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Fetch certificates on component mount
  useEffect(() => {
    fetchCertificates();
  }, []);

  // Filter certificates whenever search term or certificates list changes
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredCertificates(certificates);
    } else {
      const filtered = certificates.filter(
        (cert) =>
          cert.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cert.alumniName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cert.eventType.toLowerCase().includes(searchTerm.toLowerCase()) ||
          formatDate(cert.eventDate).includes(searchTerm)
      );
      setFilteredCertificates(filtered);
    }
    // Reset to first page whenever filters change
    setCurrentPage(1);
  }, [searchTerm, certificates]);

  // Format date function - moved outside of return for reuse
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const fetchCertificates = async () => {
    try {
      const token = Cookies.get('ams_token');
      if (!token) {
        setError("Authentication token not found");
        setLoading(false);
        return;
      }
  
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        throw new Error("API URL is not defined in environment variables");
      }
  
      const response = await axios.get(`${apiUrl}/certificate/byAlumni`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      console.log("API Response:", response.data); // Debug log
  
      if (response.data.success) {
        setCertificates(response.data.data);
        setFilteredCertificates(response.data.data);
      } else {
        setError(response.data.message || "Failed to fetch certificates");
      }
    } catch (err: unknown) {
      console.error("Error fetching certificates:", err);
      const axiosError = err as AxiosError<ApiErrorResponse>;
      setError(
        axiosError.response?.data?.message || "Failed to fetch certificates"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCertificates.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCertificates.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="bg-gray-100 w-full">
      <main className="flex-1 p-8 overflow-auto">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Faculty Issued Certificates</h1>
            <p className="text-gray-600">Manage certificates you&apos;ve issued to alumni</p>
          </div>
          <Button onClick={fetchCertificates} className="bg-blue-500 hover:bg-blue-600">
            Refresh
          </Button>
        </div>

        <div className="mt-6">
          <Input
            type="text"
            placeholder="Search by event name, alumni name, event type, or date"
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
          />
        </div>

        {loading ? (
          <div className="mt-8 text-center py-8">Loading certificates...</div>
        ) : error ? (
          <div className="mt-8 text-center py-8 text-red-500">{error}</div>
        ) : filteredCertificates.length === 0 ? (
          <div className="mt-8 text-center py-8">No certificates found</div>
        ) : (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentItems.map((certificate) => (
              <div
                key={certificate.id}
                onClick={() => handleRowClick(certificate)}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Calendar className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{certificate.eventName}</h2>
                    <p className="text-gray-600">{certificate.eventType}</p>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-gray-500" />
                    <p className="text-gray-700">
                      <strong>Alumni:</strong> {certificate.alumniName}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5 text-gray-500" />
                    <p className="text-gray-700">
                      <strong>Course:</strong> {certificate.alumniCourse}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-gray-500" />
                    <p className="text-gray-700">
                      <strong>Date:</strong> {formatDate(certificate.eventDate)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <nav className="flex items-center space-x-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => paginate(i + 1)}
                  className={`px-4 py-2 border rounded-lg ${
                    currentPage === i + 1
                      ? "bg-blue-500 text-white"
                      : "text-gray-500"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </nav>
          </div>
        )}
      </main>

      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Certificate Details</DialogTitle>
            <DialogDescription>View and manage certificate information</DialogDescription>
          </DialogHeader>
          {selectedCertificate && (
            <div className="space-y-6">
              <div className="flex items-center space-x-6">
              <div className="h-20 w-20 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-2xl">
                    {(() => {
                      const words = selectedCertificate.eventName
                        .replace(/[&.]/g, ' ')
                        .split(" ")
                        .filter(word => word.length > 0);

                      if (words.length > 3) {
                        return (words[0][0] + words[words.length - 1][0]).toUpperCase();
                      }

                      return words
                        .map(word => word[0])
                        .join('')
                        .toUpperCase();
                    })()}
                  </div>
                <div>
                  <h2 className="text-2xl font-bold">{selectedCertificate.eventName}</h2>
                  <p className="text-gray-600">{selectedCertificate.eventType}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <User className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Alumni Name</p>
                    <p className="font-medium">{selectedCertificate.alumniName}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-green-100 rounded-full">
                    <BookOpen className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Course & Batch</p>
                    <p className="font-medium">
                      {selectedCertificate.alumniCourse} ({selectedCertificate.alumniBatch})
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Calendar className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Event Date</p>
                    <p className="font-medium">{formatDate(selectedCertificate.eventDate)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-yellow-100 rounded-full">
                    <Clock className="h-5 w-5 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Issued Date</p>
                    <p className="font-medium">{formatDate(selectedCertificate.issuedAt)}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 col-span-2">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Link className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{selectedCertificate.alumniEmail}</p>
                  </div>
                </div>
                
                <div className="col-span-2 flex justify-end">
                  <a 
                    href={selectedCertificate.certificateUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Button>
                      <Download className="mr-2 h-4 w-4" />
                      Download Certificate
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}