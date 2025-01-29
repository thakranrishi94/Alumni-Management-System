"use client"
import Image from "next/image";
export default function header() {
    return (
        <div className="bg-white">
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
        </div>
    )
};