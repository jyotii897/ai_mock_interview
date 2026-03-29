import { NextResponse } from "next/server";

export async function POST() {
    console.log("!!! 🏁 EMERGENCY MOCK ROUTE HIT 🏁 !!!");
    
    // HARDCODED QUESTIONS for your 10:00 interview
    const data = {
        questions: [
            { 
                question: "Explain the difference between useMemo and useCallback in React.", 
                answer: "useMemo returns a memoized value, while useCallback returns a memoized function." 
            },
            { 
                question: "What are the common ways to improve Next.js performance?", 
                answer: "Using Image components, lazy loading, and choosing the right rendering strategy (ISR/SSR)." 
            },
            { 
                question: "What is a Closure in JavaScript?", 
                answer: "A closure is when a function remembers its lexical scope even when it is executed outside that scope." 
            },
            { 
                question: "Wait, is this working?", 
                answer: "Yes, this is a hardcoded response to ensure your interview works right now!" 
            }
        ]
    };

    return new Response(JSON.stringify(data), {
        status: 200,
        headers: { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization"
        }
    });
}
