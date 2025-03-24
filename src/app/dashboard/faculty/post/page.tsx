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
import { Calendar, User, FileText, Tag, Clock, Image as ImageIcon, Menu } from "lucide-react";
import Cookies from "js-cookie";
import UpdatePost from "@/components/UpdatePost";
import { Button } from "@/components/ui/button";
import Image from "next/image"; // Import Next.js Image component

// Define types for our data structures
interface Post {
  id: number;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  eventImages?: { url: string }[];
  event: {
    eventType: string;
    eventDate: string;
    faculty?: {
      user?: {
        name: string;
      }
    };
    alumni?: {
      user?: {
        name: string;
      }
    }
  }
}

// Utility functions
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  return `${hours}:${minutes} ${ampm}`;
};

// Helper function to safely get name
const getName = (post: Post, type: 'alumni' | 'faculty'): string => {
  if (post.event[type]?.user?.name) {
    return post.event[type].user.name;
  }
  return type === 'alumni' ? 'Admin' : 'Admin';
};

export default function PostListing() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');

  // Fetch posts when component mounts
  useEffect(() => {
    fetchPosts();
    
    // Check screen size to set initial view mode
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setViewMode('card');
      } else {
        setViewMode('table');
      }
    };
    
    // Set initial view mode
    handleResize();
    
    // Add resize listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const token = Cookies.get('ams_token');

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/post/get-faculty-post`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPosts(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Failed to load posts. Please try again later.');
      setIsLoading(false);
    }
  };

  const handleRowClick = (post: Post) => {
    setSelectedPost(post);
    setIsDialogOpen(true);
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'table' ? 'card' : 'table');
  };

  const filteredPosts = posts.filter(post => {
    const alumniName = getName(post, 'alumni').toLowerCase();
    const facultyName = getName(post, 'faculty').toLowerCase();
    const query = searchQuery.toLowerCase();
    
    return post.title.toLowerCase().includes(query) ||
      alumniName.includes(query) ||
      facultyName.includes(query) ||
      post.event.eventType.toLowerCase().includes(query);
  });

  // Get initials for card view
  const getInitials = (title: string) => {
    const words = title
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
  };

  const getEventTypeColor = (eventType: string) => {
    switch (eventType) {
      case "WEBINAR": return "bg-blue-100 text-blue-800";
      case "WORKSHOP": return "bg-green-100 text-green-800";
      case "SEMINAR": return "bg-purple-100 text-purple-800";
      case "LECTURE": return "bg-red-100 text-red-800";
      default: return "bg-yellow-100 text-yellow-800";
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading posts...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="bg-gray-100 w-full min-h-screen">
      <main className="flex-1 p-4 md:p-8 overflow-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-bold">Your Posts</h1>
            <p className="text-gray-600 text-sm md:text-base">View and manage your posts</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={toggleViewMode}
              className="flex items-center gap-2 ml-2"
            >
              <Menu className="h-4 w-4" />
              {viewMode === 'table' ? 'Card View' : 'Table View'}
            </Button>
          </div>
        </div>

        <div className="mt-4 md:mt-6">
          <input
            type="text"
            placeholder="Search posts by title, host, or event type"
            className="w-full p-2 md:p-3 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-200 text-sm md:text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="mt-6 md:mt-8 bg-white shadow-lg rounded-lg overflow-hidden">
          {filteredPosts.length === 0 ? (
            <div className="p-6 md:p-8 text-center text-gray-500">
              No posts found. Posts from your events will appear here.
            </div>
          ) : viewMode === 'table' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-xs md:text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 md:p-3 text-left text-gray-700 font-semibold">
                      <div className="flex items-center space-x-1 md:space-x-2">
                        <FileText className="h-3 w-3 md:h-4 md:w-4 text-blue-500" />
                        <span>Title</span>
                      </div>
                    </th>
                    <th className="p-2 md:p-3 text-left text-gray-700 font-semibold hidden sm:table-cell">
                      <div className="flex items-center space-x-1 md:space-x-2">
                        <User className="h-3 w-3 md:h-4 md:w-4 text-green-500" />
                        <span>Host</span>
                      </div>
                    </th>
                    <th className="p-2 md:p-3 text-left text-gray-700 font-semibold hidden md:table-cell">
                      <div className="flex items-center space-x-1 md:space-x-2">
                        <User className="h-3 w-3 md:h-4 md:w-4 text-green-500" />
                        <span>Faculty</span>
                      </div>
                    </th>
                    <th className="p-2 md:p-3 text-left text-gray-700 font-semibold">
                      <div className="flex items-center space-x-1 md:space-x-2">
                        <Tag className="h-3 w-3 md:h-4 md:w-4 text-red-500" />
                        <span>Type</span>
                      </div>
                    </th>
                    <th className="p-2 md:p-3 text-left text-gray-700 font-semibold hidden sm:table-cell">
                      <div className="flex items-center space-x-1 md:space-x-2">
                        <Calendar className="h-3 w-3 md:h-4 md:w-4 text-blue-500" />
                        <span>Date</span>
                      </div>
                    </th>
                    <th className="p-2 md:p-3 text-left text-gray-700 font-semibold">
                      <div className="flex items-center space-x-1 md:space-x-2">
                        <Clock className="h-3 w-3 md:h-4 md:w-4 text-indigo-500" />
                        <span>Time</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPosts.map((post, index) => (
                    <tr
                      key={post.id}
                      onClick={() => handleRowClick(post)}
                      className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                        } hover:bg-gray-100 transition-colors cursor-pointer`}
                    >
                      <td className="p-2 md:p-3 text-gray-700 truncate max-w-[150px] md:max-w-none">{post.title}</td>
                      <td className="p-2 md:p-3 text-gray-700 hidden sm:table-cell">{getName(post, 'alumni')}</td>
                      <td className="p-2 md:p-3 text-gray-700 hidden md:table-cell">{getName(post, 'faculty')}</td>
                      <td className="p-2 md:p-3 text-gray-700">
                        <span className={`px-1 py-0.5 md:px-2 md:py-1 text-xs md:text-sm rounded-full ${getEventTypeColor(post.event.eventType)}`}>
                          {post.event.eventType}
                        </span>
                      </td>
                      <td className="p-2 md:p-3 text-gray-700 hidden sm:table-cell">{formatDate(post.event.eventDate)}</td>
                      <td className="p-2 md:p-3 text-gray-700">{formatTime(post.startTime)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              {filteredPosts.map((post) => (
                <div 
                  key={post.id}
                  onClick={() => handleRowClick(post)}
                  className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-4 cursor-pointer border border-gray-100"
                >
                  <div className="flex items-start gap-3">
                    <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                      {getInitials(post.title)}
                    </div>
                    <div className="overflow-hidden">
                      <h3 className="text-md font-semibold truncate">{post.title}</h3>
                      <div className="mt-1">
                        <span className={`px-2 py-1 text-xs rounded-full ${getEventTypeColor(post.event.eventType)}`}>
                          {post.event.eventType}
                        </span>
                      </div>
                      <div className="mt-3 text-xs text-gray-600 grid grid-cols-2 gap-x-2 gap-y-1">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(post.event.eventDate)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{formatTime(post.startTime)}</span>
                        </div>
                        <div className="flex items-center gap-1 col-span-2 truncate">
                          <User className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">{getName(post, 'alumni')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* View Post Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-2xl max-w-[95vw] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                  <DialogTitle className="text-xl sm:text-2xl font-bold">Post Details</DialogTitle>
                  <DialogDescription>View post information</DialogDescription>
                </div>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDialogOpen(false);
                    setIsUpdateDialogOpen(true);
                  }}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 self-start sm:self-auto"
                >
                  <FileText className="h-4 w-4" />
                  Edit Post
                </Button>
              </div>
            </DialogHeader>
            {selectedPost && (
              <div className="space-y-6 p-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                  <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-xl sm:text-2xl flex-shrink-0 mx-auto sm:mx-0">
                    {getInitials(selectedPost.title)}
                  </div>

                  <div className="text-center sm:text-left">
                    <h2 className="text-xl sm:text-2xl font-bold">{selectedPost.title}</h2>
                    <p className="text-gray-600">{selectedPost.event.eventType}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 sm:p-3 bg-blue-100 rounded-full">
                      <User className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600">Host</p>
                      <p className="text-sm sm:text-base font-medium">{getName(selectedPost, 'faculty')}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="p-2 sm:p-3 bg-green-100 rounded-full">
                      <Tag className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600">Event Type</p>
                      <p className="text-sm sm:text-base font-medium">{selectedPost.event.eventType}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="p-2 sm:p-3 bg-purple-100 rounded-full">
                      <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600">Date</p>
                      <p className="text-sm sm:text-base font-medium">{formatDate(selectedPost.startTime)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="p-2 sm:p-3 bg-yellow-100 rounded-full">
                      <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600">Time</p>
                      <p className="text-sm sm:text-base font-medium">{formatTime(selectedPost.startTime)} - {formatTime(selectedPost.endTime)}</p>
                    </div>
                  </div>
                </div>

                {selectedPost.eventImages && selectedPost.eventImages.length > 0 && (
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 sm:p-3 bg-indigo-100 rounded-full">
                        <ImageIcon className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs sm:text-sm text-gray-600">Images</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                          {selectedPost.eventImages.map((image, index) => (
                            <div key={index} className="h-16 sm:h-20 bg-gray-200 rounded flex items-center justify-center overflow-hidden">
                              <Image
                                src={image.url}
                                alt={`Event image ${index + 1}`}
                                width={100}
                                height={100}
                                className="h-full w-full object-cover rounded"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 sm:p-3 bg-purple-100 rounded-full">
                      <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs sm:text-sm text-gray-600">Description</p>
                      <p className="text-sm sm:text-base">{selectedPost.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Update Post Dialog */}
        <UpdatePost
          post={selectedPost}
          isOpen={isUpdateDialogOpen}
          onClose={() => setIsUpdateDialogOpen(false)}
          onSuccess={() => {
            fetchPosts();
            setIsUpdateDialogOpen(false);
          }}
        />
      </main>
    </div>
  );
}