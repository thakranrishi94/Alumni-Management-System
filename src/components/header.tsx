"use client"
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
    const pathname = usePathname();
    const isLoginPage = pathname === "/login";

    return (
        <div className="bg-white">
            <header className="flex items-center justify-between border-b border-solid border-b-gray-200 px-6 py-4">
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
                    <h2 className="text-lg font-bold text-gray-900">KR Managalam Alumni</h2>
                </div>
                <nav className="hidden md:flex gap-6">
                    <Link href="/" className="text-sm font-medium text-gray-900">
                        Home
                    </Link>
                    <Link href="/events" className="text-sm font-medium text-gray-900">
                        Events
                    </Link>
                    <Link href="/groups" className="text-sm font-medium text-gray-900">
                        Groups
                    </Link>
                    <Link href="/mentorship" className="text-sm font-medium text-gray-900">
                        Mentorship
                    </Link>
                    <Link href="/benefits" className="text-sm font-medium text-gray-900">
                        Benefits
                    </Link>
                </nav>
                {!isLoginPage && (
                    <div className="flex gap-3">
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-bold">
                            Give
                        </button>
                        <Link href="/login">
                            <button className="bg-gray-200 text-gray-900 px-4 py-2 rounded-md text-sm font-bold">
                                Sign In
                            </button>
                        </Link>
                    </div>
                )}
            </header>
        </div>
    );
}