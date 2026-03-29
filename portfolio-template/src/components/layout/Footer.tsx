export default function Footer() {
    return (
        <footer className="border-t border-white/10 bg-black mt-20">
            <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between text-gray-400 text-sm">
                <p>© {new Date().getFullYear()} Jyoti. All rights reserved. Handcrafted by me.</p>
                <div className="flex items-center gap-4 mt-4 md:mt-0">
                    <span>Made with ❤️ and Next.js</span>
                </div>
            </div>
        </footer>
    );
}
