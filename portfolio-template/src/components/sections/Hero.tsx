import { ArrowRight } from "lucide-react";

export default function Hero() {
    return (
        <section className="min-h-[80vh] flex flex-col justify-center max-w-6xl mx-auto px-6 pt-20">
            <div className="max-w-3xl">
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
                    Hi, I&apos;m <span className="text-blue-500">Jyoti</span>. <br />
                    I build handcrafted digital experiences.
                </h1>
                <p className="text-xl text-gray-400 mb-10 leading-relaxed">
                    Full-stack developer focused on creating smooth, user-centric applications.
                    I believe in <span className="text-white font-medium">showing, not just telling</span>.
                </p>
                <div className="flex flex-wrap gap-4">
                    <a href="#work" className="bg-white text-black px-6 py-3 rounded-full font-medium hover:bg-gray-200 transition-colors flex items-center gap-2">
                        View My Work <ArrowRight className="w-4 h-4" />
                    </a>
                    <a href="mailto:hello@example.com" className="px-6 py-3 rounded-full font-medium border border-white/20 hover:bg-white/5 transition-colors">
                        Contact Me
                    </a>
                </div>
            </div>
        </section>
    );
}
