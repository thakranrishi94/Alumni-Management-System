"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Calendar, User, BookOpen, FileText, Tag, Clock, Image, Plus, X } from "lucide-react";

// Define types for our data structures
interface Post {
  id: number;
  title: string;
  hostName: string;
  facultyName: string;
  eventName: string;
  date: string;
  time: string;
  description: string;
  images?: string[];
}

interface Event {
  id: number;
  name: string;
}

// Sample data for static implementation
const samplePosts: Post[] = [
  {
    id: 1,
    title: "Introduction to React Workshop",
    hostName: "John Doe",
    facultyName: "Dr. Smith",
    eventName: "WORKSHOP",
    date: "2025-02-25",
    time: "2025-02-25T14:30:00",
    description: "Learning the basics of React framework and component design patterns."
  },
  {
    id: 2,
    title: "AI in Healthcare Seminar",
    hostName: "Jane Smith",
    facultyName: "Dr. Johnson",
    eventName: "SEMINAR",
    date: "2025-02-28",
    time: "2025-02-28T10:00:00",
    description: "Exploring the applications of artificial intelligence in modern healthcare."
  },
  {
    id: 3,
    title: "Career Development Webinar",
    hostName: "Alex Williams",
    facultyName: "Prof. Davis",
    eventName: "WEBINAR",
    date: "2025-03-05",
    time: "2025-03-05T16:00:00",
    description: "Tips and strategies for advancing your professional career."
  }
];

// Sample events for dropdown
const sampleEvents: Event[] = [
  { id: 1, name: "WORKSHOP" },
  { id: 2, name: "SEMINAR" },
  { id: 3, name: "WEBINAR" },
  { id: 4, name: "CONFERENCE" },
  { id: 5, name: "HACKATHON" },
  { id: 6, name: "MEETUP" },
  { id: 7, name: "TRAINING" }
];

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

