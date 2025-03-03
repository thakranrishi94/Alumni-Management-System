"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { X, Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

// Define the props interface
interface CreatePostModalProps {
  eventId: number;
  eventTitle: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

// Define interface for API errors
interface ApiError {
  response?: {
    status?: number;
    data?: {
      message?: string;
      error?: string;
    };
  };
  message?: string;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ 
  eventId, 
  eventTitle, 
  isOpen, 
  setIsOpen 
}) => {
  const { toast } = useToast();
  const [description, setDescription] = useState<string>("");
  const [images, setImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Handle image selection
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) {
      toast({
        title: "Error",
        description: "You can upload a maximum of 5 images",
        variant: "destructive",
      });
      return;
    }

    setImages([...images, ...files]);

    // Create preview URLs
    const newPreviewImages = files.map((file) => URL.createObjectURL(file));
    setPreviewImages([...previewImages, ...newPreviewImages]);
  };

  // Remove an image from the selection
  const removeImage = (index: number) => {
    const newImages = [...images];
    const newPreviewImages = [...previewImages];
    
    // Release the object URL to avoid memory leaks
    URL.revokeObjectURL(newPreviewImages[index]);
    
    newImages.splice(index, 1);
    newPreviewImages.splice(index, 1);
    
    setImages(newImages);
    setPreviewImages(newPreviewImages);
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!description.trim() && images.length === 0) {
      toast({
        title: "Error",
        description: "Please add a description or at least one image",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const token = Cookies.get('ams_token');
      
      if (!token) {
        toast({
          title: "Error",
          description: "Authentication required",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Create form data for multipart/form-data request
      const formData = new FormData();
      formData.append("eventId", eventId.toString());
      formData.append("description", description);
      
      // Append each image to form data
      images.forEach((image) => {
        formData.append("images", image);
      });

      // Make API request
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/posts/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Show success message
      toast({
        title: "Success",
        description: "Post created successfully!",
        variant: "default",
      });

      // Reset form and close dialog
      setDescription("");
      setImages([]);
      setPreviewImages([]);
      setIsOpen(false);
    } catch (err) {
      const error = err as ApiError;
      console.error("Failed to create post:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message || "Failed to create post",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cleanup preview URLs when component unmounts
  useEffect(() => {
    return () => {
      previewImages.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewImages]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Create Post for "{eventTitle}"</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Image Upload Section */}
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-700">Upload Images</h3>
            
            {/* Preview Images */}
            {previewImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                {previewImages.map((src, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={src}
                      alt={`Preview ${index}`}
                      className="w-full h-32 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-70 hover:opacity-100"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {/* Upload Button */}
            {images.length < 5 && (
              <div className="flex items-center justify-center w-full">
                <label
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-gray-500" />
                    <p className="mb-1 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG or JPEG (Max {5 - images.length} more)
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    multiple
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
            )}
          </div>
          
          {/* Description Section */}
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-700">Post Description</h3>
            <textarea
              className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-200 min-h-32"
              placeholder="Write your post description here..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
            />
          </div>
          
          {/* Button Section */}
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Post"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostModal;