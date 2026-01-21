"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Mic, MicOff, Video, VideoOff, PhoneOff, Volume2, Loader2, ArrowLeft, RefreshCw, Key, ShieldCheck } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import Vapi from "@vapi-ai/web";
import Webcam from "react-webcam";

const InterviewPage = () => {
    const router = useRouter();
    const [isCallActive, setIsCallActive] = useState(false);
    const [isMicOn, setIsMicOn] = useState(false);
    const [isCamOn, setIsCamOn] = useState(true);
    const [volumeLevel, setVolumeLevel] = useState(0);
    const [questions, setQuestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [userTranscript, setUserTranscript] = useState("");

    // Auth & Permission States
    const [showKeyDialog, setShowKeyDialog] = useState(false);
    const [manualKey, setManualKey] = useState("");
    const [permissionStatus, setPermissionStatus] = useState<"unknown" | "granted" | "denied">("unknown");

    // Vapi Instance Ref
    const vapiRef = useRef<any>(null);

    useEffect(() => {
        // Load questions
        const storedData = localStorage.getItem("interviewQuestions");
        if (storedData) {
            try {
                setQuestions(JSON.parse(storedData));
            } catch (e) {
                console.error("Failed to parse questions", e);
            }
        }
        setLoading(false);

        // Pre-fill manual key from storage if available
        const savedKey = localStorage.getItem("vapi_manual_key");
        if (savedKey) setManualKey(savedKey);

    }, []);

    // Initialize Vapi helper


    const [debugLogs, setDebugLogs] = useState<string[]>([]);
    const [isStarting, setIsStarting] = useState(false);

    const log = (msg: string, data?: any) => {
        const timestamp = new Date().toLocaleTimeString();
        const logMsg = data ? `${msg} ${JSON.stringify(data)}` : msg;
        console.log(`[${timestamp}] ${msg}`, data || "");
        setDebugLogs(prev => [`[${timestamp}] ${logMsg}`, ...prev]);
    };

    // ... (rest of initializeVapi)

    const initializeVapi = (keyToUse: string) => {
        if (!keyToUse) return null;

        log("Initializing Vapi with key: " + keyToUse.substring(0, 15) + "...");

        try {
            const vapi = new Vapi(keyToUse);
            vapiRef.current = vapi;

            vapi.on("call-start", () => {
                log("Call started event received");
                setIsCallActive(true);
                setIsMicOn(true);
                setIsStarting(false);
                setShowKeyDialog(false);
            });

            vapi.on("call-end", () => {
                log("Call ended event received");
                setIsCallActive(false);
                setIsMicOn(false);
                setIsStarting(false);
                setVolumeLevel(0);
                router.push("/feedback");
            });

            vapi.on("volume-level", (level: number) => {
                setVolumeLevel(level);
            });

            vapi.on("message", (message: any) => {
                if (message.type === "transcript" && message.transcriptType === "final") {
                    if (message.role === "user") {
                        setUserTranscript(message.transcript);
                    }
                }
            });

            vapi.on("error", (e: any) => {
                log("Vapi Error Event:", e);
                setIsCallActive(false);
                setIsStarting(false);

                // Analyze error structure
                const errorObj = e?.error || e;
                let errorMessage = errorObj?.message || (typeof errorObj === 'string' ? errorObj : JSON.stringify(errorObj));

                // Ensure errorMessage is a string
                if (typeof errorMessage !== 'string') {
                    try {
                        errorMessage = JSON.stringify(errorMessage);
                    } catch (err) {
                        errorMessage = "Unknown error object";
                    }
                }

                const statusCode = errorObj?.statusCode || e?.statusCode;

                const isAuthError = statusCode === 401 ||
                    errorMessage.includes("Invalid Key") ||
                    errorMessage.includes("Unauthorized") ||
                    errorMessage.includes("401");

                if (isAuthError) {
                    log("Auth Error detected: " + errorMessage);
                    alert("Authentication Failed: Invalid Vapi Public Key.\nPlease check your key in the settings.");
                    setShowKeyDialog(true);
                } else {
                    // Generic error alert so user knows why it stopped
                    log("Generic Error: " + errorMessage);
                    // Don't alert for every little thing, but for start errors yes
                    if (errorMessage.includes("start-method-error") || errorMessage.includes("Connection timeout")) {
                        alert("Failed to start interview session. Error: " + errorMessage);
                    }
                }
            });

            return vapi;

        } catch (err) {
            log("Vapi Init Error:", err);
            return null;
        }
    };

    const checkPermissions = async () => {
        log("Checking permissions...");
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
            log("Permissions granted. Stream ID: " + stream.id);
            stream.getTracks().forEach(track => {
                log(`Track: ${track.kind} - ${track.label} (${track.readyState})`);
                track.stop();
            }); // Stop immediately after check
            setPermissionStatus("granted");
            return true;
        } catch (err: any) {
            log("Permission denied or error:", err.message);
            setPermissionStatus("denied");

            if (err.name === 'NotFoundError' || err.message?.includes('device not found')) {
                alert("No camera or microphone found. Please ensure your devices are connected.");
            } else if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                alert("Please allow Microphone and Camera access in your browser settings.");
            } else {
                alert("Error accessing media devices: " + err.message);
            }
            return false;
        }
    };

    const startInterview = async () => {
        if (isStarting) return;
        setIsStarting(true);
        log("Starting interview process...");

        // 1. Check permissions first
        const hasPerms = await checkPermissions();
        if (!hasPerms) {
            setIsStarting(false);
            return;
        }

        // 2. Determine Key (Manual > Env > Hardcoded)
        // STRICT PRIORITY: Manual Key -> Env Key -> Default
        let key = manualKey;

        if (!key) {
            key = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY as string;
        }

        if (!key) {
            key = "vapi-public-c1ee9545-be52-4663-aa49-9dfc2f92b4a0";
        }

        // Safety Clean-up
        key = key.trim();
        // REMOVED: Forced prefix check. Trusting the user's input/env.

        log("Using Key: " + key.substring(0, 5) + "..." + key.substring(key.length - 4));

        // 3. Init Vapi if needed or if key changed
        // We always re-init to ensure the correct key is being used
        initializeVapi(key);

        const questionsList = questions.map((q, i) => `${i + 1}. ${q.question}`).join("\n");
        const systemPrompt = `You are a professional technical interviewer named "Sarah".
        Your goal is to interview the candidate using these specific questions:
        ${questionsList}
        Rules: Ask ONE question at a time. Wait for answer. Be professional.`;

        const vapiConfig = {
            model: {
                provider: "openai",
                model: "gpt-3.5-turbo",
                messages: [{ role: "system", content: systemPrompt }]
            },
            voice: { provider: "11labs", voiceId: "paula" },
            firstMessage: "Hello! I am ready to start. Can you hear me?"
        };

        try {
            log("Calling vapi.start()...");

            // Create a timeout promise
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Connection timeout")), 10000)
            );

            // Race between start and timeout
            await Promise.race([
                vapiRef.current.start(vapiConfig),
                timeoutPromise
            ]);

            log("vapi.start() promise resolved");
        } catch (err: any) {
            log("Start Error Catch:", err);
            setIsStarting(false);

            // Analyze Error
            const errorObj = err?.error || err;
            let errorMessage = errorObj?.message || (typeof errorObj === 'string' ? errorObj : JSON.stringify(errorObj));
            if (typeof errorMessage !== 'string') errorMessage = "Unknown Error";

            const isAuthError = err?.statusCode === 401 || err?.error?.statusCode === 401 || errorMessage.includes("Invalid Key") || errorMessage.includes("Unauthorized");

            if (isAuthError) {
                log("Authentication failed with key: " + key);
                setShowKeyDialog(true);
            } else if (errorMessage === "Connection timeout") {
                alert("Connection timed out. Please check your internet or try again.");
            } else {
                alert("Failed to start interview: " + errorMessage);
            }
        }
    };

    const handleSaveKey = () => {
        if (manualKey) {
            let keyToUse = manualKey.trim();
            // REMOVED: forcing prefix

            localStorage.setItem("vapi_manual_key", keyToUse);
            setManualKey(keyToUse); // Update state to show the normalized key

            // Re-init with new key
            initializeVapi(keyToUse);
            setShowKeyDialog(false);
            // Try starting again
            startInterview();
        }
    };

    const handleResetKey = () => {
        localStorage.removeItem("vapi_manual_key");
        setManualKey("");
        log("Manual key cleared from storage.");
        setShowKeyDialog(false);
    };

    const stopInterview = () => {
        vapiRef.current?.stop();
    };

    const toggleCall = () => {
        if (isCallActive) stopInterview();
        else startInterview();
    };

    const toggleMic = () => {
        vapiRef.current?.setMuted(isMicOn);
        setIsMicOn(!isMicOn);
    };

    if (loading) return <div className="flex h-screen items-center justify-center bg-black text-white"><Loader2 className="h-8 w-8 animate-spin" /></div>;

    if (questions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-black text-white p-6">
                <h1 className="text-2xl font-bold mb-4">No Interview Context</h1>
                <Button onClick={() => router.push("/")} className="bg-blue-600 hover:bg-blue-700">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Key Override Dialog */}
            <Dialog open={showKeyDialog} onOpenChange={setShowKeyDialog}>
                <DialogContent className="bg-slate-900 border-slate-800 text-white">
                    <DialogHeader>
                        <DialogTitle>Authentication Failed</DialogTitle>
                        <DialogDescription className="text-slate-400">
                            The Vapi API Key seems invalid (Error 401). Please paste your <strong>Public Key</strong> below.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="apiKey">Vapi Public Key</Label>
                            <Input
                                id="apiKey"
                                placeholder="vapi-public-..."
                                value={manualKey}
                                onChange={(e) => setManualKey(e.target.value)}
                                className="bg-slate-950 border-slate-800"
                            />
                            <p className="text-xs text-slate-500">Find this in Vapi Dashboard {">"} API Keys</p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleSaveKey} className="bg-blue-600 hover:bg-blue-700">
                            Save & Retry
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-900/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-900/20 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2 pointer-events-none" />

            {/* Debug Console Overlay */}
            <div className="fixed bottom-4 left-4 z-50 w-96 max-h-48 overflow-y-auto bg-black/80 text-green-400 font-mono text-xs p-2 rounded border border-green-900/50 pointer-events-none opacity-80 hover:opacity-100 transition-opacity">
                {debugLogs.map((log, i) => (
                    <div key={i} className="whitespace-pre-wrap mb-1 border-b border-green-900/30 pb-1">{log}</div>
                ))}
                {debugLogs.length === 0 && <div className="text-gray-500 italic">Ready. Click Start Interview...</div>}
            </div>

            <div className="w-full max-w-6xl z-10 space-y-8 flex flex-col h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between gap-4 mb-4 shrink-0">
                    <div className="flex items-center gap-4">
                        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">PrepWise</h1>
                        <span className="hidden md:inline-block bg-slate-800 text-slate-300 text-xs px-2 py-1 rounded-full uppercase tracking-wider font-semibold">Interview Session</span>
                    </div>

                    {/* Debug Tools */}
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setShowKeyDialog(true)} className="border-white/10 hover:bg-white/5 text-xs h-8">
                            <Key className="w-3 h-3 mr-1" /> Update Key
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleResetKey} className="border-red-500/20 text-red-400 hover:bg-red-500/10 text-xs h-8">
                            <RefreshCw className="w-3 h-3 mr-1" /> Reset Key
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={checkPermissions}
                            className={`border-white/10 hover:bg-white/5 text-xs h-8 ${permissionStatus === 'denied' ? 'text-red-400 border-red-500/50' : ''}`}
                        >
                            <ShieldCheck className="w-3 h-3 mr-1" />
                            {permissionStatus === 'granted' ? 'Perms OK' : 'Check Perms'}
                        </Button>
                    </div>
                </div>

                {/* Main Grid: Interviewer vs You */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 grow min-h-0">

                    {/* AI Interviewer Section */}
                    <Card className={`bg-slate-900/50 border-slate-800 flex flex-col items-center justify-center relative overflow-hidden h-full rounded-2xl ring-1 ring-white/10 group shadow-2xl transition-all duration-300 ${isCallActive ? 'ring-blue-500/50' : ''}`}>
                        <div className={`relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center transition-transform duration-200 ${isCallActive ? 'scale-105' : ''}`}
                            style={{ transform: isCallActive ? `scale(${1 + volumeLevel * 0.5})` : 'scale(1)' }}
                        >
                            <div className={`absolute inset-0 bg-blue-500 rounded-full blur-[60px] opacity-20 ${isCallActive ? 'animate-pulse' : ''}`}></div>
                            <img
                                src="/logo.svg"
                                alt="AI Interviewer"
                                className="relative z-10 w-full h-full object-contain drop-shadow-2xl"
                            />
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
                            <div className="absolute inset-0 bg-slate-800 flex items-center justify-center overflow-hidden rounded-2xl">
                                <Webcam
                                    audio={false}
                                    className="w-full h-full object-cover transform scale-x-[-1]"
                                    screenshotFormat="image/jpeg"
                                    videoConstraints={{ width: 1280, height: 720, facingMode: "user" }}
                                    onUserMediaError={(e) => {
                                        console.error("Cam Error", e);
                                        log("Webcam Error: " + (typeof e === 'string' ? e : e.message || "Unknown"));
                                        setIsCamOn(false);
                                        // Wait a moment to render the change, then alert
                                        setTimeout(() => alert("Camera not accessible. Switching to audio-only."), 100);
                                    }}
                                />
                                <div className="absolute bottom-4 left-4 bg-black/60 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md">You</div>
                            </div>
                        ) : (
                            <div className="w-32 h-32 rounded-full bg-slate-700 flex items-center justify-center">
                                <VideoOff className="w-12 h-12 text-slate-500" />
                            </div>
                        )}
                    </Card>
                </div>

                {/* Transcription */}
                {userTranscript && (
                    <div className="w-full max-w-3xl mx-auto text-center mt-4 h-16 flex items-center justify-center">
                        <div className="bg-black/40 px-6 py-3 rounded-full border border-white/10 backdrop-blur-sm">
                            <p className="text-slate-200 text-lg">"{userTranscript}"</p>
                        </div>
                    </div>
                )}

                {/* Controls */}
                <div className="shrink-0 flex items-center justify-center gap-6 bg-slate-900/80 backdrop-blur-md px-8 py-4 rounded-full border border-white/10 shadow-2xl mx-auto mt-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        className={`rounded-full w-12 h-12 ${!isMicOn ? 'text-red-400 bg-red-400/10' : 'text-white'}`}
                        onClick={toggleMic}
                        disabled={isStarting} // Only disable while connecting
                    >
                        {isMicOn ? <Mic /> : <MicOff />}
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className={`rounded-full w-12 h-12 ${!isCamOn ? 'text-red-400 bg-red-400/10' : 'text-white'}`}
                        onClick={() => setIsCamOn(!isCamOn)}
                        disabled={isStarting}
                    >
                        {isCamOn ? <Video /> : <VideoOff />}
                    </Button>
                    <Button
                        size="lg"
                        className={`rounded-full px-8 h-12 text-lg font-medium transition-all min-w-[200px] ${isCallActive ? 'bg-red-600 hover:bg-red-700' :
                            isStarting ? 'bg-slate-700 cursor-wait' : 'bg-green-600 hover:bg-green-700'
                            }`}
                        onClick={toggleCall}
                        disabled={isStarting}
                    >
                        {isStarting ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Connecting...
                            </>
                        ) : isCallActive ? (
                            <>
                                <PhoneOff className="mr-2 h-5 w-5" />
                                End Call
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
