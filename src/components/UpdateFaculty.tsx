import { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Mail, Phone, Award, FileText } from "lucide-react";
import Cookies from "js-cookie";
import { useToast } from "@/hooks/use-toast";

type FacultyUpdateFormProps = {
  faculty: {
    id: number;
    userId: number;
    user: {
      name: string;
      email: string;
      phone: string;
    };
    designation: string;
    school: string;
    image: string | null;
  };
  open: boolean;
  onClose: () => void;
};

export default function UpdateFaculty({ faculty, open, onClose }: FacultyUpdateFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    password: "",
    designation: faculty?.designation ?? "",
    school: faculty?.school ?? "",
  });

  const [formErrors, setFormErrors] = useState({
    password: "",
    designation: "",
    school: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(faculty?.image ?? null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      setImageFile(file);
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase();
  };

  const validateForm = () => {
    let isValid = true;
    const errors = {
      password: "",
      designation: "",
      school: "",
    };

    if (formData.password && formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
      isValid = false;
    }

    if (!formData.designation.trim()) {
      errors.designation = "Designation is required";
      isValid = false;
    }

    if (!formData.school.trim()) {
      errors.school = "School is required";
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
      const formDataObj = new FormData();

      if (formData.password.trim()) {
        formDataObj.append("password", formData.password);
      }

      formDataObj.append("designation", formData.designation);
      formDataObj.append("school", formData.school);

      if (imageFile) {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/faculty/update-image/${faculty.id}`,
          { image: imageFile },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        formDataObj.append("image", response.data.imageUrl);
      }

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/faculty/update-profile/${faculty.id}`,
        formDataObj,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        toast({
          title: "Success",
          description: "Profile Updated Successfully",
          variant: "default",
        });
        onClose();
      }
    } catch {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-bold">Update Faculty Profile</DialogTitle>
          <p className="text-sm text-gray-500 mt-1">Update your profile information. Leave password blank to keep current password.</p>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Top Profile Section */}
          <div className="flex items-center space-x-4 mb-4">
            {previewImage ? (
              <Image
                src={previewImage}
                alt={faculty.user.name || "Profile"}
                width={60}
                height={60}
                className="h-16 w-16 rounded-full object-cover"
              />
            ) : (
              <div className="h-16 w-16 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-xl">
                {getInitials(faculty.user.name)}
              </div>
            )}
            <div className="flex-1">
              <h2 className="text-lg font-bold">{faculty.user.name}</h2>
              <p className="text-sm text-gray-600">{faculty.user.email}</p>

              <div className="mt-2">
                <Input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full text-sm"
                />
              </div>
            </div>
          </div>

          {/* Two Column Main Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Contact Information */}
              <div className="space-y-2 p-3 bg-gray-50 rounded-md">
                <h3 className="text-sm font-medium text-gray-600">Contact Information</h3>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Mail className="h-4 w-4 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-medium">{faculty.user.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 mt-2">
                  <div className="p-2 bg-green-100 rounded-full">
                    <Phone className="h-4 w-4 text-green-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm font-medium">{faculty.user.phone}</p>
                  </div>
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 bg-red-100 rounded-full">
                    <FileText className="h-4 w-4 text-red-500" />
                  </div>
                  <label htmlFor="password" className="text-sm font-medium">Password</label>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter new password or leave blank to keep current"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="mt-1 text-sm"
                />
                {formErrors.password && (
                  <p className="text-xs text-red-500">{formErrors.password}</p>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Designation */}
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 bg-purple-100 rounded-full">
                    <Award className="h-4 w-4 text-purple-500" />
                  </div>
                  <label htmlFor="designation" className="text-sm font-medium">Designation</label>
                </div>
                <Input
                  id="designation"
                  name="designation"
                  placeholder="Your designation"
                  value={formData.designation}
                  onChange={handleInputChange}
                  className="mt-1 text-sm"
                />
                {formErrors.designation && (
                  <p className="text-xs text-red-500">{formErrors.designation}</p>
                )}
              </div>

              {/* School */}
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 bg-green-100 rounded-full">
                    <Award className="h-4 w-4 text-green-500" />
                  </div>
                  <label htmlFor="school" className="text-sm font-medium">School</label>
                </div>
                <Input
                  id="school"
                  name="school"
                  placeholder="Your school"
                  value={formData.school}
                  onChange={handleInputChange}
                  className="mt-1 text-sm"
                />
                {formErrors.school && (
                  <p className="text-xs text-red-500">{formErrors.school}</p>
                )}
              </div>
            </div>
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
              {isSubmitting ? "Updating..." : "Update Profile"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}