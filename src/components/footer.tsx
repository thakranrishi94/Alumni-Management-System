"use client"
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-black text-white py-6 mt-auto">
            <div className="container mx-auto flex flex-col items-center">
                <div className="flex space-x-4 mb-4">
                    <a
                        href="https://www.linkedin.com/in/krmuniv/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white rounded-full py-1 px-2"
                    >
                        <span className="text-black font-bold">in</span>
                    </a>
                    <a
                        href="https://www.youtube.com/@KRMangalamUniversity"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white rounded-full py-1 px-2"
                    >
                        <Image
                            src="/youtube.png"
                            alt="YouTube"
                            width={24}
                            height={24}
                            className="h-6 w-6"
                            priority
                        />
                    </a>
                </div>

                <nav className="flex flex-wrap justify-center gap-2 text-sm uppercase">
                    <Link href="/" className="hover:underline">Home</Link>
                    <span>|</span>
                    <Link href="/about" className="hover:underline">About</Link>
                    <span>|</span>
                    <Link href="/contact" className="hover:underline">Contact</Link>
                    <span>|</span>
                    <Link href="/sitemap" className="hover:underline">Sitemap</Link>
                    <span>|</span>
                    <Link href="/terms" className="hover:underline">Terms</Link>
                    <span>|</span>
                    <Link href="/privacy" className="hover:underline">Privacy</Link>
                </nav>
            </div>
        </footer>
    );
}
