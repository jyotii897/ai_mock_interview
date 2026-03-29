import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
    try {
        const { jobRole, techStack, yearsOfExperience, questionCount } = await req.json();
        const apiKey = process.env.GEMINI_API_KEY?.trim();

        if (!apiKey) {
            return NextResponse.json({ error: "GEMINI_API_KEY is not configured" }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
            You are an expert technical interviewer.
            Generate ${questionCount} technical interview questions for a ${jobRole} position.
            Tech Stack: ${techStack || "General"}.
            Experience Level: ${yearsOfExperience} years.

            Return ONLY a valid JSON array of objects. NO markdown blocks, NO "json" label.
            Each object MUST have:
            - "question": string
            - "answer": string
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        // Clean markdown if Gemini still provides it
        let cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();

        try {
            const jsonResponse = JSON.parse(cleanedText);
            return NextResponse.json({ questions: jsonResponse });
        } catch (e) {
            console.error("Gemini failed to generate valid JSON:", text);
            return NextResponse.json({ error: "AI response failed to parse as JSON. Please try again.", raw: text }, { status: 500 });
        }

    } catch (error) {
        console.error("Gemini API Error:", error);
        return NextResponse.json({ 
            error: `API Connection Error: ${error instanceof Error ? error.message : "Possible network or config issue"}` 
        }, { status: 500 });
    }
}
