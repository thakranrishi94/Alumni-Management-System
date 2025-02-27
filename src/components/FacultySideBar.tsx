"use client";
import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Cookies from "js-cookie";
import axios from "axios";
import UpdateFaculty from "./UpdateFaculty"; // Import the FacultyUpdateForm component

type MenuItem = {
  title: string;
  children: { name: string; link: string }[];
};

type SideBarProps = {
  children: React.ReactNode;
  sidebarMenus: MenuItem[];
  title: string;
};

// Define the FacultyData interface
interface FacultyData {
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
}

const FacultySideBar = ({ children, sidebarMenus, title }: SideBarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // State for FacultyUpdateForm
  const [isUpdateFormOpen, setIsUpdateFormOpen] = useState(false);
  const [facultyData, setFacultyData] = useState<FacultyData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      setIsSidebarOpen(window.innerWidth >= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (pathname) {
      for (const menu of sidebarMenus) {
        const matchingChild = menu.children.find((child) => child.link === pathname);
        if (matchingChild) {
          setOpenMenu(menu.title);
          setActiveMenu(menu.title);
          break;
        }
      }
    }
  }, [pathname, sidebarMenus]);

  const toggleMenu = (title: string | null) => {
    setOpenMenu((prev) => (prev === title ? null : title));
  };

  const handleLogout = () => {
    Cookies.remove("ams_token");
    Cookies.remove("ams_user_role");
    router.push('/login');
  };

  // Function to handle opening the update form
  const handleOpenUpdateForm = async () => {
    try {
      setIsLoading(true);
      const token = Cookies.get('ams_token');

      // Fetch faculty data
      const response = await axios.get<FacultyData>(
        `${process.env.NEXT_PUBLIC_API_URL}/faculty/byId`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFacultyData(response.data);
      setIsUpdateFormOpen(true);
    } catch (error) {
      console.error('Error fetching faculty data:', error);
      alert('Failed to load profile data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex min-h-screen bg-gray-50">
      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg md:hidden"
          aria-label="Toggle menu"
        >
          <span className="sr-only">Toggle menu</span>
          ☰
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static w-64 h-screen bg-white shadow-md
          transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 z-40 flex flex-col
        `}
      >
        {/* Header */}
        <div className="p-6">
          <div className="flex flex-col items-center">
            <div className="h-40 w-30 p-5 relative">
              <Link href={'/'}>
              <Image
                src="/logo.jpg"
                alt="Logo"
                width={120}
                height={160}
                className="object-cover"
                priority
              /></Link>
            </div>
            <h1 className="text-xl font-bold">{title}</h1>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-grow mt-4" role="navigation">
          {sidebarMenus.map((menu) => (
            <div key={menu.title}>
              <button
                onClick={() => {
                  if (menu.children.length > 0) {
                    toggleMenu(menu.title);
                  }
                  setActiveMenu(menu.title);
                }}
                className={`
                  w-full px-6 py-3 text-left flex justify-between items-center
                  ${activeMenu === menu.title ? "bg-gray-200 font-semibold" : "hover:bg-gray-100"}
                `}
                aria-expanded={openMenu === menu.title}
              >
                <span>{menu.title}</span>
                {menu.children.length > 0 && (
                  <span aria-hidden="true">{openMenu === menu.title ? "▼" : "►"}</span>
                )}
              </button>
              {openMenu === menu.title && menu.children.length > 0 && (
                <div className="pl-8 bg-gray-50">
                  {menu.children.map((child) => (
                    <Link
                      key={child.name}
                      href={child.link}
                      className={`block px-4 py-2 text-sm ${
                        pathname === child.link ? "bg-blue-100 font-semibold" : "hover:bg-gray-100"
                      }`}
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Footer Actions */}
        <div className="mt-auto">
          {/* Profile Update Button */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleOpenUpdateForm}
              disabled={isLoading}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <span className="mr-2" aria-hidden="true">👤</span>
              <span>{isLoading ? "Loading..." : "Update Profile"}</span>
            </button>
          </div>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
            >
              <span className="mr-2" aria-hidden="true">🚪</span>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {children}
      </main>

      {/* Faculty Update Form */}
      {facultyData && (
        <UpdateFaculty
          faculty={facultyData}
          open={isUpdateFormOpen}
          onClose={() => setIsUpdateFormOpen(false)}
        />
      )}

      {/* Mobile Backdrop */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
    </section>
  );
};

export default FacultySideBar;