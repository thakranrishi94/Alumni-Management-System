"use client";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    const userRole = Cookies.get("ams_user_role");
    const token = Cookies.get("ams_token");

    if (!userRole || !token) {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [router, isAuthenticated]);

  if (!isAuthenticated) return null;

  return <>{children}</>;
};

export default ProtectedRoute;
