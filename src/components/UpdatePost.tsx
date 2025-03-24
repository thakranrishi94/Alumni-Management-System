"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Image as ImageIcon, X, Plus } from "lucide-react";
import { format, parse, isValid } from "date-fns";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import Image from "next/image"; // Import Next.js Image component

// Updated interface with all required fields from the imported post
interface Post {
  id: number;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  eventImages?: { url: string; id?: number }[];
  brochureImage?: string;
  attendance?: string;
  event: {
    id?: number;
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

interface UpdatePostProps {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const UpdatePost: React.FC<UpdatePostProps> = ({ post, isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    location: "",
  });
  const [images, setImages] = useState<{ url: string; id?: number; file?: File }[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<number[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [brochureImage, setBrochureImage] = useState<File | null>(null);
  const [existingBrochure, setExistingBrochure] = useState<string | null>(null);
  const [attendanceFile, setAttendanceFile] = useState<File | null>(null);
  const [existingAttendance, setExistingAttendance] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [viewportWidth, setViewportWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const [timeErrors, setTimeErrors] = useState({
    startTime: "",
    endTime: ""
  });

  useEffect(() => {
    if (post) {
      // Extract the time part only from startTime and endTime
      const startTime = post.startTime ? formatTimeOnly(post.startTime) : "";
      const endTime = post.endTime ? formatTimeOnly(post.endTime) : "";

      setFormData({
        title: post.title || "",
        description: post.description || "",
        startTime,
        endTime,
        location: post.location || "",
      });
      
      // Initialize images array with existing images
      if (post.eventImages && post.eventImages.length > 0) {
        setImages(post.eventImages);
      } else {
        setImages([]);
      }

      // Set existing brochure and attendance if available
      if (post.brochureImage) {
        setExistingBrochure(post.brochureImage);
      }
      
      if (post.attendance) {
        setExistingAttendance(post.attendance);
      }
    }
    
    // Add window resize listener for responsive behavior
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [post]);

  // Format time only (HH:MM) from a datetime string
  const formatTimeOnly = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return format(date, "HH:mm");
    } catch (error) {
      console.error('Error formatting time:', error);
      return '';
    }
  };

  const validateTime = (startTime: string, endTime: string): boolean => {
    // Reset errors
    setTimeErrors({
      startTime: "",
      endTime: ""
    });

    // Check if either field is empty
    if (!startTime || !endTime) {
      if (!startTime) setTimeErrors(prev => ({ ...prev, startTime: "Start time is required" }));
      if (!endTime) setTimeErrors(prev => ({ ...prev, endTime: "End time is required" }));
      return false;
    }

    // Parse times for comparison
    if (!post) return false;
    
    const eventDate = post.event.eventDate ? new Date(post.event.eventDate) : new Date();
    const formattedDate = format(eventDate, "yyyy-MM-dd");
    
    const startDateTime = parse(`${formattedDate} ${startTime}`, "yyyy-MM-dd HH:mm", new Date());
    const endDateTime = parse(`${formattedDate} ${endTime}`, "yyyy-MM-dd HH:mm", new Date());

    // Check if times are valid
    if (!isValid(startDateTime) || !isValid(endDateTime)) {
      if (!isValid(startDateTime)) setTimeErrors(prev => ({ ...prev, startTime: "Invalid time format" }));
      if (!isValid(endDateTime)) setTimeErrors(prev => ({ ...prev, endTime: "Invalid time format" }));
      return false;
    }

    // Check if end time is after start time
    if (endDateTime <= startDateTime) {
      setTimeErrors(prev => ({ ...prev, endTime: "End time must be after start time" }));
      return false;
    }

    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear validation errors when user types
    if (name === "startTime" || name === "endTime") {
      setTimeErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      
      // Limit the number of images to prevent UI clutter
      const maxAllowedImages = 8;
      const totalImagesAfterAddition = images.length + filesArray.length;
      
      if (totalImagesAfterAddition > maxAllowedImages) {
        toast.error(`You can only upload up to ${maxAllowedImages} images`);
        return;
      }
      
      // Preview and prepare new images
      const newImagePreviews = filesArray.map(file => ({
        url: URL.createObjectURL(file),
        file: file
      }));
      
      setImages(prev => [...prev, ...newImagePreviews]);
      setNewImages(prev => [...prev, ...filesArray]);
    }
  };

  const handleBrochureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        toast.error("Please upload an image file for the brochure");
        return;
      }
      setBrochureImage(file);
    }
  };

  const handleAttendanceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type !== 'application/pdf') {
        toast.error("Please upload a PDF file for attendance");
        return;
      }
      setAttendanceFile(file);
    }
  };

  const handleRemoveImage = (index: number) => {
    const imageToRemove = images[index];
    
    // If the image has an ID, it's an existing image that needs to be deleted on the server
    if (imageToRemove.id) {
      setImagesToDelete(prev => [...prev, imageToRemove.id!]);
    }
    
    // Remove from preview
    setImages(prev => prev.filter((_, i) => i !== index));
    
    // If it's a new image, remove from newImages array
    if (imageToRemove.file) {
      const fileIndex = newImages.findIndex(file => file === imageToRemove.file);
      if (fileIndex !== -1) {
        setNewImages(prev => prev.filter((_, i) => i !== fileIndex));
      }
    }
  };

  const handleRemoveBrochure = () => {
    setBrochureImage(null);
    setExistingBrochure(null);
  };

  const handleRemoveAttendance = () => {
    setAttendanceFile(null);
    setExistingAttendance(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!post) return;
    
    // Validate times
    if (!validateTime(formData.startTime, formData.endTime)) {
      return;
    }
    
    try {
      setIsLoading(true);
      const token = Cookies.get('ams_token');
      
      // Create FormData for multipart/form-data to handle file uploads
      const formDataToSend = new FormData();
      
      // Add basic form fields
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      
      // Combine event date with the time inputs
      const eventDate = post.event.eventDate ? new Date(post.event.eventDate) : new Date();
      const formattedDate = format(eventDate, "yyyy-MM-dd");
      
      const startDateTime = parse(`${formattedDate} ${formData.startTime}`, "yyyy-MM-dd HH:mm", new Date());
      const endDateTime = parse(`${formattedDate} ${formData.endTime}`, "yyyy-MM-dd HH:mm", new Date());
      
      formDataToSend.append('startTime', startDateTime.toISOString());
      formDataToSend.append('endTime', endDateTime.toISOString());
      formDataToSend.append('location', formData.location);
      
      // Add event ID if available
      if (post.event && post.event.id) {
        formDataToSend.append('eventId', post.event.id.toString());
      }
      
      // Add images to delete
      if (imagesToDelete.length > 0) {
        formDataToSend.append('imagesToDelete', JSON.stringify(imagesToDelete));
      }
      
      // Add flag if brochure is removed
      if (existingBrochure === null && post.brochureImage) {
        formDataToSend.append('removeBrochure', 'true');
      }
      
      // Add flag if attendance is removed
      if (existingAttendance === null && post.attendance) {
        formDataToSend.append('removeAttendance', 'true');
      }
      
      // Add new images
      newImages.forEach((file) => {
        formDataToSend.append('eventImages', file);
      });
      
      // Add brochure image if present
      if (brochureImage) {
        formDataToSend.append('brochureImage', brochureImage);
      }
      
      // Add attendance file if present
      if (attendanceFile) {
        formDataToSend.append('attendance', attendanceFile);
      }
      
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/post/update/${post.id}`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
        }
      );
      
      toast.success("Post updated successfully");
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error("Failed to update post");
    } finally {
      setIsLoading(false);
    }
  };

  // Determine the number of image columns based on viewport width
  const getImageGridCols = () => {
    if (viewportWidth < 480) return 'grid-cols-2';
    if (viewportWidth < 768) return 'grid-cols-3';
    return 'grid-cols-4';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md md:max-w-xl lg:max-w-2xl w-full mx-auto p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="mb-2 sm:mb-4">
          <DialogTitle className="text-xl sm:text-2xl font-bold">Update Post</DialogTitle>
          <DialogDescription className="text-sm">Edit your post information</DialogDescription>
        </DialogHeader>
        
        {post && (
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Post title"
                className="w-full text-sm sm:text-base"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Post description"
                className="w-full min-h-[80px] sm:min-h-[100px] p-2 border rounded-lg text-sm sm:text-base"
                rows={viewportWidth < 640 ? 3 : 4}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Event Type</label>
              <div className="p-2 border rounded-lg bg-gray-50 text-sm sm:text-base">
                {post.event?.eventType || "Unknown"}
                <span className="text-xs text-gray-500 ml-2">(Cannot be changed)</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Start Time</label>
                <Input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className={`w-full text-sm sm:text-base ${timeErrors.startTime ? 'border-red-500' : ''}`}
                  required
                />
                {timeErrors.startTime && (
                  <p className="text-red-500 text-xs mt-1">{timeErrors.startTime}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">End Time</label>
                <Input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  className={`w-full text-sm sm:text-base ${timeErrors.endTime ? 'border-red-500' : ''}`}
                  required
                />
                {timeErrors.endTime && (
                  <p className="text-red-500 text-xs mt-1">{timeErrors.endTime}</p>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <Input
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Event location"
                className="w-full text-sm sm:text-base"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Brochure Image</label>
              <div className="mt-2">
                {(existingBrochure || brochureImage) ? (
                  <div className="relative w-full h-40 sm:h-48 bg-gray-100 rounded flex items-center justify-center overflow-hidden border">
                    {brochureImage ? (
                      <div className="relative h-full w-full">
                        <Image
                          src={URL.createObjectURL(brochureImage)}
                          alt="Brochure preview"
                          fill
                          className="object-contain"
                        />
                      </div>
                    ) : existingBrochure ? (
                      <div className="relative h-full w-full">
                        <Image
                          src={existingBrochure}
                          alt="Existing brochure"
                          fill
                          className="object-contain"
                        />
                      </div>
                    ) : null}
                    <button
                      type="button"
                      onClick={handleRemoveBrochure}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-32 sm:h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">
                        <span className="font-semibold">Click to upload brochure image</span>
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleBrochureUpload}
                    />
                  </label>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Attendance File (PDF)</label>
              <div className="mt-2">
                {(existingAttendance || attendanceFile) ? (
                  <div className="relative flex items-center p-3 bg-gray-50 border rounded-lg">
                    <FileText className="h-5 w-5 text-blue-500 mr-2" />
                    <span className="text-sm truncate">
                      {attendanceFile ? attendanceFile.name : "Current Attendance PDF"}
                    </span>
                    <button
                      type="button"
                      onClick={handleRemoveAttendance}
                      className="ml-auto bg-red-500 text-white p-1 rounded-full"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-3 pb-3">
                      <FileText className="w-7 h-7 text-gray-400 mb-1" />
                      <p className="text-sm text-gray-500">
                        <span className="font-semibold">Click to upload attendance (PDF)</span>
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={handleAttendanceUpload}
                    />
                  </label>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Event Images</label>
              <div className={`grid ${getImageGridCols()} gap-2 sm:gap-3 mt-2`}>
                {images.map((image, index) => (
                  <div key={`image-${index}-${Date.now()}`} className="relative h-16 sm:h-20 md:h-24 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                    <div className="relative h-full w-full">
                      <Image
                        src={image.url}
                        alt={`Event image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                    >
                      <X className="h-3 w-3 sm:h-4 sm:w-4" />
                    </button>
                  </div>
                ))}
                
                <label className="h-16 sm:h-20 md:h-24 bg-gray-100 rounded flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors">
                  <Plus className="h-4 w-4 sm:h-6 sm:w-6 text-gray-400" />
                  <span className="text-xs sm:text-sm text-gray-500 text-center px-1">Add Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    multiple
                  />
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Up to 8 images. {images.length} of 8 used.
              </p>
            </div>
            
            <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2 pt-2">
              <Button variant="outline" type="button" onClick={onClose} className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                {isLoading ? "Updating..." : "Update Post"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UpdatePost;