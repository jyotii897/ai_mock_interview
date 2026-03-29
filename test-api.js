const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error("❌ No API Key found in env!");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
    try {
        console.log("Fetching available models...");
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();
        
        if (data.models) {
            console.log("✅ Models found:");
            data.models.forEach(m => console.log(` - ${m.name}`));
        } else {
            console.log("❌ No models returned in response.", JSON.stringify(data, null, 2));
        }
    } catch (error) {
        console.error("❌ Error listing models:", error.message);
    }
}

listModels();
