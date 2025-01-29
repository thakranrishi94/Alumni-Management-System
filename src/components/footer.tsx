"use client"
import Image from "next/image";

export default function footer () {
    return (
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
    )
};