"use client"
import React, { useState, useEffect } from 'react';

// Define types for the menu items
type MenuItem = {
  title: string;
  children: { name: string; link: string }[];
};

type SideBarProps = {
  children: React.ReactNode;
  sidebarMenus: MenuItem[]; // Pass the menu configuration as a prop
  defaultActiveMenu?: string; // Optional prop to set the default active menu
  title:string;
};

const SideBar = ({ children, sidebarMenus, defaultActiveMenu = 'Faculty',title }: SideBarProps) => {
  const [activeMenu, setActiveMenu] = useState(defaultActiveMenu);
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
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleMenu = (title: string | null) => {
    setOpenMenu((prev) => (prev === title ? null : title));
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
      >
        ☰
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed md:relative w-64 h-full bg-white shadow-md
          transform transition-transform duration-300
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
          z-40
        `}
      >
        <div className="p-6 text-xl font-bold flex justify-between items-center">
          <div className="flex flex-col items-center">
            <img src="/logo.jpg" className="h-40 w-30 p-5" alt="Logo" />
            <p className="pl-5">{title}</p>
          </div>
          
        </div>

        <nav className="mt-4">
          {sidebarMenus.map((menu) => (
            <div key={menu.title}>
              <div
                onClick={() => {
                  menu.children.length > 0 && toggleMenu(menu.title);
                  setActiveMenu(menu.title);
                }}
                className={`
                  px-6 py-3 cursor-pointer flex justify-between items-center
                  ${activeMenu === menu.title ? 'bg-gray-200 font-semibold' : 'hover:bg-gray-100'}
                `}
              >
                {menu.title}
                {menu.children.length > 0 && <span>{openMenu === menu.title ? '▼' : '►'}</span>}
              </div>
              {openMenu === menu.title && menu.children.length > 0 && (
                <div className="pl-8 bg-gray-50">
                  {menu.children.map((child) => (
                    <a
                      key={child.name}
                      href={child.link}
                      className="block px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      {child.name}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* Backdrop for mobile */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {children}
    </>
  );
};

export default SideBar;