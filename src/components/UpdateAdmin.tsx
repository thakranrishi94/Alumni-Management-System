import { useState, FormEvent } from "react";
import axios, { AxiosError } from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Eye, EyeOff } from "lucide-react";
import Cookies from "js-cookie";
import { useToast } from "@/hooks/use-toast";

// Define the API error response type
interface ApiErrorResponse {
  message: string;
  // Add other properties your API might return in errors
}

type AdminPasswordUpdateFormProps = {
  open: boolean;
  onClose: () => void;
};

export default function UpdateAdmin({ open, onClose }: AdminPasswordUpdateFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  
  const [formErrors, setFormErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Password visibility toggles
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const resetForm = () => {
    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setFormErrors({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  const validateForm = () => {
    let isValid = true;
    const errors = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };

    if (!formData.currentPassword.trim()) {
      errors.currentPassword = "Current password is required";
      isValid = false;
    }

    if (!formData.newPassword.trim()) {
      errors.newPassword = "New password is required";
      isValid = false;
    } else if (formData.newPassword.length < 8) {
      errors.newPassword = "New password must be at least 8 characters";
      isValid = false;
    }

    if (!formData.confirmPassword.trim()) {
      errors.confirmPassword = "Please confirm your new password";
      isValid = false;
    } else if (formData.newPassword !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    const token = Cookies.get("ams_token");
    
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/admin-profile/update-password`,
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (response.status === 200) {
        toast({
          title: "Success",
          description: "Password updated successfully",
          variant: "default",
        });
        resetForm(); // Reset form after successful submission
        onClose();
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data?.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-4 sm:p-6">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-bold">Update Admin Password</DialogTitle>
          <p className="text-sm text-gray-500 mt-1">
            Enter your current password and a new password to update your credentials
          </p>
        </DialogHeader>
        
        <form onSubmit={onSubmit} className="space-y-4">
          {/* Current Password */}
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-gray-100 rounded-full">
                <Lock className="h-4 w-4 text-gray-500" />
              </div>
              <label htmlFor="currentPassword" className="text-sm font-medium">Current Password</label>
            </div>
            <div className="relative">
              <Input 
                id="currentPassword"
                name="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                placeholder="Enter your current password" 
                value={formData.currentPassword}
                onChange={handleInputChange}
                className="mt-1 text-sm pr-10"
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {formErrors.currentPassword && (
              <p className="text-xs text-red-500">{formErrors.currentPassword}</p>
            )}
          </div>
          
          {/* New Password */}
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-blue-100 rounded-full">
                <Lock className="h-4 w-4 text-blue-500" />
              </div>
              <label htmlFor="newPassword" className="text-sm font-medium">New Password</label>
            </div>
            <div className="relative">
              <Input 
                id="newPassword"
                name="newPassword"
                type={showNewPassword ? "text" : "password"} 
                placeholder="Enter new password (min. 8 characters)" 
                value={formData.newPassword}
                onChange={handleInputChange}
                className="mt-1 text-sm pr-10"
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {formErrors.newPassword && (
              <p className="text-xs text-red-500">{formErrors.newPassword}</p>
            )}
          </div>
          
          {/* Confirm Password */}
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-green-100 rounded-full">
                <Lock className="h-4 w-4 text-green-500" />
              </div>
              <label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</label>
            </div>
            <div className="relative">
              <Input 
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"} 
                placeholder="Confirm your new password" 
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="mt-1 text-sm pr-10"
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {formErrors.confirmPassword && (
              <p className="text-xs text-red-500">{formErrors.confirmPassword}</p>
            )}
          </div>
          
          {/* Password Requirements */}
          <div className="p-3 bg-gray-50 rounded-md text-xs text-gray-600">
            <p className="font-medium mb-1">Password Requirements:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Minimum 8 characters</li>
              <li>Current password is required for verification</li>
              <li>New password and confirmation must match</li>
            </ul>
          </div>
          
          {/* Action Buttons */}
          <div className="flex space-x-3 mt-6 pt-3 border-t border-gray-200">
            <Button 
              type="button" 
              onClick={onClose}
              className="w-full p-2 text-sm rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors duration-200"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full p-2 text-sm rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200"
            >
              {isSubmitting ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}