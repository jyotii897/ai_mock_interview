"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/client";
import { Button } from "@/components/ui/button";
import InterviewModal from "@/components/InterviewModal";
import { Code, Server, Database, Terminal, Globe, Cpu, Smartphone, Lock, Shield, LogOut, ArrowRight, Sparkles } from "lucide-react";
import { Cloud } from "lucide-react";

// Mock data to match the screenshot style
const dashboardData = [
  {
    title: "Full-Stack Dev Interview",
    description: "Practice your full-stack skills with React, Node.js and more.",
    logoText: "FS",
    logoColor: "bg-purple-600",
    badge: "Technical",
    techIcons: [Code, Database],
    color: "group-hover:border-purple-500/50",
  },
  {
    title: "DevOps & Cloud",
    description: "Cloud infrastructure, CI/CD pipelines and containerization.",
    logoText: "DO",
    logoColor: "bg-orange-600",
    badge: "Technical",
    techIcons: [Server, Terminal],
    color: "group-hover:border-orange-500/50",
  },
  {
    title: "System Design",
    description: "Scalability, load balancing and distributed systems.",
    logoText: "SD",
    logoColor: "bg-blue-600",
    badge: "Technical",
    techIcons: [Database, Cloud],
    color: "group-hover:border-blue-500/50",
  },
  {
    title: "Mobile Dev",
    description: "iOS & Android development with React Native and Swift.",
    logoText: "MD",
    logoColor: "bg-green-600",
    badge: "Technical",
    techIcons: [Smartphone, Code],
    color: "group-hover:border-green-500/50",
  },
  {
    title: "Cybersecurity",
    description: "Network security, encryption, and threat analysis.",
    logoText: "CS",
    logoColor: "bg-red-600",
    badge: "Technical",
    techIcons: [Shield, Lock],
    color: "group-hover:border-red-500/50",
  },
  {
    title: "Data Science",
    description: "Machine learning, python data analysis and statistics.",
    logoText: "DS",
    logoColor: "bg-yellow-600",
    badge: "Technical",
    techIcons: [Terminal, Database],
    color: "group-hover:border-yellow-500/50",
  },
];

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const router = useRouter();

  const handleStartInterview = (title: string) => {
    setSelectedRole(title);
    setIsModalOpen(true);
  };

  const handleSignOut = async () => {
    await signOut(auth);
    router.push("/sign-in");
  };

  return (
    <main className="flex min-h-screen bg-[#050505] text-white selection:bg-blue-500/30 font-sans">
      {/* Sidebar / Left Panel */}
      <section className="relative z-10 w-[280px] p-6 border-r border-white/5 flex flex-col hidden lg:flex bg-[#0A0A0A]">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
            <span className="font-bold text-lg">P</span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            PrepWise
          </h1>
        </div>

        <div className="space-y-6 flex-1">
          <div>
            <h2 className="text-4xl font-extrabold text-white leading-tight mb-2">Dashboard</h2>
            <p className="text-white/40 text-sm">Welcome back!</p>
          </div>

          <div className="pt-8">
            <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4">Menu</p>
            <Button variant="ghost" className="w-full justify-start text-white bg-white/5 mb-2">
              <Sparkles className="mr-2 h-4 w-4 text-yellow-400" /> Dashboard
            </Button>
            <Button variant="ghost" className="w-full justify-start text-white/60 hover:text-white hover:bg-white/5">
              <Database className="mr-2 h-4 w-4" /> Past Interviews
            </Button>
          </div>
        </div>

        <div className="mt-auto">
          <Button
            onClick={handleSignOut}
            variant="ghost"
            className="w-full justify-start text-white/60 hover:text-white hover:bg-white/5 gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </section>

      {/* Main Content */}
      <section className="relative z-10 flex-1 p-6 lg:p-10 overflow-y-auto">

        {/* Hero Banner */}
        <div className="w-full bg-gradient-to-r from-blue-900/40 to-purple-900/40 rounded-3xl border border-white/10 p-8 md:p-12 mb-12 relative overflow-hidden group">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
          <div className="relative z-10 max-w-2xl">
            <span className="inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-semibold mb-4 border border-blue-500/30">New Feature</span>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
              Get Interview-Ready with <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">AI-Powered Practice</span>
            </h2>
            <p className="text-lg text-slate-300 mb-8 leading-relaxed max-w-md">
              Practice with realistic questions tailored to your role. Get instant feedback on your answers and body language.
            </p>
            <Button
              onClick={() => handleStartInterview("General Practice")}
              size="lg"
              className="bg-white text-black hover:bg-slate-200 rounded-full px-8 h-12 font-semibold shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              Start an Interview
            </Button>
          </div>

          {/* Robot Illustration / Decorative visuals */}
          <div className="absolute right-0 bottom-0 top-0 w-1/3 hidden md:flex items-center justify-center">
            <div className="relative w-64 h-64">
              <div className="absolute inset-0 bg-blue-500 rounded-full blur-[100px] opacity-20 animate-pulse"></div>
              <Image
                src="/logo.svg"
                alt="AI Robot"
                width={200}
                height={200}
                className="relative z-10 drop-shadow-2xl hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>

        {/* Your Interviews Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white">Your Interviews</h3>
          </div>

          <div className="w-full rounded-2xl border border-dashed border-white/10 bg-[#0F0F0F] p-12 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <Database className="w-8 h-8 text-white/20" />
            </div>
            <h4 className="text-lg font-medium text-white mb-2">No interviews yet</h4>
            <p className="text-white/40 max-w-sm mx-auto">
              You haven't taken any mock interviews yet. Start one now to track your progress!
            </p>
          </div>
        </div>

        {/* Take an Interview Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white">Take an Interview</h3>
            <Button variant="link" className="text-blue-400 hover:text-blue-300">View All <ArrowRight className="ml-1 w-4 h-4" /></Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {dashboardData.map((item, index) => (
              <div
                key={index}
                className={`
                    group relative bg-[#0F0F0F] rounded-[24px] p-6 border border-white/5 
                    hover:border-white/10 transition-all duration-300 cursor-pointer overflow-hidden
                    flex flex-col justify-between h-[280px]
                    ${item.color}
                `}
                onClick={() => handleStartInterview(item.title)}
              >
                {/* Header Row: Logo & Badge */}
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-12 h-12 rounded-2xl ${item.logoColor} flex items-center justify-center shadow-lg`}>
                    <span className="text-md font-bold text-white">{item.logoText}</span>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-[#1A1A1A] border border-white/5">
                    <span className="text-xs font-medium text-white/60">{item.badge}</span>
                  </div>
                </div>

                {/* Text Content */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white mb-2 leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-400 line-clamp-2">
                    {item.description}
                  </p>
                </div>

                {/* Bottom Row */}
                <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-xs text-white/40 font-medium">15 Mins • 5 Questions</span>
                  <Button size="sm" className="rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/5">
                    Start
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <InterviewModal
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
          initialJobRole={selectedRole}
        />
      </section>
    </main>
  );
};

export default Home;