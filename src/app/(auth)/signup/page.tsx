"use client";
import React, { useState } from "react";
import Image from "next/image"; // Import the Image component

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    course: "",
    school: "",
    yearOfJoining: "",
    yearOfGraduation: "",
    email: "",
    password: "",
    Cpassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
    // Add form submission logic here
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-white overflow-hidden">
      {/* Header Section */}
      <header className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <Image
            src="/logo.jpg"
            alt="logo"
            width={40} // Set the width
            height={40} // Set the height
            className="h-10 w-10 rounded"
          />
          <h2 className="text-lg font-bold text-gray-900">KR Mangalam Alumni</h2>
        </div>
        <nav className="hidden md:flex gap-6">
          <a href="#" className="text-sm font-medium text-gray-900 hover:underline">
            Home
          </a>
          <a href="#" className="text-sm font-medium text-gray-900 hover:underline">
            Events
          </a>
          <a href="#" className="text-sm font-medium text-gray-900 hover:underline">
            Groups
          </a>
          <a href="#" className="text-sm font-medium text-gray-900 hover:underline">
            Mentorship
          </a>
          <a href="#" className="text-sm font-medium text-gray-900 hover:underline">
            Benefits
          </a>
        </nav>
        <div className="flex gap-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-bold">
            Give
          </button>
          <button className="bg-gray-200 text-gray-900 px-4 py-2 rounded-md text-sm font-bold">
            Sign In
          </button>
        </div>
      </header>

      {/* Main Section */}
      <main className="flex flex-col md:flex-row py-10 px-4 md:px-20 gap-8 justify-center items-center">
        {/* Left Section: Image */}
        <div
          className="hidden md:flex flex-shrink-0 w-full max-w-md bg-cover bg-center rounded-lg"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.4)), url('krmu.jpg')",
            height: "500px", // Set a fixed height
            width: "100%", // Ensure it takes up full width
            maxWidth: "500px", // Optional: set a maximum width for the image container
          }}
        ></div>

        {/* Right Section: Form */}
        <div className="flex flex-1 justify-center items-center p-6">
          <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-center mb-4">
              Add your Alumni details in - K.R. Mangalam University
            </h2>
            <p className="text-sm text-gray-500 text-center mb-4">
              Fields marked * are mandatory
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block font-medium mb-1">
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
                <div>
                  <label htmlFor="name" className="block font-medium mb-1">
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
                <div>
                  <label htmlFor="course" className="block font-medium mb-1">
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
                <div>
                  <label htmlFor="house" className="block font-medium mb-1">
                    School *
                  </label>
                  <input
                    type="text"
                    id="school"
                    name="school"
                    value={formData.school}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                    placeholder="School"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="yearOfJoining" className="block font-medium mb-1">
                    Year of Joining *
                  </label>
                  <select
                    id="yearOfJoining"
                    name="yearOfJoining"
                    value={formData.yearOfJoining}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                    required
                  >
                    <option value="">Select Year of Joining</option>
                    {[...Array(new Date().getFullYear() - 2013 + 1)].map((_, i) => (
                      <option key={i} value={2013 + i}>
                        {2013 + i}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="yearOfGraduation" className="block font-medium mb-1">
                    Year of Graduation *
                  </label>
                  <select
                    id="yearOfGraduation"
                    name="yearOfGraduation"
                    value={formData.yearOfGraduation}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                    required
                  >
                    <option value="">Select Year of Graduation</option>
                    {[...Array(30)].map((_, i) => (
                      <option key={i} value={2013 + i}>
                        {2013 + i}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="password" className="block font-medium mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                    placeholder="Password..."
                    required
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block font-medium mb-1">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    id="Cpassword"
                    name="Cpassword"
                    value={formData.Cpassword}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                    placeholder="Confirm Password..."
                    required
                  />
                </div>
              </div>
              <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md">
                Join Alumni Network
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* Footer Section */}
      <footer className="bg-black text-white py-6">
        <div className="container mx-auto flex flex-col items-center">
          {/* Social Media Icons */}
          <div className="flex space-x-4 mb-4">
            <a
              href="https://www.linkedin.com/in/krmuniv/"
              className="bg-white rounded-full px-3 p-2"
            >
              <span className="text-black font-bold">in</span>
            </a>
            <a
              href="https://www.youtube.com/@KRMangalamUniversity"
              className="bg-white rounded-full px-2 p-2"
            >
              <Image
                src="/youtube.png"
                alt="YouTube"
                width={24} // Set the width
                height={24} // Set the height
                className="h-6 w-6"
              />
            </a>
          </div>
          {/* Links */}
          <nav className="flex space-x-4 text-sm uppercase">
            <a href="#home" className="hover:underline">
              Home
            </a>
            <span>|</span>
            <a href="#about" className="hover:underline">
              About
            </a>
            <span>|</span>
            <a href="#contact" className="hover:underline">
              Contact
            </a>
            <span>|</span>
            <a href="#sitemap" className="hover:underline">
              Sitemap
            </a>
            <span>|</span>
            <a href="#terms" className="hover:underline">
              Terms
            </a>
            <span>|</span>
            <a href="#privacy" className="hover:underline">
              Privacy
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}