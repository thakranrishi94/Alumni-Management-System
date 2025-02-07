"use client";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation"; 

export default function SignupPage() {
  // Define the type for formData
  type FormDataType = {
    name: string;
    email: string;
    phoneNumber: string;
    course: string;
    currentOrganization: string;
    designation: string;
    skills: string;
    password: string;
    confirmPassword: string;
    image?: File;
  };

  // Initialize state with correct type
  const [formData, setFormData] = useState<FormDataType>({
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

  const [passwordError, setPasswordError] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const router = useRouter(); 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name as keyof FormDataType]: name === "image" && files ? files[0] : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    setPasswordError("");

    console.log("Form Data Submitted:", formData);

    setShowSuccessPopup(true);
  };

  const handleOkButtonClick = () => {
    setShowSuccessPopup(false);
    router.push("/");
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-white overflow-hidden">
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: "Name", name: "name", type: "text" },
                  { label: "Email", name: "email", type: "email" },
                  { label: "Phone Number", name: "phoneNumber", type: "tel" },
                  { label: "Course", name: "course", type: "text" },
                  { label: "Current Organization", name: "currentOrganization", type: "text" },
                  { label: "Designation", name: "designation", type: "text" },
                  { label: "Skills", name: "skills", type: "text" },
                  { label: "Password", name: "password", type: "password" },
                  { label: "Confirm Password", name: "confirmPassword", type: "password" },
                ].map(({ label, name, type }) => (
                  <div key={name}>
                    <label htmlFor={name} className="block font-medium text-gray-600 mb-1">
                      {label} *
                    </label>
                    <input
                      type={type}
                      id={name}
                      name={name}
                      value={formData[name as keyof FormDataType] as string}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-md"
                      placeholder={label}
                      required
                    />
                  </div>
                ))}

                {passwordError && (
                  <p className="text-sm text-red-500 mt-1">{passwordError}</p>
                )}
              </div>

              <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md">
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
