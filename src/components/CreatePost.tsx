import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { X, Upload, Clock, MapPin, AlignLeft, Image as ImageIcon, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import Image from 'next/image';

interface CreatePostProps {
  eventId: string;
  eventTitle: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

interface FormData {
  title: string;
  description: string;
  location: string;
  startTime: string;
  endTime: string;
  brochureImage: File | null;
  eventImages: File[];
  attendance: File | null;
}

interface ValidationErrors {
  description?: string;
  location?: string;
  startTime?: string;
  endTime?: string;
  eventImages?: string;
  timeComparison?: string;
  attendance?: string;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/jpg"];
const ALLOWED_ADDITIONAL_FILE_TYPES = ["application/pdf"];

const CreatePost: React.FC<CreatePostProps> = ({ eventId, eventTitle, isOpen, setIsOpen }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    title: eventTitle || "",
    description: "",
    location: "",
    startTime: "",
    endTime: "",
    brochureImage: null,
    eventImages: [],
    attendance: null,
  });
  const [errors, setErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: eventTitle || "",
        description: "",
        location: "",
        startTime: "",
        endTime: "",
        brochureImage: null,
        eventImages: [],
        attendance: null,
      });
      setErrors({});
    }
  }, [isOpen, eventTitle]);

  const validateForm = (): ValidationErrors => {
    const newErrors: ValidationErrors = {};

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (!formData.startTime) {
      newErrors.startTime = "Start time is required";
    }

    if (!formData.endTime) {
      newErrors.endTime = "End time is required";
    }

    if (formData.startTime && formData.endTime) {
      const start = new Date(`2000-01-01T${formData.startTime}`);
      const end = new Date(`2000-01-01T${formData.endTime}`);
      
      if (start >= end) {
        newErrors.timeComparison = "End time must be after start time";
      }
    }

    if (formData.eventImages.length === 0) {
      newErrors.eventImages = "At least one event image is required";
    }

    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateFile = (file: File, allowedTypes: string[]): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return `File "${file.name}" exceeds maximum size of 10MB`;
    }
    
    if (!allowedTypes.includes(file.type)) {
      return `File "${file.name}" must be a valid type (${allowedTypes.join(", ")})`;
    }
    
    return null;
  };

  const handleBrochureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const fileError = validateFile(file, ALLOWED_FILE_TYPES);
      
      if (fileError) {
        toast({
          title: "Invalid File",
          description: fileError,
          variant: "destructive",
        });
        return;
      }
      
      setFormData((prev) => ({
        ...prev,
        brochureImage: file,
      }));
    }
  };

  const handleImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      const invalidFiles = fileArray.map((file) => validateFile(file, ALLOWED_FILE_TYPES)).filter(Boolean);
      
      if (invalidFiles.length > 0) {
        toast({
          title: "Invalid Files",
          description: invalidFiles[0],
          variant: "destructive",
        });
        return;
      }
      
      setFormData((prev) => ({
        ...prev,
        eventImages: [...prev.eventImages, ...fileArray],
      }));
    }
  };

  const handleAdditionalFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const fileError = validateFile(file, ALLOWED_ADDITIONAL_FILE_TYPES);
      
      if (fileError) {
        toast({
          title: "Invalid File",
          description: fileError,
          variant: "destructive",
        });
        return;
      }
      
      setFormData((prev) => ({
        ...prev,
        attendance: file,
      }));
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = formData.eventImages.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      eventImages: updatedImages,
    }));
  };

  const removeBrochureImage = () => {
    setFormData((prev) => ({
      ...prev,
      brochureImage: null,
    }));
  };

  const removeAdditionalFile = () => {
    setFormData((prev) => ({
      ...prev,
      attendance: null,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length > 0) {
      const firstError = Object.values(validationErrors)[0];
      toast({
        title: "Validation Error",
        description: firstError,
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);

    try {
      const token = Cookies.get("ams_token");
      if (!token) {
        toast({
          title: "Error",
          description: "Authentication required",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      const postFormData = new FormData();
      postFormData.append("eventId", eventId);
      postFormData.append("title", formData.title);
      postFormData.append("description", formData.description);
      postFormData.append("location", formData.location);
      postFormData.append("startTime", formData.startTime);
      postFormData.append("endTime", formData.endTime);

      if (formData.brochureImage) {
        postFormData.append("brochureImage", formData.brochureImage);
      }

      if (formData.attendance) {
        postFormData.append("attendance", formData.attendance);
      }

      formData.eventImages.forEach((image) => {
        postFormData.append("eventImages", image);
      });

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/post/create-post`,
        postFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast({
        title: "Success",
        description: "Event post created successfully!",
        variant: "default",
      });

      setIsOpen(false);
    } catch (error: unknown) {
      console.error("Failed to create event post:", error);
      let errorMessage = "Failed to create event post";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto bg-gradient-to-b from-white to-blue-50 border-0 shadow-xl">
        <DialogHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 -mx-6 -mt-6 px-6 py-6 rounded-t-lg">
          <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
            <Calendar className="h-6 w-6" />
            Create Event Post
          </DialogTitle>
          <DialogDescription className="text-blue-100">
            Share details and memories from your event
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6 px-2">
          <div className="grid grid-cols-1 gap-6">
            <div className="relative">
              <label htmlFor="title" className="flex items-center text-sm font-medium text-gray-700 mb-1 gap-1">
                <AlignLeft className="h-4 w-4 text-blue-500" />
                <span>Event Title</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="block w-full rounded-md border border-gray-300 px-4 py-3 shadow-sm bg-gray-100 text-gray-700 cursor-not-allowed sm:text-sm transition-all"
                placeholder="Enter event title"
                disabled
              />
              <p className="mt-1 text-xs text-gray-500">Event title cannot be modified</p>
            </div>

            <div className="relative">
              <label htmlFor="description" className="flex items-center text-sm font-medium text-gray-700 mb-1 gap-1">
                <AlignLeft className="h-4 w-4 text-blue-500" />
                <span>Description</span>
                <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="block w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500 px-4 py-3 shadow-sm sm:text-sm transition-all hover:border-blue-400"
                placeholder="Describe the event experience"
                required
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-500">{errors.description}</p>
              )}
            </div>

            <div className="relative">
              <label htmlFor="location" className="flex items-center text-sm font-medium text-gray-700 mb-1 gap-1">
                <MapPin className="h-4 w-4 text-blue-500" />
                <span>Location</span>
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="block w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500 px-4 py-3 shadow-sm sm:text-sm transition-all hover:border-blue-400"
                placeholder="Where was the event held?"
                required
              />
              {errors.location && (
                <p className="mt-1 text-sm text-red-500">{errors.location}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <label htmlFor="startTime" className="flex items-center text-sm font-medium text-gray-700 mb-1 gap-1">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span>Start Time</span>
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  id="startTime"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className="block w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500 px-4 py-3 shadow-sm sm:text-sm transition-all hover:border-blue-400"
                  required
                />
                {errors.startTime && (
                  <p className="mt-1 text-sm text-red-500">{errors.startTime}</p>
                )}
              </div>

              <div className="relative">
                <label htmlFor="endTime" className="flex items-center text-sm font-medium text-gray-700 mb-1 gap-1">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span>End Time</span>
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  id="endTime"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  className="block w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500 px-4 py-3 shadow-sm sm:text-sm transition-all hover:border-blue-400"
                  required
                />
                {errors.endTime && (
                  <p className="mt-1 text-sm text-red-500">{errors.endTime}</p>
                )}
              </div>
            </div>

            <div className="relative bg-white p-5 rounded-lg shadow-sm border border-gray-100">
              <label htmlFor="brochureImage" className="flex items-center text-sm font-medium text-gray-700 mb-3 gap-1">
                <ImageIcon className="h-4 w-4 text-blue-500" />
                <span>Brochure Image (Optional)</span>
              </label>
              
              {!formData.brochureImage ? (
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-blue-200 rounded-md hover:border-blue-400 transition-colors bg-blue-50">
                  <div className="space-y-2 text-center">
                    <Upload className="mx-auto h-12 w-12 text-blue-400" />
                    <div className="flex text-sm text-gray-600 justify-center">
                      <label
                        htmlFor="brochureImage"
                        className="relative cursor-pointer bg-blue-100 rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none py-2 px-4"
                      >
                        <span>Upload a brochure</span>
                        <input
                          id="brochureImage"
                          name="brochureImage"
                          type="file"
                          className="sr-only"
                          onChange={handleBrochureUpload}
                          accept="image/jpeg,image/png,image/gif,image/jpg"
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
              ) : (
                <div className="mt-1 relative bg-blue-50 rounded-md p-3 border border-blue-200">
                  <div className="flex items-center">
                    <div className="h-16 w-16 overflow-hidden rounded-md mr-3 border border-blue-300">
                      <Image
                        src={URL.createObjectURL(formData.brochureImage)}
                        alt="Brochure preview"
                        width={64}
                        height={64}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">{formData.brochureImage.name}</p>
                      <p className="text-sm text-gray-500">{(formData.brochureImage.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                    <button
                      type="button"
                      onClick={removeBrochureImage}
                      className="ml-4 bg-white rounded-full p-1 text-gray-500 hover:text-red-500 focus:outline-none border border-gray-200 hover:border-red-300 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="relative bg-white p-5 rounded-lg shadow-sm border border-gray-100">
              <label htmlFor="eventImages" className="flex items-center text-sm font-medium text-gray-700 mb-3 gap-1">
                <ImageIcon className="h-4 w-4 text-blue-500" />
                <span>Event Images</span>
                <span className="text-red-500">*</span>
              </label>
              
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-indigo-200 rounded-md hover:border-indigo-400 transition-colors bg-indigo-50">
                <div className="space-y-2 text-center">
                  <Upload className="mx-auto h-12 w-12 text-indigo-400" />
                  <div className="flex text-sm text-gray-600 justify-center">
                    <label
                      htmlFor="eventImages"
                      className="relative cursor-pointer bg-indigo-100 text-indigo-600 hover:text-indigo-500 rounded-md font-medium focus-within:outline-none py-2 px-4"
                    >
                      <span>Upload images</span>
                      <input
                        id="eventImages"
                        name="eventImages"
                        type="file"
                        className="sr-only"
                        onChange={handleImagesUpload}
                        accept="image/jpeg,image/png,image/gif,image/jpg"
                        multiple
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB each</p>
                </div>
              </div>
              
              {formData.eventImages.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <span className="inline-flex items-center justify-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-indigo-700 mr-2">
                      {formData.eventImages.length}
                    </span>
                    Selected Images
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {formData.eventImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square w-full rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all">
                          <Image
                            src={URL.createObjectURL(image)}
                            alt={`Event image ${index}`}
                            width={100}
                            height={100}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-1">
                          <p className="text-white text-xs truncate">
                            {image.name.length > 15 ? image.name.substring(0, 15) + "..." : image.name}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {errors.eventImages && (
                <p className="mt-1 text-sm text-red-500">{errors.eventImages}</p>
              )}
            </div>

            <div className="relative bg-white p-5 rounded-lg shadow-sm border border-gray-100">
              <label htmlFor="attendance" className="flex items-center text-sm font-medium text-gray-700 mb-3 gap-1">
                <Upload className="h-4 w-4 text-blue-500" />
                <span>Attendance File (PDF)</span>
              </label>
              
              {!formData.attendance ? (
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-blue-200 rounded-md hover:border-blue-400 transition-colors bg-blue-50">
                  <div className="space-y-2 text-center">
                    <Upload className="mx-auto h-12 w-12 text-blue-400" />
                    <div className="flex text-sm text-gray-600 justify-center">
                      <label
                        htmlFor="attendance"
                        className="relative cursor-pointer bg-blue-100 rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none py-2 px-4"
                      >
                        <span>Upload a file</span>
                        <input
                          id="attendance"
                          name="attendance"
                          type="file"
                          className="sr-only"
                          onChange={handleAdditionalFileUpload}
                          accept="application/pdf"
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">PDF up to 10MB</p>
                  </div>
                </div>
              ) : (
                <div className="mt-1 relative bg-blue-50 rounded-md p-3 border border-blue-200">
                  <div className="flex items-center">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">{formData.attendance.name}</p>
                      <p className="text-sm text-gray-500">{(formData.attendance.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                    <button
                      type="button"
                      onClick={removeAdditionalFile}
                      className="ml-4 bg-white rounded-full p-1 text-gray-500 hover:text-red-500 focus:outline-none border border-gray-200 hover:border-red-300 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="inline-flex items-center justify-center py-2.5 px-5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center py-2.5 px-5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </>
              ) : (
                "Create Post"
              )}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;