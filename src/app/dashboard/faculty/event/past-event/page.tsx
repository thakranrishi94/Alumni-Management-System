"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Calendar, User, BookOpen, FileText, Tag, Clock, ListTodo } from "lucide-react";
import Cookies from "js-cookie";
// import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import CreatePost from "@/components/CreatePost";
//interface for certificate
interface CertificateResponse {
  message: string;
  certificate: {
    id: number;
    eventId: number;
    userId: number;
    certificateUrl: string;
    issuedAt: string;
    issuerId: number;
    createdAt: string;
    updatedAt: string;
  };
}

// Update interface to make relationships optional
interface Event {
  eventRequestId: number;
  eventTitle: string;
  eventDescription: string;
  eventType: string;
  eventDate: string;
  eventTime: string;
  eventDuration: string;
  eventLink: string | null;
  eventAgenda: string;
  alumniId: number;
  facultyId: number;
  adminId: number | null;
  requestStatus: string;
  specialRequirements: string;
  targetAudience: string;
  createdAt: string;
  updatedAt: string;
  alumni: {
    user: {
      name: string;
    };
  };
  faculty: {
    user: {
      name: string;
    };
  };
}

//error interface
interface ApiError {
  response?: {
    status?: number;
    data?: {
      error?: string;
    };
  };
  message?: string;
}

// Utility functions remain the same
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  return `${hours}:${minutes}:${seconds} ${ampm}`;
};

// Helper function to get event host name
const getHostName = (event: Event): string => {
  if (event.alumni?.user.name) {
    return event.alumni.user.name;
  }
  // You might want to fetch admin name from your API if needed
  return event.adminId ? 'Admin' : 'Unknown Host';
};

