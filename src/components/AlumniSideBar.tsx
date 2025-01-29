"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

// Define types for the menu items
type MenuItem = {
  title: string;
  children: { name: string; link: string }[];
};

type SideBarProps = {
  children: React.ReactNode;
  sidebarMenus: MenuItem[];
  title: string;
};

const SideBar = ({ children, sidebarMenus, title }: SideBarProps) => {
  const pathname = usePathname();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive sidebar
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      setIsSidebarOpen(window.innerWidth >= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Set the default open and active menu based on the current URL
  useEffect(() => {
    if (pathname) {
      // Find the menu item that matches the current URL
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
    // Add your logout logic here
    console.log("User logged out");
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
      >
        ☰
      </button>

      {/* Sidebar - Now fixed width */}
      <aside
        className={`
          w-64 h-full bg-white shadow-md shrink-0
          transform transition-transform duration-300
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
          z-40 overflow-y-auto flex flex-col
        `}
      >
        <div className="p-6 text-xl font-bold flex justify-between items-center">
          <div className="flex flex-col items-center">
            <div className="h-40 w-30 p-5 relative">
              <Image
                src="/logo.jpg" // Path to the image in the public folder
                alt="Logo"
                width={120} // Set the width of the image
                height={160} // Set the height of the image
                className="object-cover" // Optional: Add styling
              />
            </div>
            <p className="pl-5">{title}</p>
          </div>
        </div>

        <nav className="mt-4 flex-grow">
          {sidebarMenus.map((menu) => (
            <div key={menu.title}>
              <div
                onClick={() => {
                  menu.children.length > 0 && toggleMenu(menu.title);
                  setActiveMenu(menu.title);
                }}
                className={`
                  px-6 py-3 cursor-pointer flex justify-between items-center
                  ${activeMenu === menu.title ? "bg-gray-200 font-semibold" : "hover:bg-gray-100"}
                `}
              >
                {menu.title}
                {menu.children.length > 0 && <span>{openMenu === menu.title ? "▼" : "►"}</span>}
              </div>
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

        {/* Profile Update Section */}
        <div className="p-4 border-t border-gray-200">
          <Link
            href="/profile-update"
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <span className="mr-2">👤</span>
            <span>Update Profile</span>
          </Link>
        </div>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
          >
            <span className="mr-2">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content area - now scrollable */}
      <main className="flex-grow overflow-y-auto">
        {children}
      </main>

      {/* Backdrop for mobile */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default SideBar;