"use client";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

type FormDataType = {
  name: string;
  email: string;
  phone: string;
  course: string;
  organization: string;
  designation: string;
  skills: string;
  password: string;
  confirmPassword: string;
  batch: string;
};

interface RegistrationError extends Error {
  message: string;
}

export default function SignupPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormDataType>({
    name: "",
    email: "",
    phone: "",
    course: "",
    organization: "",
    designation: "",
    skills: "",
    password: "",
    confirmPassword: "",
    batch: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const router = useRouter();

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your full name",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      toast({
        title: "Email Required",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.phone.trim() || !/^\d{10}$/.test(formData.phone)) {
      toast({
        title: "Phone Number Required",
        description: "Please enter a valid 10-digit phone number",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.batch.trim()) {
      toast({
        title: "Batch Year Required",
        description: "Please enter your batch year",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.course.trim()) {
      toast({
        title: "Course Required",
        description: "Please enter your course",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.organization.trim()) {
      toast({
        title: "Organization Required",
        description: "Please enter your current organization",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.designation.trim()) {
      toast({
        title: "Designation Required",
        description: "Please enter your designation",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.skills.trim()) {
      toast({
        title: "Skills Required",
        description: "Please enter your skills",
        variant: "destructive",
      });
      return false;
    }
    if (formData.password.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords Do Not Match",
        description: "Please ensure both passwords are identical",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      const registrationData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: "ALUMNI",
        status: "ACTIVE",
        batch: formData.batch,
        course: formData.course,
        organization: formData.organization,
        designation: formData.designation,
        skills: formData.skills
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registrationData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      setShowSuccessPopup(true);
      toast({
        title: "Registration Successful",
        description: "Your registration has been submitted successfully",
        variant: "default",
      });
    } catch (error: unknown) {
      const err = error as RegistrationError;
      if (err.message.includes("already exists")) {
        toast({
          title: "Registration Failed",
          description: "This email or phone number is already registered",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Registration Failed",
          description: err.message || "Please try again later",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-white">
      <main className="flex flex-col md:flex-row py-10 px-4 md:px-20 gap-8 justify-center items-center">
        {/* Left Section: Image */}
        <div
          className="hidden md:flex flex-shrink-0 w-full max-w-md bg-cover bg-center rounded-lg"
          style={{
            backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.4)), url('/krmu.jpg')",
            height: "500px",
            maxWidth: "500px",
          }}
        />

        {/* Right Section: Form */}
        <div className="flex-1 w-full max-w-4xl">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-center mb-4">
              Join K.R. Mangalam University Alumni Network
            </h2>
            <p className="text-sm text-gray-500 text-center mb-6">
              All fields are required
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: "Full Name", name: "name", type: "text", placeholder: "e.g. John Doe" },
                  { label: "Email Address", name: "email", type: "email", placeholder: "e.g. john@example.com" },
                  { label: "Phone Number", name: "phone", type: "tel", placeholder: "10-digit mobile number" },
                  { label: "Batch Year", name: "batch", type: "text", placeholder: "e.g. 2022" },
                  { label: "Programme", name: "course", type: "text", placeholder: "e.g. B.Tech CSE" },
                  { label: "Current Organization/College", name: "organization", type: "text", placeholder: "e.g. Google" },
                  { label: "Designation/Course", name: "designation", type: "text", placeholder: "e.g. Software Engineer" },
                  { label: "Skills", name: "skills", type: "text", placeholder: "e.g. React, Node.js" },
                  { label: "Password", name: "password", type: "password", placeholder: "Create a password" },
                  { label: "Confirm Password", name: "confirmPassword", type: "password", placeholder: "Re-enter your password" },
                ].map(({ label, name, type,placeholder }) => (
                  <div key={name}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {label}
                    </label>
                    <input
                      type={type}
                      name={name}
                      placeholder={placeholder}
                      value={formData[name as keyof FormDataType]}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                ))}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Processing..." : "Join Alumni Network"}
              </button>
            </form>
          </div>
        </div>
      </main>

      <Dialog open={showSuccessPopup} onOpenChange={setShowSuccessPopup}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-500" />
              Registration Successful
            </DialogTitle>
          </DialogHeader>
          <p className="text-gray-600">
            Your registration has been submitted successfully. You will receive a confirmation email after admin approval.
          </p>
          <div className="flex justify-end mt-4">
            <button
              onClick={() => {
                setShowSuccessPopup(false);
                router.push("/");
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              OK
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}