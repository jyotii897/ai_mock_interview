import Link from "next/link";
import { Github, Linkedin, Twitter, Mail } from "lucide-react";

export default function Navbar() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-md border-b border-white/10">
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link href="/" className="text-xl font-bold tracking-tighter text-white">
                    Jyoti<span className="text-blue-500">.dev</span>
                </Link>

                <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
                    <Link href="#about" className="hover:text-white transition-colors">About</Link>
                    <Link href="#work" className="hover:text-white transition-colors">Work</Link>
                    <Link href="#blog" className="hover:text-white transition-colors">Writing</Link>
                </nav>

                <div className="flex items-center gap-4 text-gray-400">
                    <Link href="https://github.com" target="_blank" className="hover:text-white transition-colors">
                        <Github className="w-5 h-5" />
                    </Link>
                    <Link href="https://linkedin.com" target="_blank" className="hover:text-white transition-colors">
                        <Linkedin className="w-5 h-5" />
                    </Link>
                    <Link href="mailto:hello@example.com" className="hover:text-white transition-colors hidden sm:block">
                        <Mail className="w-5 h-5" />
                    </Link>
                </div>
            </div>
        </header>
    );
}
