"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, CheckCircle2, Star, TrendingUp, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const FeedbackPage = () => {
    const router = useRouter();
    const [rating, setRating] = useState(0);

    // Mock Rating Animation
    useEffect(() => {
        const timer = setTimeout(() => setRating(7), 500); // 7/10 rating
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen bg-neutral-950 p-6 flex flex-col items-center">
            {/* Confetti / Success Background Effect */}
            <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-green-900/20 to-transparent pointer-events-none" />

            <div className="max-w-4xl w-full z-10 space-y-8 mt-10">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-white tracking-tight">Interview Feedback</h1>
                    <Link href="/">
                        <Button variant="outline" className="border-white/10 text-white hover:bg-white/5">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Go Home
                        </Button>
                    </Link>
                </div>

                {/* Score Card */}
                <Card className="bg-slate-900/50 border-slate-800 overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-32 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                    <CardHeader>
                        <CardTitle className="text-white text-xl">Overall Performance</CardTitle>
                        <CardDescription className="text-slate-400">Based on your recent AI interview session</CardDescription>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-3 gap-8">
                        {/* Rating Circle */}
                        <div className="flex flex-col items-center justify-center p-4 bg-slate-950/50 rounded-2xl border border-white/5">
                            <div className="relative w-32 h-32 flex items-center justify-center mb-4">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-800" />
                                    <circle
                                        cx="64" cy="64" r="56"
                                        stroke="currentColor" strokeWidth="8" fill="transparent"
                                        className="text-green-500 transition-all duration-1000 ease-out"
                                        strokeDasharray={351}
                                        strokeDashoffset={351 - (351 * rating) / 10}
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <span className="absolute text-3xl font-bold text-white">{rating}/10</span>
                            </div>
                            <h3 className="text-green-400 font-semibold flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4" /> Passed
                            </h3>
                        </div>

                        {/* Stats */}
                        <div className="md:col-span-2 space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm text-slate-300">
                                    <span>Communication</span>
                                    <span className="text-blue-400">Good</span>
                                </div>
                                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 w-[80%] rounded-full" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm text-slate-300">
                                    <span>Technical Content</span>
                                    <span className="text-yellow-400">Average</span>
                                </div>
                                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-yellow-500 w-[60%] rounded-full" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm text-slate-300">
                                    <span>Confidence</span>
                                    <span className="text-purple-400">Excellent</span>
                                </div>
                                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-purple-500 w-[90%] rounded-full" />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Detailed Feedback Mockup */}
                <div className="grid md:grid-cols-2 gap-6">
                    <Card className="bg-slate-900/50 border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-white text-lg flex items-center gap-2">
                                <Star className="w-5 h-5 text-yellow-500" /> Strengths
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-200 text-sm">
                                "You clearly articulated the differences between SQL and NoSQL databases."
                            </div>
                            <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-200 text-sm">
                                "Your introduction was professional and confident."
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-900/50 border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-white text-lg flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-red-400" /> Improvement Areas
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-200 text-sm">
                                "Try to provide more concrete examples when discussing React hooks."
                            </div>
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-200 text-sm">
                                "Answers to behavioral questions could be structured better using the STAR method."
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="text-center pt-8">
                    <Button size="lg" className="w-full md:w-auto bg-blue-600 hover:bg-blue-700" onClick={() => router.push("/")}>
                        Practice Again
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default FeedbackPage;
