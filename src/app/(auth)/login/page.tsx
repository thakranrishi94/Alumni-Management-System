"use client"
import React, { useEffect } from "react";
// import Image from "next/image";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Cookies from "js-cookie";
import { useToast } from "@/hooks/use-toast";
// import ProtectedRoute from "@/components/ProtectedRoute";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const {toast} = useToast();

  useEffect(() => {
    console.log("inside the login");
  }, [  ])
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!email || !password){
      toast({
        title:"Please fill in all fields",
        description: "Please fill in all fields",
        variant:"destructive",     
      })
      return;
    }
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        { email, password }
      );
      if (response.data.user) {
        Cookies.set('ams_user_role', response.data.user.role, { expires: 1 });
        Cookies.set('ams_token', response.data.token, { expires: 1 });

        switch (response.data.user.role) {
          case 'ADMIN':
            router.push('/dashboard/admin/overview');
            break;
          case 'ALUMNI':
            router.push('/dashboard/alumni/overview');
            break;
          case 'FACULTY':
            router.push('/dashboard/faculty/overview');
            break;
          default:
            router.push('/')
        }
      }
    } catch (error) {
      console.log(error);
      toast({title:"Invalid Credentials",
        variant:"destructive",     
      })
    }
  };
  return (
    // <ProtectedRoute>
      <div className="relative flex min-h-screen flex-col bg-white overflow-x-hidden justify-center">
        {/* Main Section */}
        <main className="flex flex-1 flex-col md:flex-row py-20">
          {/* Left Section: Image */}
        
          <div
            className="hidden md:flex md:flex-1 bg-cover bg-center ml-10 h-150 w-full md:w-2/3 lg:w-1/2 rounded-lg"
            style={{
              backgroundImage:
                "linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%), url('krmu.jpg')",
            }}
          ></div>
          {/* Right Section: Content */}
          <div className="flex flex-col flex-1 px-6 py-8 sm:px-10 lg:px-20">
            <div className="max-w-md w-4/5 mx-auto">
            <form onSubmit={handleSubmit}>
              <h1 className="text-2xl font-bold text-gray-900 text-center">
                Sign in
              </h1>
              <div className="mt-6">
                <label className="block">
                  <span className="text-gray-700">Email</span>
                  <input
                    type="email"
                    placeholder="you@gmail.com"
                    value={email}
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 p-2 block w-full rounded-md  shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                  />
                </label>
              </div>
              <div className="mt-6">
                <label className="block">
                  <span className="text-gray-700">Password</span>
                  <input
                    type="password"
                    value={password}
                    required
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••"
                    className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                  />
                </label>
              </div>
              <div className="flex items-center mt-6">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring focus:ring-blue-200"
                />
                <label htmlFor="remember" className="ml-2 text-gray-700">
                  Remember me
                </label>
              </div>
              <button type="submit" className="w-full mt-6 bg-blue-600 text-white py-2 rounded-md font-bold hover:bg-blue-700">
                Sign in
              </button>
              <div className="mt-6 text-center text-sm text-gray-700">
                <p>
                  Don’t have an account?{" "}
                  <a href="/signup" className="text-blue-600 hover:underline">
                    Sign up
                  </a>
                </p>
              </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    // </ProtectedRoute>

  );
}
