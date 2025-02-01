"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle } from "lucide-react"; // For the success icon
import { useRouter } from "next/navigation"; // For navigation

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    course: "",
    currentOrganization: "",
    designation: "",
    skills: "",
    password: "",
    confirmPassword: "",
  });

  const [passwordError, setPasswordError] = useState(""); // State for password mismatch error
  const [showSuccessPopup, setShowSuccessPopup] = useState(false); // State for success popup
  const router = useRouter(); // Initialize the router

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, [name]: files[0] }); // Handle file upload
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    } else {
      setPasswordError("");
    }

    console.log("Form Data Submitted:", formData);

    // Simulate form submission success
    setShowSuccessPopup(true);
  };

  const handleOkButtonClick = () => {
    setShowSuccessPopup(false); // Close the popup
    router.push("/"); // Redirect to the home page
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-white overflow-hidden">
      {/* Header Section */}
      

      {/* Main Section */}
      <main className="flex flex-col md:flex-row py-10 px-4 md:px-20 gap-8 justify-center items-center">
        {/* Left Section: Image */}
        <div
          className="hidden md:flex flex-shrink-0 w-full max-w-md bg-cover bg-center rounded-lg"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.4)), url('krmu.jpg')",
            height: "500px",
            width: "100%",
            maxWidth: "500px",
          }}
        ></div>

        {/* Right Section: Form */}
        <div className="flex flex-1 justify-center items-center p-6">
          <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-center mb-4">
              Add your Alumni details in - K.R. Mangalam University
            </h2>
            <p className="text-sm text-gray-500 text-center mb-4">
              Fields marked * are mandatory
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Three-column grid layout */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block font-medium text-gray-600 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                    placeholder="Name"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-gray-600  font-medium mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                    placeholder="Email"
                    required
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label htmlFor="phoneNumber" className="block font-medium mb-1 text-gray-600 ">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                    placeholder="Phone Number"
                    required
                  />
                </div>

                {/* Course */}
                <div>
                  <label htmlFor="course" className="block font-medium mb-1 text-gray-600 ">
                    Course *
                  </label>
                  <input
                    type="text"
                    id="course"
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                    placeholder="Course"
                    required
                  />
                </div>

                

                {/* Current Organization */}
                <div>
                  <label htmlFor="currentOrganization" className="block font-medium mb-1 text-gray-600 ">
                    Current Organization *
                  </label>
                  <input
                    type="text"
                    id="currentOrganization"
                    name="currentOrganization"
                    value={formData.currentOrganization}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                    placeholder="Current Organization"
                    required
                  />
                </div>

                {/* Designation */}
                <div>
                  <label htmlFor="designation" className="block font-medium mb-1 text-gray-600 ">
                    Designation *
                  </label>
                  <input
                    type="text"
                    id="designation"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                    placeholder="Designation"
                    required
                  />
                </div>

                {/* Skills */}
                <div>
                  <label htmlFor="skills" className="block font-medium mb-1 text-gray-600 ">
                    Skills *
                  </label>
                  <input
                    type="text"
                    id="skills"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                    placeholder="Skills (comma separated)"
                    required
                  />
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block font-medium mb-1 text-gray-600 ">
                    Password *
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                    placeholder="Password"
                    required
                  />
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block font-medium mb-1 text-gray-600 ">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                    placeholder="Confirm Password"
                    required
                  />
                  {passwordError && (
                    <p className="text-sm text-red-500 mt-1">{passwordError}</p>
                  )}
                </div>

                
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-md"
              >
                Join Alumni Network
              </button>
            </form>
          </div>
        </div>
      </main>

     
      {/* Success Popup */}
      <Dialog open={showSuccessPopup} onOpenChange={setShowSuccessPopup}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-500" />
              Success!
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">
            You will receive a confirmation message on your email after approval by KRMU admin.
          </p>
          <div className="flex justify-center mt-4">
            <button
              onClick={handleOkButtonClick}
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              OK
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}