export default function PastEvents() {
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isIssuingCertificate, setIsIssuingCertificate] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState<boolean>(false);
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = Cookies.get('ams_token');
        console.log(token)

        if (!token) {
          setError("Authentication required");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/event/events/past`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setEvents(response.data);
        setLoading(false);
      } catch (err: unknown) {
        const error = err as ApiError;

        // console.error("Failed to fetch events:", error);
        setError(error.response?.data?.error || error.message || "Failed to load events");
        setLoading(false);

        // Handle authentication errors
        if (error.response?.status === 401) {
          setError("Please log in to view your events");
          // You might want to redirect to login page here
        }
      }
    };

    fetchEvents();
  }, []);

  const handleRowClick = (event: Event) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
  };

  //issueCertificate
  const handleIssueCertificate = async (eventId: number, alumniId: number) => {
    try {
      setIsIssuingCertificate(true);
      const token = Cookies.get('ams_token');
      await axios.post<CertificateResponse>(
        `${process.env.NEXT_PUBLIC_API_URL}/certificate/issue`,
        {
          eventId,
          alumniId: alumniId  // We'll use alumniId as the userId
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Show success message
      toast({
        title: "Success",
        description: "Certificate issued successfully!",
        variant: "default",
      });

      // Close the dialog after successful issuance
      setIsDialogOpen(false);

      // Reset the issuing state
      setIsIssuingCertificate(false);

      // Optionally, you can open the certificate in a new tab
      // if (response.data.certificate?.certificateUrl) {
      //   window.open(response.data.certificate.certificateUrl, '_blank');
      // }
    } catch (error) {
      // console.error('Failed to issue certificate:', error);
      setIsIssuingCertificate(false);
      if (axios.isAxiosError(error)) {
        toast({
          title: "Error",
          description: error.response?.data?.message || 'Failed to issue certificate',
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      }
    }
  };

  // Updated search to handle optional fields
  const filteredEvents = events && events.filter(event =>
    event.eventTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.eventType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    getHostName(event).toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.eventAgenda.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (error) return <div className="flex items-center justify-center h-screen text-red-500">{error}</div>;

  return (
    <div className="bg-gray-100 w-full">
      <main className="flex-1 p-8 overflow-auto">
        <h1 className="text-2xl font-bold ml-5 md:ml-0">Past Events</h1>
        <p className="text-gray-600">Manage Events</p>

        <div className="mt-6">
          <input
            type="text"
            placeholder="Search events by name, type, host, or agenda"
            className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="mt-8 bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left text-gray-700 font-semibold">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      <span>Event Name</span>
                    </div>
                  </th>
                  <th className="p-3 text-left text-gray-700 font-semibold">
                    <div className="flex items-center space-x-2">
                      <ListTodo className="h-4 w-4 text-purple-500" />
                      <span>Agenda</span>
                    </div>
                  </th>
                  <th className="p-3 text-left text-gray-700 font-semibold">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-green-500" />
                      <span>Host</span>
                    </div>
                  </th>
                  <th className="p-3 text-left text-gray-700 font-semibold">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="h-4 w-4 text-purple-500" />
                      <span>Faculty</span>
                    </div>
                  </th>
                  <th className="p-3 text-left text-gray-700 font-semibold">
                    <div className="flex items-center space-x-2">
                      <Tag className="h-4 w-4 text-red-500" />
                      <span>Type</span>
                    </div>
                  </th>
                  <th className="p-3 text-left text-gray-700 font-semibold">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      <span>Date</span>
                    </div>
                  </th>
                  <th className="p-3 text-left text-gray-700 font-semibold">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-indigo-500" />
                      <span>Time</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((event, index) => (
                  <tr
                    key={event.eventRequestId}
                    onClick={() => handleRowClick(event)}
                    className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-gray-100 transition-colors cursor-pointer`}
                  >
                    <td className="p-3 text-gray-700">{event.eventTitle}</td>
                    <td className="p-3 text-gray-700">{event.eventAgenda}</td>
                    <td className="p-3 text-gray-700">{getHostName(event)}</td>
                    <td className="p-3 text-gray-700">{event.faculty?.user.name || 'Not assigned'}</td>
                    <td className="p-3 text-gray-700">
                      <span className={`px-2 py-1 text-sm rounded-full ${event.eventType === "WEBINAR" ? "bg-blue-100 text-blue-800" :
                        event.eventType === "WORKSHOP" ? "bg-green-100 text-green-800" :
                          event.eventType === "SEMINAR" ? "bg-purple-100 text-purple-800" :
                            "bg-yellow-100 text-yellow-800"
                        }`}>
                        {event.eventType}
                      </span>
                    </td>
                    <td className="p-3 text-gray-700">{formatDate(event.eventDate)}</td>
                    <td className="p-3 text-gray-700">{formatTime(event.eventTime)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Event Details</DialogTitle>
              <DialogDescription>View and update event information</DialogDescription>
            </DialogHeader>
            {selectedEvent && (
              <div className="space-y-6">
                <div className="flex items-center space-x-6">
                  <div className="h-20 w-20 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-2xl">
                    {(() => {
                      const words = selectedEvent.eventTitle
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
                    <h2 className="text-2xl font-bold">{selectedEvent.eventTitle}</h2>
                    <p className="text-gray-600">{selectedEvent.eventType}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <User className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Host</p>
                      <p className="font-medium">{getHostName(selectedEvent)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-green-100 rounded-full">
                      <BookOpen className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Faculty</p>
                      <p className="font-medium">{selectedEvent.faculty?.user.name || "Not assigned"}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-purple-100 rounded-full">
                      <Calendar className="h-5 w-5 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Date & Time</p>
                      <p className="font-medium">
                        {formatDate(selectedEvent.eventDate)} {formatTime(selectedEvent.eventTime)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-yellow-100 rounded-full">
                      <Clock className="h-5 w-5 text-yellow-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Duration</p>
                      <p className="font-medium">{selectedEvent.eventDuration}</p>
                    </div>
                  </div>


                  <div className=" flex space-y-4">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-indigo-100 rounded-full">
                        <ListTodo className="h-5 w-5 text-indigo-500" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Agenda</p>
                        <p className="font-medium">{selectedEvent.eventAgenda}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-purple-100 rounded-full">
                        <FileText className="h-5 w-5 text-purple-500" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Description</p>
                        <p className="font-medium">{selectedEvent.eventDescription}</p>
                      </div>
                    </div>
                  </div>
                  {/* <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-purple-100 rounded-full">
                        <Link2 className="h-5 w-5 text-purple-500" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Event Link:</p>
                        {selectedEvent.eventLink ? (
                          <Link
                            href={selectedEvent.eventLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-blue-600 hover:cursor-pointer"
                          >
                            {selectedEvent.eventLink}
                          </Link>
                        ) : (
                          <span className="text-gray-500">No assigned</span>
                        )}
                      </div>
                    </div>
                  </div> */}
                  <div className="mt-4">
                    <button
                      className={`bg-blue-700 p-2 rounded-sm text-xs text-white font-bold ${isIssuingCertificate ? 'opacity-75 cursor-not-allowed' : ''}`}
                      onClick={() => {
                        if (!isIssuingCertificate && selectedEvent && selectedEvent.alumniId) {
                          handleIssueCertificate(selectedEvent.eventRequestId, selectedEvent.alumniId);
                        } else if (!selectedEvent?.alumniId) {
                          toast({
                            title: "Error",
                            description: "Cannot issue a certificate for Admin",
                            variant: "destructive",
                          });
                        }
                      }}
                      disabled={isIssuingCertificate}
                    >
                      {isIssuingCertificate ? 'Issuing...' : 'Issue Certificate'}
                    </button>
                    <button
                      className="bg-blue-700 p-2 ml-4 px-5 rounded-sm text-xs text-white font-bold"
                      onClick={() => setIsCreatePostOpen(true)}
                    >
                      Create Post
                    </button>
                  </div>
                </div>
              </div>

            )}
            {selectedEvent && (
              <CreatePost
                eventId={selectedEvent.eventRequestId.toString()}
                eventTitle={selectedEvent.eventTitle}
                isOpen={isCreatePostOpen}
                setIsOpen={setIsCreatePostOpen}
              />
            )}
          </DialogContent>
        </Dialog>

      </main>
    </div>

  );
}