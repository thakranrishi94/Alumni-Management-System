"use client"

import { useState } from "react";
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Cookies from "js-cookie";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const validateInputs = () => {
    if (!email.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return false;
    }

    if (!password.trim()) {
      toast({
        title: "Password Required",
        description: "Please enter your password",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateInputs()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        { email, password }
      );
      
      if (response.data.user) {
       
        Cookies.set('ams_user_role', response.data.user.role);
        Cookies.set('ams_token', response.data.token);

        const routes = {
          'ADMIN': '/dashboard/admin/overview',
          'ALUMNI': '/dashboard/alumni/overview',
          'FACULTY': '/dashboard/faculty/overview'
        };

        const redirectPath = routes[response.data.user.role as keyof typeof routes] || '/';
        router.push(redirectPath);
        
        toast({
          title: "Login Successful",
          description: "Welcome back!",
          variant: "default",
        });
      }
    } catch (error) {
      console.log("Login error:", error);
    
      let errorMessage = "Invalid credentials. Please check your email and password.";
      let requestStatus = null;
    
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data?.error || errorMessage;
        requestStatus = error.response.data?.requestStatus;
        
        // If the error is specifically about alumni approval status
        if (requestStatus) {
          let statusMessage;
          
          switch (requestStatus) {
            case 'PENDING':
              statusMessage = "Your account is pending approval by an administrator.";
              break;
            case 'REJECTED':
              statusMessage = "Your account request has been rejected. Please contact administration.";
              break;
            default:
              statusMessage = "There's an issue with your account status.";
          }
          
          errorMessage = statusMessage;
        }
      }
    
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-[calc(100vh-140px)] flex-col bg-white overflow-x-hidden justify-center">
      <main className="flex flex-1 flex-col md:flex-row py-10">
        <div
          className="hidden md:flex md:flex-1 bg-cover bg-center ml-10 h-150 w-full md:w-2/3 lg:w-1/2 rounded-lg"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%), url('/krmu.jpg')",
          }}
          role="img"
          aria-label="Campus background image"
        />
        
        <div className="flex flex-col flex-1 px-6 py-8 sm:px-10 lg:px-20">
          <div className="max-w-md w-full mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              <h1 className="text-2xl font-bold text-gray-900 text-center">
                Sign in
              </h1>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                    required
                    autoComplete="email"
                  />
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••"
                    className="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                    required
                    autoComplete="current-password"
                  />
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring focus:ring-blue-200"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <button 
                type="submit" 
                className="w-full bg-blue-600 text-white py-2 rounded-md font-bold hover:bg-blue-700 disabled:opacity-50 transition-opacity"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </button>

              <div className="text-center text-sm text-gray-700">
                <p>
                  Don&apos;t have an account?{" "}
                  <Link href="/signup" className="text-blue-600 hover:underline">
                    Sign up
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}