"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Cookies from "js-cookie";
import { useEffect, useState, useLayoutEffect } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
    const pathname = usePathname();
    const [userRole, setUserRole] = useState<string | undefined>();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    // Dynamic title setting via document API instead of metadata
    useEffect(() => {
        const routeToTitleMap: Record<string, string> = {
            "/": "Home | KRMU Alumni Portal",
            "/events": "Events | KRMU Alumni Portal",
            "/gallery": "Gallery | KRMU Alumni Portal",
            "/about-us": "About Us | KRMU Alumni Portal",
            "/job-opportunities": "Career | KRMU Alumni Portal",
            "/login": "Login | KRMU Alumni Portal",
            "/signup": "Register | KRMU Alumni Portal",
        };

        const matchedTitle = routeToTitleMap[pathname] || "KRMU Alumni Portal";
        document.title = matchedTitle;
    }, [pathname]);

    useEffect(() => {
        const token = Cookies.get('ams_token');
        const role = Cookies.get('ams_user_role');
        
        setIsLoggedIn(!!token);
        setUserRole(role);

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Better layout effect for header height
    useLayoutEffect(() => {
        // Only apply padding adjustment on non-dashboard pages
        if (!pathname.startsWith('/dashboard')) {
            const adjustBodyPadding = () => {
                const header = document.querySelector('header');
                if (header) {
                    const headerHeight = header.offsetHeight;
                    document.body.style.paddingTop = `${headerHeight}px`;
                }
            };
            
            // Run immediately and after a short delay to ensure correct measurement
            adjustBodyPadding();
            const timerId = setTimeout(adjustBodyPadding, 100);
            
            return () => {
                clearTimeout(timerId);
            };
        } else {
            // For dashboard pages, remove the padding
            document.body.style.paddingTop = '0';
        }
    }, [pathname, isMobileMenuOpen]);

    const getDashboardRoute = () => {
        const routes = {
            'ADMIN': '/dashboard/admin/overview',
            'ALUMNI': '/dashboard/alumni/overview',
            'FACULTY': '/dashboard/faculty/overview'
        };
        return userRole ? routes[userRole as keyof typeof routes] : '/';
    };

    const navLinks = [
        { href: "/", label: "Home" },
        { href: "/events", label: "Events"},
        { href: "/gallery", label: "Gallery"},
        { href: "/about-us", label: "About Us"},
        { href: "/job-opportunities", label: "Career"},
    ];

    const handleLogout = () => {
        Cookies.remove('ams_token');
        Cookies.remove('ams_user_role');
        setIsLoggedIn(false);
        setUserRole(undefined);
        setIsMobileMenuOpen(false);
    };

    const handleMobileNavClick = () => {
        setIsMobileMenuOpen(false);
    };
    
    // Don't render header at all on dashboard pages
    if(pathname.startsWith('/dashboard')) {
        return null;
    }
    
    return (
        <div className={`fixed top-0 left-0 right-0 z-50 bg-white transition-shadow duration-300 ${isScrolled ? 'shadow-md' : ''}`}>
            <header className="relative flex items-center justify-between border-b border-solid border-b-gray-200 px-6 py-4">
                <div className="flex items-center gap-4">
                    <Link href="/" className="text-blue-600">
                        <Image
                            src="/logo.jpg"
                            alt="logo"
                            width={40}
                            height={40}
                            className="h-10 w-10 rounded"
                            priority
                        />
                    </Link>
                    <h2 className="text-lg font-bold text-gray-900">
                        K.R. Mangalam Alumni
                    </h2>
                </div>

                <nav className="hidden md:flex gap-6">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`relative text-sm font-medium hover:text-blue-600 transition-colors pb-1 ${
                                    isActive ? 'text-blue-600' : 'text-gray-900'
                                }`}
                            >
                                {link.label}
                                {isActive ? (
                                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></span>
                                ) : (
                                    <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-blue-600 group-hover:w-full group-hover:left-0 transition-all duration-300"></span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="hidden md:flex gap-3">
                    {isLoggedIn ? (
                        <>
                            <Link href={getDashboardRoute()}>
                                <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-bold hover:bg-blue-700 transition-colors">
                                    Dashboard
                                </button>
                            </Link>
                            <button 
                                onClick={handleLogout}
                                className="bg-gray-200 text-gray-900 px-4 py-2 rounded-md text-sm font-bold hover:bg-gray-300 transition-colors"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link href="/login">
                            <button className="bg-gray-200 text-gray-900 px-4 py-2 rounded-md text-sm font-bold hover:bg-gray-300 transition-colors">
                                Sign In
                            </button>
                        </Link>
                    )}
                </div>

                <button 
                    className="md:hidden"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? (
                        <X className="h-6 w-6 text-gray-600" />
                    ) : (
                        <Menu className="h-6 w-6 text-gray-600" />
                    )}
                </button>

                {isMobileMenuOpen && (
                    <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 md:hidden shadow-lg">
                        <nav className="flex flex-col p-4">
                            {navLinks.map((link) => {
                                const isActive = pathname === link.href;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`relative text-sm font-medium hover:text-blue-600 transition-colors py-2 ${isActive ? 'text-blue-600' : 'text-gray-900'}`}
                                        onClick={handleMobileNavClick}
                                    >
                                        {link.label}
                                        {isActive ? (
                                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></span>
                                        ) : (
                                            <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-blue-600 group-hover:w-full group-hover:left-0 transition-all duration-300"></span>
                                        )}
                                    </Link>
                                );
                            })}
                            <div className="flex flex-col gap-2 pt-4 border-t border-gray-100 mt-4">
                                {isLoggedIn ? (
                                    <>
                                        <Link 
                                            href={getDashboardRoute()}
                                            onClick={handleMobileNavClick}
                                            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-bold hover:bg-blue-700 transition-colors text-center"
                                        >
                                            Dashboard
                                        </Link>
                                        <button 
                                            onClick={handleLogout}
                                            className="bg-gray-200 text-gray-900 px-4 py-2 rounded-md text-sm font-bold hover:bg-gray-300 transition-colors"
                                        >
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <Link 
                                        href="/login"
                                        onClick={handleMobileNavClick}
                                        className="bg-gray-200 text-gray-900 px-4 py-2 rounded-md text-sm font-bold hover:bg-gray-300 transition-colors text-center"
                                    >
                                        Sign In
                                    </Link>
                                )}
                            </div>
                        </nav>
                    </div>
                )}
            </header>
        </div>
    );
}