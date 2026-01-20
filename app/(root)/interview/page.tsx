"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, MicOff, Video, VideoOff, PhoneOff, Volume2 } from "lucide-react";
import Vapi from "@vapi-ai/web";

const InterviewPage = () => {
    const router = useRouter();
    const [isCallActive, setIsCallActive] = useState(false);
    const [isMicOn, setIsMicOn] = useState(false);
    const [isCamOn, setIsCamOn] = useState(true);
    const [volumeLevel, setVolumeLevel] = useState(0);
    const [questions, setQuestions] = useState<any[]>([]);
    
    // Vapi Instance Ref
    const vapiRef = useRef<any>(null);

    useEffect(() => {
        // Load questions
        const storedData = localStorage.getItem("interviewQuestions");
        if (storedData) {
            setQuestions(JSON.parse(storedData));
        }

        // Initialize Vapi
        const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || "");
        vapiRef.current = vapi;

        // Vapi Event Listeners
        vapi.on("call-start", () => {
            console.log("Call started");
            setIsCallActive(true);
            setIsMicOn(true);
        });

        vapi.on("call-end", () => {
            console.log("Call ended");
            setIsCallActive(false);
            setIsMicOn(false);
        });

        vapi.on("volume-level", (level: number) => {
            setVolumeLevel(level);
        });

        vapi.on("error", (e: any) => {
            console.error("Vapi Error:", e);
            alert("Voice Error: " + e.message);
            setIsCallActive(false);
        });

        return () => {
            vapi.stop();
        };
    }, []);

    const startInterview = async () => {
        if (!vapiRef.current) return;

        // Construct the System Prompt with the questions
        const questionsList = questions.map((q, i) => `${i + 1}. ${q.question}`).join("\n");
        const systemPrompt = `You are a professional technical interviewer named "Sarah".
        Your goal is to interview the candidate using these specific questions:
        ${questionsList}

        Rules:
        1. Ask ONE question at a time.
        2. Wait for the candidate's answer.
        3. Provide brief, encouraging feedback (or correction if completely wrong) after their answer.
        4. Then move to the next question.
        5. Be polite and professional.
        6. Keep your responses concise.`;

        // Start call with inline assistant configuration
        try {
            await vapiRef.current.start({
                model: {
                    provider: "openai",
                    model: "gpt-3.5-turbo",
                    systemPrompt: systemPrompt
                },
                voice: {
                    provider: "11labs", 
                    voiceId: "paula" 
                },
                firstMessage: "Hello! I am ready to start your interview. Shall we begin with the first question?"
            });
        } catch (err) {
            console.error("Failed to start call", err);
        }
    };

    const stopInterview = () => {
        if (vapiRef.current) {
            vapiRef.current.stop();
        }
    };

    const toggleCall = () => {
        if (isCallActive) {
            stopInterview();
        } else {
            startInterview();
        }
    };

    const toggleMic = () => {
        if (vapiRef.current) {
            vapiRef.current.setMuted(isMicOn); // Logic is inverted in Vapi SDK usually (mute=true means no sound)
            setIsMicOn(!isMicOn);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-900/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-900/20 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2 pointer-events-none" />

            <div className="w-full max-w-6xl z-10 space-y-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-4">
                     <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                        PrepWise
                    </h1>
                    <span className="bg-slate-800 text-slate-300 text-xs px-2 py-1 rounded-full uppercase tracking-wider font-semibold">
                        Interview Session
                    </span>
                </div>

                {/* Main Grid: Interviewer vs You */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-[60vh] min-h-[400px]">
                    
                    {/* AI Interviewer Section */}
                    <Card className={`bg-slate-900/50 border-slate-800 flex flex-col items-center justify-center relative overflow-hidden h-full rounded-2xl ring-1 ring-white/10 group shadow-2xl transition-all duration-300 ${isCallActive ? 'ring-blue-500/50' : ''}`}>
                         {/* Placeholder Animation for AI */}
                        <div className={`w-32 h-32 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_0_60px_-10px_rgba(139,92,246,0.3)] transition-transform duration-200 ${isCallActive ? 'animate-pulse' : ''}`}
                             style={{ transform: `scale(${1 + volumeLevel * 2})` }}
                        >
                            <Volume2 className="w-12 h-12 md:w-20 md:h-20 text-white fill-white/20" />
                        </div>
                        
                        <div className="absolute bottom-6 left-0 right-0 text-center">
                            <h3 className="text-xl font-semibold text-white tracking-wide">AI Interviewer</h3>
                            <p className="text-indigo-300/60 text-sm mt-1">
                                {isCallActive ? "Speaking..." : "Ready to start"}
                            </p>
                        </div>
                    </Card>

                    {/* User Section (You) */}
                    <Card className="bg-slate-900/50 border-slate-800 flex flex-col items-center justify-center relative overflow-hidden h-full rounded-2xl ring-1 ring-white/10 shadow-2xl">
                         {isCamOn ? (
                             <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
                                 {/* Mock Camera Feed */}
                                 <div className="w-full h-full object-cover opacity-50 bg-[url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center" />
                                  <div className="absolute inset-0 flex items-center justify-center">
                                     <p className="bg-black/40 px-4 py-2 rounded-lg backdrop-blur-sm text-sm border border-white/10">Camera Preview</p>
                                 </div>
                             </div>
                         ) : (
                            <div className="w-32 h-32 rounded-full bg-slate-700 flex items-center justify-center">
                                <VideoOff className="w-12 h-12 text-slate-500" />
                            </div>
                         )}
                        
                        <div className="absolute bottom-6 left-0 right-0 text-center z-10">
                            <h3 className="text-xl font-semibold text-white tracking-wide">You</h3>
                        </div>
                         <div className="absolute top-4 right-4 z-10 flex gap-2">
                             <div className={`p-2 rounded-full ${isMicOn ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                 {isMicOn ? <Mic size={16} /> : <MicOff size={16} />}
                             </div>
                         </div>
                    </Card>
                </div>

                {/* Controls Footer */}
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 bg-slate-900/80 backdrop-blur-md px-8 py-4 rounded-full border border-white/10 shadow-2xl z-50">
                    <Button 
                        variant="ghost" 
                        size="icon"
                        className={`rounded-full w-12 h-12 hover:bg-slate-800 ${!isMicOn ? 'text-red-400 bg-red-400/10' : 'text-white'}`}
                        onClick={toggleMic}
                        disabled={!isCallActive}
                    >
                        {isMicOn ? <Mic /> : <MicOff />}
                    </Button>
                    
                    <Button 
                        variant="ghost" 
                        size="icon"
                        className={`rounded-full w-12 h-12 hover:bg-slate-800 ${!isCamOn ? 'text-red-400 bg-red-400/10' : 'text-white'}`}
                        onClick={() => setIsCamOn(!isCamOn)}
                    >
                        {isCamOn ? <Video /> : <VideoOff />}
                    </Button>

                    <Button 
                        size="lg"
                        className={`rounded-full px-8 h-12 text-lg font-medium transition-all duration-300 shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] ${isCallActive ? 'bg-red-600 hover:bg-red-700 shadow-none' : 'bg-green-600 hover:bg-green-700'}`}
                        onClick={toggleCall}
                    >
                        {isCallActive ? (
                            <>
                                <PhoneOff className="mr-2 h-5 w-5" /> End Call
                            </>
                        ) : (
                            "Start Interview"
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default InterviewPage;
