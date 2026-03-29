import { ArrowRight } from "lucide-react";

export default function Writing() {
    const posts = [
        {
            title: "How I handled WebRTC permissions in React",
            date: "March 2026",
            excerpt: "A deep dive into managing microphone and camera states elegantly across different browsers.",
            link: "#"
        },
        {
            title: "Why face recognition on the server bottlenecks quickly",
            date: "February 2026",
            excerpt: "Lessons learned from building Cognito and why edge-computing is the future for CV tasks.",
            link: "#"
        }
    ];

    return (
        <section id="blog" className="py-24 max-w-6xl mx-auto px-6 border-t border-white/10">
            <h2 className="text-3xl font-bold mb-12">Writing & Thinking</h2>
            <div className="flex flex-col gap-8">
                {posts.map((post, idx) => (
                    <a key={idx} href={post.link} className="group block border border-white/10 bg-white/[0.02] p-8 rounded-2xl hover:bg-white/[0.04] transition-all hover:-translate-y-1">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-semibold group-hover:text-blue-400 transition-colors">{post.title}</h3>
                            <span className="text-sm text-gray-500 shrink-0 mt-1 ml-4">{post.date}</span>
                        </div>
                        <p className="text-gray-400 group-hover:text-gray-300 transition-colors mb-4">
                            {post.excerpt}
                        </p>
                        <span className="text-sm text-blue-500 font-medium flex items-center gap-1">
                            Read More <ArrowRight className="w-4 h-4" />
                        </span>
                    </a>
                ))}
            </div>
        </section>
    );
}
