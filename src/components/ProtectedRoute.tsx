"use client";
import React, { useLayoutEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useLayoutEffect(() => {
    const token = Cookies.get("ams_token");
    const userRole = Cookies.get("ams_user_role");

    if (!token || !userRole) {
      router.replace("/login"); // Ensures immediate redirection
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  if (!isAuthenticated) return null; // Prevent rendering protected content before verification

  return <>{children}</>;
};

export default ProtectedRoute;
