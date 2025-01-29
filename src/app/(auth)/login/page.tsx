"use client"
import React from "react";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import axios, { Axios } from 'axios';
import Cookies from "js-cookie";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const {toast} = useToast();
  
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
        { email, password },
        {headers:{
          "Authorization":"Bearer "
        }}
      );
      if (response.data.user) {
        // Cookies.set('userRole', response.data.user.role, { expires: '1h' });
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
      toast({title:"Invalid Credentials",
        variant:"destructive",     
      })
    }
  };
  return (
    <div className="relative flex min-h-screen flex-col bg-white overflow-x-hidden justify-center">
      {/* Header Section */}
      <header className="flex items-center justify-between border-b border-solid border-b-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="text-blue-600">
            <Image
              src="/logo.jpg"
              alt="logo"
              width={40} // Set the width
              height={40} // Set the height
              className="h-10 w-10 rounded"
            />
          </div>
          <h2 className="text-lg font-bold text-gray-900">KR Managalam Alumni</h2>
        </div>
        <nav className="flex gap-6">
          <a href="#" className="text-sm font-medium text-gray-900">
            Home
          </a>
          <a href="#" className="text-sm font-medium text-gray-900">
            Events
          </a>
          <a href="#" className="text-sm font-medium text-gray-900">
            Groups
          </a>
          <a href="#" className="text-sm font-medium text-gray-900">
            Mentorship
          </a>
          <a href="#" className="text-sm font-medium text-gray-900">
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

      {/* Footer Section */}
      <footer className="bg-black text-white py-6">
        <div className="container mx-auto flex flex-col items-center">
          {/* Social Media Icons */}
          <div className="flex space-x-4 mb-4">
            <a
              href="https://www.linkedin.com/in/krmuniv/"
              className="bg-white rounded-full py-1 px-2"
            >
              <span className="text-black font-bold">in</span>
            </a>
            <a
              href="https://www.youtube.com/@KRMangalamUniversity"
              className="bg-white rounded-full py-1 px-2"
            >
              <span>
                <Image
                  src="/youtube.png"
                  alt="YouTube"
                  width={24} // Set the width
                  height={24} // Set the height
                  className="h-6 w-6"
                />
              </span>
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
