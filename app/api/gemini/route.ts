import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
    try {
        const { jobRole, techStack, yearsOfExperience, questionCount } = await req.json();

        const apiKey = process.env.GEMINI_API_KEY;
        console.log("API Key configured:", !!apiKey);

        if (!apiKey) {
            return NextResponse.json(
                { error: "GEMINI_API_KEY is not configured" },
                { status: 500 }
            );
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

        const prompt = `
      You are an expert technical interviewer.
      Generate ${questionCount} technical interview questions for a ${jobRole} position.
      Tech Stack: ${techStack || "General"}.
      Experience Level: ${yearsOfExperience} years.

      Return the response STRICTLY as a JSON array of objects, where each object has:
      - "question": The interview question.
      - "answer": A brief suggested answer or key points to look for.

      Do not include any markdown formatting (like \`\`\`json). Just the raw JSON array.
    `;

        console.log("Sending prompt to Gemini...");
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log("Gemini Raw Response:", text);

        // Clean up if Gemini wraps in markdown code blocks
        const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();

        try {
            const jsonResponse = JSON.parse(cleanedText);
            return NextResponse.json({ questions: jsonResponse });
        } catch (e) {
            console.error("Failed to parse Gemini response:", text);
            return NextResponse.json({ error: "Failed to generate valid JSON format", raw: text }, { status: 500 });
        }

    } catch (error) {
        console.error("Error generating questions:", error);
        return NextResponse.json(
            { error: `Internal Server Error: ${error instanceof Error ? error.message : String(error)}` },
            { status: 500 }
        );
    }
}