export default function PostListing() {
  const [posts, setPosts] = useState<Post[]>(samplePosts);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [events, setEvents] = useState<Event[]>(sampleEvents);
  
  // New post form state - simplified
  const [newPost, setNewPost] = useState({
    id: 0, // Will be set when created
    eventName: "",
    description: "",
    hostName: "Current User", // Placeholder, would come from auth in real implementation
    images: [] as string[]
  });

  // Simulating an API call to fetch events
  useEffect(() => {
    // In a real application, you would fetch from your API here
    // const fetchEvents = async () => {
    //   try {
    //     const response = await fetch('/api/events');
    //     const data = await response.json();
    //     setEvents(data);
    //   } catch (error) {
    //     console.error('Error fetching events:', error);
    //   }
    // };
    // fetchEvents();

    // For now, we'll just use our sample data
    setEvents(sampleEvents);
  }, []);

  const handleRowClick = (post: Post) => {
    setSelectedPost(post);
    setIsDialogOpen(true);
  };

  const handleCreatePost = () => {
    // Here you would normally send data to your API
    // For static implementation, we'll just add to the local state
    const newId = Math.max(...posts.map(post => post.id)) + 1;
    const createdPost = {
      ...newPost,
      id: newId,
      title: newPost.eventName, // Use event name as title or set a default
      facultyName: "", // Set default or remove if not needed
      date: new Date().toISOString().split('T')[0], // Current date
      time: new Date().toISOString().slice(0, 16) // Current time
    } as Post;
    
    setPosts([...posts, createdPost]);
    setIsCreateDialogOpen(false);
    setNewPost({
      id: 0,
      eventName: "",
      description: "",
      hostName: "Current User",
      images: []
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // In a real implementation, you would handle file uploads
    // For now, we'll just store the file names
    if (e.target.files) {
      const fileNames = Array.from(e.target.files).map(file => file.name);
      setNewPost({
        ...newPost,
        images: [...(newPost.images || []), ...fileNames]
      });
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = [...(newPost.images || [])];
    updatedImages.splice(index, 1);
    setNewPost({
      ...newPost,
      images: updatedImages
    });
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.hostName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.facultyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.eventName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-gray-100 w-full">
      <main className="flex-1 p-8 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold ml-5 md:ml-0">Posts</h1>
            <p className="text-gray-600">Manage Posts</p>
          </div>
          <button 
            onClick={() => setIsCreateDialogOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Create New Post
          </button>
        </div>

        <div className="mt-6">
          <input
            type="text"
            placeholder="Search posts by title, host, faculty, or event type"
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
                      <FileText className="h-4 w-4 text-blue-500" />
                      <span>Title</span>
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
                      <span>Event Type</span>
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
                {filteredPosts.map((post, index) => (
                  <tr
                    key={post.id}
                    onClick={() => handleRowClick(post)}
                    className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-gray-100 transition-colors cursor-pointer`}
                  >
                    <td className="p-3 text-gray-700">{post.title}</td>
                    <td className="p-3 text-gray-700">{post.hostName}</td>
                    <td className="p-3 text-gray-700">{post.facultyName}</td>
                    <td className="p-3 text-gray-700">
                      <span className={`px-2 py-1 text-sm rounded-full ${
                        post.eventName === "WEBINAR" ? "bg-blue-100 text-blue-800" :
                        post.eventName === "WORKSHOP" ? "bg-green-100 text-green-800" :
                        post.eventName === "SEMINAR" ? "bg-purple-100 text-purple-800" :
                        post.eventName === "HACKATHON" ? "bg-red-100 text-red-800" :
                        post.eventName === "MEETUP" ? "bg-orange-100 text-orange-800" :
                        post.eventName === "TRAINING" ? "bg-indigo-100 text-indigo-800" :
                        "bg-yellow-100 text-yellow-800"
                      }`}>
                        {post.eventName}
                      </span>
                    </td>
                    <td className="p-3 text-gray-700">{formatDate(post.date)}</td>
                    <td className="p-3 text-gray-700">{formatTime(post.time)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* View Post Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Post Details</DialogTitle>
              <DialogDescription>View post information</DialogDescription>
            </DialogHeader>
            {selectedPost && (
              <div className="space-y-6">
                <div className="flex items-center space-x-6">
                  <div className="h-20 w-20 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-2xl">
                    {(() => {
                      const words = selectedPost.title
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
                    <h2 className="text-2xl font-bold">{selectedPost.title}</h2>
                    <p className="text-gray-600">{selectedPost.eventName}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <User className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Host</p>
                      <p className="font-medium">{selectedPost.hostName}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-green-100 rounded-full">
                      <BookOpen className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Faculty</p>
                      <p className="font-medium">{selectedPost.facultyName}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-purple-100 rounded-full">
                      <Calendar className="h-5 w-5 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Date</p>
                      <p className="font-medium">{formatDate(selectedPost.date)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-yellow-100 rounded-full">
                      <Clock className="h-5 w-5 text-yellow-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Time</p>
                      <p className="font-medium">{formatTime(selectedPost.time)}</p>
                    </div>
                  </div>
                </div>

                {selectedPost.images && selectedPost.images.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-indigo-100 rounded-full">
                        <Image className="h-5 w-5 text-indigo-500" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Images</p>
                        <div className="grid grid-cols-3 gap-2 mt-2">
                          {selectedPost.images.map((image, index) => (
                            <div key={index} className="h-20 bg-gray-200 rounded flex items-center justify-center">
                              <p className="text-xs text-gray-500 p-2 truncate">{image}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-purple-100 rounded-full">
                      <FileText className="h-5 w-5 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Description</p>
                      <p className="font-medium">{selectedPost.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Create New Post Dialog - Simplified */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
  <DialogContent className="sm:max-w-lg md:max-w-2xl w-11/12 p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle className="text-xl sm:text-2xl font-bold">Create New Post</DialogTitle>
      <DialogDescription className="text-sm sm:text-base">Fill in the details to create a new post</DialogDescription>
    </DialogHeader>
    
    <div className="space-y-4 sm:space-y-6 py-2 sm:py-4">
      {/* Event Name Dropdown */}
      <div className="space-y-1 sm:space-y-2">
        <label className="text-xs sm:text-sm font-medium text-gray-700">Event Name</label>
        <select
          className="w-full p-2 text-sm sm:text-base border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
          value={newPost.eventName}
          onChange={(e) => setNewPost({...newPost, eventName: e.target.value})}
          required
        >
          <option value="">Select Event Type</option>
          {events.map(event => (
            <option key={event.id} value={event.name}>{event.name}</option>
          ))}
        </select>
      </div>
      
      {/* Enhanced Image Upload */}
      <div className="space-y-1 sm:space-y-2">
        <label className="text-xs sm:text-sm font-medium text-gray-700">Gallery Images</label>
        <div className="flex flex-col space-y-2">
          <input
            type="file"
            multiple
            className="hidden"
            id="images"
            onChange={handleImageUpload}
            accept="image/*"
          />
          <label
            htmlFor="images"
            className="cursor-pointer bg-gray-100 border-2 border-dashed border-gray-300 rounded-md p-3 sm:p-6 text-center hover:bg-gray-50 transition-colors"
          >
            <Image className="h-6 w-6 sm:h-8 sm:w-8 mx-auto text-gray-400" />
            <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-500">Click to upload multiple images</p>
            <p className="text-xs text-gray-400">(Max 5 images recommended)</p>
          </label>
          
          {/* Preview of uploaded images with delete functionality */}
          {newPost.images && newPost.images.length > 0 && (
            <div className="mt-2 sm:mt-4">
              <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">Selected images ({newPost.images.length}):</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
                {newPost.images.map((image, index) => (
                  <div key={index} className="relative group bg-gray-100 p-2 sm:p-3 rounded">
                    <p className="text-xs truncate pr-6">{image}</p>
                    <button 
                      onClick={() => removeImage(index)}
                      className="absolute top-1 sm:top-2 right-1 sm:right-2 bg-red-100 hover:bg-red-200 text-red-500 rounded-full p-1 transition-colors"
                      type="button"
                      aria-label="Remove image"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Description */}
      <div className="space-y-1 sm:space-y-2">
        <label className="text-xs sm:text-sm font-medium text-gray-700">Description</label>
        <textarea
          className="w-full p-2 sm:p-3 border rounded-md focus:outline-none focus:ring focus:ring-blue-200 min-h-24 sm:min-h-32 resize-y text-sm sm:text-base"
          placeholder="Enter detailed description of the post..."
          value={newPost.description}
          onChange={(e) => setNewPost({...newPost, description: e.target.value})}
          rows={4}
        ></textarea>
        <p className="text-xs text-gray-500">
          {newPost.description.length}/500 characters 
          {newPost.description.length > 500 && 
            <span className="text-red-500"> (exceeds maximum)</span>
          }
        </p>
      </div>
      
      {/* Action Buttons */}
      <div className="flex justify-end space-x-2 sm:space-x-3 pt-2 sm:pt-4">
        <button
          onClick={() => setIsCreateDialogOpen(false)}
          className="px-3 py-1.5 sm:px-4 sm:py-2 border rounded-md text-gray-700 hover:bg-gray-50 text-sm sm:text-base"
        >
          Cancel
        </button>
        <button
          onClick={handleCreatePost}
          className="px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm sm:text-base"
          disabled={!newPost.eventName || newPost.description.length > 500}
        >
          Create Post
        </button>
      </div>
    </div>
  </DialogContent>
</Dialog>
      </main>
    </div>
  );
}