import { ExternalLink, Github } from "lucide-react";

export default function Projects() {
    const projects = [
        {
            title: "AI Mock Interviewer (PrepWise)",
            description: "An AI-powered voice interviewer using Next.js, Vapi, Gemini, and Firebase. Built robust device management and real-time audio interaction.",
            tech: ["Next.js", "Firebase", "WebRTC", "Gemini API"],
            demoLink: "https://your-demo-url.com",
            githubLink: "https://github.com/jyotii897/ai_mock_interview",
        },
        {
            title: "Real-time Attendance Tracker (Cognito)",
            description: "Automated student attendance using face recognition (dlib) synced instantly to a Firebase backend. Scaled CV tasks via Flask.",
            tech: ["Python", "Flask", "OpenCV", "Firebase"],
            demoLink: "https://your-cognito-url.com",
            githubLink: "https://github.com/jyotii897/cognito",
        }
    ];

    return (
        <section id="work" className="py-24 max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-12">Selected Work</h2>
            <div className="grid md:grid-cols-2 gap-8">
                {projects.map((project, idx) => (
                    <div key={idx} className="group border border-white/10 bg-white/[0.02] p-8 rounded-2xl hover:bg-white/[0.04] transition-colors">
                        <h3 className="text-2xl font-semibold mb-3">{project.title}</h3>
                        <p className="text-gray-400 mb-6 leading-relaxed">
                            {project.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-8">
                            {project.tech.map(t => (
                                <span key={t} className="text-xs font-medium px-3 py-1 bg-white/10 rounded-full text-blue-200">
                                    {t}
                                </span>
                            ))}
                        </div>
                        <div className="flex gap-4">
                            <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="text-sm font-medium flex items-center gap-2 hover:text-blue-400 transition-colors">
                                <Github className="w-4 h-4" /> Code
                            </a>
                            <a href={project.demoLink} target="_blank" rel="noopener noreferrer" className="text-sm font-medium flex items-center gap-2 hover:text-blue-400 transition-colors">
                                <ExternalLink className="w-4 h-4" /> Live Demo
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
